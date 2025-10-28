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

axios.defaults.withCredentials = true;

function UserAppointmentsPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/appointments/get-appointments-by-user`
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

  const handleCancel = async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendUrl}/appointments/update-appointment/${appointmentId}`,
        {
          status: "cancelled",
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

  const columns = [
    "Appointment ID",
    "Salon Name",
    "Date",
    "Time",
    "Status",
    "Booked At",
    "Actions",
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <PageTitle title="My Appointments" />
      </div>

      {loading && <Spinner />}

      {!loading && appointments.length === 0 && (
        <InfoMessage message="You have no appointments yet." />
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
                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell className="font-medium">
                  {getTimeFormat(item.time)}
                </TableCell>
                <TableCell className="font-medium">{item.status}</TableCell>
                <TableCell className="font-medium">
                  {getDateTimeFormat(item.createdAt)}
                </TableCell>
                <TableCell className="font-medium">
                  {item.status === "booked" && (
                    <h1
                      className="text-sm underline cursor-pointer"
                      onClick={() => handleCancel(item._id!)}
                    >
                      Cancel
                    </h1>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default UserAppointmentsPage;
