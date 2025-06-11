import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { BarChart, PieChart, LineChart, Download, FileText, Filter, Calendar, Plus, Loader2 } from "lucide-react";
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

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Report types configuration
const reportTypes = [
  { id: "budget-summary", name: "Budget Summary", icon: <BarChart className="h-4 w-4" /> },
  { id: "expense-report", name: "Expense Report", icon: <PieChart className="h-4 w-4" /> },
  { id: "cash-flow", name: "Cash Flow Analysis", icon: <LineChart className="h-4 w-4" /> },
  { id: "profit-loss", name: "Profit/Loss Statement", icon: <FileText className="h-4 w-4" /> }
];

// Financial Reports Page Component
const FinancialReportsPage = () => {
  // Current project ID - in a real app, this would come from context or URL params
  const projectId = "project123";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("saved");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for data
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);

  // Fetch reports
  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters = {
        type: typeFilter !== "all" ? typeFilter : undefined,
        search: searchQuery || undefined
      };
      
      const data = await financialService.getReports(projectId, filters);
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [projectId, typeFilter, searchQuery]);

  // Handle generate report
  const handleGenerateReport = async (formData) => {
    try {
      setIsLoading(true);
      await financialService.generateReport(projectId, formData);
      setShowGenerateDialog(false);
      toast({
        title: "Success",
        description: "Report generated successfully."
      });
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error("Error generating report:", err);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view report
  const handleViewReport = async (report) => {
    try {
      setIsLoading(true);
      setSelectedReport(report);
      
      // Fetch the report data
      const data = await financialService.getReportData(report.id);
      setReportData(data);
      setShowReportDialog(true);
    } catch (err) {
      console.error("Error fetching report data:", err);
      toast({
        title: "Error",
        description: "Failed to load report data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export report
  const handleExportReport = async (reportId, format) => {
    try {
      setIsLoading(true);
      toast({
        title: "Export Started",
        description: `Exporting report as ${format.toUpperCase()}...`
      });
      
      await financialService.exportReport(reportId, format);
      
      toast({
        title: "Export Complete",
        description: `Report exported as ${format.toUpperCase()} successfully.`
      });
    } catch (err) {
      console.error("Error exporting report:", err);
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (typeId) => {
    setSelectedReportType(typeId);
    setShowGenerateDialog(true);
  };

  // Filter reports based on search query and type filter
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and view financial reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" /> Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Select report type and parameters to generate a new financial report.
                </DialogDescription>
              </DialogHeader>
              <ReportGenerationForm 
                onSubmit={handleGenerateReport} 
                onCancel={() => setShowGenerateDialog(false)} 
                initialType={selectedReportType}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Budget Summary">Budget Summary</SelectItem>
                <SelectItem value="Expense Report">Expense Report</SelectItem>
                <SelectItem value="Cash Flow">Cash Flow</SelectItem>
                <SelectItem value="Profit/Loss">Profit/Loss</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports Grid */}
          {error ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-red-600">
                  <p>{error}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchReports}>
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No reports found. Generate your first report to get started.
                </div>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <CardDescription>{report.type}</CardDescription>
                        </div>
                        {getReportTypeIcon(report.type)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date Range:</span>
                          <span>{formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created By:</span>
                          <span>{report.createdBy}</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewReport(report)}
                        disabled={isLoading}
                      >
                        View
                      </Button>
                      <Select 
                        onValueChange={(format) => handleExportReport(report.id, format)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[120px] h-9">
                          <SelectValue placeholder="Export" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">Export as PDF</SelectItem>
                          <SelectItem value="excel">Export as Excel</SelectItem>
                          <SelectItem value="csv">Export as CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((type) => (
              <Card key={type.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    {type.icon}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    {getReportTypeDescription(type.id)}
                  </p>
                </CardContent>
                <div className="p-4 pt-0 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleTemplateSelect(type.id)}
                    disabled={isLoading}
                  >
                    Generate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[800px]">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedReport.name}</DialogTitle>
                <DialogDescription>
                  {selectedReport.type} for {formatDate(selectedReport.dateRange.start)} - {formatDate(selectedReport.dateRange.end)}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : reportData ? (
                  renderReportContent(selectedReport, reportData)
                ) : (
                  <div className="text-center py-8 text-red-600">
                    <p>Failed to load report data.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => handleViewReport(selectedReport)}
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                  Close
                </Button>
                <Select 
                  onValueChange={(format) => handleExportReport(selectedReport.id, format)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Export" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">Export as PDF</SelectItem>
                    <SelectItem value="excel">Export as Excel</SelectItem>
                    <SelectItem value="csv">Export as CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to get report type icon
const getReportTypeIcon = (type) => {
  switch (type) {
    case "Budget Summary":
      return <BarChart className="h-5 w-5 text-blue-500" />;
    case "Expense Report":
      return <PieChart className="h-5 w-5 text-green-500" />;
    case "Cash Flow":
      return <LineChart className="h-5 w-5 text-purple-500" />;
    case "Profit/Loss":
      return <FileText className="h-5 w-5 text-amber-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

// Helper function to get report type description
const getReportTypeDescription = (typeId) => {
  switch (typeId) {
    case "budget-summary":
      return "Compare budgeted amounts with actual expenses across categories.";
    case "expense-report":
      return "Detailed breakdown of expenses by category, vendor, or time period.";
    case "cash-flow":
      return "Track income, expenses, and cumulative cash flow over time.";
    case "profit-loss":
      return "Summary of revenue, expenses, and resulting profit or loss.";
    default:
      return "Generate a financial report.";
  }
};

// Helper function to render report content based on type
const renderReportContent = (report, data) => {
  switch (report.type) {
    case "Budget Summary":
      return renderBudgetSummaryReport(data);
    case "Expense Report":
      return renderExpenseReport(data);
    case "Cash Flow":
      return renderCashFlowReport(data);
    case "Profit/Loss":
      return renderProfitLossReport(data);
    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          Report content not available.
        </div>
      );
  }
};

// Render Budget Summary Report
const renderBudgetSummaryReport = (data) => {
  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data.chartData}
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
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2">Category</th>
              <th className="text-right p-2">Budget</th>
              <th className="text-right p-2">Actual</th>
              <th className="text-right p-2">Variance</th>
              <th className="text-right p-2">% Used</th>
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                <td className="text-left p-2">{row.category}</td>
                <td className="text-right p-2">{formatCurrency(row.budget)}</td>
                <td className="text-right p-2">{formatCurrency(row.actual)}</td>
                <td className="text-right p-2">{formatCurrency(row.variance)}</td>
                <td className="text-right p-2">{row.percentUsed}%</td>
              </tr>
            ))}
            <tr className="font-bold bg-muted/50">
              <td className="text-left p-2">Total</td>
              <td className="text-right p-2">{formatCurrency(data.totals.budget)}</td>
              <td className="text-right p-2">{formatCurrency(data.totals.actual)}</td>
              <td className="text-right p-2">{formatCurrency(data.totals.variance)}</td>
              <td className="text-right p-2">{data.totals.percentUsed}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Render Expense Report
const renderExpenseReport = (data) => {
  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data.chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2">Category</th>
              <th className="text-right p-2">Amount</th>
              <th className="text-right p-2">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                <td className="text-left p-2">{row.name}</td>
                <td className="text-right p-2">{formatCurrency(row.value)}</td>
                <td className="text-right p-2">{row.percentage}%</td>
              </tr>
            ))}
            <tr className="font-bold bg-muted/50">
              <td className="text-left p-2">Total</td>
              <td className="text-right p-2">{formatCurrency(data.total)}</td>
              <td className="text-right p-2">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Render Cash Flow Report
const renderCashFlowReport = (data) => {
  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data.chartData}
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
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2">Month</th>
              <th className="text-right p-2">Income</th>
              <th className="text-right p-2">Expenses</th>
              <th className="text-right p-2">Net</th>
              <th className="text-right p-2">Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                <td className="text-left p-2">{row.month}</td>
                <td className="text-right p-2">{formatCurrency(row.income)}</td>
                <td className="text-right p-2">{formatCurrency(row.expenses)}</td>
                <td className="text-right p-2">{formatCurrency(row.income - row.expenses)}</td>
                <td className="text-right p-2">{formatCurrency(row.cumulative)}</td>
              </tr>
            ))}
            <tr className="font-bold bg-muted/50">
              <td className="text-left p-2">Total</td>
              <td className="text-right p-2">{formatCurrency(data.totals.income)}</td>
              <td className="text-right p-2">{formatCurrency(data.totals.expenses)}</td>
              <td className="text-right p-2">{formatCurrency(data.totals.net)}</td>
              <td className="text-right p-2">{formatCurrency(data.totals.cumulative)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Render Profit/Loss Report
const renderProfitLossReport = (data) => {
  return (
    <div className="space-y-6">
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-right p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-semibold bg-muted/30">
              <td className="text-left p-2" colSpan={2}>Revenue</td>
            </tr>
            {data.revenue.items.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="text-left p-2 pl-6">{item.name}</td>
                <td className="text-right p-2">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            <tr className="font-semibold bg-muted/30">
              <td className="text-left p-2">Total Revenue</td>
              <td className="text-right p-2">{formatCurrency(data.revenue.total)}</td>
            </tr>
            
            <tr className="font-semibold bg-muted/30">
              <td className="text-left p-2" colSpan={2}>Expenses</td>
            </tr>
            {data.expenses.items.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="text-left p-2 pl-6">{item.name}</td>
                <td className="text-right p-2">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            <tr className="font-semibold bg-muted/30">
              <td className="text-left p-2">Total Expenses</td>
              <td className="text-right p-2">{formatCurrency(data.expenses.total)}</td>
            </tr>
            
            <tr className="font-bold bg-muted/50">
              <td className="text-left p-2">Net Profit/Loss</td>
              <td className="text-right p-2">{formatCurrency(data.netProfit)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={[
              { name: "Revenue", value: data.revenue.total },
              { name: "Expenses", value: data.expenses.total },
              { name: "Net Profit/Loss", value: data.netProfit }
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
              {[
                <Cell key="cell-0" fill="#4ade80" />,
                <Cell key="cell-1" fill="#f87171" />,
                <Cell key="cell-2" fill={data.netProfit >= 0 ? "#4ade80" : "#f87171"} />
              ]}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Report Generation Form Component
const ReportGenerationForm = ({ onSubmit, onCancel, initialType = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: initialType || "budget-summary",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    includeSubcategories: true,
    includeCharts: true,
    includeTables: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Set end date to last day of current month by default
  useEffect(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setFormData(prev => ({
      ...prev,
      endDate: lastDay.toISOString().split("T")[0]
    }));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for the field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Report name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Report Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
            placeholder="e.g., Q2 Budget Summary"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Report Type <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget-summary">Budget Summary</SelectItem>
              <SelectItem value="expense-report">Expense Report</SelectItem>
              <SelectItem value="cash-flow">Cash Flow Analysis</SelectItem>
              <SelectItem value="profit-loss">Profit/Loss Statement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Report Options</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeSubcategories"
                checked={formData.includeSubcategories}
                onChange={(e) => handleChange("includeSubcategories", e.target.checked)}
              />
              <Label htmlFor="includeSubcategories" className="font-normal">Include subcategories</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeCharts"
                checked={formData.includeCharts}
                onChange={(e) => handleChange("includeCharts", e.target.checked)}
              />
              <Label htmlFor="includeCharts" className="font-normal">Include charts</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeTables"
                checked={formData.includeTables}
                onChange={(e) => handleChange("includeTables", e.target.checked)}
              />
              <Label htmlFor="includeTables" className="font-normal">Include tables</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Report"}
        </Button>
      </div>
    </form>
  );
};

export default FinancialReportsPage;
