"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginAction } from "@/actions/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [globalError, setGlobalError] = useState(null);
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values) {
    startTransition(async () => {
      try {
        const { access_token, refresh_token } = await loginAction(
          values.username,
          values.password
        );
        Cookies.set("access_token", access_token);
        Cookies.set("refresh_token", refresh_token);
        window.location.href = searchParams.has("redirectTo")
          ? searchParams.get("redirectTo")
          : "/account-settings";
      } catch (err) {
        setGlobalError(err.message || "An unknown error occurred");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => setGlobalError(null)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username / Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  autoComplete="username"
                  {...field}
                />
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
                <PasswordInput
                  placeholder="Current Password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Log In"}
        </Button>
        {globalError && (
          <div className="text-red-500 text-sm font-medium">{globalError}</div>
        )}
      </form>
    </Form>
  );
}
