import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { ZoomIn, ZoomOut, ChevronRight, MoreVertical, AlertTriangle } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
  getScheduleItems: async (scheduleId) => {
    console.log("Fetching schedule items for:", scheduleId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: "item1",
        name: "Project Planning Phase",
        type: "Phase",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        completionPercentage: 100,
        status: "Completed",
        children: [
          {
            id: "item1-1",
            name: "Requirements Gathering",
            type: "Task",
            startDate: "2024-01-15",
            endDate: "2024-01-25",
            completionPercentage: 100,
            status: "Completed",
          },
          {
            id: "item1-2",
            name: "Initial Design",
            type: "Task",
            startDate: "2024-01-20",
            endDate: "2024-02-05",
            completionPercentage: 100,
            status: "Completed",
          },
          {
            id: "item1-3",
            name: "Planning Complete",
            type: "Milestone",
            startDate: "2024-02-15",
            endDate: "2024-02-15",
            completionPercentage: 100,
            status: "Completed",
          }
        ]
      },
      {
        id: "item2",
        name: "Foundation Work",
        type: "Phase",
        startDate: "2024-02-20",
        endDate: "2024-04-10",
        completionPercentage: 85,
        status: "In Progress",
        children: [
          {
            id: "item2-1",
            name: "Site Preparation",
            type: "Task",
            startDate: "2024-02-20",
            endDate: "2024-03-05",
            completionPercentage: 100,
            status: "Completed",
          },
          {
            id: "item2-2",
            name: "Excavation",
            type: "Task",
            startDate: "2024-03-01",
            endDate: "2024-03-20",
            completionPercentage: 100,
            status: "Completed",
          },
          {
            id: "item2-3",
            name: "Foundation Pouring",
            type: "Task",
            startDate: "2024-03-15",
            endDate: "2024-04-05",
            completionPercentage: 70,
            status: "In Progress",
          },
          {
            id: "item2-4",
            name: "Foundation Inspection",
            type: "Milestone",
            startDate: "2024-04-10",
            endDate: "2024-04-10",
            completionPercentage: 0,
            status: "Not Started",
          }
        ]
      },
      {
        id: "item3",
        name: "Framing",
        type: "Phase",
        startDate: "2024-04-15",
        endDate: "2024-06-30",
        completionPercentage: 0,
        status: "Not Started",
        children: [
          {
            id: "item3-1",
            name: "First Floor Framing",
            type: "Task",
            startDate: "2024-04-15",
            endDate: "2024-05-15",
            completionPercentage: 0,
            status: "Not Started",
          },
          {
            id: "item3-2",
            name: "Second Floor Framing",
            type: "Task",
            startDate: "2024-05-10",
            endDate: "2024-06-10",
            completionPercentage: 0,
            status: "Not Started",
          },
          {
            id: "item3-3",
            name: "Roof Framing",
            type: "Task",
            startDate: "2024-06-01",
            endDate: "2024-06-25",
            completionPercentage: 0,
            status: "Not Started",
          },
          {
            id: "item3-4",
            name: "Framing Inspection",
            type: "Milestone",
            startDate: "2024-06-30",
            endDate: "2024-06-30",
            completionPercentage: 0,
            status: "Not Started",
          }
        ]
      }
    ];
  },
  getDependencies: async (scheduleId) => {
    console.log("Fetching dependencies for:", scheduleId);
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: "dep1",
        predecessorId: "item1-3", // Planning Complete milestone
        successorId: "item2-1", // Site Preparation
        type: "Finish-to-Start",
        lag: 2
      },
      {
        id: "dep2",
        predecessorId: "item2-2", // Excavation
        successorId: "item2-3", // Foundation Pouring
        type: "Finish-to-Start",
        lag: 0
      },
      {
        id: "dep3",
        predecessorId: "item2-3", // Foundation Pouring
        successorId: "item2-4", // Foundation Inspection
        type: "Finish-to-Start",
        lag: 3
      },
      {
        id: "dep4",
        predecessorId: "item2-4", // Foundation Inspection
        successorId: "item3-1", // First Floor Framing
        type: "Finish-to-Start",
        lag: 2
      }
    ];
  }
};

// Helper functions
const parseDate = (dateStr) => new Date(dateStr);
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Status color mapping
const statusColors = {
  "Completed": "bg-green-500",
  "In Progress": "bg-blue-500",
  "Not Started": "bg-gray-300",
  "On Hold": "bg-amber-500",
  "Delayed": "bg-red-500"
};

