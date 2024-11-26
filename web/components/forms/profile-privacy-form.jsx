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
import { useState, useTransition } from "react";
import { UpdateProfilePrivacy } from "@/actions/profile";
import { useRouter } from "next/navigation";

// Dynamically import the Markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function ProfilePrivacyForm({ profile, privacy }) {
  const [profileState, setProfileState] = useState(profile);
  const [privacyState, setPrivacyState] = useState(
    privacy.reduce((p, c) => {
      p[c.attribute] = c.visibility;
      return p;
    }, {})
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { bio, address, phone } = profileState;

  const saveChanges = () => {
    startTransition(async () => {
      try {
        await UpdateProfilePrivacy(profileState, privacyState);
        router.refresh();
      } catch (error) {
        console.error("Error updating profile", error);
        //toast error
      }
    });
    console.log({ profileState, privacyState });
  };

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
            <Label className="text-md font-semibold">Phone</Label>
            <Input
              value={phone}
              onChange={(e) =>
                setProfileState({ ...profileState, phone: e.target.value })
              }
              placeholder={`Enter your phone number`}
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              onValueChange={(v) =>
                setPrivacyState({ ...privacyState, phone: v })
              }
              value={privacyState.phone}
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
              value={address}
              onChange={(e) =>
                setProfileState({ ...profileState, address: e.target.value })
              }
              placeholder={`Enter your location`}
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              onValueChange={(v) =>
                setPrivacyState({ ...privacyState, address: v })
              }
              value={privacyState.address}
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
              onChange={(c) => setProfileState({ ...profileState, bio: c })}
              height={400}
              placeholder="Write your bio in Markdown..."
            />
          </div>
          <div className="items-end justify-center h-full flex">
            <ToggleGroup
              type="single"
              variant="outline"
              onValueChange={(v) =>
                setPrivacyState({ ...privacyState, bio: v })
              }
              value={privacyState.bio}
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
