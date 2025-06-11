import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../core/Card';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import { Form, FormField, FormLabel, FormDescription, FormMessage } from '../core/Form';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../core/Table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Report {
  id: string;
  title: string;
  type: 'project_status' | 'financial_summary' | 'resource_utilization' | 'safety_incident' | 'quality_audit' | 'custom';
  status: 'draft' | 'generated' | 'pending_review' | 'approved' | 'distributed' | 'archived';
  projectId?: string;
  projectName?: string;
  generatedBy: string;
  generatedDate: string;
  periodStartDate?: string;
  periodEndDate?: string;
  description: string;
  recipients: string[];
  attachments: string[];
  tags: string[];
  data?: any; // Placeholder for report-specific data
}

// Sample data for charts
const projectStatusData = [
  { name: 'Planning', value: 15 },
  { name: 'Execution', value: 60 },
  { name: 'Testing', value: 10 },
  { name: 'Completed', value: 15 },
];

const financialData = [
  { name: 'Budget', value: 12500000 },
  { name: 'Actual Cost', value: 9800000 },
  { name: 'Forecasted Cost', value: 13100000 },
];

const resourceData = [
  { name: 'Labor', utilized: 85, total: 100 },
  { name: 'Equipment', utilized: 70, total: 100 },
  { name: 'Materials', utilized: 90, total: 100 },
];

