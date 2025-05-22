import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface FinancialDashboardProps {
  projectId: string;
  projectName: string;
  budget?: {
    total: number;
    spent: number;
    remaining: number;
    forecast: number;
  };
  expenses?: {
    id: string;
    category: string;
    description: string;
    amount: number;
    date: Date;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    submittedBy: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
  }[];
  invoices?: {
    id: string;
    number: string;
    client: string;
    amount: number;
    issueDate: Date;
    dueDate: Date;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  }[];
  costCategories?: {
    id: string;
    name: string;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
  }[];
  isLoading?: boolean;
  onCreateExpense?: () => void;
  onCreateInvoice?: () => void;
  onViewExpense?: (expenseId: string) => void;
  onViewInvoice?: (invoiceId: string) => void;
  onExportFinancialReport?: () => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  projectId,
  projectName,
  budget,
  expenses = [],
  invoices = [],
  costCategories = [],
  isLoading = false,
  onCreateExpense,
  onCreateInvoice,
  onViewExpense,
  onViewInvoice,
  onExportFinancialReport
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(expense => {
    if (!searchQuery) return true;
    
    return (
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => {
    if (!searchQuery) return true;
    
    return (
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get status color for expenses
  const getExpenseStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Get status color for invoices
  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  // Render budget overview
  const renderBudgetOverview = () => {
    if (!budget) return null;
    
    const spentPercentage = (budget.spent / budget.total) * 100;
    const forecastPercentage = (budget.forecast / budget.total) * 100;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div>
                <div className="text-sm font-medium">Total Budget</div>
                <div className="text-2xl font-bold">{formatCurrency(budget.total)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Remaining</div>
                <div className="text-2xl font-bold">{formatCurrency(budget.remaining)}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Spent: {formatCurrency(budget.spent)}</span>
                  <span>{spentPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${spentPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Forecast: {formatCurrency(budget.forecast)}</span>
                  <span>{forecastPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${forecastPercentage > 100 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.min(forecastPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cost Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {costCategories.map(category => (
                <div key={category.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category.name}</span>
                    <span>{formatCurrency(category.spent)} / {formatCurrency(category.budget)}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.percentage > 100 ? 'bg-red-600' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render expenses list
  const renderExpensesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent Expenses</h3>
          {onCreateExpense && (
            <Button onClick={onCreateExpense} size="sm">
              New Expense
            </Button>
          )}
        </div>
        
        {filteredExpenses.length > 0 ? (
          <div className="space-y-2">
            {filteredExpenses.slice(0, 5).map(expense => (
              <div 
                key={expense.id} 
                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => onViewExpense && onViewExpense(expense.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={expense.submittedBy.avatarUrl} alt={expense.submittedBy.name} />
                    <AvatarFallback>{expense.submittedBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-xs text-muted-foreground">{expense.category} • {expense.date.toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(expense.amount)}</div>
                    <Badge className={getExpenseStatusColor(expense.status)}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              <line x1="2" x2="22" y1="10" y2="10"></line>
            </svg>
            <p className="text-muted-foreground">No expenses found</p>
          </div>
        )}
      </div>
    );
  };

  // Render invoices list
  const renderInvoicesList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Recent Invoices</h3>
          {onCreateInvoice && (
            <Button onClick={onCreateInvoice} size="sm">
              New Invoice
            </Button>
          )}
        </div>
        
        {filteredInvoices.length > 0 ? (
          <div className="space-y-2">
            {filteredInvoices.slice(0, 5).map(invoice => (
              <div 
                key={invoice.id} 
                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => onViewInvoice && onViewInvoice(invoice.id)}
              >
                <div>
                  <div className="font-medium">Invoice #{invoice.number}</div>
                  <div className="text-xs text-muted-foreground">{invoice.client} • Due: {invoice.dueDate.toLocaleDateString()}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                    <Badge className={getInvoiceStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
              <path d="M10 9H8"></path>
            </svg>
            <p className="text-muted-foreground">No invoices found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{projectName} Financials</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[200px]"
            />
            {onExportFinancialReport && (
              <Button variant="outline" size="sm" onClick={onExportFinancialReport} className="h-8">
                Export Report
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {renderBudgetOverview()}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>{renderExpensesList()}</div>
                <div>{renderInvoicesList()}</div>
              </div>
            </TabsContent>
            
            <TabsContent value="expenses">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">All Expenses</h3>
                  {onCreateExpense && (
                    <Button onClick={onCreateExpense}>
                      New Expense
                    </Button>
                  )}
                </div>
                
                {filteredExpenses.length > 0 ? (
                  <div className="space-y-2">
                    {filteredExpenses.map(expense => (
                      <div 
                        key={expense.id} 
                        className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => onViewExpense && onViewExpense(expense.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={expense.submittedBy.avatarUrl} alt={expense.submittedBy.name} />
                            <AvatarFallback>{expense.submittedBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{expense.description}</div>
                            <div className="text-xs text-muted-foreground">{expense.category} • {expense.date.toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(expense.amount)}</div>
                            <Badge className={getExpenseStatusColor(expense.status)}>
                              {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                    <p className="text-muted-foreground">No expenses found</p>
                    {onCreateExpense && (
                      <Button onClick={onCreateExpense}>
                        Create Expense
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="invoices">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">All Invoices</h3>
                  {onCreateInvoice && (
                    <Button onClick={onCreateInvoice}>
                      New Invoice
                    </Button>
                  )}
                </div>
                
                {filteredInvoices.length > 0 ? (
                  <div className="space-y-2">
                    {filteredInvoices.map(invoice => (
                      <div 
                        key={invoice.id} 
                        className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => onViewInvoice && onViewInvoice(invoice.id)}
                      >
                        <div>
                          <div className="font-medium">Invoice #{invoice.number}</div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.client} • Issued: {invoice.issueDate.toLocaleDateString()} • Due: {invoice.dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                            <Badge className={getInvoiceStatusColor(invoice.status)}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <path d="M14 2v6h6"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                      <path d="M10 9H8"></path>
                    </svg>
                    <p className="text-muted-foreground">No invoices found</p>
                    {onCreateInvoice && (
                      <Button onClick={onCreateInvoice}>
                        Create Invoice
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialDashboard;
