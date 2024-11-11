"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroupItem, ToggleGroup } from "@/components/ui/toggle-group";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";

// Dynamically import the Markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function PrivacyCard({ profile, privacy }) {
  const { firstName, lastName, bio, address, phone } = profile;
  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-medium">Profile Privacy</h2>
        <p className="text-sm text-gray-500">
          You can configure the visibility of these attributes
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-md font-semibold">Given Name</Label>
            <Input
              value={firstName}
              onChange={(e) => {}}
              placeholder={`Enter your given name`}
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={
                privacy.find((p) => p.attribute === "firstName")?.visibility
              }
            >
              {["public", "private", "friends-only"].map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  aria-label={option}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-md font-semibold">Family Name</Label>
            <Input
              value={firstName}
              onChange={(e) => {}}
              placeholder={`Enter your family name`}
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={
                privacy.find((p) => p.attribute === "lastName")?.visibility
              }
            >
              {["public", "private", "friends-only"].map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  aria-label={option}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-md font-semibold">Phone</Label>
            <Input
              value={firstName}
              onChange={(e) => {}}
              placeholder={`Enter your phone number`}
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={
                privacy.find((p) => p.attribute === "phone")?.visibility
              }
            >
              {["public", "private", "friends-only"].map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  aria-label={option}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-md font-semibold">Location</Label>
            <Input
              value={firstName}
              onChange={(e) => {}}
              placeholder={`Enter your location`}
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={
                privacy.find((p) => p.attribute === "address")?.visibility
              }
            >
              {["public", "private", "friends-only"].map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  aria-label={option}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div>
            <Label className="text-md font-semibold">Bio</Label>
            <MDEditor
              value={bio}
              onChange={() => {}}
              height={400}
              placeholder="Write your bio in Markdown..."
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              defaultValue={
                privacy.find((p) => p.attribute === "bio")?.visibility
              }
            >
              {["public", "private", "friends-only"].map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  aria-label={option}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
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
