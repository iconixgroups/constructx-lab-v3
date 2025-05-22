import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface DocumentCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  version: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  uploadedAt: Date;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'not_required';
  tags?: string[];
  thumbnailUrl?: string;
  onView: () => void;
  onDownload: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onVersionHistory?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  description,
  category,
  version,
  fileName,
  fileType,
  fileSize,
  uploadedBy,
  uploadedAt,
  approvalStatus,
  tags = [],
  thumbnailUrl,
  onView,
  onDownload,
  onEdit,
  onDelete,
  onVersionHistory
}) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (): JSX.Element => {
    if (fileType.includes('image')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <circle cx="9" cy="9" r="2"></circle>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
        </svg>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      );
    } else if (fileType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M8 13h8"></path>
          <path d="M8 17h8"></path>
          <path d="M8 9h1"></path>
        </svg>
      );
    } else if (fileType.includes('excel') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="m8 13 2 2 6-6"></path>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      );
    }
  };

  // Get approval status badge
  const getApprovalStatusBadge = () => {
    if (!approvalStatus || approvalStatus === 'not_required') return null;
    
    let badgeClass = '';
    let badgeText = '';
    
    switch (approvalStatus) {
      case 'pending':
        badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
        badgeText = 'Pending Approval';
        break;
      case 'approved':
        badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        badgeText = 'Approved';
        break;
      case 'rejected':
        badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        badgeText = 'Rejected';
        break;
    }
    
    return (
      <Badge className={badgeClass}>
        {badgeText}
      </Badge>
    );
  };

  // Format category
  const formatCategory = (cat: string): string => {
    return cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              Version {version} • {formatFileSize(fileSize)}
            </CardDescription>
          </div>
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
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0">
                <span className="sr-only">Delete</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">
            {formatCategory(category)}
          </Badge>
          {getApprovalStatusBadge()}
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0">
            {thumbnailUrl ? (
              <div className="w-12 h-12 rounded border overflow-hidden">
                <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded border flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                {getFileIcon()}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <Text className="text-sm font-medium mb-1 truncate">{fileName}</Text>
            {description && (
              <Text className="text-xs text-muted-foreground line-clamp-2">{description}</Text>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Uploaded {uploadedAt.toLocaleDateString()} at {uploadedAt.toLocaleTimeString()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={uploadedBy.avatarUrl} alt={uploadedBy.name} />
            <AvatarFallback>{uploadedBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{uploadedBy.name}</span>
        </div>
        
        <div className="flex space-x-2">
          {onVersionHistory && (
            <Button variant="ghost" size="sm" onClick={onVersionHistory} className="h-7 text-xs">
              History
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onView} className="h-7 text-xs">
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload} className="h-7 text-xs">
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
