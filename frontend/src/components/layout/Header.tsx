"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";

export function Header() {
  const { user, isLoading } = useSession();
  const isLoggedIn = !!user && !isLoading;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xl font-bold">justlive.chat</span>
        </Link>
        <nav className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Button asChild>
              <Link href="/app">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 