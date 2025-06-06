"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

interface DashboardChartProps {
  type: "line" | "bar" | "pie"
}

export default function DashboardChart({ type }: DashboardChartProps) {
  // Sample data for line/bar chart
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Responses",
        data: [65, 59, 80, 81, 56, 55, 72],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  }

  // Sample data for pie chart
  const pieData = {
    labels: ["Pre-Purchase", "Post-Purchase", "Customer Satisfaction", "Product Feedback", "Other"],
    datasets: [
      {
        data: [12, 19, 8, 15, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  if (type === "line") {
    return <Line data={lineData} options={lineOptions} />
  } else if (type === "bar") {
    return <Bar data={lineData} options={lineOptions} />
  } else {
    return <Pie data={pieData} options={pieOptions} />
  }
}