const GanttChartView = ({ scheduleId, dateRange }) => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [zoomLevel, setZoomLevel] = useState(50); // 0-100 scale
  const [isLoading, setIsLoading] = useState(true);
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [showBaseline, setShowBaseline] = useState(false);
  const [error, setError] = useState(null);
  
  const ganttContainerRef = useRef(null);
  
  // Calculate date range for the chart
  const startDate = dateRange?.from || new Date("2024-01-01");
  const endDate = dateRange?.to || new Date("2024-12-31");
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Calculate day width based on zoom level
  const minDayWidth = 15; // px at minimum zoom
  const maxDayWidth = 60; // px at maximum zoom
  const dayWidth = minDayWidth + ((maxDayWidth - minDayWidth) * (zoomLevel / 100));
  
  // Total width of the timeline
  const timelineWidth = daysDiff * dayWidth;
  
  // Fetch schedule items and dependencies
  useEffect(() => {
    if (!scheduleId) return;
    
    setIsLoading(true);
    setError(null);
    
    Promise.all([
      mockApi.getScheduleItems(scheduleId),
      mockApi.getDependencies(scheduleId)
    ])
      .then(([itemsData, depsData]) => {
        setScheduleItems(itemsData);
        setDependencies(depsData);
        
        // Initialize expanded state for all parent items
        const expanded = {};
        itemsData.forEach(item => {
          expanded[item.id] = true; // Default to expanded
        });
        setExpandedItems(expanded);
      })
      .catch(err => {
        console.error("Failed to load Gantt data:", err);
        setError("Failed to load schedule data. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [scheduleId]);
  
  // Toggle expanded state for an item
  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Calculate position and width for a task bar
  const calculateTaskPosition = (item) => {
    const itemStart = parseDate(item.startDate);
    const itemEnd = parseDate(item.endDate);
    
    // Calculate days from start of chart
    const daysFromStart = Math.max(0, Math.ceil((itemStart - startDate) / (1000 * 60 * 60 * 24)));
    
    // Calculate width in days
    const itemDuration = Math.max(1, Math.ceil((itemEnd - itemStart) / (1000 * 60 * 60 * 24)) + 1);
    
    return {
      left: daysFromStart * dayWidth,
      width: itemDuration * dayWidth
    };
  };
  
  // Generate month headers for the timeline
  const generateMonthHeaders = () => {
    const months = [];
    let currentDate = new Date(startDate);
    currentDate.setDate(1); // Start from the 1st of the month
    
    while (currentDate <= endDate) {
      const monthStart = new Date(currentDate);
      currentDate.setMonth(currentDate.getMonth() + 1);
      
      // Calculate position and width
      const daysFromStart = Math.ceil((monthStart - startDate) / (1000 * 60 * 60 * 24));
      const nextMonth = new Date(monthStart);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const daysInMonth = Math.min(
        Math.ceil((nextMonth - monthStart) / (1000 * 60 * 60 * 24)),
        Math.ceil((endDate - monthStart) / (1000 * 60 * 60 * 24)) + 1
      );
      
      months.push({
        name: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        left: daysFromStart * dayWidth,
        width: daysInMonth * dayWidth
      });
    }
    
    return months;
  };
  
  // Generate day headers for the timeline
  const generateDayHeaders = () => {
    const days = [];
    let currentDate = new Date(startDate);
    
    for (let i = 0; i <= daysDiff; i++) {
      days.push({
        date: new Date(currentDate),
        left: i * dayWidth,
        width: dayWidth,
        isWeekend: [0, 6].includes(currentDate.getDay()) // 0 is Sunday, 6 is Saturday
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };
  
  // Render dependency lines
  const renderDependencies = () => {
    // Create a map of items by ID for easier lookup
    const itemsMap = {};
    const flattenItems = (items, level = 0) => {
      items.forEach(item => {
        itemsMap[item.id] = { ...item, level };
        if (item.children && item.children.length > 0) {
          flattenItems(item.children, level + 1);
        }
      });
    };
    flattenItems(scheduleItems);
    
    return dependencies.map(dep => {
      const predecessor = itemsMap[dep.predecessorId];
      const successor = itemsMap[dep.successorId];
      
      if (!predecessor || !successor) return null;
      
      // Calculate positions
      const predPos = calculateTaskPosition(predecessor);
      const succPos = calculateTaskPosition(successor);
      
      // For milestone predecessors, start from the center
      const predIsMilestone = predecessor.type === "Milestone";
      const succIsMilestone = successor.type === "Milestone";
      
      // Calculate start and end points
      const startX = predIsMilestone ? predPos.left : predPos.left + predPos.width;
      const startY = (predecessor.level + 1) * 40 + 20; // Centered vertically on the task
      
      const endX = succPos.left;
      const endY = (successor.level + 1) * 40 + 20; // Centered vertically on the task
      
      // Create path for the arrow
      const midX = (startX + endX) / 2;
      
      const path = `
        M ${startX} ${startY}
        L ${midX} ${startY}
        L ${midX} ${endY}
        L ${endX} ${endY}
      `;
      
      const isCritical = showCriticalPath && (dep.isCritical || Math.random() > 0.7); // Mock critical path
      
      return (
        <g key={dep.id} className={`dependency-line ${isCritical ? 'critical-path' : ''}`}>
          <path 
            d={path} 
            fill="none" 
            stroke={isCritical ? "#ff4500" : "#999"} 
            strokeWidth={isCritical ? 2 : 1} 
            strokeDasharray={isCritical ? "none" : "4,2"}
          />
          {/* Arrow head */}
          <polygon 
            points={`${endX},${endY} ${endX-5},${endY-3} ${endX-5},${endY+3}`} 
            fill={isCritical ? "#ff4500" : "#999"} 
          />
        </g>
      );
    });
  };
  
  // Render a single task bar
  const renderTaskBar = (item, level) => {
    const { left, width } = calculateTaskPosition(item);
    const isMilestone = item.type === "Milestone";
    
    // Today line position
    const today = new Date();
    const daysFromStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const todayPosition = daysFromStart * dayWidth;
    
    if (isMilestone) {
      // Render diamond shape for milestone
      const diamondSize = 16;
      return (
        <div 
          className={`absolute flex items-center justify-center ${statusColors[item.status] || "bg-gray-400"}`}
          style={{ 
            left: left + (width / 2) - (diamondSize / 2), 
            top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            width: diamondSize,
            height: diamondSize,
            zIndex: 10
          }}
          title={`${item.name} (${formatDate(parseDate(item.startDate))})`}
        >
          <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
            {item.completionPercentage === 100 && (
              <div className="text-white text-xs">✓</div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div 
        className={`absolute h-6 rounded-sm ${statusColors[item.status] || "bg-gray-400"} flex items-center`}
        style={{ 
          left, 
          width: Math.max(width, 4), // Minimum width for visibility
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 5
        }}
        title={`${item.name} (${formatDate(parseDate(item.startDate))} - ${formatDate(parseDate(item.endDate))})`}
      >
        {/* Progress bar */}
        {item.completionPercentage > 0 && (
          <div 
            className="absolute h-2 bg-green-700 bottom-0 left-0 rounded-sm"
            style={{ width: `${item.completionPercentage}%` }}
          ></div>
        )}
        
        {/* Task label - only show if enough space */}
        {width > 50 && (
          <span className="px-2 text-xs text-white truncate whitespace-nowrap">
            {item.name}
          </span>
        )}
      </div>
    );
  };
  
  // Render the gantt chart rows recursively
  const renderGanttRows = (items, level = 0) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems[item.id];
      
      return (
        <React.Fragment key={item.id}>
          <div className={`gantt-row flex ${level === 0 ? 'bg-muted/50' : ''}`}>
            {/* Task name column */}
            <div 
              className="gantt-task-name flex items-center pr-4 border-r border-border min-w-[250px] max-w-[250px]"
              style={{ paddingLeft: `${level * 20 + 8}px` }}
            >
              {hasChildren && (
                <button 
                  onClick={() => toggleExpand(item.id)}
                  className="mr-1 p-1 rounded-sm hover:bg-muted"
                >
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  />
                </button>
              )}
              <span className={`truncate ${item.type === 'Milestone' ? 'font-medium' : ''}`}>
                {item.name}
              </span>
            </div>
            
            {/* Timeline column */}
            <div className="gantt-timeline relative flex-1 h-10">
              {renderTaskBar(item, level)}
            </div>
          </div>
          
          {/* Render children if expanded */}
          {hasChildren && isExpanded && renderGanttRows(item.children, level + 1)}
        </React.Fragment>
      );
    });
  };
  
  // Handle zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 100));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 0));
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading Gantt chart...</div>;
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <AlertTriangle className="mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }
  
  const monthHeaders = generateMonthHeaders();
  const dayHeaders = generateDayHeaders();
  
  return (
    <div className="gantt-chart-container flex flex-col h-full">
      {/* Controls */}
      <div className="flex justify-between items-center mb-4 p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 0}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider 
            value={[zoomLevel]} 
            min={0} 
            max={100} 
            step={1} 
            className="w-32" 
            onValueChange={(value) => setZoomLevel(value[0])}
          />
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 100}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="criticalPath" 
              checked={showCriticalPath} 
              onCheckedChange={setShowCriticalPath}
            />
            <label htmlFor="criticalPath" className="text-sm cursor-pointer">
              Critical Path
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="baseline" 
              checked={showBaseline} 
              onCheckedChange={setShowBaseline}
            />
            <label htmlFor="baseline" className="text-sm cursor-pointer">
              Show Baseline
            </label>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Add Task</DropdownMenuItem>
                    <DropdownMenuItem>Add Milestone</DropdownMenuItem>
                    <DropdownMenuItem>Add Dependency</DropdownMenuItem>
                    <DropdownMenuItem>Export as Image</DropdownMenuItem>
                    <DropdownMenuItem>Print Gantt Chart</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center space-x-4 mb-2 px-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 mr-1"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 mr-1"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 mr-1"></div>
          <span>Not Started</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 mr-1"></div>
          <span>On Hold</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 mr-1"></div>
          <span>Delayed</span>
        </div>
        {showCriticalPath && (
          <div className="flex items-center">
            <div className="w-6 h-0.5 bg-red-600 mr-1"></div>
            <span>Critical Path</span>
          </div>
        )}
      </div>
      
      {/* Gantt Chart */}
      <div className="gantt-scroll-container flex-1 overflow-auto border rounded-md">
        <div className="gantt-inner-container" ref={ganttContainerRef}>
          {/* Header with timeline */}
          <div className="gantt-header sticky top-0 z-20 bg-background">
            <div className="flex">
              {/* Empty space above task names */}
              <div className="min-w-[250px] max-w-[250px] border-r border-border">
                <div className="h-8 border-b border-border"></div>
                <div className="h-6 border-b border-border"></div>
              </div>
              
              {/* Timeline headers */}
              <div className="flex-1">
                <div className="relative h-8 border-b border-border">
                  {/* Month headers */}
                  {monthHeaders.map((month, idx) => (
                    <div 
                      key={idx}
                      className="absolute top-0 h-full flex items-center justify-center border-r border-border text-xs font-medium"
                      style={{ left: month.left, width: month.width }}
                    >
                      {month.name}
                    </div>
                  ))}
                </div>
                
                <div className="relative h-6 border-b border-border">
                  {/* Day headers */}
                  {dayHeaders.map((day, idx) => (
                    <div 
                      key={idx}
                      className={`absolute top-0 h-full flex items-center justify-center border-r border-border text-xs ${
                        day.isWeekend ? 'bg-muted/30' : ''
                      }`}
                      style={{ left: day.left, width: day.width }}
                    >
                      {day.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Today indicator */}
          {(() => {
            const today = new Date();
            if (today >= startDate && today <= endDate) {
              const daysFromStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
              const todayPosition = daysFromStart * dayWidth;
              
              return (
                <div 
                  className="absolute top-14 bottom-0 border-l-2 border-red-500 z-10"
                  style={{ left: `calc(250px + ${todayPosition}px)` }}
                >
                  <div className="bg-red-500 text-white text-xs px-1 rounded-sm">Today</div>
                </div>
              );
            }
            return null;
          })()}
          
          {/* Gantt body */}
          <div className="gantt-body relative" style={{ width: `${250 + timelineWidth}px` }}>
            {/* Task rows */}
            {renderGanttRows(scheduleItems)}
            
            {/* SVG layer for dependencies */}
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none" 
              style={{ left: '250px' }}
            >
              {renderDependencies()}
            </svg>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" size="sm">Add Task</Button>
        <Button variant="outline" size="sm">Add Milestone</Button>
        <Button variant="outline" size="sm">Manage Dependencies</Button>
      </div>
    </div>
  );
};

export default GanttChartView;
