import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface InspectionsCalendarProps {
  inspections: any[];
  onEdit: (inspection: any) => void;
}

const InspectionsCalendar: React.FC<InspectionsCalendarProps> = ({ inspections, onEdit }) => {
  const events = inspections.map(inspection => ({
    id: inspection.id,
    title: `${inspection.inspectionNumber}: ${inspection.title} (${inspection.status})`,
    start: new Date(inspection.scheduledDate),
    end: new Date(inspection.scheduledDate),
    allDay: true,
    resource: inspection,
  }));

  const eventPropGetter = (event: any) => {
    let backgroundColor = "#3174ad"; // Default blue
    switch (event.resource.status) {
      case "Completed":
        backgroundColor = "#4CAF50"; // Green
        break;
      case "In Progress":
        backgroundColor = "#FFC107"; // Amber
        break;
      case "Scheduled":
        backgroundColor = "#2196F3"; // Blue
        break;
      case "Cancelled":
        backgroundColor = "#F44336"; // Red
        break;
      default:
        backgroundColor = "#9E9E9E"; // Grey
    }
    return { style: { backgroundColor } };
  };

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={onEdit}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default InspectionsCalendar;


