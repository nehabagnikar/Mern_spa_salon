import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import type { ISalon } from "@/interfaces";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import isBetween from "dayjs/plugin/isBetween";
// import isBetween from 'dayjs/plugin/isBetween' // ES 2015

dayjs.extend(isBetween);

import "react-datepicker/dist/react-datepicker.css";
import { getTimeFormat } from "@/utils";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";

function BookAppointmentPage() {
  const [salonData, setSalonData] = useState<ISalon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [bookingAppointment, setBookingAppointment] = useState<boolean>(false);
  const { user } = usersGlobalStore() as IUsersStore;
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/salons/get-salon-by-id/${params.id}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setSalonData(response.data.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch salon data"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/appointments/get-salon-availability`,
        {
          salonId: params.id,
          date,
          time,
        }
      );
      if (response.data.success) {
        setIsAvailable(response.data.success);
        setAvailableCount(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to check availability"
      );
    }
  };

  const bookAppointment = async () => {
    try {
      setBookingAppointment(true);
      const payload = {
        salon: salonData?._id,
        user: user?._id,
        owner: salonData?.owner,
        date,
        time,
        status: "booked",
      };
      const response = await axios.post(
        `${backendUrl}/appointments/book-appointment`,
        payload
      );
      if (response.data.success) {
        toast.success("Appointment booked successfully");
        navigate("/user/appointments");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setBookingAppointment(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, []);

  const renderSalonProperty = (label: string, value: string | number) => (
    <div className="flex justify-between items-center">
      <h1 className="text-sm text-gray-600">{label}</h1>
      <h1 className="text-sm font-semibold">{value}</h1>
    </div>
  );

  const timeslots = useMemo(() => {
    const tempTimeslots: { label: string; value: string }[] = [];
    if (date && salonData) {
      let startTime = dayjs(
        `${date} ${salonData?.startTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const endTime = dayjs(
        `${date} ${salonData?.endTime}`,
        "YYYY-MM-DD HH:mm"
      );

      const breakStartTime = dayjs(
        `${date} ${salonData?.breakStartTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const breakEndTime = dayjs(
        `${date} ${salonData?.breakEndTime}`,
        "YYYY-MM-DD HH:mm"
      );

      while (startTime.isBefore(endTime)) {
        if (
          !startTime.isBetween(breakStartTime, breakEndTime, null, "[]") ||
          startTime.isSame(breakEndTime)
        ) {
          tempTimeslots.push({
            label: startTime.format("h:mm A"),
            value: startTime.format("HH:mm"),
          });
        }
        startTime = startTime.add(salonData!.slotDuration!, "minute");
      }
    }

    return tempTimeslots;
  }, [salonData, date]);

  useEffect(() => {
    if (date && time) {
      setIsAvailable(false);
      setAvailableCount(0);
      checkAvailability();
    }
  }, [date, time]);

  return (
    <div>
      <PageTitle title="Book Appointment" />

      {loading && <Spinner />}

      {!loading && !salonData && <InfoMessage message="Salon not found" />}

      {salonData && (
        <div className="grid grid-cols-3 gap-7 mt-5">
          <div className="col-span-2 flex flex-col gap-2 p-5 border border-gray-400 rounded">
            {renderSalonProperty("Name", salonData.name)}
            {renderSalonProperty("Address", salonData.address)}
            {renderSalonProperty("City", salonData.city)}
            {renderSalonProperty("State", salonData.state)}
            {renderSalonProperty("Zip Code", salonData.zip)}
            {renderSalonProperty(
              "Minimum Service Price",
              "$" + salonData.minimumServicePrice
            )}
            {renderSalonProperty(
              "Maximum Service Price",
              "$" + salonData.maximumServicePrice
            )}
            {renderSalonProperty(
              "Working Days",
              salonData.workingDays.join(", ").toUpperCase()
            )}
            {renderSalonProperty(
              "Slot Duration",
              salonData.slotDuration + " min"
            )}
            {renderSalonProperty(
              "Start Time",
              getTimeFormat(salonData.startTime)
            )}
            {renderSalonProperty("End Time", getTimeFormat(salonData.endTime))}
            {renderSalonProperty(
              "Break Start Time",
              getTimeFormat(salonData.breakStartTime)
            )}
            {renderSalonProperty(
              "Break End Time",
              getTimeFormat(salonData.breakEndTime)
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-2 p-5 border border-gray-400 rounded h-max">
            <div className="flex flex-col gap-1">
              <label className="text-sm">Select date</label>
              <DatePicker
                selected={date ? new Date(date) : null}
                onChange={(date) => setDate(dayjs(date).format("YYYY-MM-DD"))}
                className="border border-gray-300 rounded p-2 w-full"
                filterDate={(date) => {
                  const today = dayjs().format("YYYY-MM-DD");
                  if (dayjs(date).isBefore(today)) {
                    return false; // Disable past dates
                  }

                  const day = dayjs(date).format("dddd").toLowerCase();
                  return salonData?.workingDays.includes(day);
                }}
              />
            </div>

            <div className="select">
              <label className="text-sm">Select time</label>
              <Select
                onValueChange={(e) => {
                  setTime(e);
                }}
                defaultValue={time}
                disabled={!salonData || !date}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>

                <SelectContent>
                  {timeslots.map((slot) => (
                    <SelectItem value={slot.value} key={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAvailable && (
              <div>
                <h1 className="text-sm font-bold text-green-700">
                  Total Available Slots: {availableCount}
                </h1>
              </div>
            )}

            <div className="grid grid-cols-2 gap-5 mt-7">
              <Button
                variant={"outline"}
                onClick={() => navigate("/user/salons")}
              >
                Cancel
              </Button>
              <Button
                disabled={!time || !date || !isAvailable || bookingAppointment}
                onClick={bookAppointment}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointmentPage;
