import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertTriangle, ArrowRight } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
  getCriticalPath: async (scheduleId) => {
    console.log("Fetching critical path for schedule:", scheduleId);
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      criticalPathItems: [
        {
          id: "item1-1",
          name: "Requirements Gathering",
          startDate: "2024-01-15",
          endDate: "2024-01-25",
          duration: 11,
          slack: 0
        },
        {
          id: "item1-2",
          name: "Initial Design",
          startDate: "2024-01-20",
          endDate: "2024-02-05",
          duration: 17,
          slack: 0
        },
        {
          id: "item1-3",
          name: "Planning Complete",
          startDate: "2024-02-15",
          endDate: "2024-02-15",
          duration: 0,
          slack: 0
        },
        {
          id: "item2-1",
          name: "Site Preparation",
          startDate: "2024-02-20",
          endDate: "2024-03-05",
          duration: 14,
          slack: 0
        },
        {
          id: "item2-3",
          name: "Foundation Pouring",
          startDate: "2024-03-15",
          endDate: "2024-04-05",
          duration: 22,
          slack: 0
        },
        {
          id: "item2-4",
          name: "Foundation Inspection",
          startDate: "2024-04-10",
          endDate: "2024-04-10",
          duration: 0,
          slack: 0
        }
      ],
      criticalPathLength: 86, // days
      projectLength: 86, // days
      criticalPathPercentage: 100, // percentage of project length
      riskFactors: [
        {
          itemId: "item2-3",
          name: "Foundation Pouring",
          risk: "high",
          reason: "Weather dependent activity with no buffer"
        },
        {
          itemId: "item1-2",
          name: "Initial Design",
          risk: "medium",
          reason: "Resource constraints"
        }
      ],
      optimizationSuggestions: [
        {
          itemId: "item2-3",
          name: "Foundation Pouring",
          suggestion: "Consider splitting into smaller phases to reduce risk"
        },
        {
          itemId: "item1-2",
          name: "Initial Design",
          suggestion: "Add additional resources to potentially reduce duration"
        }
      ]
    };
  }
};

// Helper functions
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const CriticalPathVisualizer = ({ scheduleId }) => {
  const [criticalPathData, setCriticalPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("path");
  
  // Load critical path data
  useEffect(() => {
    if (!scheduleId) return;
    
    setIsLoading(true);
    setError(null);
    
    mockApi.getCriticalPath(scheduleId)
      .then(data => {
        setCriticalPathData(data);
      })
      .catch(err => {
        console.error("Failed to load critical path:", err);
        setError("Failed to load critical path data. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [scheduleId]);
  
  // Render critical path tab
  const renderPathTab = () => {
    if (!criticalPathData) return null;
    
    const { criticalPathItems, criticalPathLength, projectLength } = criticalPathData;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Critical Path Length</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalPathLength} days</div>
              <p className="text-sm text-muted-foreground">Total project duration</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Critical Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalPathItems.length}</div>
              <p className="text-sm text-muted-foreground">Tasks on critical path</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Path Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalPathData.criticalPathPercentage}%</div>
              <p className="text-sm text-muted-foreground">Of project timeline</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 font-medium">Critical Path Sequence</div>
          <div className="p-4">
            <div className="flex flex-col space-y-4">
              {criticalPathItems.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  <div className="min-w-[250px] md:min-w-[300px]">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </div>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="h-2 bg-muted rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${(item.duration / criticalPathLength) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{item.duration} days</span>
                      <span>Slack: {item.slack} days</span>
                    </div>
                  </div>
                  
                  {index < criticalPathItems.length - 1 && (
                    <div className="flex justify-center my-2">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render risks tab
  const renderRisksTab = () => {
    if (!criticalPathData || !criticalPathData.riskFactors) return null;
    
    const { riskFactors } = criticalPathData;
    
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <p className="text-amber-800">
            The following tasks on the critical path have been identified as potential risks. 
            Delays in these tasks will directly impact the project completion date.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {riskFactors.map(risk => (
            <Card key={risk.itemId}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{risk.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{risk.reason}</p>
                  </div>
                  <Badge className={
                    risk.risk === "high" 
                      ? "bg-red-100 text-red-800 border-red-300" 
                      : risk.risk === "medium"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-blue-100 text-blue-800 border-blue-300"
                  }>
                    {risk.risk.charAt(0).toUpperCase() + risk.risk.slice(1)} Risk
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Render optimization tab
  const renderOptimizationTab = () => {
    if (!criticalPathData || !criticalPathData.optimizationSuggestions) return null;
    
    const { optimizationSuggestions } = criticalPathData;
    
    return (
      <div className="space-y-4">
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 font-medium">Optimization Suggestions</div>
          <div className="divide-y">
            {optimizationSuggestions.map(suggestion => (
              <div key={suggestion.itemId} className="p-4">
                <div className="font-medium">{suggestion.name}</div>
                <p className="text-sm text-muted-foreground mt-1">{suggestion.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">General Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              • Consider adding resources to critical tasks to reduce duration
            </p>
            <p className="text-sm">
              • Review dependencies to identify opportunities for fast-tracking
            </p>
            <p className="text-sm">
              • Monitor critical path tasks daily and address delays immediately
            </p>
            <p className="text-sm">
              • Create contingency plans for high-risk critical tasks
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading critical path data...</div>;
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertTriangle className="mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }
  
  if (!criticalPathData) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No critical path data available
      </div>
    );
  }
  
  return (
    <div className="critical-path-visualizer space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="path">Critical Path</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="path" className="mt-0">
            {renderPathTab()}
          </TabsContent>
          
          <TabsContent value="risks" className="mt-0">
            {renderRisksTab()}
          </TabsContent>
          
          <TabsContent value="optimization" className="mt-0">
            {renderOptimizationTab()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CriticalPathVisualizer;
