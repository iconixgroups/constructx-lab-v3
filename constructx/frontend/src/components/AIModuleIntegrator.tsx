import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AIModuleIntegratorProps {
  moduleContext: string;
  projectId: string;
  children: React.ReactNode;
  showAIControls?: boolean;
  aiEnabled?: boolean;
  onToggleAI?: (enabled: boolean) => void;
}

export const AIModuleIntegrator: React.FC<AIModuleIntegratorProps> = ({
  moduleContext,
  projectId,
  children,
  showAIControls = true,
  aiEnabled = true,
  onToggleAI
}) => {
  const [isAIEnabled, setIsAIEnabled] = useState(aiEnabled);
  const [activeTab, setActiveTab] = useState<string>('standard');
  const [aiInsights, setAiInsights] = useState<{
    available: boolean;
    loading: boolean;
    content?: React.ReactNode;
  }>({
    available: false,
    loading: true
  });
  
  // Toggle AI features
  const toggleAI = () => {
    const newState = !isAIEnabled;
    setIsAIEnabled(newState);
    if (onToggleAI) {
      onToggleAI(newState);
    }
  };
  
  // Simulate loading AI insights based on context
  useEffect(() => {
    if (isAIEnabled && activeTab === 'ai-enhanced') {
      setAiInsights({
        available: false,
        loading: true
      });
      
      // This would be replaced with actual AI API calls in production
      setTimeout(() => {
        // Simulate AI insights based on module context
        const insights = (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
                      <circle cx="12" cy="10" r="1"></circle>
                    </svg>
                  </div>
                  <span className="font-medium">AI-Enhanced View</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  This view has been enhanced with AI insights to help you make better decisions about your {moduleContext}.
                </p>
                
                {moduleContext === 'dashboard' && (
                  <div className="space-y-2">
                    <p className="text-sm">• Your project is currently <span className="text-amber-600 font-medium">2 days behind schedule</span> based on milestone progress.</p>
                    <p className="text-sm">• Budget utilization is <span className="text-green-600 font-medium">12% under forecast</span> for this phase.</p>
                    <p className="text-sm">• Team productivity has <span className="text-green-600 font-medium">increased 8%</span> compared to last week.</p>
                  </div>
                )}
                
                {moduleContext === 'tasks' && (
                  <div className="space-y-2">
                    <p className="text-sm">• <span className="text-red-600 font-medium">3 critical tasks</span> are approaching their deadlines.</p>
                    <p className="text-sm">• Task dependencies suggest <span className="text-amber-600 font-medium">potential bottlenecks</span> in the framing phase.</p>
                    <p className="text-sm">• Based on current progress, consider <span className="text-blue-600 font-medium">reallocating resources</span> from electrical to plumbing tasks.</p>
                  </div>
                )}
                
                {moduleContext === 'schedule' && (
                  <div className="space-y-2">
                    <p className="text-sm">• Current schedule has a <span className="text-amber-600 font-medium">68% probability</span> of meeting the target completion date.</p>
                    <p className="text-sm">• Weather forecast indicates <span className="text-red-600 font-medium">potential delays</span> for exterior work next week.</p>
                    <p className="text-sm">• Inspection scheduling has <span className="text-amber-600 font-medium">historical delays</span> of 2-3 days not accounted for in the timeline.</p>
                  </div>
                )}
                
                {moduleContext === 'budget' && (
                  <div className="space-y-2">
                    <p className="text-sm">• Material costs are trending <span className="text-red-600 font-medium">15% above estimates</span>, primarily in lumber and concrete.</p>
                    <p className="text-sm">• Labor utilization is <span className="text-green-600 font-medium">7% more efficient</span> than planned.</p>
                    <p className="text-sm">• Current spending pattern projects a <span className="text-amber-600 font-medium">$12,450 overrun</span> by project completion.</p>
                  </div>
                )}
                
                {moduleContext === 'resources' && (
                  <div className="space-y-2">
                    <p className="text-sm">• Equipment utilization is <span className="text-red-600 font-medium">32% below optimal levels</span>.</p>
                    <p className="text-sm">• Team skill distribution shows <span className="text-amber-600 font-medium">gaps in specialized electrical work</span>.</p>
                    <p className="text-sm">• Material delivery schedule has <span className="text-green-600 font-medium">improved efficiency</span> compared to previous projects.</p>
                  </div>
                )}
                
                {(moduleContext !== 'dashboard' && 
                  moduleContext !== 'tasks' && 
                  moduleContext !== 'schedule' && 
                  moduleContext !== 'budget' && 
                  moduleContext !== 'resources') && (
                  <div className="space-y-2">
                    <p className="text-sm">• AI analysis has identified <span className="text-amber-600 font-medium">3 key areas for improvement</span> in your {moduleContext}.</p>
                    <p className="text-sm">• Based on historical data, consider <span className="text-blue-600 font-medium">adjusting your approach</span> to optimize outcomes.</p>
                    <p className="text-sm">• Similar projects have achieved <span className="text-green-600 font-medium">better results</span> by implementing the suggested changes.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {children}
          </div>
        );
        
        setAiInsights({
          available: true,
          loading: false,
          content: insights
        });
      }, 1500);
    }
  }, [isAIEnabled, activeTab, moduleContext, children]);
  
  return (
    <div className="w-full">
      {showAIControls && (
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="standard">Standard View</TabsTrigger>
              <TabsTrigger 
                value="ai-enhanced" 
                disabled={!isAIEnabled}
              >
                AI-Enhanced View
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant={isAIEnabled ? "default" : "outline"} 
            size="sm"
            onClick={toggleAI}
            className="flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M12 2a8 8 0 0 0-8 8c0 1.5.5 2.5 1.5 3.5L12 22l6.5-8.5c1-1 1.5-2 1.5-3.5a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="1"></circle>
            </svg>
            <span>{isAIEnabled ? 'AI Enabled' : 'Enable AI'}</span>
          </Button>
        </div>
      )}
      
      {activeTab === 'standard' || !showAIControls ? (
        children
      ) : (
        aiInsights.loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading AI insights...</p>
            </div>
          </div>
        ) : (
          aiInsights.content
        )
      )}
    </div>
  );
};

export default AIModuleIntegrator;
