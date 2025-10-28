import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "@/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["user", "owner"]),
});

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "user",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      // ✅ FIXED: use /api/users/register
      const response = await axios.post(`${backendUrl}/api/users/register`, values);

      if (response.data.success) {
        toast.success("Registration successful! Please login.");
        form.reset();
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "An error occurred while registering";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-primary">
      <div className="bg-white rounded p-5 flex flex-col gap-3 border w-[500px]">
        <h1 className="text-primary text-xl font-bold uppercase">
          Register a New Account
        </h1>
        <hr className="border-gray-300" />

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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value} // ✅ use `value` instead of `defaultValue`
                      className="flex flex-row gap-7"
                    >
                      {["user", "owner"].map((role) => (
                        <FormItem key={role} className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value={role} id={role} />
                          </FormControl>
                          <FormLabel htmlFor={role} className="uppercase font-semibold">
                            {role}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <h1 className="flex gap-5 text-sm text-primary items-center font-semibold">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary underline font-semibold"
                >
                  Login
                </Link>
              </h1>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
