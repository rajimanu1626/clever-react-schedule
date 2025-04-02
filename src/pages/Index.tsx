
import { useState, useEffect } from "react";
import CalendarView from "@/components/calendar/CalendarView";
import EventModal from "@/components/calendar/EventModal";
import SchedulerModal from "@/components/calendar/SchedulerModal";
import Header from "@/components/layout/Header";
import { Event } from "@/types/Event";
import { generateEvents } from "@/utils/eventUtils";
import { fetchNylasEvents } from "@/utils/nylasUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Index = () => {
  const [events, setEvents] = useState<Event[]>(generateEvents());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Nylas configuration
  const [nylasApiKey, setNylasApiKey] = useState<string>(
    localStorage.getItem("nylasApiKey") || ""
  );
  const [calendarIds, setCalendarIds] = useState<string[]>(
    JSON.parse(localStorage.getItem("nylasCalendarIds") || "[]")
  );
  const [newCalendarId, setNewCalendarId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (nylasApiKey && calendarIds.length > 0) {
      loadNylasEvents();
    }
  }, [nylasApiKey, calendarIds]);

  const loadNylasEvents = async () => {
    if (!nylasApiKey || calendarIds.length === 0) return;
    
    setIsLoading(true);
    try {
      const nylasEvents = await fetchNylasEvents(nylasApiKey, calendarIds);
      setEvents(nylasEvents);
      toast.success(`Loaded ${nylasEvents.length} events from Nylas`);
    } catch (error) {
      console.error("Failed to load Nylas events:", error);
      toast.error("Failed to load calendar events");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNylasApiKey(value);
    localStorage.setItem("nylasApiKey", value);
  };

  const handleAddCalendarId = () => {
    if (!newCalendarId) return;
    const updatedIds = [...calendarIds, newCalendarId];
    setCalendarIds(updatedIds);
    localStorage.setItem("nylasCalendarIds", JSON.stringify(updatedIds));
    setNewCalendarId("");
  };

  const handleRemoveCalendarId = (id: string) => {
    const updatedIds = calendarIds.filter(calId => calId !== id);
    setCalendarIds(updatedIds);
    localStorage.setItem("nylasCalendarIds", JSON.stringify(updatedIds));
  };

  const toggleConfig = () => {
    setIsConfigOpen(!isConfigOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onCreateEvent={handleCreateEvent} />
      
      <div className="flex-none px-4 py-2 flex items-center justify-between bg-background border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleConfig}
          >
            Nylas Config
          </Button>
          
          {nylasApiKey && calendarIds.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadNylasEvents} 
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh Calendars"}
            </Button>
          )}
        </div>
        
        {calendarIds.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {calendarIds.length} calendar{calendarIds.length !== 1 ? 's' : ''} connected
          </div>
        )}
      </div>
      
      {isConfigOpen && (
        <div className="flex-none p-4 bg-muted/50 border-b">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div>
              <label htmlFor="apiKey" className="text-sm font-medium">Nylas API Key</label>
              <Input
                id="apiKey"
                type="text"
                className="w-full mt-1"
                placeholder="Nylas API Key"
                value={nylasApiKey}
                onChange={handleApiKeyChange}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Calendar IDs</label>
              <div className="mt-2 space-y-2">
                {calendarIds.map(id => (
                  <div key={id} className="flex items-center gap-2 p-2 bg-background rounded border">
                    <span className="text-sm flex-1 truncate">{id}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveCalendarId(id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add calendar ID"
                    value={newCalendarId}
                    onChange={(e) => setNewCalendarId(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddCalendarId}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
