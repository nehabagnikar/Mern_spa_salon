export const backendUrl = import.meta.env.VITE_API_DOMAIN || "http://localhost:5001/api";

export const daysList = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const salonsFilterOptions = [
  { label: "All Salons", value: "all" },
  { label: "Nearby", value: "nearby" },
  { label: "Premium", value: "premium" },
  { label: "With Offers", value: "offers" },
];
