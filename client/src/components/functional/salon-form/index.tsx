import type { ISalon } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { backendUrl, daysList } from "@/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import { useNavigate } from "react-router-dom";
import LocationSelection from "../location-selection";

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  minimumServicePrice: z
    .number()
    .min(0, "Minimum service price must be at least 0"),
  maximumServicePrice: z
    .number()
    .min(0, "Maximum service price must be at least 0"),
  offerStatus: z.enum(["active", "inactive"]),
  workingDays: z.array(z.string()),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  breakStartTime: z.string().optional(),
  breakEndTime: z.string().optional(),
  slotDuration: z.number().min(1, "Slot duration must be at least 1 minute"),
  maxBookingsPerSlot: z
    .number()
    .min(1, "Maximum bookings per slot must be at least 1"),
  locationInMap: z.object({}).optional(),
  isActive: z.boolean().optional(),
});

function SalonForm({
  formType,
  initialValues,
}: {
  formType: "add" | "edit";
  initialValues?: Partial<ISalon>;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = usersGlobalStore() as IUsersStore;
  const [selectedLocationObject, setSelectedLocationObject] = useState<any>(
    initialValues?.locationInMap || {}
  );
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      address: initialValues?.address || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      zip: initialValues?.zip || "",

      minimumServicePrice: initialValues?.minimumServicePrice || 0,
      maximumServicePrice: initialValues?.maximumServicePrice || 0,
      offerStatus: initialValues?.offerStatus || "active",
      workingDays: initialValues?.workingDays || [],
      startTime: initialValues?.startTime || "",
      endTime: initialValues?.endTime || "",
      breakStartTime: initialValues?.breakStartTime || "",
      breakEndTime: initialValues?.breakEndTime || "",
      slotDuration: initialValues?.slotDuration || 30,
      maxBookingsPerSlot: initialValues?.maxBookingsPerSlot || 1,
      locationInMap: initialValues?.locationInMap || {},
      isActive: initialValues?.isActive || true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const payload = {
        ...values,
        locationInMap: selectedLocationObject,
        owner: user?._id,
      };
      let response = null;
      if (formType === "add") {
        response = await axios.post(
          `${backendUrl}/salons/create-salon`,
          payload
        );
      } else {
        response = await axios.put(
          `${backendUrl}/salons/update-salon-by-id/${initialValues?._id}`,
          payload
        );
      }

      if (!response?.data.success) {
        throw new Error(response?.data.message || "Failed to create salon");
      }
      toast.success(
        formType === "add"
          ? "Salon created successfully!"
          : "Salon updated successfully!"
      );
      navigate("/owner/salons");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while submitting the form."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleDayChange = (day: string) => {
    let daysSelected = form.getValues("workingDays");
    if (daysSelected.includes(day)) {
      daysSelected = daysSelected.filter((d) => d !== day);
    } else {
      daysSelected.push(day);
    }
    form.setValue("workingDays", daysSelected);
  };

  useEffect(() => {
    console.log("Selected Location Object:", selectedLocationObject);
  }, [selectedLocationObject]);

  return (
    <div className="mt-7">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="address" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumServicePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Service price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximumServicePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Service price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offerStatus"
              render={({ field }) => (
                <FormItem className="select">
                  <FormLabel>Offer Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["active", "inactive"].map((status) => (
                        <SelectItem value={status} key={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border p-5">
            <h1 className="text-sm text-primary font-semibold">Working Days</h1>

            <div className="flex gap-7 mt-2">
              {daysList.map((day) => {
                const values = form.watch("workingDays");
                const isChecked = values.includes(day);
                return (
                  <div key={day} className="flex items-center gap-1">
                    <h1 className="capitalize text-sm">{day}</h1>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleDayChange(day)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-5 mt-5">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breakStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breakEndTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break End Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slotDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slot Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder=""
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxBookingsPerSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Bookings Per Slot</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder=""
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <LocationSelection
            selectedLocationObject={selectedLocationObject}
            setSelectedLocationObject={setSelectedLocationObject}
          />

          <div className="flex justify-end gap-5">
            <Button
              variant={"outline"}
              type="button"
              disabled={loading}
              onClick={() => navigate("/owner/salons")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white"
              disabled={loading}
            >
              {formType === "add" ? "Add Salon" : "Update Salon"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SalonForm;
