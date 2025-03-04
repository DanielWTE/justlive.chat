"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  MessageSquare,
  Menu,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const mainNavItems = [
  {
    title: "Overview",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Websites",
    href: "/app/websites",
    icon: Globe,
  },
  {
    title: "Chat",
    href: "/app/chat",
    icon: MessageSquare,
  },
];

const accountNavItems = [
  {
    title: "Settings",
    href: "/app/settings",
    icon: Settings,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout, isAuthenticated, isSessionExpired } =
    useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mounted && !isLoading && (!isAuthenticated || isSessionExpired)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isSessionExpired, router, mounted]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isSessionExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 py-2">
        <div className="flex items-center px-4 mb-6">
          <h2 className="text-xl font-bold">JustLive.Chat</h2>
        </div>

        <div className="mb-6">
          <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main
          </h3>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </h3>
          <div className="space-y-1">
            {accountNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto px-3 py-2">
        <Separator className="my-4" />
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="" alt={user?.email || ""} />
              <AvatarFallback>
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none max-w-[150px] truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground max-w-[150px] truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed left-4 top-4 z-40"
            size="sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle />
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-8 md:mt-0">{children}</main>
    </div>
  );
}
