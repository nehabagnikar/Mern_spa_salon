import PageTitle from "@/components/ui/page-title";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InfoMessage from "@/components/ui/info-message";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import { getDateTimeFormat, getTimeFormat } from "@/utils";
import axios from "axios";
import type { IAppointment } from "@/interfaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SalonsFilter from "@/components/functional/salons-filter";

axios.defaults.withCredentials = true;

function SalonOwnerAppointments() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedsalonId, setSelectedSalonId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filtersCleared, setFiltersCleared] = useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/appointments/get-appointments-by-owner?salonId=${selectedsalonId}&date=${selectedDate}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setAppointments(response.data.data);
    } catch (error: any) {
      setAppointments([]);
      toast.error(error?.response?.data?.message || "Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendUrl}/appointments/update-appointment/${appointmentId}`,
        {
          status: newStatus,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Appointment cancelled successfully");

      const updatedAppointments: any[] = appointments.map((item) =>
        item._id === appointmentId ? { ...item, status: "cancelled" } : item
      );
      setAppointments(updatedAppointments);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to cancel appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (filtersCleared) {
      getData();
      setFiltersCleared(false);
    }
  }, [filtersCleared]);

  const columns = [
    "Appointment ID",
    "Salon Name",
    "Customer Name",
    "Date",
    "Time",
    "Status",
    "Booked At",
    "Status Update",
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <PageTitle title="My Appointments" />
      </div>

      <SalonsFilter
        selectedsalonId={selectedsalonId}
        setSelectedSalonId={setSelectedSalonId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onFilter={getData}
        onResetFilters={() => {
          setSelectedSalonId("");
          setSelectedDate("");
          setFiltersCleared(true);
        }}
      />

      {loading && <Spinner />}

      {!loading && appointments.length === 0 && (
        <InfoMessage
          message={
            selectedsalonId || selectedDate
              ? "No appointments found for the selected filters."
              : "No appointments found"
          }
        />
      )}

      {!loading && appointments.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="text-left font-bold text-primary"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((item: IAppointment) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item._id}</TableCell>
                <TableCell className="font-medium">
                  {item.salon?.name || "N/A"}
                </TableCell>
                <TableCell className="font-medium">
                  {item.user?.name || "N/A"}
                </TableCell>

                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell className="font-medium">
                  {getTimeFormat(item.time)}
                </TableCell>
                <TableCell className="font-medium">{item.status}</TableCell>
                <TableCell className="font-medium">
                  {getDateTimeFormat(item.createdAt)}
                </TableCell>
                <TableCell className="font-medium">
                  <Select
                    onValueChange={(value) =>
                      handleStatusChange(item._id, value)
                    }
                    defaultValue={item.status}
                    disabled={
                      item.status === "completed" || item.status === "cancelled"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>

                    <SelectContent>
                      {["booked", "cancelled", "completed"].map((status) => (
                        <SelectItem value={status} key={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default SalonOwnerAppointments;
