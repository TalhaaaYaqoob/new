'use client'

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export function ProtectedComponent() {
  const { isLoaded, userId } = useAuth();
  
  if (!isLoaded) return null;
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      {/* Protected content */}
    </div>
  );
}