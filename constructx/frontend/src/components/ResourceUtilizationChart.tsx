import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { BarChart2, AlertTriangle, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import resourceService from "../services/resourceService"; // Import the service
import { toast } from "sonner"; // Assuming toast library

const ResourceUtilizationChart = ({ resourceId }) => {
  const [utilizationData, setUtilizationData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [unit, setUnit] = useState("hours");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("past_month"); // past_week, past_month, past_quarter, past_year
  const [aggregation, setAggregation] = useState("daily"); // daily, weekly, monthly

  // Fetch utilization data
  const loadUtilization = useCallback(async () => {
    if (!resourceId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await resourceService.getResourceUtilization(resourceId, dateRange, aggregation);
      setUtilizationData(data.utilizationData || []);
      setSummary(data.summary || null);
      setUnit(data.unit || "hours");
    } catch (err) {
      console.error("Failed to load utilization data:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load utilization data. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId, dateRange, aggregation]);

  useEffect(() => {
    loadUtilization();
  }, [loadUtilization]);

  // Handle date range change
  const handleDateRangeChange = (value) => {
    setDateRange(value);
    // Adjust aggregation based on range if needed
    if (value === "past_week" || value === "past_month") setAggregation("daily");
    else if (value === "past_quarter") setAggregation("weekly");
    else if (value === "past_year") setAggregation("monthly");
  };

  // Handle aggregation change
  const handleAggregationChange = (value) => {
    setAggregation(value);
  };

  // Handle export
  const handleExport = async () => {
    try {
      await resourceService.exportUtilizationData(resourceId, dateRange, aggregation);
      toast.success("Utilization data exported successfully");
    } catch (err) {
      console.error("Failed to export utilization data:", err);
      toast.error("Failed to export utilization data");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <CardTitle className="flex items-center"><BarChart2 className="h-5 w-5 mr-2" /> Utilization History</CardTitle>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full sm:w-[150px] text-sm">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="past_week">Past Week</SelectItem>
              <SelectItem value="past_month">Past Month</SelectItem>
              <SelectItem value="past_quarter">Past Quarter</SelectItem>
              <SelectItem value="past_year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={aggregation} onValueChange={handleAggregationChange}>
            <SelectTrigger className="w-full sm:w-[120px] text-sm">
              <SelectValue placeholder="Aggregate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading || utilizationData.length === 0}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">Loading chart data...</div>
        ) : utilizationData.length === 0 ? (
           <div className="h-[300px] flex items-center justify-center text-muted-foreground">
             No utilization data available for the selected period.
           </div>
        ) : (
          <>
            {summary && (
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total Allocated</div>
                  <div className="text-lg font-semibold">{summary.totalAllocated.toFixed(1)} {unit}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Utilized</div>
                  <div className="text-lg font-semibold">{summary.totalUtilized.toFixed(1)} {unit}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Utilization Rate</div>
                  <div className="text-lg font-semibold">{summary.utilizationRate.toFixed(1)}%</div>
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} unit={unit === "hours" ? "h" : ""} />
                <Tooltip 
                  cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="allocated" fill="hsl(var(--primary) / 0.5)" name="Allocated" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilized" fill="hsl(var(--primary))" name="Utilized" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceUtilizationChart;
