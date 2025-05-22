import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';

interface CXChatbotProps {
  projectId?: string;
  projectName?: string;
  isLoading?: boolean;
  onSendFeedback?: (feedback: string) => void;
}

export const CXChatbot: React.FC<CXChatbotProps> = ({
  projectId,
  projectName,
  isLoading = false,
  onSendFeedback
}) => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [promptInput, setPromptInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock data for demonstration
  const chatHistory = [
    {
      id: '1',
      role: 'system',
      content: 'Welcome to ConstructX! I'm your CX Assistant, here to help you learn how to use the platform effectively. What would you like to know about?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    },
    {
      id: '2',
      role: 'user',
      content: 'How do I create a new project?',
      timestamp: new Date(Date.now() - 9 * 60 * 1000) // 9 minutes ago
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Creating a new project in ConstructX is easy! Here's how:\n\n1. From your dashboard, click the "+ New Project" button in the top right corner\n2. Fill in the project details including name, location, and start date\n3. Select the appropriate project template (or start from scratch)\n4. Add team members and assign roles\n5. Set up your initial budget parameters\n6. Click "Create Project"\n\nWould you like me to walk you through any specific part of this process?',
      timestamp: new Date(Date.now() - 9 * 60 * 1000 + 20 * 1000) // 20 seconds after user message
    },
    {
      id: '4',
      role: 'user',
      content: 'How do I add team members to my project?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: '5',
      role: 'assistant',
      content: 'Adding team members to your project can be done in a few ways:\n\n**During Project Creation:**\nWhen creating a new project, you'll reach a "Team Members" step where you can add people directly.\n\n**From an Existing Project:**\n1. Navigate to your project dashboard\n2. Click on the "Team" tab in the left sidebar\n3. Click the "+ Add Member" button\n4. Enter their email address\n5. Assign their role (Admin, Manager, Member, or Viewer)\n6. Set their permissions for specific modules\n7. Click "Send Invitation"\n\n**Bulk Import:**\nFor adding multiple team members at once:\n1. Go to the "Team" tab\n2. Click "Import Members"\n3. Download the template CSV file\n4. Fill in the required information\n5. Upload the completed CSV\n\nTeam members will receive an email invitation to join the project. You can also manage existing team members' roles and permissions from the Team tab.\n\nIs there anything specific about team management you'd like to know more about?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000 + 30 * 1000) // 30 seconds after user message
    }
  ];
  
  const helpTopics = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of ConstructX and how to set up your first project',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M2 3h20"></path>
          <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
          <path d="m7 21 5-5 5 5"></path>
        </svg>
      )
    },
    {
      id: 'project-management',
      title: 'Project Management',
      description: 'Manage tasks, schedules, and track progress effectively',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
          <line x1="16" x2="16" y1="2" y2="6"></line>
          <line x1="8" x2="8" y1="2" y2="6"></line>
          <line x1="3" x2="21" y1="10" y2="10"></line>
          <path d="m9 16 2 2 4-4"></path>
        </svg>
      )
    },
    {
      id: 'financial-tools',
      title: 'Financial Tools',
      description: 'Learn about budgeting, expense tracking, and financial reporting',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
          <path d="M12 18V6"></path>
        </svg>
      )
    },
    {
      id: 'field-operations',
      title: 'Field Operations',
      description: 'Manage on-site activities, reports, and inspections',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      )
    },
    {
      id: 'ai-features',
      title: 'AI Features',
      description: 'Leverage AI for insights, predictions, and automation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
          <circle cx="12" cy="10" r="1"></circle>
        </svg>
      )
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Work effectively with team members and stakeholders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];
  
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
  
  // Handle send feedback
  const handleSendFeedback = () => {
    if (!feedbackInput.trim()) return;
    
    if (onSendFeedback) {
      onSendFeedback(feedbackInput);
    }
    
    setFeedbackInput('');
  };
  
  // Render chat interface
  const renderChat = () => {
    return (
      <div className="flex flex-col h-[600px]">
        <div className="flex-1 overflow-auto p-4 space-y-4 border rounded-t-md bg-slate-50 dark:bg-slate-900">
          {chatHistory.map(message => (
            <div 
              key={message.id} 
              className={`flex ${
                message.role === 'user' 
                  ? 'justify-end' 
                  : message.role === 'system' 
                    ? 'justify-center' 
                    : 'justify-start'
              }`}
            >
              {message.role === 'system' ? (
                <div className="bg-slate-200 dark:bg-slate-800 rounded-lg p-3 max-w-[90%] text-center">
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs mt-1 text-muted-foreground">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-background border">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                  <span className="text-sm text-muted-foreground">CX Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-x border-b rounded-b-md bg-background">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me how to use any feature..."
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
            CX Assistant can help you learn how to use ConstructX and answer questions about any feature.
          </div>
        </div>
      </div>
    );
  };
  
  // Render help topics
  const renderHelpTopics = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Help Topics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helpTopics.map(topic => (
            <Card 
              key={topic.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={() => setPromptInput(`Tell me about ${topic.title.toLowerCase()}`)}
            >
              <CardContent className="p-4 flex items-start space-x-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {topic.icon}
                </div>
                <div>
                  <h4 className="font-medium mb-1">{topic.title}</h4>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Popular Questions</h3>
          <div className="space-y-2">
            {[
              "How do I create a new project?",
              "How can I invite team members?",
              "How do I generate reports?",
              "How do I track project expenses?",
              "How do I use the AI features?"
            ].map((question, index) => (
              <div 
                key={index}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => setPromptInput(question)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  <span>{question}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render feedback form
  const renderFeedback = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Send Feedback</h3>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h4 className="font-medium mb-2">How can we improve ConstructX?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Your feedback helps us make ConstructX better for everyone. Let us know what you think!
              </p>
              
              <Textarea
                placeholder="Share your thoughts, suggestions, or report any issues you've encountered..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSendFeedback} 
                disabled={!feedbackInput.trim()}
              >
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Other Ways to Get Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team directly at support@constructx.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Live Chat</h4>
                    <p className="text-sm text-muted-foreground">
                      Chat with our support team during business hours (9am-5pm EST)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Browse our comprehensive documentation and tutorials
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Community Forum</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with other users and share knowledge
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M12 11v.01"></path>
                <path d="M8 11v.01"></path>
                <path d="M16 11v.01"></path>
              </svg>
            </div>
            <CardTitle className="text-xl font-bold">CX Assistant</CardTitle>
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
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="help">Help Topics</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat">
              {renderChat()}
            </TabsContent>
            
            <TabsContent value="help">
              {renderHelpTopics()}
            </TabsContent>
            
            <TabsContent value="feedback">
              {renderFeedback()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CXChatbot;
