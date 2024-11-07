"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { UnauthorizedCard } from "@/components/unauthorized";

import { ErrorCard } from "@/components/error";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  if (error === "Access denied")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ErrorCard reset={reset} message={error.message} />
    </div>
  );
}
