"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden relative" ref={menuRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="relative z-20"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile menu dropdown */}
      <div 
        className={cn(
          "absolute right-0 top-full mt-2 w-56 rounded-md border bg-background shadow-lg transition-all duration-200 ease-in-out",
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="p-4">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <Button 
                variant="default"
                size="sm"
                className="w-full justify-start" 
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link href="/app">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start" 
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full justify-start" 
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

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
        
        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-4">
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
        
        {/* Mobile Menu - Visible only on mobile */}
        <MobileMenu isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
} 