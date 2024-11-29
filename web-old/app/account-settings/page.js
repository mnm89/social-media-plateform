import { cookies } from "next/headers";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UnauthorizedCard } from "@/components/unauthorized";
import ProfilePrivacyForm from "@/components/forms/profile-privacy-form";
import { isTokenExpired } from "@/lib/token";
import { getCurrentProfile } from "@/lib/api";
import AvatarForm from "@/components/forms/avatar-form";
import PublicIdentityForm from "@/components/forms/public-identity-form";
import PasswordForm from "@/components/forms/password-form";

export default async function Page() {
  const token = (await cookies()).get("access_token")?.value;

  if (isTokenExpired(token)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }

  const { profile, privacy } = await getCurrentProfile(token);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>

      <AvatarForm currentAvatarUrl={profile.avatar} />

      {/* Public Identity Section */}
      <PublicIdentityForm />

      {/* Profile Privacy Section */}
      <ProfilePrivacyForm
        profile={privacy
          .map((p) => p.attribute)
          .reduce((p, c) => {
            p[c] = profile[c] ?? "";
            return p;
          }, {})}
        privacy={privacy}
      />

      {/* Password Section */}
      <PasswordForm />

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
