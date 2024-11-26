"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { ChangePassword } from "@/actions/profile";
import { useAuth } from "@/components/auth-provider";

const formSchema = z.object({
  currentPassword: z.string().min(6).max(10),
  newPassword: z.string().min(6).max(10),
});

export default function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const { currentUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  function onSubmit(values) {
    startTransition(async () => {
      try {
        await ChangePassword(values);
        //toast success
      } catch (err) {
        console.error("Error updating password", err);
        // toast error
      }
      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input
          type="text"
          autoComplete="username"
          name="username"
          value={currentUser?.preferred_username}
          readOnly
          aria-hidden="true"
          className="hidden"
        />
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-medium">Change Password</h2>
            <p className="text-sm text-gray-500">Update your password</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
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
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="New Password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Button
              className="mt-4"
              variant="primary"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Updating password ..." : "Update Password"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
