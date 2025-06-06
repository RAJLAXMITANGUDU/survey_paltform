"use client"

import { Bar, Doughnut, Line, Pie } from "react-chartjs-2"
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

interface AnalyticsChartProps {
  type: "line" | "bar" | "pie" | "doughnut" | "horizontalBar"
  data: {
    labels: string[]
    datasets: {
      label?: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      tension?: number
      fill?: boolean
    }[]
  }
}

export default function AnalyticsChart({ type, data }: AnalyticsChartProps) {
  // Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
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

  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  if (type === "line") {
    return <Line data={data} options={lineOptions} />
  } else if (type === "bar") {
    return <Bar data={data} options={barOptions} />
  } else if (type === "horizontalBar") {
    return <Bar data={data} options={horizontalBarOptions} />
  } else if (type === "pie") {
    return <Pie data={data} options={pieOptions} />
  } else if (type === "doughnut") {
    return <Doughnut data={data} options={pieOptions} />
  } else {
    return null
  }
}
