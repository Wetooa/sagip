"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  MapPin,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import {
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AIAnalytics() {
  const [floodPrediction] = useState([
    { time: "12:00", level: 2.3, predicted: 2.5 },
    { time: "14:00", level: 2.8, predicted: 3.2 },
    { time: "16:00", level: 3.5, predicted: 4.1 },
    { time: "18:00", level: 4.2, predicted: 5.3 },
    { time: "20:00", level: 5.1, predicted: 6.2 },
    { time: "22:00", level: 4.8, predicted: 5.5 },
  ]);

  const [riskDistribution] = useState([
    { name: "Safe", value: 802, color: "#22c55e" },
    { name: "Warning", value: 289, color: "#eab308" },
    { name: "Danger", value: 98, color: "#f97316" },
    { name: "Critical", value: 58, color: "#ef4444" },
  ]);

  const [rescueEfficiency] = useState([
    { hour: "08:00", completed: 5, active: 2 },
    { hour: "10:00", completed: 8, active: 3 },
    { hour: "12:00", completed: 12, active: 5 },
    { hour: "14:00", completed: 18, active: 4 },
    { hour: "16:00", completed: 24, active: 6 },
    { hour: "18:00", completed: 31, active: 8 },
  ]);

  const [aiInsights] = useState([
    {
      type: "warning",
      title: "Flood Level Rising",
      description: "AI predicts 40% increase in flood levels within 4 hours",
      confidence: 87,
    },
    {
      type: "critical",
      title: "Critical Zone Alert",
      description:
        "156 people detected in high-risk zones requiring immediate evacuation",
      confidence: 94,
    },
    {
      type: "info",
      title: "Optimal Rescue Routes",
      description:
        "ML model identified 3 faster alternative routes avoiding congestion",
      confidence: 91,
    },
    {
      type: "success",
      title: "Evacuation Progress",
      description:
        "73% of target population successfully evacuated to safe zones",
      confidence: 96,
    },
  ]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#ff6b6b]" />
            AI-Powered Analytics
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Real-time predictions and data insights
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#8B0000]/20 to-[#6B1515]/20 px-4 py-2 rounded-lg border border-[#8B0000]/30">
          <Zap className="w-4 h-4 text-[#F4E4C1]" />
          <span className="text-sm text-[#F4E4C1] font-medium">AI Active</span>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-2 gap-4">
        {aiInsights.map((insight, index) => (
          <AIInsightCard key={index} insight={insight} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Flood Prediction Chart */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4 hover:border-white/20 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-500" />
              Flood Level Prediction
            </h3>
            <span className="text-xs text-gray-400">
              ML Model: 87% confidence
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={floodPrediction}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #ffffff20",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="level"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorLevel)"
                name="Current"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorPredicted)"
                name="Predicted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4 hover:border-white/20 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Population Risk Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPie>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #ffffff20",
                  borderRadius: "8px",
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Rescue Operations Efficiency */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4 col-span-2 hover:border-white/20 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Rescue Operations Timeline
            </h3>
            <span className="text-xs text-gray-400">Last 6 hours</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={rescueEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #ffffff20",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar
                dataKey="completed"
                fill="#22c55e"
                name="Completed"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="active"
                fill="#3b82f6"
                name="Active"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Response Time"
          value="8.5 min"
          trend="down"
          trendValue="12%"
          icon={TrendingDown}
          color="text-green-500"
        />
        <MetricCard
          label="Rescue Success Rate"
          value="94.3%"
          trend="up"
          trendValue="3%"
          icon={TrendingUp}
          color="text-green-500"
        />
        <MetricCard
          label="Critical Zones"
          value="24"
          trend="up"
          trendValue="8%"
          icon={AlertTriangle}
          color="text-red-500"
        />
        <MetricCard
          label="People Evacuated"
          value="1,089"
          trend="up"
          trendValue="15%"
          icon={Users}
          color="text-blue-500"
        />
      </div>
    </div>
  );
}

interface AIInsightCardProps {
  insight: {
    type: string;
    title: string;
    description: string;
    confidence: number;
  };
}

function AIInsightCard({ insight }: AIInsightCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500/50 bg-red-500/10";
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "success":
        return "border-green-500/50 bg-green-500/10";
      default:
        return "border-blue-500/50 bg-blue-500/10";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getTypeColor(insight.type)}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getTypeIcon(insight.type)}
          <h4 className="font-semibold text-white">{insight.title}</h4>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#F4E4C1]" />
          <span className="text-xs text-gray-400">{insight.confidence}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-300">{insight.description}</p>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  trend: "up" | "down";
  trendValue: string;
  icon: React.ElementType;
  color: string;
}

function MetricCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  color,
}: MetricCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4 hover:border-white/20 transition-all shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        {trend === "up" ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-green-500" />
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xs text-green-500 mt-1">
        {trend === "up" ? "↑" : "↓"} {trendValue}
      </div>
    </div>
  );
}
