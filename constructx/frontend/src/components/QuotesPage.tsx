import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  List, 
  LayoutDashboard, 
  Loader2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Send,
  Check,
  X,
  RefreshCcw,
  DollarSign
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import quoteService from "../services/quoteService";
import QuotesList from "./QuotesList";
// import QuotesGrid from "./QuotesGrid";
import QuoteForm from "./QuoteForm";
// import QuoteMetricsComponent from "./QuoteMetricsComponent";

interface QuotesPageProps {
  projectId?: string; // Optional - if provided, shows quotes for specific project
}

const QuotesPage: React.FC<QuotesPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("quotes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalValue: 0,
    acceptedQuotes: 0,
    pendingQuotes: 0,
  });

  // Mock data for development
  const mockQuotes = [
    {
      id: "q-1",
      projectId: "proj-1",
      quoteNumber: "Q-001",
      title: "Concrete Foundation Work",
      type: "Client Quote",
      recipientCompany: "ABC Construction",
      status: "Sent",
      issueDate: "2025-06-01",
      expiryDate: "2025-06-30",
      totalAmount: 50000.00,
      currency: "USD",
    },
    {
      id: "q-2",
      projectId: "proj-1",
      quoteNumber: "Q-002",
      title: "Electrical Subcontracting",
      type: "Vendor Quote Request",
      vendor: "Sparky Electric",
      status: "Accepted",
      issueDate: "2025-05-20",
      expiryDate: "2025-06-15",
      totalAmount: 25000.00,
      currency: "USD",
    },
    {
      id: "q-3",
      projectId: "proj-1",
      quoteNumber: "Q-003",
      title: "Plumbing Rough-in",
      type: "Client Quote",
      recipientCompany: "XYZ Developers",
      status: "Draft",
      issueDate: "2025-06-10",
      expiryDate: "2025-07-10",
      totalAmount: 12000.00,
      currency: "USD",
    },
  ];

  const mockStatuses = [
    { value: "Draft", label: "Draft" },
    { value: "Sent", label: "Sent" },
    { value: "Viewed", label: "Viewed" },
    { value: "Accepted", label: "Accepted" },
    { value: "Rejected", label: "Rejected" },
    { value: "Expired", label: "Expired" },
    { value: "Converted", label: "Converted" },
  ];

  const mockTypes = [
    { value: "Client Quote", label: "Client Quote" },
    { value: "Vendor Quote Request", label: "Vendor Quote Request" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [quotesResponse, statusesResponse, typesResponse] = await Promise.all([
        quoteService.getQuotes(projectId || ""),
        quoteService.getQuoteStatuses(),
        quoteService.getQuoteTypes(),
      ]);
      
      setQuotes(quotesResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setTypes(typesResponse.map((t: string) => ({ value: t, label: t })));
      setStats({
        totalQuotes: quotesResponse.length,
        totalValue: quotesResponse.reduce((sum: number, q: any) => sum + q.totalAmount, 0),
        acceptedQuotes: quotesResponse.filter((q: any) => q.status === "Accepted").length,
        pendingQuotes: quotesResponse.filter((q: any) => q.status === "Sent" || q.status === "Viewed").length,
      });
    } catch (error) {
      console.error("Error loading quote data:", error);
      toast({
        title: "Error",
        description: "Failed to load quote data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "status":
        setFilterStatus(value);
        break;
      case "type":
        setFilterType(value);
        break;
    }
  };

  // Handle create Quote
  const handleCreateQuote = () => {
    setEditingQuote(null);
    setShowQuoteForm(true);
  };

  // Handle edit Quote
  const handleEditQuote = (quote: any) => {
    setEditingQuote(quote);
    setShowQuoteForm(true);
  };

  // Handle Quote form submit
  const handleQuoteFormSubmit = async (quoteData: any) => {
    setIsLoading(true);
    try {
      if (editingQuote) {
        await quoteService.updateQuote(editingQuote.id, quoteData);
        toast({
          title: "Success",
          description: "Quote updated successfully."
        });
      } else {
        await quoteService.createQuote(quoteData);
        toast({
          title: "Success",
          description: "Quote created successfully."
        });
      }
      setShowQuoteForm(false);
      setEditingQuote(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Quotes based on search and filters
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = !searchTerm || 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.recipientCompany && quote.recipientCompany.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quote.vendor && quote.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !filterStatus || quote.status === filterStatus;
    const matchesType = !filterType || quote.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading && quotes.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quotes Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage quotes for this project" : "Manage all project quotes"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateQuote}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quote
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Quotes</CardTitle>
            <Check className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <RefreshCcw className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="quotes">Quotes List</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search quotes..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quotes List/Grid */}
          <QuotesList 
            quotes={filteredQuotes}
            onEdit={handleEditQuote}
            onDelete={async (quote) => {
              try {
                await quoteService.deleteQuote(quote.id);
                toast({
                  title: "Success",
                  description: "Quote removed successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting quote:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove quote. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onSend={async (quote) => {
              try {
                await quoteService.sendQuote(quote.id);
                toast({
                  title: "Success",
                  description: "Quote sent successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error sending quote:", error);
                toast({
                  title: "Error",
                  description: "Failed to send quote. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <QuoteMetricsComponent 
            quotes={quotes}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {/* Quote Form Dialog */}
      {showQuoteForm && (
        <QuoteForm
          quote={editingQuote}
          onSubmit={handleQuoteFormSubmit}
          onCancel={() => {
            setShowQuoteForm(false);
            setEditingQuote(null);
          }}
        />
      )}
    </div>
  );
};

export default QuotesPage;


