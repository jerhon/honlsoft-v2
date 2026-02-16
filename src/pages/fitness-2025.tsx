import React, { useEffect, useRef } from "react"
import Layout from "../components/layout/layout"
import Running from "./running-2025.json"
import Chart from "chart.js/auto"
import { Container } from "../components/ui/container"
import PageHeader from "../components/layout/page-header"
import { BreadcrumbInfo } from "../components/navigation/breadcrumb"
import "../styles/technical-article.css"
import { FitnessLinks } from "../components/fitness/links"

const breadcrumbs : BreadcrumbInfo[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Fitness 2025",
    url: "/fitness-2025/"
  }
];

function Fitness2025() {

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateRunningChart(canvas.current);
  },[canvas])


  return <Layout isDocked={true}>
    <PageHeader title="Fitness Goals 2025" breadcrumbs={breadcrumbs} />
    <Container>
    <article className="technical-article m-4">
      <div className="technical-content">
        <section>
            <p>
            In 2025, I continued to work towards improving my fitness and health.
            I didn't have as concrete goals set for myself and mainly tracked my progress throughout the year with Strava.
            </p>

            <p>
            I mainly focused on running and was really happy with the progress I made.
            My primary goal was to run 500 miles in 2025, and I accomplished running over 600 miles.
            </p>
        </section>


        <h2>Running</h2>
        <p>
            I started tracking my running workouts in Strava.  This makes it much easier to extract the data.
        </p>
        <p>
            I was able to generate a dump of my exercise data in .csv format, and use GitHub CoPilot to write a script to format the data for me, a step I was previously doing manually with samsung health. 
        </p>

        <canvas id="running-chart" ref={canvas}></canvas>
        
        <FitnessLinks />
      </div>
    </article>
    </Container>
  </Layout>
}

function generateRunningChart(chart: HTMLCanvasElement | null) {

  if (chart == null)
  {
    return;
  }

  const labels = Running.weeks.map((w) => w.startDate);
  const miles = Running.weeks.map((w) => w.total);
  const avgs = Running.weeks.map((w) => w.average);
  const runningTotal = Running.weeks.map((w) => w.runningTotal);

  new Chart(chart, {
    data: {
      labels: labels,
      datasets: [{
        type: "bar",
        label: 'Miles Run (Week)',
        data: miles,
        yAxisID: 'A',
      },
        {
          type: "bar",
          label: 'Miles Per Run Avg (Week)',
          data: avgs,
          yAxisID: 'A',
        },
        {
          type: "line",
          label: 'Miles Run (Total)',
          data: runningTotal,
          yAxisID: 'B',
        }]
    },
    options: {
      animation: {
        duration: 200
      },
      scales: {
       A: {
         type: 'linear',
         position: 'left'
       },
        B: {
         type: 'linear',
          position: 'right'
        }
      }
    }
  });
}

export default Fitness2025;