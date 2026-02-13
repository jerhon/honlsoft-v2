import React, { useEffect, useRef } from "react"
import Layout from "../components/layout/layout"
import Running from "./running.json"
import Chart from "chart.js/auto"
import { Container } from "../components/ui/container"
import PageHeader from "../components/layout/page-header"
import { BreadcrumbInfo } from "../components/navigation/breadcrumb"

const breadcrumbs : BreadcrumbInfo[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Fitness",
    url: "/fitness/"
  }
];

function Fitness() {

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateRunningChart(canvas.current);
  },[canvas])


  return <Layout isDocked={true}>
    <PageHeader title="Fitness Goals" breadcrumbs={breadcrumbs} />
    <Container>
    <article className="m-4">
      <section>
        Over 2023 and 2024 I decided to try get more in shape before I hit a milestone birthday.
        In order to accomplish this, I've been setting obtainable goals for my fitness journey.
        I find if I just focus on losing weight, I eventually get discouraged when my progress slows.
        Having smaller fitness goals gives me something to work towards other than just my weight, and helps me get in shape.
      </section>

     <section>
       <h2>Accomplishments</h2>
       <ul>
         <li>Perform a single pull up.</li>
         <li>Get across the monkey bars in the gym.</li>
         <li>Run a mile without stopping.</li>
         <li>Run two miles without stopping.</li>
         <li>Run three miles without stopping.</li>
         <li>Run a mile in under 10 minutes.</li>
         <li>Weigh under 200 lbs.</li>
         <li>Run a 5k.</li>
         <li>Run a 10k.</li>
         <li>Run 2 miles in under 20 minutes.</li>
       </ul>

       <h2>Current Goals</h2>
       <ul>
         <li>Perform 5 consecutive pull ups.</li>
         <li>Perform 20 consecutive push ups.</li>
         <li>Weigh under 190 lbs.</li>
       </ul>
     </section>


      <h2>Running</h2>
      <p>
        In June of 2024, I decided to start running to help aid my fitness goals.
        This is tracking my mileage week by week.
      </p>

      <canvas id="running-chart" ref={canvas}></canvas>

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

export default Fitness;