import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Camera, MapPin, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Site360PageProps {
  projectId?: string;
}

const Site360Page: React.FC<Site360PageProps> = ({ projectId }) => {
  const isLoading = false; // Placeholder for loading state

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">Site 360 Management</h1>
          <p className="text-muted-foreground">
            {projectId ? `Visual insights for project ${projectId}` : 'Capture, organize, and visualize site progress'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Photo Viewer</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Browse and manage site photos.</CardDescription>
            <div className="mt-4 text-center text-muted-foreground">
              <ImageIcon className="mx-auto h-12 w-12 mb-4" />
              <p>Photo viewer coming soon!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location Mapping</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Visualize site data on maps.</CardDescription>
            <div className="mt-4 text-center text-muted-foreground">
              <MapPin className="mx-auto h-12 w-12 mb-4" />
              <p>Location mapping coming soon!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capture Tools</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>Integrate with site capture devices.</CardDescription>
            <div className="mt-4 text-center text-muted-foreground">
              <Camera className="mx-auto h-12 w-12 mb-4" />
              <p>Capture tools integration coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-[300px] flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-12 w-12 mb-4" />
          <p>Site 360 Management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Site360Page;


