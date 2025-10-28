import { Button } from "@/components/ui/button";
import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import type { ISalon } from "@/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDateTimeFormat } from "@/utils";
import { Edit2, Trash2 } from "lucide-react";

axios.defaults.withCredentials = true;

function OwnerSalonsPage() {
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/salons/get-salons-by-owner`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setSalons(response.data.data);
    } catch (error: any) {
      setSalons([]);
      toast.error(error?.response?.data?.message || "Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (salonId: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${backendUrl}/salons/delete-salon-by-id/${salonId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Salon deleted successfully");
      setSalons((prevSalons) => prevSalons.filter((s) => s._id !== salonId));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete salon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    "Name",
    "City",
    "State",
    "Zip",
    "Minimum Service Price",
    "Maximum Service Price",
    "Offer Status",
    "Created At",
    "Actions",
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <PageTitle title="My Salons" />
        <Button>
          <Link to={"/owner/salons/add"}>Register new salon</Link>
        </Button>
      </div>

      {loading && <Spinner />}

      {!loading && salons.length === 0 && (
        <InfoMessage message="You have not registered any salon yet. Please register a new salon." />
      )}

      {!loading && salons.length > 0 && (
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
            {salons.map((salon) => (
              <TableRow key={salon._id}>
                <TableCell className="font-medium">{salon.name}</TableCell>
                <TableCell>{salon.city}</TableCell>
                <TableCell>{salon.state}</TableCell>
                <TableCell>{salon.zip}</TableCell>
                <TableCell>$ {salon.minimumServicePrice}</TableCell>
                <TableCell>$ {salon.maximumServicePrice}</TableCell>
                <TableCell>
                  {salon.offerStatus === "active" ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>{getDateTimeFormat(salon.createdAt!)}</TableCell>
                <TableCell>
                  <div className="flex gap-5">
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() =>
                        navigate(`/owner/salons/edit/${salon._id}`)
                      }
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => handleDelete(salon._id!)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default OwnerSalonsPage;

