
import { Event } from "@/types/Event";

interface NylasEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time: number; // Unix timestamp in seconds
  end_time: number; // Unix timestamp in seconds
  calendar_id: string;
  busy: boolean;
  status: string;
}

export async function fetchNylasEvents(apiKey: string, calendarIds: string[]): Promise<Event[]> {
  try {
    // Create promises for each calendar
    const fetchPromises = calendarIds.map(calendarId => 
      fetch(`https://api.nylas.com/events?calendar_id=${calendarId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch calendar ${calendarId}: ${response.statusText}`);
        }
        return response.json();
      })
    );

    // Wait for all requests to complete
    const results = await Promise.all(fetchPromises);
    
    // Flatten and map to our Event type
    const allEvents: NylasEvent[] = results.flat();
    
    // Map Nylas events to our Event format
    return allEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time * 1000),
      end: new Date(event.end_time * 1000),
      allDay: isAllDayEvent(event.start_time, event.end_time),
      category: getEventCategory(event.calendar_id),
      description: event.description,
      location: event.location,
      calendarId: event.calendar_id
    }));
  } catch (error) {
    console.error("Error fetching Nylas events:", error);
    return [];
  }
}

// Helper to determine if an event is all-day
function isAllDayEvent(startTime: number, endTime: number): boolean {
  const start = new Date(startTime * 1000);
  const end = new Date(endTime * 1000);
  
  // Check if event spans a full day or multiple days
  return start.getHours() === 0 && 
         start.getMinutes() === 0 && 
         end.getHours() === 0 && 
         end.getMinutes() === 0 && 
         (end.getTime() - start.getTime()) >= 86400000; // At least 24 hours
}

// Assign consistent colors based on calendar ID
function getEventCategory(calendarId: string): "blue" | "green" | "yellow" | "red" | "purple" {
  // Generate a consistent number from the calendar ID
  const hash = calendarId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Map to one of our categories
  const categories: ["blue", "green", "yellow", "red", "purple"] = ["blue", "green", "yellow", "red", "purple"];
  const index = Math.abs(hash) % categories.length;
  return categories[index];
}
