import dayjs from "dayjs";
import haversine from "haversine-distance";

export const getDateTimeFormat = (date: Date | string) => {
  return dayjs(date).format("MMM DD, YYYY hh:mm A");
};

export const getTimeFormat = (time: string) => {
  return dayjs(`${dayjs().format("YYYY-MM-DD")} ${time}`).format("hh:mm A");
};

export const calculateDistanceBetweenTwoLocation = ({
  location1,
  location2,
}: {
  location1: { lat: number; lon: number };
  location2: { lat: number; lon: number };
}) => {
  if (!location1 || !location2) return 0;
  const distance = haversine(
    {
      latitude: location1.lat,
      longitude: location1.lon,
    },
    {
      latitude: location2.lat,
      longitude: location2.lon,
    }
  );

  // convert distance to kilometers
  const distanceInKm = distance / 1000;
  // round to 2 decimal places
  return Math.round(distanceInKm * 100) / 100;
};
