import { cookies } from "next/headers";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UnauthorizedCard } from "@/components/unauthorized";

export default async function ProtectedPage() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }

  // Render protected content

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>

      {/* Profile Information Section */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-medium">Profile Information</h2>
          <p className="text-sm text-gray-500">Update your profile details</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Your Name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Button className="mt-4" variant="primary">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-medium">Change Password</h2>
          <p className="text-sm text-gray-500">Update your password</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Current Password"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="New Password"
            />
          </div>
          <Button className="mt-4" variant="primary">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences Section */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-medium">Notification Preferences</h2>
          <p className="text-sm text-gray-500">Manage your notifications</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch id="emailNotifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="smsNotifications">SMS Notifications</Label>
            <Switch id="smsNotifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNotifications">Push Notifications</Label>
            <Switch id="pushNotifications" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
