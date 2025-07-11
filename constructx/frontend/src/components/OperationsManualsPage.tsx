import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  BookOpen,
  Search,
  Loader2,
  Plus,
  Download,
  Folder,
  FileText,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import operationsManualsService from '../services/operationsManualsService';

interface OperationsManualsPageProps {
  projectId?: string; // Optional - if provided, filters data for specific project
}

const OperationsManualsPage: React.FC<OperationsManualsPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [manuals, setManuals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [manualsResponse, categoriesResponse] = await Promise.all([
        operationsManualsService.getManuals(projectId),
        operationsManualsService.getManualCategories(),
      ]);
      setManuals(manualsResponse);
      setCategories(categoriesResponse.map((c: string) => ({ value: c, label: c })));
    } catch (error) {
      console.error('Error loading operations manuals data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load operations manuals data. Please try again.',
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

  const handleUploadManual = async () => {
    toast({
      title: 'Info',
      description: 'Upload manual functionality coming soon!',
    });
  };

  const handleCreateCategory = async () => {
    toast({
      title: 'Info',
      description: 'Create category functionality coming soon!',
    });
  };

  const filteredManuals = manuals.filter((manual) => {
    const matchesSearch =
      !searchTerm ||
      manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filterCategory || manual.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading && manuals.length === 0) {
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
          <h1 className="text-3xl font-bold">Operations & Manuals</h1>
          <p className="text-muted-foreground">
            {projectId ? `Manage manuals for project ${projectId}` : 'Centralized repository for all operations manuals and guides'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCreateCategory}>
            <Folder className="h-4 w-4 mr-2" />
            Create Category
          </Button>
          <Button onClick={handleUploadManual}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Manual
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manuals & Guides</CardTitle>
          <CardDescription>Browse and search through your operations manuals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search manuals..."
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
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredManuals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredManuals.map((manual) => (
                <Card key={manual.id}>
                  <CardHeader>
                    <CardTitle>{manual.title}</CardTitle>
                    <CardDescription>{manual.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Category: {manual.category}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      toast({
                        title: 'Info',
                        description: `Viewing manual: ${manual.title} coming soon!`,
                      });
                    }}>
                      <BookOpen className="h-4 w-4 mr-2" /> View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p>No operations manuals found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationsManualsPage;


