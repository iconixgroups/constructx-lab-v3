import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import {
  Archive,
  Search,
  Loader2,
  Download,
  History,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import projectArchiveService from '../services/projectArchiveService';

interface ProjectArchivesPageProps {
  // No specific props needed for a global archives page
}

const ProjectArchivesPage: React.FC<ProjectArchivesPageProps> = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [archivedProjects, setArchivedProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadArchivedProjects();
  }, []);

  const loadArchivedProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectArchiveService.getArchivedProjects();
      setArchivedProjects(data);
    } catch (error) {
      console.error('Error loading archived projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load archived projects. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRestoreProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      await projectArchiveService.restoreProject(projectId);
      toast({
        title: 'Success',
        description: 'Project restored successfully.',
      });
      loadArchivedProjects();
    } catch (error) {
      console.error('Error restoring project:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = archivedProjects.filter((project) => {
    return (
      !searchTerm ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading && archivedProjects.length === 0) {
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
          <h1 className="text-3xl font-bold">Project Archives</h1>
          <p className="text-muted-foreground">
            Manage and restore your archived projects.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export Archive List
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Archived Projects</CardTitle>
          <CardDescription>Browse and search through your historical project data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search archived projects..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Archived: {new Date(project.archivedAt).toLocaleDateString()}
                    </div>
                    <Button size="sm" onClick={() => handleRestoreProject(project.id)}>
                      <History className="h-4 w-4 mr-2" /> Restore
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <Archive className="mx-auto h-12 w-12 mb-4" />
              <p>No archived projects found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectArchivesPage;