const ReportingModule: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Monthly Project Status Report - May 2025',
      type: 'project_status',
      status: 'approved',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      generatedBy: 'John Smith',
      generatedDate: '2025-06-01',
      periodStartDate: '2025-05-01',
      periodEndDate: '2025-05-31',
      description: 'Summary of project progress, milestones achieved, and upcoming activities for May 2025.',
      recipients: ['Client Representatives', 'Executive Team'],
      attachments: ['may_status_report.pdf', 'progress_photos.zip'],
      tags: ['monthly', 'status', 'progress'],
      data: projectStatusData
    },
    {
      id: '2',
      title: 'Q2 Financial Summary Report',
      type: 'financial_summary',
      status: 'generated',
      projectId: '1',
      projectName: 'Downtown Office Tower',
      generatedBy: 'Emily Davis',
      generatedDate: '2025-07-05',
      periodStartDate: '2025-04-01',
      periodEndDate: '2025-06-30',
      description: 'Overview of project financials for the second quarter, including budget vs. actual costs.',
      recipients: ['Finance Department', 'Project Manager'],
      attachments: ['q2_financials.xlsx'],
      tags: ['quarterly', 'financial', 'budget'],
      data: financialData
    },
    {
      id: '3',
      title: 'Weekly Resource Utilization Report',
      type: 'resource_utilization',
      status: 'distributed',
      generatedBy: 'Michael Brown',
      generatedDate: '2025-06-07',
      periodStartDate: '2025-06-01',
      periodEndDate: '2025-06-07',
      description: 'Report on the utilization of labor, equipment, and materials for the past week.',
      recipients: ['Site Managers', 'Resource Planners'],
      attachments: [],
      tags: ['weekly', 'resources', 'utilization'],
      data: resourceData
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState<Partial<Report>>({
    type: 'project_status',
    title: '',
    status: 'draft',
    projectId: '',
    generatedBy: '',
    generatedDate: new Date().toISOString().split('T')[0],
    description: '',
    recipients: [],
    attachments: [],
    tags: []
  });
  const [attachmentInput, setAttachmentInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [recipientInput, setRecipientInput] = useState('');

  // Mock projects for dropdown
  const projects = [
    { id: '1', name: 'Downtown Office Tower' },
    { id: '2', name: 'Riverside Apartments' },
    { id: '3', name: 'City Hospital Renovation' }
  ];

  // Mock team members for dropdown
  const teamMembers = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Brown' },
    { id: '4', name: 'Emily Davis' },
    { id: '5', name: 'Robert Wilson' }
  ];

  // Mock recipient groups for dropdown
  const recipientGroups = [
    { id: '1', name: 'Project Team' },
    { id: '2', name: 'Client Representatives' },
    { id: '3', name: 'Executive Team' },
    { id: '4', name: 'Finance Department' },
    { id: '5', name: 'Site Managers' },
    { id: '6', name: 'Resource Planners' }
  ];

  const handleCreateReport = () => {
    const reportId = Math.random().toString(36).substr(2, 9);
    const selectedProject = projects.find(p => p.id === newReport.projectId);
    
    // Simulate generating data based on type
    let reportData = null;
    if (newReport.type === 'project_status') reportData = projectStatusData;
    else if (newReport.type === 'financial_summary') reportData = financialData;
    else if (newReport.type === 'resource_utilization') reportData = resourceData;
    
    const createdReport = {
      ...newReport,
      id: reportId,
      projectName: selectedProject?.name || '',
      attachments: newReport.attachments || [],
      tags: newReport.tags || [],
      recipients: newReport.recipients || [],
      data: reportData,
      status: 'generated' // Assume generation happens on create
    } as Report;
    
    setReports([...reports, createdReport]);
    setNewReport({
      type: 'project_status',
      title: '',
      status: 'draft',
      projectId: '',
      generatedBy: '',
      generatedDate: new Date().toISOString().split('T')[0],
      description: '',
      recipients: [],
      attachments: [],
      tags: []
    });
    setAttachmentInput('');
    setTagInput('');
    setRecipientInput('');
    setShowCreateForm(false);
  };

  const handleUpdateReport = () => {
    if (!editingReport) return;
    
    const selectedProject = projects.find(p => p.id === editingReport.projectId);
    const updatedReport = {
      ...editingReport,
      projectName: selectedProject?.name || editingReport.projectName
    };
    
    const updatedReports = reports.map(report => 
      report.id === updatedReport.id ? updatedReport : report
    );
    
    setReports(updatedReports);
    setEditingReport(null);
    setAttachmentInput('');
    setTagInput('');
    setRecipientInput('');
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
  };

  const handleAddAttachment = (isEditing: boolean) => {
    if (!attachmentInput.trim()) return;
    
    if (isEditing && editingReport) {
      const newAttachments = [...(editingReport.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setEditingReport({...editingReport, attachments: newAttachments});
    } else {
      const newAttachments = [...(newReport.attachments || [])];
      if (!newAttachments.includes(attachmentInput.trim())) {
        newAttachments.push(attachmentInput.trim());
      }
      setNewReport({...newReport, attachments: newAttachments});
    }
    
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (attachment: string, isEditing: boolean) => {
    if (isEditing && editingReport) {
      const newAttachments = editingReport.attachments.filter(a => a !== attachment);
      setEditingReport({...editingReport, attachments: newAttachments});
    } else {
      const newAttachments = (newReport.attachments || []).filter(a => a !== attachment);
      setNewReport({...newReport, attachments: newAttachments});
    }
  };

  const handleAddTag = (isEditing: boolean) => {
    if (!tagInput.trim()) return;
    
    if (isEditing && editingReport) {
      const newTags = [...(editingReport.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setEditingReport({...editingReport, tags: newTags});
    } else {
      const newTags = [...(newReport.tags || [])];
      if (!newTags.includes(tagInput.trim())) {
        newTags.push(tagInput.trim());
      }
      setNewReport({...newReport, tags: newTags});
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, isEditing: boolean) => {
    if (isEditing && editingReport) {
      const newTags = editingReport.tags.filter(t => t !== tag);
      setEditingReport({...editingReport, tags: newTags});
    } else {
      const newTags = (newReport.tags || []).filter(t => t !== tag);
      setNewReport({...newReport, tags: newTags});
    }
  };

  const handleAddRecipient = (isEditing: boolean) => {
    if (!recipientInput.trim()) return;
    
    if (isEditing && editingReport) {
      const newRecipients = [...(editingReport.recipients || [])];
      if (!newRecipients.includes(recipientInput.trim())) {
        newRecipients.push(recipientInput.trim());
      }
      setEditingReport({...editingReport, recipients: newRecipients});
    } else {
      const newRecipients = [...(newReport.recipients || [])];
      if (!newRecipients.includes(recipientInput.trim())) {
        newRecipients.push(recipientInput.trim());
      }
      setNewReport({...newReport, recipients: newRecipients});
    }
    
    setRecipientInput('');
  };

  const handleRemoveRecipient = (recipient: string, isEditing: boolean) => {
    if (isEditing && editingReport) {
      const newRecipients = editingReport.recipients.filter(r => r !== recipient);
      setEditingReport({...editingReport, recipients: newRecipients});
    } else {
      const newRecipients = (newReport.recipients || []).filter(r => r !== recipient);
      setNewReport({...newReport, recipients: newRecipients});
    }
  };

  const handleStatusChange = (status: string, isEditing: boolean) => {
    if (isEditing && editingReport) {
      setEditingReport({...editingReport, status: status as any});
    } else {
      setNewReport({...newReport, status: status as any});
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      case 'generated':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'approved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'distributed':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'archived':
        return 'bg-gray-500 text-white px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'project_status':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'financial_summary':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'resource_utilization':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs';
      case 'safety_incident':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'quality_audit':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      case 'custom':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const renderReportChart = (report: Report) => {
    if (!report.data) return <div className="text-center py-4 text-gray-500">No data visualization available.</div>;

    switch (report.type) {
      case 'project_status':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Percentage" unit="%" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'financial_summary':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'resource_utilization':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend />
              <Bar dataKey="utilized" fill="#ffc658" name="Utilized" unit="%" />
              {/* <Bar dataKey="total" fill="#ccc" name="Total" unit="%" /> */}
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return <div className="text-center py-4 text-gray-500">Data visualization not available for this report type.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reporting Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Generate New Report</Button>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>Manage project status, financial, resource, and other reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div>{report.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{report.description}</div>
                    {report.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={getTypeBadgeClass(report.type)}>
                      {report.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{report.projectName || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(report.status)}>
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{report.generatedDate}</TableCell>
                  <TableCell>
                    {report.periodStartDate && report.periodEndDate ? 
                     `${report.periodStartDate} to ${report.periodEndDate}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setViewingReport(report)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingReport(report)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Report Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Enter the details for the new report</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Report Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newReport.type} 
                  onChange={(e) => setNewReport({...newReport, type: e.target.value as any})}
                >
                  <option value="project_status">Project Status</option>
                  <option value="financial_summary">Financial Summary</option>
                  <option value="resource_utilization">Resource Utilization</option>
                  <option value="safety_incident">Safety Incident</option>
                  <option value="quality_audit">Quality Audit</option>
                  <option value="custom">Custom Report</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Report Title</FormLabel>
                <Input 
                  value={newReport.title} 
                  onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                  placeholder="Enter report title"
                />
              </FormField>
              
              <FormField>
                <FormLabel>Project (Optional)</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newReport.projectId} 
                  onChange={(e) => setNewReport({...newReport, projectId: e.target.value})}
                >
                  <option value="">Select a project (if applicable)</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={newReport.description} 
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                  placeholder="Enter report description"
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Period Start Date (Optional)</FormLabel>
                  <Input 
                    type="date"
                    value={newReport.periodStartDate} 
                    onChange={(e) => setNewReport({...newReport, periodStartDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Period End Date (Optional)</FormLabel>
                  <Input 
                    type="date"
                    value={newReport.periodEndDate} 
                    onChange={(e) => setNewReport({...newReport, periodEndDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Generated By</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newReport.generatedBy} 
                  onChange={(e) => setNewReport({...newReport, generatedBy: e.target.value})}
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Recipients</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={recipientInput} 
                    onChange={(e) => setRecipientInput(e.target.value)}
                  >
                    <option value="">Select recipient</option>
                    {recipientGroups.map(group => (
                      <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                    {teamMembers.map(member => (
                      <option key={`member-${member.id}`} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    onClick={() => handleAddRecipient(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newReport.recipients || []).map(recipient => (
                    <div key={recipient} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {recipient}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveRecipient(recipient, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Attachments</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={attachmentInput} 
                    onChange={(e) => setAttachmentInput(e.target.value)}
                    placeholder="Enter attachment filename"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddAttachment(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <FormDescription>
                  In a real implementation, this would allow file uploads
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newReport.attachments || []).map(attachment => (
                    <div key={attachment} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <span className="mr-1">📎</span> {attachment}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveAttachment(attachment, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Tags</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag (e.g., monthly, financial)"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddTag(false)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newReport.tags || []).map(tag => (
                    <div key={tag} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      #{tag}
                      <button 
                        type="button"
                        className="ml-1 text-gray-700 hover:text-gray-900"
                        onClick={() => handleRemoveTag(tag, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={handleCreateReport}>Generate Report</Button>
          </CardFooter>
        </Card>
      )}

      {/* Edit Report Form */}
      {editingReport && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Report</CardTitle>
            <CardDescription>Update the report details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form>
              <FormField>
                <FormLabel>Report Type</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingReport.type} 
                  onChange={(e) => setEditingReport({...editingReport, type: e.target.value as any})}
                >
                  <option value="project_status">Project Status</option>
                  <option value="financial_summary">Financial Summary</option>
                  <option value="resource_utilization">Resource Utilization</option>
                  <option value="safety_incident">Safety Incident</option>
                  <option value="quality_audit">Quality Audit</option>
                  <option value="custom">Custom Report</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel required>Report Title</FormLabel>
                <Input 
                  value={editingReport.title} 
                  onChange={(e) => setEditingReport({...editingReport, title: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Project (Optional)</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingReport.projectId} 
                  onChange={(e) => setEditingReport({...editingReport, projectId: e.target.value})}
                >
                  <option value="">Select a project (if applicable)</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Status</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingReport.status} 
                  onChange={(e) => handleStatusChange(e.target.value, true)}
                >
                  <option value="draft">Draft</option>
                  <option value="generated">Generated</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="distributed">Distributed</option>
                  <option value="archived">Archived</option>
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Description</FormLabel>
                <Input 
                  value={editingReport.description} 
                  onChange={(e) => setEditingReport({...editingReport, description: e.target.value})}
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField>
                  <FormLabel>Period Start Date (Optional)</FormLabel>
                  <Input 
                    type="date"
                    value={editingReport.periodStartDate} 
                    onChange={(e) => setEditingReport({...editingReport, periodStartDate: e.target.value})}
                  />
                </FormField>
                
                <FormField>
                  <FormLabel>Period End Date (Optional)</FormLabel>
                  <Input 
                    type="date"
                    value={editingReport.periodEndDate} 
                    onChange={(e) => setEditingReport({...editingReport, periodEndDate: e.target.value})}
                  />
                </FormField>
              </div>
              
              <FormField>
                <FormLabel>Generated By</FormLabel>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingReport.generatedBy} 
                  onChange={(e) => setEditingReport({...editingReport, generatedBy: e.target.value})}
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </FormField>
              
              <FormField>
                <FormLabel>Generated Date</FormLabel>
                <Input 
                  type="date"
                  value={editingReport.generatedDate} 
                  onChange={(e) => setEditingReport({...editingReport, generatedDate: e.target.value})}
                />
              </FormField>
              
              <FormField>
                <FormLabel>Recipients</FormLabel>
                <div className="flex space-x-2">
                  <select 
                    className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={recipientInput} 
                    onChange={(e) => setRecipientInput(e.target.value)}
                  >
                    <option value="">Select recipient</option>
                    {recipientGroups.map(group => (
                      <option key={group.id} value={group.name}>{group.name}</option>
                    ))}
                    {teamMembers.map(member => (
                      <option key={`member-${member.id}`} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  <Button 
                    type="button" 
                    onClick={() => handleAddRecipient(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingReport.recipients.map(recipient => (
                    <div key={recipient} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {recipient}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveRecipient(recipient, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Attachments</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={attachmentInput} 
                    onChange={(e) => setAttachmentInput(e.target.value)}
                    placeholder="Enter attachment filename"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddAttachment(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <FormDescription>
                  In a real implementation, this would allow file uploads
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingReport.attachments.map(attachment => (
                    <div key={attachment} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <span className="mr-1">📎</span> {attachment}
                      <button 
                        type="button"
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        onClick={() => handleRemoveAttachment(attachment, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
              
              <FormField>
                <FormLabel>Tags</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag (e.g., monthly, financial)"
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleAddTag(true)}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingReport.tags.map(tag => (
                    <div key={tag} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      #{tag}
                      <button 
                        type="button"
                        className="ml-1 text-gray-700 hover:text-gray-900"
                        onClick={() => handleRemoveTag(tag, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormField>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditingReport(null)}>Cancel</Button>
            <Button onClick={handleUpdateReport}>Update Report</Button>
          </CardFooter>
        </Card>
      )}

      {/* View Report Modal/Dialog */}
      {viewingReport && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-3xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{viewingReport.title}</CardTitle>
                  <CardDescription>
                    Type: <span className={getTypeBadgeClass(viewingReport.type)}>{viewingReport.type.replace('_', ' ').toUpperCase()}</span> | 
                    Status: <span className={getStatusBadgeClass(viewingReport.status)}>{viewingReport.status.replace('_', ' ').toUpperCase()}</span> | 
                    Project: {viewingReport.projectName || 'N/A'}
                  </CardDescription>
                  <CardDescription>
                    Generated by {viewingReport.generatedBy} on {viewingReport.generatedDate}
                    {viewingReport.periodStartDate && viewingReport.periodEndDate && 
                     ` | Period: ${viewingReport.periodStartDate} to ${viewingReport.periodEndDate}`}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewingReport(null)}>X</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p>{viewingReport.description}</p>
                </div>
                
                {/* Report Data Visualization */}
                <div>
                  <h4 className="font-medium mb-2">Data Visualization</h4>
                  {renderReportChart(viewingReport)}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Recipients</h4>
                  <p>{viewingReport.recipients.join(', ')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Attachments</h4>
                  {viewingReport.attachments.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {viewingReport.attachments.map(att => <li key={att}>📎 {att}</li>)}
                    </ul>
                  ) : (
                    <p>No attachments.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Tags</h4>
                  {viewingReport.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewingReport.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p>No tags.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setViewingReport(null)}>Close</Button>
            </CardFooter>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default ReportingModule;
