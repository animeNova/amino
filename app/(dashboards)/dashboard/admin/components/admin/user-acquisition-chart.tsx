"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export function UserAcquisitionChart() {
  const data = [
    { name: "Organic Search", value: 35 },
    { name: "Social Media", value: 25 },
    { name: "Direct", value: 20 },
    { name: "Referral", value: 15 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#4ECDC4", "#FF6B6B", "#45B7D1", "#FFA5A5", "#98D8C8"]

  return (
    <div className="h-[300px]">
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
