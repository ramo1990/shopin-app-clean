'use client'

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = { labels: string[]; data: number[]; title?: string };

export default function BarChart({ labels, data, title }: Props) {
  return (
    <div className="w-full max-w-md h-64">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Bar data={{
        labels,
        datasets: [{ label: title || 'Données', data, backgroundColor: 'rgba(75,192,192,0.6)' }]
      }} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
}
