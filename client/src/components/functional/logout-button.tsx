import Cookies from "js-cookie";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      Cookies.remove("token"); // Remove the token cookie
      Cookies.remove("role"); // Remove the user cookie
      toast.success("Logged out successfully.");
      navigate("/login"); // Redirect to the login page
    } catch (error: any) {
      toast.error(error.message || "An error occurred while logging out.");
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}

export default LogoutButton;
