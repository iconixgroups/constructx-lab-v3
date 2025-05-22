import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface AIIntegrationServiceProps {
  projectId: string;
  apiKey?: string;
  provider: 'openrouter' | 'claude' | 'auto';
  isConfigured: boolean;
  isLoading?: boolean;
  onSaveConfig?: (config: {
    provider: string;
    apiKey: string;
    models: string[];
    features: string[];
  }) => void;
}

export const AIIntegrationService: React.FC<AIIntegrationServiceProps> = ({
  projectId,
  apiKey = '',
  provider = 'auto',
  isConfigured = false,
  isLoading = false,
  onSaveConfig
}) => {
  const [activeTab, setActiveTab] = useState<string>(isConfigured ? 'status' : 'setup');
  const [configProvider, setConfigProvider] = useState<string>(provider);
  const [configApiKey, setConfigApiKey] = useState<string>(apiKey);
  const [selectedModels, setSelectedModels] = useState<string[]>(['claude-3-opus-20240229', 'anthropic/claude-3-haiku']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['insights', 'chat', 'document_analysis', 'schedule_optimization']);
  
  // Available models
  const availableModels = {
    openrouter: [
      { id: 'anthropic/claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful model for complex tasks' },
      { id: 'anthropic/claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance and efficiency' },
      { id: 'anthropic/claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast responses for simpler tasks' },
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Advanced reasoning and problem solving' },
      { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Efficient for standard tasks' }
    ],
    claude: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful model for complex tasks' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance and efficiency' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast responses for simpler tasks' }
    ]
  };
  
  // Available features
  const availableFeatures = [
    { id: 'insights', name: 'AI Insights', description: 'Automated analysis and recommendations' },
    { id: 'chat', name: 'AI Assistant Chat', description: 'Interactive AI assistant for all modules' },
    { id: 'document_analysis', name: 'Document Analysis', description: 'Extract and analyze information from documents' },
    { id: 'schedule_optimization', name: 'Schedule Optimization', description: 'AI-powered schedule improvements' },
    { id: 'risk_prediction', name: 'Risk Prediction', description: 'Identify potential risks before they occur' },
    { id: 'cost_forecasting', name: 'Cost Forecasting', description: 'Predict future costs based on current data' },
    { id: 'resource_allocation', name: 'Resource Allocation', description: 'Optimize resource distribution' },
    { id: 'report_generation', name: 'Report Generation', description: 'Automated comprehensive reports' }
  ];
  
  // Toggle model selection
  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };
  
  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };
  
  // Handle save configuration
  const handleSaveConfig = () => {
    if (onSaveConfig) {
      onSaveConfig({
        provider: configProvider,
        apiKey: configApiKey,
        models: selectedModels,
        features: selectedFeatures
      });
    }
    
    setActiveTab('status');
  };
  
  // Render setup tab
  const renderSetup = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">AI Provider Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className={`cursor-pointer ${configProvider === 'openrouter' ? 'ring-2 ring-primary' : ''}`} onClick={() => setConfigProvider('openrouter')}>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <line x1="3" x2="21" y1="9" y2="9"></line>
                    <line x1="9" x2="9" y1="21" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">OpenRouter</h4>
                  <p className="text-sm text-muted-foreground">Access multiple AI models through a single API</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer ${configProvider === 'claude' ? 'ring-2 ring-primary' : ''}`} onClick={() => setConfigProvider('claude')}>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Claude API</h4>
                  <p className="text-sm text-muted-foreground">Direct integration with Anthropic's Claude models</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium mb-1">
                API Key
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder={`Enter your ${configProvider === 'openrouter' ? 'OpenRouter' : 'Claude'} API key`}
                value={configApiKey}
                onChange={(e) => setConfigApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {configProvider === 'openrouter' 
                  ? 'Get your API key from openrouter.ai' 
                  : 'Get your API key from anthropic.com'}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Select AI Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableModels[configProvider === 'openrouter' ? 'openrouter' : 'claude'].map(model => (
              <Card 
                key={model.id}
                className={`cursor-pointer ${selectedModels.includes(model.id) ? 'ring-2 ring-primary' : ''}`}
                onClick={() => toggleModel(model.id)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border ${selectedModels.includes(model.id) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {selectedModels.includes(model.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-foreground">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Enable AI Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableFeatures.map(feature => (
              <Card 
                key={feature.id}
                className={`cursor-pointer ${selectedFeatures.includes(feature.id) ? 'ring-2 ring-primary' : ''}`}
                onClick={() => toggleFeature(feature.id)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border ${selectedFeatures.includes(feature.id) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {selectedFeatures.includes(feature.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-foreground">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveConfig} 
            disabled={!configApiKey || selectedModels.length === 0 || selectedFeatures.length === 0}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    );
  };
  
  // Render status tab
  const renderStatus = () => {
    // Mock data for demonstration
    const aiUsageStats = {
      totalRequests: 1243,
      totalTokens: 8765432,
      averageResponseTime: 1.8,
      lastWeekRequests: [120, 145, 98, 156, 203, 178, 343],
      modelUsage: [
        { model: 'Claude 3 Opus', requests: 456, percentage: 36.7 },
        { model: 'Claude 3 Sonnet', requests: 321, percentage: 25.8 },
        { model: 'Claude 3 Haiku', requests: 466, percentage: 37.5 }
      ],
      featureUsage: [
        { feature: 'AI Insights', requests: 389, percentage: 31.3 },
        { feature: 'AI Assistant Chat', requests: 512, percentage: 41.2 },
        { feature: 'Document Analysis', requests: 187, percentage: 15.0 },
        { feature: 'Schedule Optimization', requests: 155, percentage: 12.5 }
      ]
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">AI Integration Status</h3>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Requests</div>
              <div className="text-3xl font-bold mt-1">{aiUsageStats.totalRequests.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Tokens</div>
              <div className="text-3xl font-bold mt-1">{aiUsageStats.totalTokens.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Avg. Response Time</div>
              <div className="text-3xl font-bold mt-1">{aiUsageStats.averageResponseTime}s</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Model Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiUsageStats.modelUsage.map((model, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{model.model}</span>
                      <span>{model.requests} requests ({model.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${model.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Feature Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiUsageStats.featureUsage.map((feature, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{feature.feature}</span>
                      <span>{feature.requests} requests ({feature.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${feature.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between">
              {aiUsageStats.lastWeekRequests.map((requests, index) => {
                const day = new Date();
                day.setDate(day.getDate() - (6 - index));
                const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
                
                const maxRequests = Math.max(...aiUsageStats.lastWeekRequests);
                const height = (requests / maxRequests) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-primary rounded-t-md" 
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-muted-foreground mt-2">{dayName}</div>
                    <div className="text-sm font-medium">{requests}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setActiveTab('setup')}>
            Edit Configuration
          </Button>
          
          <Button>
            View Detailed Analytics
          </Button>
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
            <CardTitle className="text-xl font-bold">AI Integration</CardTitle>
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
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup">
              {renderSetup()}
            </TabsContent>
            
            <TabsContent value="status">
              {renderStatus()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default AIIntegrationService;
