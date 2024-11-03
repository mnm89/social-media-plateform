"use client";

import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
export const UnauthorizedCard = () => {
  return (
    <Card className="p-6 shadow-lg text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Unauthorized</h2>
      <p className="text-gray-600 mt-2">
        You must be logged in to view this page.
      </p>
      <Button
        variant="primary"
        onClick={() => redirect("/login")}
        className="mt-4"
      >
        Go to Login
      </Button>
    </Card>
  );
};
