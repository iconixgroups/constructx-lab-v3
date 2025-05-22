import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface AIAssistantProps {
  projectId: string;
  projectName: string;
  isLoading?: boolean;
  onGenerateReport?: () => void;
  onAnalyzeData?: () => void;
  onOptimizeSchedule?: () => void;
  onPredictIssues?: () => void;
  onGenerateRecommendations?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  projectId,
  projectName,
  isLoading = false,
  onGenerateReport,
  onAnalyzeData,
  onOptimizeSchedule,
  onPredictIssues,
  onGenerateRecommendations
}) => {
  const [activeTab, setActiveTab] = useState<string>('insights');
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock data for demonstration
  const insights = [
    {
      id: '1',
      title: 'Schedule Risk Analysis',
      description: 'Based on current progress and historical data, there is a 72% chance of completing the project on time. Critical path tasks in the framing phase are at risk.',
      date: new Date(),
      category: 'schedule',
      severity: 'medium',
      recommendations: [
        'Allocate additional resources to framing tasks',
        'Consider parallel execution of non-dependent tasks',
        'Review and optimize the inspection scheduling process'
      ]
    },
    {
      id: '2',
      title: 'Budget Variance Detected',
      description: 'Material costs are trending 15% above estimates. Primary factors include price increases in lumber and concrete.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      category: 'budget',
      severity: 'high',
      recommendations: [
        'Evaluate alternative material suppliers',
        'Consider bulk purchasing to lock in current prices',
        'Review material usage efficiency on site'
      ]
    },
    {
      id: '3',
      title: 'Resource Optimization Opportunity',
      description: 'Equipment utilization analysis shows excavators are idle 40% of scheduled time. Optimization could reduce equipment costs.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      category: 'resources',
      severity: 'low',
      recommendations: [
        'Adjust equipment scheduling to maximize utilization',
        'Consider reducing rental duration or equipment count',
        'Implement better coordination between site teams'
      ]
    }
  ];
  
  const chatHistory = [
    {
      id: '1',
      role: 'user',
      content: 'What are the main risks in our current schedule?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Based on my analysis of your project schedule, I've identified three main risk areas:\n\n1. The framing phase is currently on the critical path with only 2 days of float. Any delays here will directly impact your completion date.\n\n2. There's a potential resource conflict in week 8 when both electrical and plumbing rough-ins are scheduled with overlapping crew requirements.\n\n3. The current inspection schedule doesn't account for typical wait times from the local building department, which historically average 3-5 business days rather than the 2 days in your plan.\n\nWould you like me to suggest specific mitigation strategies for any of these risks?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 20 * 1000) // 20 seconds after user message
    },
    {
      id: '3',
      role: 'user',
      content: 'Yes, please suggest mitigation strategies for the framing phase risks.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '4',
      role: 'assistant',
      content: 'Here are recommended mitigation strategies for the framing phase risks:\n\n1. **Add Resources**: Consider temporarily increasing your framing crew by 2-3 workers. Based on your current productivity rates, this could reduce the framing timeline by up to 30%.\n\n2. **Pre-fabrication**: Identify components that could be pre-fabricated off-site while foundation work is being completed. Wall sections and roof trusses are good candidates.\n\n3. **Schedule Optimization**: The current schedule has framing crews starting at 8am, but weather data shows mornings have had rain delays 40% of the time this season. Consider shifting to 10am starts with extended hours to reduce weather impacts.\n\n4. **Early Material Staging**: Your materials are currently scheduled to arrive the day framing begins. Stage materials 2-3 days earlier to prevent any supply chain delays from affecting your start date.\n\n5. **Contingency Planning**: Develop a specific recovery plan that could include weekend work or additional temporary labor if delays exceed 1 day.\n\nWould you like me to update your project schedule with these mitigation strategies for your review?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45 * 1000) // 45 seconds after user message
    }
  ];
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'schedule':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
        );
      case 'budget':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
            <path d="M12 18V6"></path>
          </svg>
        );
      case 'resources':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!promptInput.trim()) return;
    
    setIsProcessing(true);
    
    // In a real implementation, this would call the AI API
    setTimeout(() => {
      setPromptInput('');
      setIsProcessing(false);
    }, 2000);
  };
  
  // Render AI insights
  const renderInsights = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">AI-Generated Insights</h3>
          <div className="flex space-x-2">
            {onAnalyzeData && (
              <Button variant="outline" size="sm" onClick={onAnalyzeData}>
                Analyze Data
              </Button>
            )}
            {onGenerateRecommendations && (
              <Button onClick={onGenerateRecommendations}>
                Generate Recommendations
              </Button>
            )}
          </div>
        </div>
        
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map(insight => (
              <Card key={insight.id} className="overflow-hidden">
                <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-800">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-full bg-background">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge className={getSeverityColor(insight.severity)}>
                      {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)} Priority
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Generated {formatDate(insight.date)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-4">{insight.description}</p>
                  
                  {insight.recommendations && insight.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      Save to Report
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                    <Button size="sm">
                      Take Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-muted-foreground">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p className="text-muted-foreground">No insights available</p>
            {onAnalyzeData && (
              <Button onClick={onAnalyzeData}>
                Generate Insights
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Render AI actions
  const renderActions = () => {
    const actions = [
      {
        id: 'report',
        title: 'Generate Project Report',
        description: 'Create a comprehensive report with project status, risks, and recommendations.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
            <path d="M10 9H8"></path>
          </svg>
        ),
        action: onGenerateReport
      },
      {
        id: 'schedule',
        title: 'Optimize Schedule',
        description: 'Analyze and optimize project schedule to improve efficiency and reduce risks.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
            <path d="m9 16 2 2 4-4"></path>
          </svg>
        ),
        action: onOptimizeSchedule
      },
      {
        id: 'predict',
        title: 'Predict Potential Issues',
        description: 'Use historical data and current trends to predict and prevent potential issues.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <path d="M2 12h10"></path>
            <path d="M9 4v16"></path>
            <path d="M14 9h3"></path>
            <path d="M17 6v6"></path>
            <path d="M22 12h-3"></path>
            <path d="M19 15v3"></path>
          </svg>
        ),
        action: onPredictIssues
      },
      {
        id: 'analyze',
        title: 'Analyze Project Data',
        description: 'Perform deep analysis of project data to uncover insights and opportunities.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
          </svg>
        ),
        action: onAnalyzeData
      }
    ];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">AI Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map(action => (
            <Card 
              key={action.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={action.action}
            >
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Render AI chat
  const renderChat = () => {
    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex-1 overflow-auto p-4 space-y-4 border rounded-t-md bg-slate-50 dark:bg-slate-900">
          {chatHistory.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div 
                  className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {formatDate(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-background border">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-x border-b rounded-b-md bg-background">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything about your project..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isProcessing || !promptInput.trim()}>
              {isProcessing ? (
                <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              )}
              <span className="ml-2">Send</span>
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            AI Assistant can answer questions, analyze data, and provide recommendations based on your project information.
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
                <circle cx="12" cy="10" r="1"></circle>
              </svg>
            </div>
            <CardTitle className="text-xl font-bold">{projectName} AI Assistant</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights">
              {renderInsights()}
            </TabsContent>
            
            <TabsContent value="actions">
              {renderActions()}
            </TabsContent>
            
            <TabsContent value="chat">
              {renderChat()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
