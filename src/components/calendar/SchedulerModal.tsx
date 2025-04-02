
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NylasScheduler } from "@nylas/react";
import { Event } from "@/types/Event";

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (start: Date, end: Date) => void;
}

const SchedulerModal = ({ isOpen, onClose, onSchedule }: SchedulerModalProps) => {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem("nylasApiKey") || ""
  );

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    localStorage.setItem("nylasApiKey", value);
  };

  const handleScheduleSuccess = (data: any) => {
    if (data.event) {
      const start = new Date(data.event.start_time * 1000);
      const end = new Date(data.event.end_time * 1000);
      onSchedule(start, end);
    }
  };

  if (!apiKey) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Nylas API Key Required</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please enter your Nylas API key to use the scheduler component.
            </p>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Nylas API Key"
              value={apiKey}
              onChange={handleApiKeyChange}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[80vh]">
        <div className="h-full">
          <NylasScheduler
            apiKey={apiKey}
            onSuccess={handleScheduleSuccess}
            theme={{
              palette: {
                primary: {
                  main: "#4285F4",
                },
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulerModal;
