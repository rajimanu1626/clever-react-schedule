
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { Event } from "@/types/Event";
import { eventStyleGetter } from "@/utils/eventUtils";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

// Create a localizer using moment
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onSelectSlot: ({ start, end }: { start: Date; end: Date }) => void;
}

const CalendarView = ({ events, onSelectEvent, onSelectSlot }: CalendarViewProps) => {
  const [view, setView] = useState("month");

  return (
    <div className="h-full p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 130px)" }}
        views={["month", "week", "day", "agenda"]}
        defaultView={Views.MONTH}
        onView={setView}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        eventPropGetter={eventStyleGetter}
        toolbar={true}
        popup
      />
    </div>
  );
};

export default CalendarView;
