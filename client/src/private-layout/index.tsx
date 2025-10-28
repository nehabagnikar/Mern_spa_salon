import { backendUrl } from "@/constants";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Spinner from "@/components/ui/spinner";
import Header from "./header";
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { setUser } = usersGlobalStore() as IUsersStore;
  const navigate = useNavigate();
  const getUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/users/get-logged-in-user`
      );
      if (response.status === 200) {
        setUser(response.data.data);
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while fetching user data."
      );
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (Cookies.get("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <div>
      <Header />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
