"use client";

import { useLanguage } from "@/components/language-provider";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

export function IdCard() {
  const { t } = useLanguage();
  const { user } = useAuthStore();

  const membershipId = user?.id.substring(0, 8).toUpperCase() || "N/A";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform hover:scale-105">
      <div className="flex items-center space-x-4">
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={user?.avatarUrl || "/default-avatar.png"}
            alt="Profile Photo"
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user?.fullName || "Anonymous"}</h2>
          <p className="text-sm text-gray-500">USG India Member</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">{t.dashboard.membershipId}</span>
          <span className="text-sm font-mono text-gray-800">{membershipId}</span>
        </div>
        {/* Note: Additional fields like university/college should be added to the User store if needed */}
      </div>
      <div className="mt-6 flex items-center justify-center rounded-lg bg-green-100 px-4 py-2">
        <span className="text-sm font-semibold text-green-800">{t.dashboard.active} / {t.dashboard.verified}</span>
      </div>
    </div>
  );
}
