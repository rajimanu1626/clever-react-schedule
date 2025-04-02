
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Event, EventCategory } from "@/types/Event";
import { format } from "date-fns";
import { Trash } from "lucide-react";

interface EventModalProps {
  mode: "create" | "edit";
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const EventModal = ({ mode, event, isOpen, onClose, onSave, onDelete }: EventModalProps) => {
  const [formState, setFormState] = useState<Event>(event);
  
  useEffect(() => {
    setFormState(event);
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleAllDayChange = (checked: boolean) => {
    setFormState({ ...formState, allDay: checked });
  };

  const handleCategoryChange = (category: EventCategory) => {
    setFormState({ ...formState, category });
  };

  const handleSave = () => {
    if (!formState.title.trim()) return;
    onSave(formState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start</Label>
              <Input 
                type="text" 
                value={format(formState.start, "PPp")} 
                readOnly 
              />
            </div>
            <div className="grid gap-2">
              <Label>End</Label>
              <Input 
                type="text" 
                value={format(formState.end, "PPp")} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="allDay" 
              checked={formState.allDay} 
              onCheckedChange={handleAllDayChange} 
            />
            <Label htmlFor="allDay">All Day</Label>
          </div>
          
          <div className="grid gap-2">
            <Label>Category</Label>
            <div className="flex gap-2">
              {["blue", "green", "yellow", "red", "purple"].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${formState.category === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: getCategoryColor(color as EventCategory) }}
                  onClick={() => handleCategoryChange(color as EventCategory)}
                />
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              name="location"
              value={formState.location || ""}
              onChange={handleInputChange}
              placeholder="Add location"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formState.description || ""}
              onChange={handleInputChange}
              placeholder="Add description"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {mode === "edit" && (
            <Button 
              variant="destructive" 
              onClick={() => onDelete(formState.id)}
              className="flex gap-1 items-center"
            >
              <Trash size={16} /> Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function getCategoryColor(category: EventCategory): string {
  switch (category) {
    case "blue": return "#4285F4";
    case "green": return "#0F9D58";
    case "yellow": return "#F4B400";
    case "red": return "#DB4437";
    case "purple": return "#9E69AF";
    default: return "#4285F4";
  }
}

export default EventModal;
