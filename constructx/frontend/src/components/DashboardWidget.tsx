import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Heading } from './ui/heading';
import { Text } from './ui/text';

interface DashboardWidgetProps {
  title: string;
  type: string;
  size?: { width: number; height: number };
  isLoading?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  refreshInterval?: number;
  lastUpdated?: Date;
  children?: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  type,
  size = { width: 1, height: 1 },
  isLoading = false,
  onEdit,
  onRemove,
  refreshInterval,
  lastUpdated,
  children
}) => {
  // Calculate widget size classes based on width and height
  const getWidthClass = () => {
    switch (size.width) {
      case 1: return 'col-span-1';
      case 2: return 'col-span-2';
      case 3: return 'col-span-3';
      case 4: return 'col-span-4';
      default: return 'col-span-1';
    }
  };

  const getHeightClass = () => {
    switch (size.height) {
      case 1: return 'h-[200px]';
      case 2: return 'h-[400px]';
      case 3: return 'h-[600px]';
      case 4: return 'h-[800px]';
      default: return 'h-[200px]';
    }
  };

  const widthClass = getWidthClass();
  const heightClass = getHeightClass();

  return (
    <Card className={`${widthClass} ${heightClass} flex flex-col`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex space-x-1">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
              </Button>
            )}
            {onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0">
                <span className="sr-only">Remove</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto pb-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          children
        )}
      </CardContent>
      {refreshInterval && (
        <CardFooter className="pt-0">
          <div className="flex w-full justify-between items-center text-xs text-muted-foreground">
            <span>Auto-refresh: {refreshInterval}s</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <span className="sr-only">Refresh</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardWidget;
