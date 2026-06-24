import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";

interface CoverageData {
  name: string;
  percentage: number;
  color: string;
}

interface CoverageChartsProps {
  quality: {
    websiteCoverage: number;
    phoneCoverage: number;
    hoursCoverage: number;
    verificationRate: number;
  };
}

export function DataQualityChart({ quality }: CoverageChartsProps) {
  const data: CoverageData[] = [
    { name: "Website Coverage", percentage: quality.websiteCoverage, color: "#C9A35A" }, // Warm Gold
    { name: "Phone Coverage", percentage: quality.phoneCoverage, color: "#6D8F82" }, // Muted Sea Green
    { name: "Operating Hours", percentage: quality.hoursCoverage, color: "#4E6B5C" }, // Sage Green
    { name: "Verification Rate", percentage: quality.verificationRate, color: "#6B6F6A" } // Stone Gray
  ];

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <XAxis type="number" domain={[0, 100]} stroke="#6B6F6A" fontSize={10} tickFormatter={(v) => `${v}%`} />
          <YAxis dataKey="name" type="category" stroke="#F5F5F0" fontSize={10} width={110} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(78, 107, 92, 0.15)" }}
            contentStyle={{
              backgroundColor: "#1E3A2F",
              border: "1px solid #6B6F6A",
              borderRadius: "8px",
              color: "#F5F5F0",
              fontSize: "11px",
              fontFamily: "monospace"
            }}
          />
          <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AnalyticsHistoryProps {
  history: {
    name: string;
    searches: number;
    verified: number;
  }[];
}

export function SystemPerformanceChart({ history }: AnalyticsHistoryProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A35A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#C9A35A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6D8F82" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6D8F82" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 111, 106, 0.15)" />
          <XAxis dataKey="name" stroke="#6B6F6A" fontSize={10} axisLine={false} />
          <YAxis stroke="#6B6F6A" fontSize={10} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E3A2F",
              border: "1px solid #6B6F6A",
              borderRadius: "8px",
              color: "#F5F5F0",
              fontSize: "11px",
              fontFamily: "monospace"
            }}
          />
          <Area
            type="monotone"
            dataKey="searches"
            stroke="#C9A35A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSearches)"
            name="Daily Queries"
          />
          <Area
            type="monotone"
            dataKey="verified"
            stroke="#6D8F82"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVerified)"
            name="Verified Leads"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
