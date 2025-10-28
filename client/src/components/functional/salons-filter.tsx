import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { backendUrl } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ISalon } from "@/interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
axios.defaults.withCredentials = true;

interface ISalonsFilterProps {
  selectedsalonId: string;
  setSelectedSalonId: (salonId: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onFilter: () => void;
  onResetFilters: () => void;
}

function SalonsFilter({
  selectedsalonId,
  setSelectedSalonId,
  selectedDate,
  setSelectedDate,
  onFilter,
  onResetFilters,
}: ISalonsFilterProps) {
  const [salons, setSalons] = useState<ISalon[]>([]);
  const getData = async () => {
    try {
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
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="grid grid-cols-4 gap-5 items-end">
      <div className="select">
        <h1 className="text-sm">Select salon</h1>
        <Select
          onValueChange={(value) => setSelectedSalonId(value)}
          defaultValue={selectedsalonId}
          value={selectedsalonId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a verified email to display" />
          </SelectTrigger>

          <SelectContent>
            {[{ name: "All", _id: "all" }, ...salons].map((item) => (
              <SelectItem value={item._id!} key={item._id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h1 className="text-sm">Select date</h1>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Button variant={"outline"} onClick={onResetFilters}>
          Cancel Filters
        </Button>
        <Button onClick={onFilter}>Apply Filters</Button>
      </div>
    </div>
  );
}

export default SalonsFilter;
