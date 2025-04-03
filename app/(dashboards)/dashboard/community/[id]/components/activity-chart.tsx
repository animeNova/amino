"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface ActivityChartProps {
  data: any[]
  type?: "line" | "area" | "bar" | "pie"
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA5A5", "#98D8C8"]

export function ActivityChart({ data, type = "line" }: ActivityChartProps) {
  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="posts" fill="#FF6B6B" />
          <Bar dataKey="members" fill="#4ECDC4" />
          <Bar dataKey="reports" fill="#45B7D1" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="posts" stackId="1" stroke="#FF6B6B" fill="#FF6B6B" />
          <Area type="monotone" dataKey="members" stackId="1" stroke="#4ECDC4" fill="#4ECDC4" />
          <Area type="monotone" dataKey="reports" stackId="1" stroke="#45B7D1" fill="#45B7D1" />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="posts" stroke="#FF6B6B" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="members" stroke="#4ECDC4" />
        <Line type="monotone" dataKey="reports" stroke="#45B7D1" />
      </LineChart>
    </ResponsiveContainer>
  )
}

