"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { useSession } from "@/hooks/useSession";

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/app");
    }
  }, [isLoading, isAuthenticated, router]);

  // Immer das Formular anzeigen, Weiterleitung passiert im Hintergrund
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Get started for free</h1>
        <p className="text-muted-foreground">Create your account in seconds</p>
      </div>
      <SignupForm />
    </div>
  );
} 