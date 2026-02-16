"""
Generate weekly running aggregates from a Strava activities CSV export.

What this script does:
- Filters activity rows down to runs only.
- Groups run distances into weekly buckets.
- Uses a custom week boundary where the first week starts on the configured
	start date (default: 2025-01-01), and each following week starts on Monday.
- Limits included runs to the configured date range (default end:
	2025-12-31).
- Computes weekly `total`, `average`, and cumulative `runningTotal` values.
- Writes the result as JSON in the format expected by the fitness page charts.

Input:
- A Strava `activities.csv` file path.

Output:
- A JSON file with a top-level `weeks` array (default:
	`src/pages/running-2025.json`).

Examples:
- python scripts/generate-fitness-states.py ./exports/activities.csv
- python scripts/generate-fitness-states.py ./exports/activities.csv -o src/pages/running-2025.json --start-date 2025-01-01 --end-date 2025-12-31 --distance-unit auto
"""

import argparse
import csv
import json
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
DEFAULT_OUTPUT_PATH = REPO_ROOT / "src" / "pages" / "running-2025.json"


DATE_COLUMNS = [
	"Activity Date",
	"Activity Date Local",
	"Date",
	"Start Date",
	"Start Date Local",
]

TYPE_COLUMNS = [
	"Activity Type",
	"Type",
	"Sport Type",
]

DISTANCE_COLUMNS = [
	"Distance",
	"Distance.1",
]


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(
		description="Generate weekly running aggregates from Strava CSV export."
	)
	parser.add_argument(
		"input_csv",
		type=Path,
		help="Path to Strava activities CSV (for example, activities.csv).",
	)
	parser.add_argument(
		"-o",
		"--output",
		type=Path,
		default=DEFAULT_OUTPUT_PATH,
		help="Output JSON path (default: src/pages/running-2025.json).",
	)
	parser.add_argument(
		"--start-date",
		type=str,
		default="2025-01-01",
		help="Start date (inclusive) for aggregation in YYYY-MM-DD format.",
	)
	parser.add_argument(
		"--end-date",
		type=str,
		default="2025-12-31",
		help="End date (inclusive) for aggregation in YYYY-MM-DD format.",
	)
	parser.add_argument(
		"--distance-unit",
		choices=["auto", "miles", "km", "meters"],
		default="auto",
		help="Unit of distance in the CSV (default: auto).",
	)
	return parser.parse_args()


def parse_date(value: str) -> date:
	candidates = [
		"%Y-%m-%d",
		"%Y-%m-%d %H:%M:%S",
		"%Y-%m-%d %H:%M:%S %z",
		"%m/%d/%Y",
		"%m/%d/%Y, %I:%M:%S %p",
		"%b %d, %Y, %I:%M:%S %p",
	]

	cleaned = value.strip()
	for fmt in candidates:
		try:
			return datetime.strptime(cleaned, fmt).date()
		except ValueError:
			continue

	from_iso = cleaned.replace("Z", "+00:00")
	try:
		return datetime.fromisoformat(from_iso).date()
	except ValueError as exc:
		raise ValueError(f"Unable to parse date value: {value}") from exc


def to_float(value: str) -> float:
	cleaned = value.strip().replace(",", "")
	if cleaned == "":
		return 0.0
	return float(cleaned)


def infer_unit(max_distance: float) -> str:
	if max_distance > 100:
		return "meters"
	if max_distance > 20:
		return "km"
	return "miles"


def convert_to_miles(distance: float, unit: str) -> float:
	if unit == "miles":
		return distance
	if unit == "km":
		return distance * 0.621371
	if unit == "meters":
		return distance * 0.000621371
	raise ValueError(f"Unsupported distance unit: {unit}")


def first_value(row: dict[str, Any], columns: list[str]) -> str | None:
	for column in columns:
		value = row.get(column)
		if value is not None and str(value).strip() != "":
			return str(value)
	return None


def is_run_activity(row: dict[str, Any]) -> bool:
	value = first_value(row, TYPE_COLUMNS)
	if value is None:
		return False
	normalized = value.strip().lower().replace("_", " ")
	return "run" in normalized


def get_week_start(activity_date: date, range_start: date) -> date:
	first_monday = range_start + timedelta(days=(7 - range_start.weekday()) % 7)
	if activity_date < first_monday:
		return range_start
	return activity_date - timedelta(days=activity_date.weekday())


def load_runs(
	input_csv: Path,
	range_start: date,
	range_end: date,
	configured_unit: str,
) -> list[tuple[date, float]]:
	if not input_csv.exists():
		raise FileNotFoundError(f"Input CSV not found: {input_csv}")

	runs_raw: list[tuple[date, float]] = []
	with input_csv.open("r", newline="", encoding="utf-8-sig") as handle:
		reader = csv.DictReader(handle)
		for row in reader:
			if not is_run_activity(row):
				continue

			date_text = first_value(row, DATE_COLUMNS)
			distance_text = first_value(row, DISTANCE_COLUMNS)
			if date_text is None or distance_text is None:
				continue

			run_date = parse_date(date_text)
			if run_date < range_start:
				continue
			if run_date > range_end:
				continue

			distance_value = to_float(distance_text)
			if distance_value <= 0:
				continue

			runs_raw.append((run_date, distance_value))

	if not runs_raw:
		return []

	unit = configured_unit
	if unit == "auto":
		unit = infer_unit(max(distance for _, distance in runs_raw))

	runs = [(run_date, round(convert_to_miles(distance, unit), 2)) for run_date, distance in runs_raw]
	runs.sort(key=lambda item: item[0])
	return runs


def aggregate_weeks(runs: list[tuple[date, float]], range_start: date) -> dict[str, list[dict[str, Any]]]:
	buckets: dict[date, list[float]] = {}
	for run_date, miles in runs:
		week_start = get_week_start(run_date, range_start)
		buckets.setdefault(week_start, []).append(round(miles, 2))

	running_total = 0.0
	weeks: list[dict[str, Any]] = []
	for week_start in sorted(buckets.keys()):
		days = buckets[week_start]
		total = round(sum(days), 2)
		average = round(total / len(days), 2) if days else 0.0
		running_total = round(running_total + total, 2)

		weeks.append(
			{
				"startDate": week_start.isoformat(),
				"total": total,
				"average": average,
				"runningTotal": running_total,
				"days": days,
			}
		)

	return {"weeks": weeks}


def write_output(payload: dict[str, Any], output_path: Path) -> None:
	if not output_path.is_absolute():
		output_path = Path.cwd() / output_path

	output_path.parent.mkdir(parents=True, exist_ok=True)
	with output_path.open("w", encoding="utf-8") as handle:
		json.dump(payload, handle, indent=2)
		handle.write("\n")


def main() -> None:
	args = parse_args()
	range_start = parse_date(args.start_date)
	range_end = parse_date(args.end_date)
	if range_end < range_start:
		raise ValueError("End date must be greater than or equal to start date.")

	runs = load_runs(args.input_csv, range_start, range_end, args.distance_unit)
	payload = aggregate_weeks(runs, range_start)
	write_output(payload, args.output)
	resolved_output = args.output if args.output.is_absolute() else Path.cwd() / args.output
	print(f"Wrote {len(payload['weeks'])} week(s) to {resolved_output.resolve()}")


if __name__ == "__main__":
	main()



