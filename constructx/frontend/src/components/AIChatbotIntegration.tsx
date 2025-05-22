import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface AIChatbotIntegrationProps {
  moduleContext: string;
  projectId?: string;
  position?: 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  onOpenFullChat?: () => void;
}

export const AIChatbotIntegration: React.FC<AIChatbotIntegrationProps> = ({
  moduleContext,
  projectId,
  position = 'bottom-right',
  size = 'md',
  onOpenFullChat
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      button: 'h-10 w-10',
      icon: 'h-5 w-5',
      popover: 'w-64'
    },
    md: {
      button: 'h-12 w-12',
      icon: 'h-6 w-6',
      popover: 'w-80'
    },
    lg: {
      button: 'h-14 w-14',
      icon: 'h-7 w-7',
      popover: 'w-96'
    }
  };
  
  // Set context-specific quick prompts
  useEffect(() => {
    // This would be replaced with actual context-aware prompts in production
    const contextualPrompts = {
      'dashboard': [
        'How do I customize my dashboard?',
        'What do these metrics mean?',
        'How can I share this dashboard?'
      ],
      'tasks': [
        'How do I assign a task?',
        'How do I set task dependencies?',
        'How can I track task progress?'
      ],
      'schedule': [
        'How do I create a milestone?',
        'How do I adjust the project timeline?',
        'How can I identify schedule risks?'
      ],
      'budget': [
        'How do I add a new expense?',
        'How do I create a budget forecast?',
        'How can I track budget variances?'
      ],
      'documents': [
        'How do I upload a document?',
        'How do I set up document approval workflow?',
        'How can I organize documents by category?'
      ],
      'resources': [
        'How do I allocate resources to tasks?',
        'How do I track equipment usage?',
        'How can I optimize resource utilization?'
      ],
      'field-operations': [
        'How do I create a field report?',
        'How do I schedule an inspection?',
        'How can I report an issue from the field?'
      ]
    };
    
    // Set default prompts if context not found
    const defaultPrompts = [
      'How do I use this feature?',
      'What are the best practices?',
      'Show me a tutorial'
    ];
    
    setQuickPrompts(moduleContext in contextualPrompts 
      ? contextualPrompts[moduleContext] 
      : defaultPrompts);
      
  }, [moduleContext]);
  
  // Handle send message
  const handleSendMessage = () => {
    if (!promptInput.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { role: 'user', content: promptInput }]);
    
    setIsProcessing(true);
    
    // In a real implementation, this would call the AI API
    setTimeout(() => {
      // Simulate AI response based on context
      let aiResponse = `I'll help you with your question about ${moduleContext}. `;
      
      if (promptInput.toLowerCase().includes('how')) {
        aiResponse += `To learn more about this feature, you can check our documentation or I can walk you through it step by step. Would you like me to show you how?`;
      } else if (promptInput.toLowerCase().includes('error') || promptInput.toLowerCase().includes('problem')) {
        aiResponse += `I'm sorry you're experiencing an issue. Let's troubleshoot this together. Could you provide more details about what's happening?`;
      } else {
        aiResponse += `I understand you're interested in ${moduleContext}. This module helps you manage your project's ${moduleContext} effectively. Is there something specific you'd like to know?`;
      }
      
      // Add AI response to chat
      setChatHistory([...chatHistory, 
        { role: 'user', content: promptInput },
        { role: 'assistant', content: aiResponse }
      ]);
      
      setPromptInput('');
      setIsProcessing(false);
    }, 1500);
  };
  
  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: string) => {
    setPromptInput(prompt);
    handleSendMessage();
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className={`rounded-full shadow-md ${sizeClasses[size].button}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizeClasses[size].icon}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M12 11v.01"></path>
              <path d="M8 11v.01"></path>
              <path d="M16 11v.01"></path>
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`${sizeClasses[size].popover} p-0`} align="end">
          <Card className="border-0">
            <CardContent className="p-0">
              <div className="flex flex-col h-[350px]">
                <div className="bg-primary p-3 text-primary-foreground rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        <path d="M12 11v.01"></path>
                        <path d="M8 11v.01"></path>
                        <path d="M16 11v.01"></path>
                      </svg>
                      <span className="font-medium">CX Assistant</span>
                    </div>
                    {onOpenFullChat && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-primary-foreground hover:text-primary-foreground hover:bg-primary/90"
                        onClick={onOpenFullChat}
                      >
                        Expand
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto p-3 space-y-3 bg-slate-50 dark:bg-slate-900">
                  {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-2 text-muted-foreground">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        <path d="M12 11v.01"></path>
                        <path d="M8 11v.01"></path>
                        <path d="M16 11v.01"></path>
                      </svg>
                      <p className="text-sm text-muted-foreground mb-2">
                        Hi! I'm your CX Assistant. How can I help you with {moduleContext}?
                      </p>
                      <div className="space-y-2 w-full">
                        {quickPrompts.map((prompt, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => handleQuickPrompt(prompt)}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {chatHistory.map((message, index) => (
                        <div 
                          key={index} 
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[85%] rounded-lg p-2 ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background border'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-lg p-2 bg-background border">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isProcessing}
                      className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button 
                      size="sm" 
                      className="h-8"
                      onClick={handleSendMessage} 
                      disabled={isProcessing || !promptInput.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                        <path d="M22 2 11 13"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AIChatbotIntegration;
