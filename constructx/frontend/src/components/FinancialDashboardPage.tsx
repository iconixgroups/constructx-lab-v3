import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Plus, 
  Settings,
  Loader2
} from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import financialService from "../services/financialService";

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to format percentage
const formatPercentage = (value) => {
  return `${value}%`;
};

// Metric Card Component
const MetricCard = ({ title, value, change, changeType, format, isLoading }) => {
  const formattedValue = format === "currency" ? formatCurrency(value) : formatPercentage(value);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="h-7 w-24 bg-muted animate-pulse rounded mt-1"></div>
            </div>
            <div className="p-2 rounded-full bg-muted animate-pulse">
              <div className="h-5 w-5"></div>
            </div>
          </div>
          <div className="h-4 w-16 bg-muted animate-pulse rounded mt-2"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{formattedValue}</h3>
          </div>
          <div className={`p-2 rounded-full ${
            changeType === "positive" ? "bg-green-100 text-green-700" : 
            changeType === "negative" ? "bg-red-100 text-red-700" : 
            "bg-gray-100 text-gray-700"
          }`}>
            {changeType === "positive" ? <TrendingUp className="h-5 w-5" /> : 
             changeType === "negative" ? <TrendingDown className="h-5 w-5" /> : 
             <Wallet className="h-5 w-5" />}
          </div>
        </div>
        {change !== 0 && (
          <p className={`text-sm mt-2 ${
            changeType === "positive" ? "text-green-600" : 
            changeType === "negative" ? "text-red-600" : 
            "text-gray-600"
          }`}>
            {changeType === "positive" ? "↑" : "↓"} {change}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Budget vs Actual Chart Component
const BudgetVsActualChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Budget vs. Actual
          </CardTitle>
          <CardDescription>Comparison by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Budget vs. Actual
        </CardTitle>
        <CardDescription>Comparison by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="hsl(var(--primary) / 0.5)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Cash Flow Chart Component
const CashFlowChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="h-5 w-5 mr-2" />
            Cash Flow
          </CardTitle>
          <CardDescription>Monthly income vs. expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChart className="h-5 w-5 mr-2" />
          Cash Flow
        </CardTitle>
        <CardDescription>Monthly income vs. expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="income" name="Income" stroke="#4ade80" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Expense Breakdown Chart Component
const ExpenseBreakdownChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Expense Breakdown
          </CardTitle>
          <CardDescription>By category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Expense Breakdown
        </CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Recent Expenses Component
const RecentExpenses = ({ expenses, isLoading, onViewAll, onAddNew }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Recent Expenses
            </CardTitle>
            <Button variant="outline" size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" /> New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center border-b pb-3">
                <div>
                  <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mt-1"></div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded mt-1"></div>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full" disabled>
              View All Expenses
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Recent Expenses
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" /> New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recent expenses found.
            </div>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(expense.amount)}</p>
                  <p className={`text-xs ${
                    expense.status === "Approved" ? "text-green-600" : 
                    expense.status === "Rejected" ? "text-red-600" : 
                    "text-amber-600"
                  }`}>
                    {expense.status}
                  </p>
                </div>
              </div>
            ))
          )}
          <Button variant="ghost" size="sm" className="w-full" onClick={onViewAll}>
            View All Expenses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Financial Dashboard Page Component
const FinancialDashboardPage = () => {
  // Current project ID - in a real app, this would come from context or URL params
  const projectId = "project123";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dashboard data
  const [financialMetrics, setFinancialMetrics] = useState([]);
  const [budgetVsActual, setBudgetVsActual] = useState([]);
  const [cashFlow, setCashFlow] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [metricsData, budgetData, cashFlowData, expenseBreakdownData, recentExpensesData] = await Promise.all([
        financialService.getFinancialMetrics(projectId, dateRange),
        financialService.getBudgetVsActualData(projectId, dateRange),
        financialService.getCashFlowData(projectId, dateRange),
        financialService.getExpenseBreakdownData(projectId, dateRange),
        financialService.getRecentExpenses(projectId, 5)
      ]);
      
      // Update state with fetched data
      setFinancialMetrics(metricsData);
      setBudgetVsActual(budgetData);
      setCashFlow(cashFlowData);
      setExpenseBreakdown(expenseBreakdownData);
      setRecentExpenses(recentExpensesData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load financial dashboard data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load financial dashboard data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [projectId, dateRange]);

  // Handle tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Navigate to appropriate page based on tab
    if (value !== "overview") {
      navigate(`/financial/${value}`);
    }
  };

  // Handle navigation to expenses page
  const handleViewAllExpenses = () => {
    navigate("/financial/expenses");
  };

  // Handle navigation to add new expense
  const handleAddNewExpense = () => {
    navigate("/financial/expenses/new");
  };

  // Handle export dashboard
  const handleExportDashboard = async () => {
    try {
      // In a real implementation, this would call an API to generate a report
      toast({
        title: "Export Started",
        description: "Your financial dashboard export is being prepared."
      });
      
      // Simulate export process
      setTimeout(() => {
        toast({
          title: "Export Complete",
          description: "Your financial dashboard has been exported successfully."
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export financial dashboard. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your project finances</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={isLoading}>
            <Calendar className="h-4 w-4 mr-2" /> Date Range
          </Button>
          <Button variant="outline" onClick={handleExportDashboard} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="outline" size="icon" disabled={isLoading}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {error ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchDashboardData}>
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {isLoading ? (
                  // Show skeleton loaders when loading
                  Array(4).fill(0).map((_, index) => (
                    <MetricCard
                      key={index}
                      title={["Total Budget", "Expenses to Date", "Remaining Budget", "Budget Utilization"][index]}
                      value={0}
                      change={0}
                      changeType="neutral"
                      format={index === 3 ? "percentage" : "currency"}
                      isLoading={true}
                    />
                  ))
                ) : (
                  // Show actual data when loaded
                  financialMetrics.map((metric, index) => (
                    <MetricCard
                      key={index}
                      title={metric.name}
                      value={metric.value}
                      change={metric.change}
                      changeType={metric.changeType}
                      format={metric.format}
                      isLoading={false}
                    />
                  ))
                )}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <BudgetVsActualChart data={budgetVsActual} isLoading={isLoading} />
                <CashFlowChart data={cashFlow} isLoading={isLoading} />
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ExpenseBreakdownChart data={expenseBreakdown} isLoading={isLoading} />
                <div className="lg:col-span-2">
                  <RecentExpenses 
                    expenses={recentExpenses} 
                    isLoading={isLoading} 
                    onViewAll={handleViewAllExpenses}
                    onAddNew={handleAddNewExpense}
                  />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          <div className="flex justify-center items-center h-[400px]">
            <p>Redirecting to budget management...</p>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <div className="flex justify-center items-center h-[400px]">
            <p>Redirecting to expense tracking...</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="flex justify-center items-center h-[400px]">
            <p>Redirecting to financial reports...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboardPage;
