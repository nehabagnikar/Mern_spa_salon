export interface IUser{
_id ?: string;
name : string;
email : string;
role : 'user' | 'owner';
createdAdt ?: string;
updateAdt ?: string;
}
export interface ISalon {
  _id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  minimumServicePrice: number;
  maximumServicePrice: number;
  offerStatus: "active" | "inactive";
  workingDays: string[];
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  slotDuration: number; // in minutes
  maxBookingsPerSlot: number;
  locationInMap: any;
  owner?: IUser;
  isActive ?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface IAppointment {
  _id: string;
  user: IUser;
  salon: ISalon;
  date: string; // ISO date string
  time: string; // Time in HH:mm format
  status : 'booked' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt?: string;
}