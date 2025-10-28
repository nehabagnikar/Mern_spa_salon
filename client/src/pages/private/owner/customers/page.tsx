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
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { IUser } from "@/interfaces";

function Customers() {
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/appointments/get-unique-customers`
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setCustomers(response.data.data);
    } catch (error: any) {
      setCustomers([]);
      toast.error(
        error?.response?.data?.message || "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = ["Id", "Name", "Email"];
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Customers" />

      {loading && <Spinner />}

      {!loading && customers.length === 0 && (
        <InfoMessage message="No customers found." />
      )}

      {!loading && customers.length > 0 && (
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
            {customers.map((item: IUser) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item._id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="font-medium">{item.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Customers;
