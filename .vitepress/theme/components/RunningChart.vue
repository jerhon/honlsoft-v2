<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import Chart from "chart.js/auto"

import running2024 from "../data/running-2024.json"
import running2025 from "../data/running-2025.json"

const props = defineProps<{ year: "2024" | "2025" }>()

const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | undefined

function getRunningData() {
  return props.year === "2024" ? running2024 : running2025
}

onMounted(() => {
  if (!canvas.value) {
    return
  }

  const running = getRunningData()

  chart = new Chart(canvas.value, {
    data: {
      labels: running.weeks.map(week => week.startDate),
      datasets: [
        {
          type: "bar",
          label: "Miles Run (Week)",
          data: running.weeks.map(week => week.total),
          yAxisID: "weekly",
        },
        {
          type: "bar",
          label: "Miles Per Run Avg (Week)",
          data: running.weeks.map(week => week.average),
          yAxisID: "weekly",
        },
        {
          type: "line",
          label: "Miles Run (Total)",
          data: running.weeks.map(week => week.runningTotal),
          yAxisID: "total",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 200,
      },
      scales: {
        weekly: {
          type: "linear",
          position: "left",
        },
        total: {
          type: "linear",
          position: "right",
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  })
})

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<template>
  <div class="chart-shell">
    <canvas ref="canvas" />
  </div>
</template>
