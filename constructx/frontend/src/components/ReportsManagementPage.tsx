import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  BarChart,
  Search,
  Loader2,
  Download,
  Plus,
  Settings,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import reportsService from '../services/reportsService';

interface ReportsManagementPageProps {
  projectId?: string; // Optional - if provided, filters data for specific project
}

const ReportsManagementPage: React.FC<ReportsManagementPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [reportTemplates, setReportTemplates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reportsResponse, templatesResponse] = await Promise.all([
        reportsService.getReports(projectId),
        reportsService.getReportTemplates(),
      ]);
      setReports(reportsResponse);
      setReportTemplates(templatesResponse);
    } catch (error) {
      console.error('Error loading reports data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: string) => {
    setFilterCategory(value);
  };

  const handleGenerateReport = async () => {
    toast({
      title: 'Info',
      description: 'Generate Report functionality coming soon!',
    });
  };

  const handleCustomizeReport = async () => {
    toast({
      title: 'Info',
      description: 'Customize Report functionality coming soon!',
    });
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      !searchTerm ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filterCategory || report.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading && reports.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports Management</h1>
          <p className="text-muted-foreground">
            {projectId ? `Reports for project ${projectId}` : 'Generate and manage project reports'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCustomizeReport}>
            <Settings className="h-4 w-4 mr-2" />
            Customize Report
          </Button>
          <Button onClick={handleGenerateReport}>
            <Plus className="h-4 w-4 mr-2" />
            Generate New Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Browse and generate various project reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.category}>
                      {template.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Generated: {new Date(report.generatedAt).toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      toast({
                        title: 'Info',
                        description: `Downloading report: ${report.title} coming soon!`,
                      });
                    }}>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <BarChart className="mx-auto h-12 w-12 mb-4" />
              <p>No reports generated yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagementPage;


