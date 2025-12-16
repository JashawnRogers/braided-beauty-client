import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

export type TimeSlot = { time: string; available: boolean };

type BookingCalendarProps = {
  date: Date;
  onDateChange: (d: Date) => void;
  time: string | null;
  onTimeChange: (t: string | null) => void;
  timeSlots: TimeSlot[];
  minDate?: Date;
};

function normalizeCalendarDate(d: Date) {
  const copy = new Date(d);
  copy.setHours(12, 0, 0, 0); // noon local time avoids DST/offset rollbacks
  return copy;
}

function formatTime12h(time24: string): string {
  const [hourStr, minute] = time24.split(":");
  let hour = Number(hourStr);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
}

export default function BookingCalendar({
  date,
  onDateChange,
  time,
  onTimeChange,
  timeSlots,
  minDate = new Date(),
}: BookingCalendarProps) {
  return (
    <div>
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                onDateChange(normalizeCalendarDate(newDate));
                onTimeChange(null);
              }
            }}
            className="p-2 sm:pe-5"
            disabled={[
              { before: normalizeCalendarDate(minDate) }, // Dates before today
            ]}
          />
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        variant={time === timeSlot ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => onTimeChange(timeSlot)}
                        disabled={!available}
                      >
                        {formatTime12h(timeSlot)}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
