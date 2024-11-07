"use client";

import { Card } from "@/components/ui/card";
import {} from "next/navigation";

import { Button } from "@/components/ui/button";
export const ErrorCard = ({ message, reset }) => {
  return (
    <Card className="p-6 shadow-lg text-center">
      <h2 className="text-2xl font-semibold text-gray-800">
        Something went wrong!
      </h2>
      {message.includes("<!DOCTYPE html>") ? (
        <div dangerouslySetInnerHTML={{ __html: message }}></div>
      ) : (
        <p className="text-gray-600 mt-2">{message}</p>
      )}
      <p className="text-gray-600 mt-2">Please try again or reload the page</p>
      <div className="flex justify-between">
        <Button variant="primary" onClick={() => reset()} className="mt-4">
          Try again
        </Button>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          reload
        </Button>
      </div>
    </Card>
  );
};
