export type Facility = {
  _id: string;
  name: string;
  sportType: string;
  location: string;
  capacity: number;
  hourlyRate: number;
};

export type Booking = {
  _id: string;
  facility: Facility;
  user: { _id: string; name: string; email: string; tel: string };
  bookingDate: string;
  startTime: string;
  durationHours: number;
  startMinutes: number;
  endMinutes: number;
};

export type BusySlot = {
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
};
