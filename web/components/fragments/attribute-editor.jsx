"use client";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function ProfileAttributeEditor({ attribute, value, initialVisibility }) {
  const [attributeValue, setAttributeValue] = useState(value);
  const [visibility, setVisibility] = useState(initialVisibility);
  const [isPending, startTransition] = useTransition();

  async function handleSave() {}

  return (
    <div className="flex flex-col p-4">
      <div>
        <Label className="text-md font-semibold">
          {attribute.toUpperCase()}
        </Label>
        <Input
          value={attributeValue}
          onChange={(e) => setAttributeValue(e.target.value)}
          placeholder={`Enter ${attribute}`}
        />
      </div>

      <div className="flex space-x-2 mt-2">
        <Label>Visibility</Label>
        {["public", "private", "friends-only"].map((option) => (
          <Button
            key={option}
            variant={visibility === option ? "default" : "outline"}
            onClick={() => setVisibility(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Button>
        ))}
      </div>

      <Button onClick={handleSave} disabled={isPending} variant="primary">
        {isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

export default ProfileAttributeEditor;
