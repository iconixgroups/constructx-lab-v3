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
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import invoiceService from "../services/invoiceService";
import InvoicesList from "./InvoicesList";
// import InvoicesGrid from "./InvoicesGrid";
import InvoiceForm from "./InvoiceForm";
// import InvoiceMetricsComponent from "./InvoiceMetricsComponent";

interface InvoicesPageProps {
  projectId?: string; // Optional - if provided, shows invoices for specific project
}

const InvoicesPage: React.FC<InvoicesPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalInvoiced: 0,
    totalPaid: 0,
    totalOverdue: 0,
    totalInvoices: 0,
  });

  // Mock data for development
  const mockInvoices = [
    {
      id: "inv-1",
      projectId: "proj-1",
      invoiceNumber: "INV-001",
      title: "Phase 1 Payment",
      type: "Outgoing Client Invoice",
      client: "ABC Corp",
      status: "Paid",
      issueDate: "2025-05-01",
      dueDate: "2025-05-31",
      totalAmount: 10000.00,
      amountDue: 0.00,
      amountPaid: 10000.00,
      currency: "USD",
    },
    {
      id: "inv-2",
      projectId: "proj-1",
      invoiceNumber: "INV-002",
      title: "Material Supply",
      type: "Incoming Vendor Invoice",
      vendor: "Building Supplies Inc.",
      status: "Due",
      issueDate: "2025-06-05",
      dueDate: "2025-07-05",
      totalAmount: 2500.00,
      amountDue: 2500.00,
      amountPaid: 0.00,
      currency: "USD",
    },
    {
      id: "inv-3",
      projectId: "proj-1",
      invoiceNumber: "INV-003",
      title: "Final Project Payment",
      type: "Outgoing Client Invoice",
      client: "XYZ Developers",
      status: "Overdue",
      issueDate: "2025-04-15",
      dueDate: "2025-05-15",
      totalAmount: 15000.00,
      amountDue: 15000.00,
      amountPaid: 0.00,
      currency: "USD",
    },
  ];

  const mockStatuses = [
    { value: "Draft", label: "Draft" },
    { value: "Sent", label: "Sent" },
    { value: "Viewed", label: "Viewed" },
    { value: "Partially Paid", label: "Partially Paid" },
    { value: "Paid", label: "Paid" },
    { value: "Overdue", label: "Overdue" },
    { value: "Void", label: "Void" },
  ];

  const mockTypes = [
    { value: "Outgoing Client Invoice", label: "Outgoing Client Invoice" },
    { value: "Incoming Vendor Invoice", label: "Incoming Vendor Invoice" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [invoicesResponse, statusesResponse, typesResponse] = await Promise.all([
        invoiceService.getInvoices(projectId || ""),
        invoiceService.getInvoiceStatuses(),
        invoiceService.getInvoiceTypes(),
      ]);
      
      setInvoices(invoicesResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setTypes(typesResponse.map((t: string) => ({ value: t, label: t })));
      setStats({
        totalInvoices: invoicesResponse.length,
        totalInvoiced: invoicesResponse.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0),
        totalPaid: invoicesResponse.reduce((sum: number, inv: any) => sum + inv.amountPaid, 0),
        totalOverdue: invoicesResponse.filter((inv: any) => inv.status === "Overdue").reduce((sum: number, inv: any) => sum + inv.amountDue, 0),
      });
    } catch (error) {
      console.error("Error loading invoice data:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice data. Please try again.",
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

  // Handle create Invoice
  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  // Handle edit Invoice
  const handleEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  // Handle Invoice form submit
  const handleInvoiceFormSubmit = async (invoiceData: any) => {
    setIsLoading(true);
    try {
      if (editingInvoice) {
        await invoiceService.updateInvoice(editingInvoice.id, invoiceData);
        toast({
          title: "Success",
          description: "Invoice updated successfully."
        });
      } else {
        await invoiceService.createInvoice(invoiceData);
        toast({
          title: "Success",
          description: "Invoice created successfully."
        });
      }
      setShowInvoiceForm(false);
      setEditingInvoice(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        title: "Error",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Invoices based on search and filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.client && invoice.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.vendor && invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    const matchesType = !filterType || invoice.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading && invoices.length === 0) {
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
          <h1 className="text-3xl font-bold">Invoices Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage invoices for this project" : "Manage all project invoices"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalInvoiced.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalOverdue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <List className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="invoices">Invoices List</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
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

          {/* Invoices List/Grid */}
          <InvoicesList 
            invoices={filteredInvoices}
            onEdit={handleEditInvoice}
            onDelete={async (invoice) => {
              try {
                await invoiceService.deleteInvoice(invoice.id);
                toast({
                  title: "Success",
                  description: "Invoice removed successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting invoice:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove invoice. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onSend={async (invoice) => {
              try {
                await invoiceService.sendInvoice(invoice.id);
                toast({
                  title: "Success",
                  description: "Invoice sent successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error sending invoice:", error);
                toast({
                  title: "Error",
                  description: "Failed to send invoice. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onRecordPayment={async (invoice) => {
              try {
                await invoiceService.recordPayment(invoice.id, { amount: invoice.amountDue, paymentDate: new Date().toISOString().split('T')[0] }); // Assuming full payment for simplicity
                toast({
                  title: "Success",
                  description: "Payment recorded successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error recording payment:", error);
                toast({
                  title: "Error",
                  description: "Failed to record payment. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <InvoiceMetricsComponent 
            invoices={invoices}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {/* Invoice Form Dialog */}
      {showInvoiceForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={handleInvoiceFormSubmit}
          onCancel={() => {
            setShowInvoiceForm(false);
            setEditingInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoicesPage;


