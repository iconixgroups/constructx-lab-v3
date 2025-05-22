import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface AISmartSuggestionProps {
  moduleContext: string;
  projectId: string;
  suggestions?: {
    id: string;
    type: 'optimization' | 'warning' | 'insight' | 'recommendation';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionText?: string;
  }[];
  position?: 'top' | 'bottom' | 'inline';
  onAction?: (suggestionId: string) => void;
  onDismiss?: (suggestionId: string) => void;
  onViewAll?: () => void;
}

export const AISmartSuggestion: React.FC<AISmartSuggestionProps> = ({
  moduleContext,
  projectId,
  suggestions = [],
  position = 'top',
  onAction,
  onDismiss,
  onViewAll
}) => {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  
  // Filter out dismissed suggestions
  const activeSuggestions = suggestions.filter(
    suggestion => !dismissedSuggestions.includes(suggestion.id)
  );
  
  // If no active suggestions, don't render anything
  if (activeSuggestions.length === 0) {
    return null;
  }
  
  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m19 9-7 7-7-7"></path>
            <path d="M5 15h14"></path>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'insight':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'recommendation':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };
  
  // Handle dismiss
  const handleDismiss = (suggestionId: string) => {
    setDismissedSuggestions([...dismissedSuggestions, suggestionId]);
    if (onDismiss) onDismiss(suggestionId);
  };
  
  // Position classes
  const positionClasses = {
    'top': 'mb-4',
    'bottom': 'mt-4',
    'inline': 'my-4'
  };
  
  return (
    <div className={`w-full ${positionClasses[position]}`}>
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-full bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
                  <circle cx="12" cy="10" r="1"></circle>
                </svg>
              </div>
              <span className="font-medium">AI Suggestions</span>
            </div>
            {activeSuggestions.length > 1 && onViewAll && (
              <Button variant="ghost" size="sm" onClick={onViewAll}>
                View All ({activeSuggestions.length})
              </Button>
            )}
          </div>
          
          <div className="mt-3 space-y-3">
            {activeSuggestions.slice(0, 1).map(suggestion => (
              <div key={suggestion.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      {getTypeIcon(suggestion.type)}
                    </div>
                    <span className="font-medium">{suggestion.title}</span>
                    <Badge className={getImpactColor(suggestion.impact)}>
                      {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDismiss(suggestion.id)}
                  >
                    Dismiss
                  </Button>
                  {suggestion.actionText && onAction && (
                    <Button 
                      size="sm" 
                      onClick={() => onAction(suggestion.id)}
                    >
                      {suggestion.actionText}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISmartSuggestion;
