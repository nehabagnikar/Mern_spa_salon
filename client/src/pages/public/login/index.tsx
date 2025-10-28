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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "@/constants";
import Cookies from "js-cookie";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "owner"]),
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user", // Default role can be set to "user" or "admin"
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
       const response = await axios.post(`${backendUrl}/users/login`, values);
       
      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      const { data } = response.data;
      Cookies.set("token", data);
      Cookies.set("role", response.data.role);
      toast.success("Login successful!");
      navigate(`/${response.data.role}/dashboard`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An error occurred while logging in"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="h-screen flex items-center justify-center bg-primary">
      <div className="bg-white rounded p-5 flex flex-col gap-3 border w-[500px]">
        <h1 className="text-primary text-xl font-bold uppercase">
          Login to Your Account
        </h1>
        <hr className="border-gray-300" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      defaultValue={field.value}
                      className="flex flex-row gap-7"
                    >
                      {["user", "owner"].map((role) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value={role} />
                          </FormControl>
                          <FormLabel className="uppercase font-semibold">
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
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary underline font-semibold"
                >
                  Register
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

export default LoginPage;
