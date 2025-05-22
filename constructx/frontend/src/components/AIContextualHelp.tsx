import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface AIContextualHelpProps {
  moduleContext: string;
  elementContext?: string;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  onHelp?: () => void;
  onSuggest?: () => void;
}

export const AIContextualHelp: React.FC<AIContextualHelpProps> = ({
  moduleContext,
  elementContext,
  position = 'bottom-right',
  size = 'md',
  onHelp,
  onSuggest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSuggestion, setHasSuggestion] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4'
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      button: 'h-8 w-8',
      icon: 'h-4 w-4',
      card: 'w-64'
    },
    md: {
      button: 'h-10 w-10',
      icon: 'h-5 w-5',
      card: 'w-72'
    },
    lg: {
      button: 'h-12 w-12',
      icon: 'h-6 w-6',
      card: 'w-80'
    }
  };
  
  // Simulate AI suggestion based on context
  useEffect(() => {
    // This would be replaced with actual AI API calls in production
    const contextualSuggestions = {
      'dashboard': 'Try customizing your dashboard widgets for better visibility of key metrics.',
      'tasks': 'You have 3 tasks approaching their deadlines. Would you like to prioritize them?',
      'schedule': 'There's a potential scheduling conflict next week. Would you like me to suggest alternatives?',
      'budget': 'Your material costs are 15% over budget. I can help identify cost-saving opportunities.',
      'documents': 'These documents need approval. Would you like me to notify the responsible team members?',
      'resources': 'Resource utilization is below optimal levels. Would you like suggestions to improve efficiency?',
      'field-operations': 'Weather forecast shows rain next week. Would you like to adjust the field work schedule?'
    };
    
    // Check if we have a suggestion for this context
    if (moduleContext in contextualSuggestions) {
      setHasSuggestion(true);
      setSuggestionText(contextualSuggestions[moduleContext]);
    } else {
      setHasSuggestion(false);
      setSuggestionText('');
    }
  }, [moduleContext, elementContext]);
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {isOpen && (
        <Card className={`${sizeClasses[size].card} mb-2 shadow-lg`}>
          <CardContent className="p-3">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizeClasses[size].icon}>
                    <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
                    <circle cx="12" cy="10" r="1"></circle>
                  </svg>
                </div>
                <span className="font-medium">AI Assistant</span>
              </div>
              
              {hasSuggestion ? (
                <div>
                  <p className="text-sm">{suggestionText}</p>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsOpen(false);
                        if (onHelp) onHelp();
                      }}
                    >
                      Ask for Help
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setIsOpen(false);
                        if (onSuggest) onSuggest();
                      }}
                    >
                      Show Me
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm">How can I help you with this {moduleContext}?</p>
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setIsOpen(false);
                        if (onHelp) onHelp();
                      }}
                    >
                      Ask for Help
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        variant={hasSuggestion ? "default" : "outline"}
        size="icon"
        className={`rounded-full shadow-md ${sizeClasses[size].button} ${hasSuggestion ? 'animate-pulse' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizeClasses[size].icon}>
          <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
          <circle cx="12" cy="10" r="1"></circle>
        </svg>
      </Button>
    </div>
  );
};

export default AIContextualHelp;
