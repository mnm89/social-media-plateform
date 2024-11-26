"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth-provider";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UpdatePublicIdentity } from "@/actions/profile";

export default function PublicIdentityForm() {
  const { currentUser } = useAuth();
  const [firstName, setFirstName] = useState(currentUser?.given_name);
  const [lastName, setLatName] = useState(currentUser?.family_name);
  const [username, setUsername] = useState(currentUser?.preferred_username);
  const [email, setEmail] = useState(currentUser?.email);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const saveChanges = () => {
    startTransition(async () => {
      try {
        await UpdatePublicIdentity({
          firstName,
          lastName,
          username,
          email,
        });
        router.refresh();
      } catch (error) {
        console.error("Error updating identity", error);
        //toast error
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-medium">Public Identity</h2>
        <p className="text-sm text-gray-500">
          These information can be accessed publicly
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label htmlFor="name">Username / Author name</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label className="text-md font-semibold">Given Name</Label>
            <Input
              value={firstName}
              placeholder={`Enter your given name`}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-md font-semibold">Family Name</Label>
            <Input
              value={lastName}
              placeholder={`Enter your family name`}
              onChange={(e) => setLatName(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          className="mt-4"
          variant="primary"
          onClick={saveChanges}
          disabled={isPending}
        >
          {isPending ? "Saving changes ..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
