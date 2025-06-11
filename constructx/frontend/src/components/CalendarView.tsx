import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
  getCalendarEvents: async (scheduleId, viewType, startDate, endDate) => {
    console.log(`Fetching ${viewType} calendar events for schedule:`, scheduleId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock events
    const events = [];
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    while (currentDate <= endDateTime) {
      // Add 0-3 events per day
      const eventsPerDay = Math.floor(Math.random() * 4);
      
      for (let i = 0; i < eventsPerDay; i++) {
        const eventTypes = ["Meeting", "Deadline", "Delivery", "Inspection", "Site Visit"];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        const startHour = 8 + Math.floor(Math.random() * 8); // 8 AM to 4 PM
        const durationHours = 1 + Math.floor(Math.random() * 3); // 1-3 hours
        
        const eventStart = new Date(currentDate);
        eventStart.setHours(startHour, 0, 0);
        
        const eventEnd = new Date(eventStart);
        eventEnd.setHours(eventStart.getHours() + durationHours);
        
        events.push({
          id: `event-${events.length + 1}`,
          title: `${eventType} - ${events.length + 1}`,
          description: `Description for ${eventType.toLowerCase()}`,
          startDateTime: eventStart,
          endDateTime: eventEnd,
          allDay: Math.random() > 0.8, // 20% chance of all-day event
          location: Math.random() > 0.5 ? "Project Site" : "Office",
          type: eventType,
          scheduleItemId: Math.random() > 0.7 ? `item-${Math.floor(Math.random() * 10) + 1}` : null,
          color: getEventColor(eventType)
        });
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return events;
  }
};

// Helper function to get color based on event type
const getEventColor = (type) => {
  const colors = {
    "Meeting": "bg-blue-500",
    "Deadline": "bg-red-500",
    "Delivery": "bg-green-500",
    "Inspection": "bg-amber-500",
    "Site Visit": "bg-purple-500"
  };
  
  return colors[type] || "bg-gray-500";
};

// Helper functions for date manipulation
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfWeek = (date) => {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
};

const startOfMonth = (date) => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfMonth = (date) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const CalendarView = ({ scheduleId, dateRange }) => {
  const [viewType, setViewType] = useState("month"); // month, week, day
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [newEventDate, setNewEventDate] = useState(null);
  const [error, setError] = useState(null);
  
  // Calculate view range based on current date and view type
  const getViewRange = () => {
    switch (viewType) {
      case "day":
        return {
          start: new Date(currentDate.setHours(0, 0, 0, 0)),
          end: new Date(currentDate.setHours(23, 59, 59, 999))
        };
      case "week":
        return {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        };
      case "month":
      default:
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
    }
  };
  
  // Fetch events when view changes
  useEffect(() => {
    if (!scheduleId) return;
    
    setIsLoading(true);
    setError(null);
    
    const range = getViewRange();
    
    mockApi.getCalendarEvents(scheduleId, viewType, range.start, range.end)
      .then(data => {
        setEvents(data);
      })
      .catch(err => {
        console.error("Failed to load calendar events:", err);
        setError("Failed to load calendar events. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [scheduleId, viewType, currentDate]);
  
  // Navigation handlers
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
      default:
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
      default:
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };
  
  // View title based on current date and view type
  const getViewTitle = () => {
    switch (viewType) {
      case "day":
        return formatDate(currentDate);
      case "week":
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case "month":
      default:
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };
  
  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };
  
  // Handle day click for new event
  const handleDayClick = (date) => {
    setNewEventDate(date);
    setShowNewEventDialog(true);
  };
  
  // Render month view
  const renderMonthView = () => {
    const viewRange = getViewRange();
    const daysWithEvents = events.reduce((acc, event) => {
      const eventDate = new Date(event.startDateTime);
      const dateKey = eventDate.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      
      acc[dateKey].push(event);
      return acc;
    }, {});
    
    return (
      <div className="calendar-month-view">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => date && handleDayClick(date)}
          className="rounded-md border"
          modifiers={{
            event: (date) => {
              const dateKey = date.toISOString().split('T')[0];
              return !!daysWithEvents[dateKey];
            }
          }}
          modifiersStyles={{
            event: { fontWeight: 'bold' }
          }}
          components={{
            DayContent: ({ date }) => {
              const dateKey = date.toISOString().split('T')[0];
              const dayEvents = daysWithEvents[dateKey] || [];
              
              return (
                <div className="w-full h-full min-h-[80px] p-1">
                  <div className="text-right">{date.getDate()}</div>
                  <div className="mt-1 space-y-1 max-h-[60px] overflow-hidden">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div 
                        key={idx}
                        className={`text-xs truncate rounded px-1 text-white cursor-pointer ${event.color}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          }}
        />
      </div>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    // Group events by day
    const eventsByDay = days.map(day => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      return {
        date: day,
        events: events.filter(event => {
          const eventStart = new Date(event.startDateTime);
          return eventStart >= dayStart && eventStart <= dayEnd;
        })
      };
    });
    
    // Hours for the day (8 AM to 6 PM)
    const hours = Array.from({ length: 11 }, (_, i) => i + 8);
    
    return (
      <div className="calendar-week-view overflow-auto">
        <div className="grid grid-cols-8 border-b">
          {/* Empty corner */}
          <div className="border-r p-2 min-w-[60px]"></div>
          
          {/* Day headers */}
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={`border-r p-2 text-center ${
                day.toDateString() === new Date().toDateString() ? 'bg-muted' : ''
              }`}
            >
              <div className="font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div>{day.getDate()}</div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-8">
          {/* Hour labels */}
          <div className="border-r">
            {hours.map(hour => (
              <div key={hour} className="h-20 border-b p-1 text-xs text-right pr-2">
                {hour % 12 === 0 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {eventsByDay.map((dayData, dayIdx) => (
            <div 
              key={dayIdx} 
              className={`border-r relative ${
                dayData.date.toDateString() === new Date().toDateString() ? 'bg-muted/30' : ''
              }`}
            >
              {/* Hour cells */}
              {hours.map(hour => (
                <div 
                  key={hour} 
                  className="h-20 border-b"
                  onClick={() => {
                    const newDate = new Date(dayData.date);
                    newDate.setHours(hour, 0, 0);
                    handleDayClick(newDate);
                  }}
                ></div>
              ))}
              
              {/* Events */}
              {dayData.events.map((event, eventIdx) => {
                const eventStart = new Date(event.startDateTime);
                const eventEnd = new Date(event.endDateTime);
                
                // Calculate position
                const startHour = eventStart.getHours() + (eventStart.getMinutes() / 60);
                const endHour = eventEnd.getHours() + (eventEnd.getMinutes() / 60);
                
                // Only show events that fall within our displayed hours
                if (startHour >= 19 || endHour <= 8) return null;
                
                const displayStartHour = Math.max(8, startHour);
                const displayEndHour = Math.min(19, endHour);
                const durationHours = displayEndHour - displayStartHour;
                
                const top = ((displayStartHour - 8) / 11) * 100;
                const height = (durationHours / 11) * 100;
                
                return (
                  <div
                    key={eventIdx}
                    className={`absolute left-0 right-0 mx-1 rounded px-2 text-white overflow-hidden cursor-pointer ${event.color}`}
                    style={{
                      top: `${top}%`,
                      height: `${height}%`,
                      minHeight: '20px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <div className="text-xs font-medium truncate">{event.title}</div>
                    {height > 10 && (
                      <div className="text-xs truncate">{formatTime(eventStart)} - {formatTime(eventEnd)}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render day view
  const renderDayView = () => {
    // Hours for the day (8 AM to 6 PM)
    const hours = Array.from({ length: 11 }, (_, i) => i + 8);
    
    // Filter events for the current day
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.startDateTime);
      return eventStart >= dayStart && eventStart <= dayEnd;
    });
    
    return (
      <div className="calendar-day-view overflow-auto">
        <div className="grid grid-cols-[100px_1fr] border-b">
          <div className="border-r p-2"></div>
          <div className={`p-2 ${
            currentDate.toDateString() === new Date().toDateString() ? 'bg-muted' : ''
          }`}>
            <div className="font-medium">{formatDate(currentDate)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-[100px_1fr]">
          {/* Hour labels */}
          <div className="border-r">
            {hours.map(hour => (
              <div key={hour} className="h-24 border-b p-1 text-right pr-2">
                {hour % 12 === 0 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>
          
          {/* Events column */}
          <div className={`relative ${
            currentDate.toDateString() === new Date().toDateString() ? 'bg-muted/30' : ''
          }`}>
            {/* Hour cells */}
            {hours.map(hour => (
              <div 
                key={hour} 
                className="h-24 border-b"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setHours(hour, 0, 0);
                  handleDayClick(newDate);
                }}
              ></div>
            ))}
            
            {/* Events */}
            {dayEvents.map((event, eventIdx) => {
              const eventStart = new Date(event.startDateTime);
              const eventEnd = new Date(event.endDateTime);
              
              // Calculate position
              const startHour = eventStart.getHours() + (eventStart.getMinutes() / 60);
              const endHour = eventEnd.getHours() + (eventEnd.getMinutes() / 60);
              
              // Only show events that fall within our displayed hours
              if (startHour >= 19 || endHour <= 8) return null;
              
              const displayStartHour = Math.max(8, startHour);
              const displayEndHour = Math.min(19, endHour);
              const durationHours = displayEndHour - displayStartHour;
              
              const top = ((displayStartHour - 8) / 11) * 100;
              const height = (durationHours / 11) * 100;
              
              return (
                <div
                  key={eventIdx}
                  className={`absolute left-0 right-0 mx-2 rounded p-2 text-white overflow-hidden cursor-pointer ${event.color}`}
                  style={{
                    top: `${top}%`,
                    height: `${height}%`,
                    minHeight: '24px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm">{formatTime(eventStart)} - {formatTime(eventEnd)}</div>
                  {height > 15 && event.location && (
                    <div className="text-sm flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" /> {event.location}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Render agenda view (alternative for mobile)
  const renderAgendaView = () => {
    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
      const eventDate = new Date(event.startDateTime);
      const dateKey = eventDate.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: eventDate,
          events: []
        };
      }
      
      acc[dateKey].events.push(event);
      return acc;
    }, {});
    
    // Sort dates
    const sortedDates = Object.values(eventsByDate).sort((a, b) => a.date - b.date);
    
    return (
      <div className="calendar-agenda-view space-y-4">
        {sortedDates.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No events scheduled for this period.
          </div>
        ) : (
          sortedDates.map((dateGroup, idx) => (
            <div key={idx} className="border rounded-md overflow-hidden">
              <div className={`p-2 font-medium ${
                dateGroup.date.toDateString() === new Date().toDateString() ? 'bg-muted' : 'bg-muted/30'
              }`}>
                {formatDate(dateGroup.date)}
              </div>
              <div className="divide-y">
                {dateGroup.events.map((event, eventIdx) => (
                  <div 
                    key={eventIdx} 
                    className="p-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${event.color}`}></div>
                      <div className="font-medium">{event.title}</div>
                    </div>
                    <div className="ml-5 text-sm text-muted-foreground flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.allDay ? (
                        <span>All day</span>
                      ) : (
                        <span>{formatTime(new Date(event.startDateTime))} - {formatTime(new Date(event.endDateTime))}</span>
                      )}
                    </div>
                    {event.location && (
                      <div className="ml-5 text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };
  
  // Event details dialog
  const renderEventDetailsDialog = () => {
    if (!selectedEvent) return null;
    
    return (
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">
                  {formatDate(new Date(selectedEvent.startDateTime))}
                </div>
                {!selectedEvent.allDay && (
                  <div className="text-sm text-muted-foreground">
                    {formatTime(new Date(selectedEvent.startDateTime))} - {formatTime(new Date(selectedEvent.endDateTime))}
                  </div>
                )}
              </div>
            </div>
            
            {selectedEvent.location && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>{selectedEvent.location}</div>
              </div>
            )}
            
            {selectedEvent.description && (
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={selectedEvent.color.replace('bg-', 'border-')}>
                {selectedEvent.type}
              </Badge>
              
              {selectedEvent.scheduleItemId && (
                <Badge variant="outline">
                  Linked to task
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>Close</Button>
            <Button variant="outline">Edit</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  // New event dialog
  const renderNewEventDialog = () => {
    if (!newEventDate) return null;
    
    return (
      <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Event title" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="border rounded-md p-2">
                  {formatDate(newEventDate)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select defaultValue="Meeting">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Deadline">Deadline</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Site Visit">Site Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Select defaultValue="9:00">
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour % 12 === 0 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Select defaultValue="10:00">
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour % 12 === 0 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="all-day" />
              <Label htmlFor="all-day">All day event</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Event location" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Event description" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schedule-item">Link to Schedule Item (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="item1">Site Preparation</SelectItem>
                  <SelectItem value="item2">Foundation Pouring</SelectItem>
                  <SelectItem value="item3">First Floor Framing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowNewEventDialog(false)}>Save Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading calendar...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }
  
  return (
    <div className="calendar-container flex flex-col h-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">{getViewTitle()}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs value={viewType} onValueChange={setViewType}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="agenda" className="sm:hidden">Agenda</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button size="sm" onClick={() => handleDayClick(new Date())}>
            <Plus className="h-4 w-4 mr-1" /> Event
          </Button>
        </div>
      </div>
      
      {/* Calendar Views */}
      <div className="flex-1 overflow-hidden">
        {viewType === "month" && renderMonthView()}
        {viewType === "week" && renderWeekView()}
        {viewType === "day" && renderDayView()}
        {viewType === "agenda" && renderAgendaView()}
      </div>
      
      {/* Event Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 p-2 border-t text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 mr-1 rounded-full"></div>
          <span>Meeting</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 mr-1 rounded-full"></div>
          <span>Deadline</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 mr-1 rounded-full"></div>
          <span>Delivery</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 mr-1 rounded-full"></div>
          <span>Inspection</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 mr-1 rounded-full"></div>
          <span>Site Visit</span>
        </div>
      </div>
      
      {/* Dialogs */}
      {renderEventDetailsDialog()}
      {renderNewEventDialog()}
    </div>
  );
};

export default CalendarView;
