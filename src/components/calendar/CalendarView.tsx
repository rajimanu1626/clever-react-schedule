
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Event } from "@/types/Event";
import { eventStyleGetter } from "@/utils/eventUtils";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

// Create a localizer using date-fns
const locales = { "en-US": enUS };
const localizer = {
  format: (date: Date, format: string) => format(date, format),
  parse: (dateString: string, format: string) => parse(dateString, format, new Date()),
  startOfWeek: (date: Date) => startOfWeek(date, { locale: enUS }),
  getDay: (date: Date) => getDay(date),
  locales
};

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
        localizer={localizer as any}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 130px)" }}
        views={["month", "week", "day"]}
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
