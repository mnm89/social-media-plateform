"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/actions/auth";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const { access_token, refresh_token } = await loginAction(
          username,
          password
        );
        Cookies.set("access_token", access_token);
        Cookies.set("refresh_token", refresh_token);
        window.location.href = searchParams.has("redirectTo")
          ? searchParams.get("redirectTo")
          : "/account-settings";
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Welcome Back
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Please log in to your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
