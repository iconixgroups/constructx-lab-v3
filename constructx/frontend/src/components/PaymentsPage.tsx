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
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Check
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import paymentService from "../services/paymentService";
import PaymentsList from "./PaymentsList";
import PaymentForm from "./PaymentForm";
import PaymentMethodsManager from "./PaymentMethodsManager";
// import PaymentMetricsComponent from "./PaymentMetricsComponent";

interface PaymentsPageProps {
  projectId?: string; // Optional - if provided, shows payments for specific project
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("payments");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalIncoming: 0,
    totalOutgoing: 0,
    pendingPayments: 0,
  });

  // Mock data for development
  const mockPayments = [
    {
      id: "pay-1",
      projectId: "proj-1",
      paymentNumber: "PAY-001",
      type: "Outgoing",
      amount: 15000.00,
      currency: "USD",
      paymentDate: "2025-06-18",
      paymentMethodId: "pm-1",
      status: "Completed",
      relatedEntityType: "Invoice",
      relatedEntityId: "inv-001",
      notes: "Payment for June progress invoice.",
    },
    {
      id: "pay-2",
      projectId: "proj-1",
      paymentNumber: "PAY-002",
      type: "Incoming",
      amount: 25000.00,
      currency: "USD",
      paymentDate: "2025-06-17",
      paymentMethodId: "pm-2",
      status: "Completed",
      relatedEntityType: "ContractMilestone",
      relatedEntityId: "mil-003",
      notes: "Milestone payment from client.",
    },
    {
      id: "pay-3",
      projectId: "proj-1",
      paymentNumber: "PAY-003",
      type: "Outgoing",
      amount: 500.00,
      currency: "USD",
      paymentDate: "2025-06-19",
      paymentMethodId: "pm-1",
      status: "Pending",
      relatedEntityType: "Expense",
      relatedEntityId: "exp-010",
      notes: "Reimbursement for site supplies.",
    },
  ];

  const mockPaymentMethods = [
    { id: "pm-1", name: "Company Checking Account", type: "Bank Account", isActive: true, isDefaultIncoming: false, isDefaultOutgoing: true },
    { id: "pm-2", name: "Client Trust Account", type: "Bank Account", isActive: true, isDefaultIncoming: true, isDefaultOutgoing: false },
    { id: "pm-3", name: "Corporate Credit Card", type: "Credit Card", isActive: true, isDefaultIncoming: false, isDefaultOutgoing: false },
  ];

  const mockStatuses = [
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Completed", label: "Completed" },
    { value: "Failed", label: "Failed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const mockTypes = [
    { value: "Incoming", label: "Incoming" },
    { value: "Outgoing", label: "Outgoing" },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [paymentsResponse, methodsResponse, statusesResponse, typesResponse] = await Promise.all([
        paymentService.getPayments(projectId || ""),
        paymentService.getPaymentMethods(),
        paymentService.getPaymentStatuses(),
        paymentService.getPaymentTypes(),
      ]);
      
      setPayments(paymentsResponse);
      setPaymentMethods(methodsResponse);
      setStatuses(statusesResponse.map((s: string) => ({ value: s, label: s })));
      setTypes(typesResponse.map((t: string) => ({ value: t, label: t })));
      setStats({
        totalPayments: paymentsResponse.length,
        totalIncoming: paymentsResponse.filter((p: any) => p.type === "Incoming").reduce((sum: number, p: any) => sum + p.amount, 0),
        totalOutgoing: paymentsResponse.filter((p: any) => p.type === "Outgoing").reduce((sum: number, p: any) => sum + p.amount, 0),
        pendingPayments: paymentsResponse.filter((p: any) => p.status === "Pending" || p.status === "Processing").length,
      });
    } catch (error) {
      console.error("Error loading payment data:", error);
      toast({
        title: "Error",
        description: "Failed to load payment data. Please try again.",
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

  // Handle record Payment
  const handleRecordPayment = () => {
    setEditingPayment(null);
    setShowPaymentForm(true);
  };

  // Handle edit Payment
  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setShowPaymentForm(true);
  };

  // Handle Payment form submit
  const handlePaymentFormSubmit = async (paymentData: any) => {
    setIsLoading(true);
    try {
      if (editingPayment) {
        await paymentService.updatePayment(editingPayment.id, paymentData);
        toast({
          title: "Success",
          description: "Payment updated successfully."
        });
      } else {
        await paymentService.recordPayment(paymentData);
        toast({
          title: "Success",
          description: "Payment recorded successfully."
        });
      }
      setShowPaymentForm(false);
      setEditingPayment(null);
      loadData(); // Reload data after successful submission
    } catch (error) {
      console.error("Error saving payment:", error);
      toast({
        title: "Error",
        description: "Failed to save payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.relatedEntityType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    const matchesType = !filterType || payment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading && payments.length === 0) {
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
          <h1 className="text-3xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">
            {projectId ? "Manage payments for this project" : "Manage all project payments"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleRecordPayment}>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incoming</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalIncoming.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalOutgoing.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments">Payments Log</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search payments..."
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

          {/* Payments List */}
          <PaymentsList 
            payments={filteredPayments}
            onEdit={handleEditPayment}
            onDelete={async (payment) => {
              try {
                await paymentService.deletePayment(payment.id);
                toast({
                  title: "Success",
                  description: "Payment removed successfully."
                });
                loadData();
              } catch (error) {
                console.error("Error deleting payment:", error);
                toast({
                  title: "Error",
                  description: "Failed to remove payment. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <PaymentMethodsManager 
            paymentMethods={paymentMethods}
            onUpdate={() => loadData()} // Reload data after method changes
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* <PaymentMetricsComponent 
            payments={payments}
          /> */}
          <div>Metrics and Reports coming soon...</div>
        </TabsContent>
      </Tabs>

      {/* Payment Form Dialog */}
      {showPaymentForm && (
        <PaymentForm
          payment={editingPayment}
          paymentMethods={paymentMethods}
          onSubmit={handlePaymentFormSubmit}
          onCancel={() => {
            setShowPaymentForm(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default PaymentsPage;


