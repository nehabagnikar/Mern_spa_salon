import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl, salonsFilterOptions } from "@/constants";
import type { ISalon } from "@/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationSelection from "@/components/functional/location-selection";
import { calculateDistanceBetweenTwoLocation } from "@/utils";
axios.defaults.withCredentials = true;
function UserSalonsPage() {
  const [allSalons, setAllSalons] = useState<ISalon[]>([]);
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [currentLocation, setCurrentLocation] = useState<any>();
  const navigate = useNavigate();

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/salons/get-all-salons`);
      if (response.data.success) {
        setSalons(response.data.data);
        setAllSalons(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch salons");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  const onFilterChange = (type: string) => {
    try {
      let filterdedData = [...allSalons];
      if (type === "offers") {
        filterdedData = filterdedData.filter(
          (salon) => salon.offerStatus === "active"
        );
      }

      if (type === "premium") {
        filterdedData = filterdedData.sort((a, b) => {
          return b.minimumServicePrice - a.minimumServicePrice;
        });
      }

      if (type === "nearby") {
        filterdedData = filterdedData.sort((a, b) => {
          return (
            calculateDistanceBetweenTwoLocation({
              location1: a.locationInMap,
              location2: currentLocation,
            }) -
            calculateDistanceBetweenTwoLocation({
              location1: b.locationInMap,
              location2: currentLocation,
            })
          );
        });
      }

      setSalons(filterdedData);
    } catch (error: any) {
      toast.error(error?.message || "Failed to filter salons");
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end">
        <PageTitle title="Available Salons" />

        <div>
          <h1 className="text-sm text-primary">Filter</h1>
          <Select
            onValueChange={(e) => {
              if (e === "nearby" && !currentLocation) {
                toast.error("Please select a location first.");
                setFilterType("all");
                return;
              }
              setFilterType(e);
              onFilterChange(e);
            }}
            defaultValue={filterType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>

            <SelectContent>
              {salonsFilterOptions.map((type: any) => (
                <SelectItem value={type.value} key={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <LocationSelection
        selectedLocationObject={currentLocation}
        setSelectedLocationObject={setCurrentLocation}
        hideMap
      />

      {loading && <Spinner />}

      {!loading && salons.length === 0 && (
        <InfoMessage message="No salons available at the moment." />
      )}

      {!loading && salons.length > 0 && (
        <div className="flex flex-col gap-6">
          {salons.map((salon) => (
            <div
              key={salon._id}
              onClick={() =>
                navigate(`/user/salons/book-appointment/${salon._id}`)
              }
              className="flex flex-col gap-2 border border-gray-400 p-5 rounded cursor-pointer hover:border-primary"
            >
              <div>
                <h1 className="text-sm font-bold">{salon.name}</h1>
                <p className="text-gray-600 text-xs mt-1">
                  {salon.address}, {salon.city}, {salon.state}, {salon.zip}
                </p>
              </div>

              <h1 className="text-xs font-bold text-primary">
                Minimum Service Cost: ${salon.minimumServicePrice}
              </h1>

              {filterType === "nearby" && currentLocation && (
                <h1 className="text-xs font-bold text-primary">
                  Distance from you:{" "}
                  {calculateDistanceBetweenTwoLocation({
                    location1: salon.locationInMap,
                    location2: currentLocation,
                  }) || 0}{" "}
                  km
                </h1>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserSalonsPage;
