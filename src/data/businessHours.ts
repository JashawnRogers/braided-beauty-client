export const DAYS_OF_WEEK = [
  { id: "SUNDAY", name: "Sunday" },
  { id: "MONDAY", name: "Monday" },
  { id: "TUESDAY", name: "Tuesday" },
  { id: "WEDNESDAY", name: "Wednesday" },
  { id: "THURSDAY", name: "Thursday" },
  { id: "FRIDAY", name: "Friday" },
  { id: "SATURDAY", name: "Saturday" },
];

export const CLOSED_CHOICES = [
  { id: false, name: "Open" },
  { id: true, name: "Closed" },
];

export const TIME_MENU_PROPS = {
  PaperProps: {
    sx: { maxHeight: 320, overflowY: "auto" },
  },
};

export const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v == "" ? msg : undefined;

export const validateTimes = (values: any) => {
  const errors: Record<string, string> = {};
  if (!values.isClosed) {
    if (!values.openTime) errors.openTime = "Required";
    if (!values.closeTime) errors.closeTime = "Required";
    if (
      values.openTime &&
      values.closeTime &&
      values.openTime >= values.closeTime
    ) {
      errors.closeTime = "Close time must be after open time";
    }
  }
  return errors;
};

const START = "06:00";
const END = "22:00";
const STEPMINUTES = 30;

export const buildTimeChoices = () => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const toLabel = (hour: number, minute: number) => {
    const hr12 = ((hour + 11) % 12) + 1;
    const amOrpm = hour < 12 ? "AM" : "PM";
    return `${hr12}:${pad(minute)} ${amOrpm}`;
  };

  const choices: { id: string; name: string }[] = [];
  const [startHour, startMinute] = START.split(":").map(Number);
  const [endHour, endMinute] = END.split(":").map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  for (let i = startTotal; i <= endTotal; i += STEPMINUTES) {
    const hour = Math.floor(i / 60);
    const minute = i % 60;
    // ids include seconds to match API "HH:mm:ss"
    choices.push({
      id: `${pad(hour)}:${pad(minute)}:00`,
      name: toLabel(hour, minute),
    });
  }
  return choices;
};

export const normalizeTime = (hhmmss?: string | null) => {
  if (!hhmmss) return "-";
  const [hour, minute] = hhmmss.split(":").map(Number);
  const hr12 = ((hour + 11) % 12) + 1;
  const amOrpm = hour < 12 ? "AM" : "PM";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${hr12}:${pad(minute)} ${amOrpm}`;
};

export const normalizeDays = (day: string) => {
  let normalizedDay = null;
  if (day == "SUNDAY") {
    normalizedDay = "Sunday";
  } else if (day == "MONDAY") {
    normalizedDay = "Monday";
  } else if (day == "TUESDAY") {
    normalizedDay = "Tuesday";
  } else if (day == "WEDNESDAY") {
    normalizedDay = "Wednesday";
  } else if (day == "THURSDAY") {
    normalizedDay = "Thursday";
  } else if (day == "FRIDAY") {
    normalizedDay = "Friday";
  } else if (day == "SATURDAY") {
    normalizedDay = "Saturday";
  } else {
    return normalizedDay;
  }
  return normalizedDay;
};

export const normalizeIsClosed = (value: boolean) => {
  let response;
  if (value) {
    response = "Closed";
  } else {
    response = "Open";
  }
  return response;
};
