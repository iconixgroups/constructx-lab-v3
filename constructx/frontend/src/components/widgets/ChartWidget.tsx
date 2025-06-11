import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// Define colors for Pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const ChartWidget = ({ data, config }) => {
    if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No chart data available.</div>;
    }

    const chartType = config?.chartType || "bar"; // Default to bar chart

    // Prepare data for recharts
    const chartData = data.labels.map((label, index) => {
        const entry = { name: label };
        data.datasets.forEach((dataset, dsIndex) => {
            entry[`value${dsIndex}`] = dataset.data[index];
        });
        return entry;
    });

    // Prepare data for Pie chart (assuming first dataset)
    const pieData = data.labels.map((label, index) => ({
        name: label,
        value: data.datasets[0].data[index],
    }));

    const renderChart = () => {
        switch (chartType) {
            case "bar":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: "10px" }} />
                            {data.datasets.map((dataset, index) => (
                                <Bar key={index} dataKey={`value${index}`} name={dataset.label} fill={dataset.backgroundColor || COLORS[index % COLORS.length]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "line":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: "10px" }} />
                            {data.datasets.map((dataset, index) => (
                                <Line key={index} type="monotone" dataKey={`value${index}`} name={dataset.label} stroke={dataset.borderColor || COLORS[index % COLORS.length]} strokeWidth={2} dot={false} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: "10px" }} layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return <div className="p-4 text-center text-muted-foreground">Unsupported chart type: {chartType}</div>;
        }
    };

    return (
        <div className="w-full h-full p-1">
            {renderChart()}
        </div>
    );
};

export default ChartWidget;

