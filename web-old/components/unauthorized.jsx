"use client";

import { Card } from "@/components/ui/card";
import { usePathname, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
export const UnauthorizedCard = () => {
  const path = usePathname();
  return (
    <Card className="p-6 shadow-lg text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Unauthorized</h2>
      <p className="text-gray-600 mt-2">
        You must be logged in to view this page.
      </p>
      <Button
        variant="primary"
        onClick={() => redirect("/login?redirectTo=" + path)}
        className="mt-4"
      >
        Go to Login
      </Button>
    </Card>
  );
};
