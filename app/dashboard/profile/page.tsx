import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/services/user";
import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Profile Settings - Reflection Scrap Solutions LLP",
  description: "Update your name, contact phone number, and profile settings.",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-brand-dark">
          Profile Settings
        </h2>
        <p className="text-xs text-brand-muted">
          Manage your personal information and verified communication channels.
        </p>
      </div>

      <ProfileClient user={user} />
    </div>
  );
}

