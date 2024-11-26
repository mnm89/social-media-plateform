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
import { useEffect, useState } from "react";

export default function PublicIdentityForm() {
  const { currentUser } = useAuth();
  const [firstName, setFirstName] = useState();
  const [lastName, setLatName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.given_name);
      setLatName(currentUser.family_name);
      setUsername(currentUser.preferred_username);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

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
        <Button className="mt-4" variant="primary">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
