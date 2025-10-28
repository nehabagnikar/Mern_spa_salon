import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/spinner";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get("token")) {
      const role = Cookies.get("role");
      navigate(`/${role}/dashboard`);
    }
    setLoading(false);
  }, []);
  if (loading) {
    return <Spinner />;
  }
  return <div>{children}</div>;
}

export default PublicLayout;
