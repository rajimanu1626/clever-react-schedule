
import { useState } from "react";
import CalendarView from "@/components/calendar/CalendarView";
import EventModal from "@/components/calendar/EventModal";
import SchedulerModal from "@/components/calendar/SchedulerModal";
import Header from "@/components/layout/Header";
import { Event } from "@/types/Event";
import { generateEvents } from "@/utils/eventUtils";

const Index = () => {
  const [events, setEvents] = useState<Event[]>(generateEvents());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({ 
      id: String(new Date().getTime()),
      title: "",
      start,
      end,
      allDay: false,
      category: "blue"
    });
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (modalMode === "create") {
      setEvents([...events, event]);
    } else {
      setEvents(events.map(e => e.id === event.id ? event : e));
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setIsModalOpen(false);
  };

  const handleCreateEvent = () => {
    setIsSchedulerOpen(true);
  };

  const handleSchedule = (start: Date, end: Date) => {
    setSelectedEvent({ 
      id: String(new Date().getTime()),
      title: "",
      start,
      end,
      allDay: false,
      category: "blue"
    });
    setIsSchedulerOpen(false);
    setModalMode("create");
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onCreateEvent={handleCreateEvent} />
      <main className="flex-1 overflow-hidden">
        <CalendarView 
          events={events}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
        {isModalOpen && selectedEvent && (
          <EventModal
            mode={modalMode}
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        )}
        <SchedulerModal 
          isOpen={isSchedulerOpen}
          onClose={() => setIsSchedulerOpen(false)}
          onSchedule={handleSchedule}
        />
      </main>
    </div>
  );
};

export default Index;
