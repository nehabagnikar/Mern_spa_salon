import DashboardCard from "@/components/functional/dashboard-card";
import SalonsFilter from "@/components/functional/salons-filter";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

function OwnerDashboardPage() {
  const [selectedsalonId, setSelectedSalonId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filtersCleared, setFiltersCleared] = useState<boolean>(false);
  const { user } = usersGlobalStore() as IUsersStore;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    upcomingAppointments: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/dashboard/owner-appointments?salonId=${selectedsalonId}&date=${selectedDate}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch dashboard data."
        );
      }
      setData(response.data.data);
    } catch (error: any) {
      toast.error("Failed to fetch dashboard data." + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filtersCleared) {
      setSelectedSalonId("all");
      setSelectedDate("");
      fetchData();
      setFiltersCleared(false);
    }
  }, [filtersCleared]);

  if (!user) return <></>;
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Dashboard" />

      <SalonsFilter
        selectedsalonId={selectedsalonId}
        setSelectedSalonId={setSelectedSalonId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onFilter={fetchData}
        onResetFilters={() => setFiltersCleared(true)}
      />

      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardCard
            name="Total appointmemnts"
            value={data.totalAppointments}
            description="Total number of bookings made by the user."
          />

          <DashboardCard
            name="Completed appointmemnts"
            value={data.completedAppointments}
            description="Total number of bookings completed by the user."
          />

          <DashboardCard
            name="Cancelled appointmemnts"
            value={data.cancelledAppointments}
            description="Total number of bookings cancelled by the user."
          />

          <DashboardCard
            name="Upcoming appointmemnts"
            value={data.upcomingAppointments}
            description="Total number of bookings that are upcoming for the user."
          />
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default OwnerDashboardPage;
