'use client';

import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Calendar, Globe, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useWebsites } from "@/hooks/useWebsites";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useActiveChatSessions } from "@/hooks/useActiveChatSessions";

export default function DashboardPage() {
  const { user } = useSession();
  const { profile, loading } = useProfile();
  const { websites, isLoading: websitesLoading } = useWebsites();
  const { activeSessionsCount, loading: chatsLoading } = useActiveChatSessions();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {profile?.data.name || user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/app/settings">
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{websitesLoading ? "..." : websites.length}</div>
                <p className="text-xs text-muted-foreground">
                  {websitesLoading ? "Loading..." : websites.length === 0 ? "No websites yet" : "Active websites"}
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/app/websites">
                  <Button variant="ghost" size="sm" className="w-full">
                    <span>Manage Websites</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatsLoading ? "..." : activeSessionsCount}</div>
                <p className="text-xs text-muted-foreground">
                  {chatsLoading ? "Loading..." : activeSessionsCount === 0 ? "No active chats" : "Ongoing conversations"}
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/app/chat">
                  <Button variant="ghost" size="sm" className="w-full">
                    <span>View Chats</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.data.createdAt
                    ? new Date(profile.data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.data.createdAt
                    ? `Joined ${new Date(profile.data.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    : "Join date unavailable"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{profile?.data.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{profile?.data.name || "No name set"}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{profile?.data.name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.data.createdAt
                        ? new Date(profile.data.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/app/settings" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Settings
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Websites</CardTitle>
                <CardDescription>Your connected websites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {websitesLoading ? (
                    <div className="flex items-center justify-center h-[100px]">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : websites.length > 0 ? (
                    <div className="space-y-3">
                      {websites.slice(0, 3).map((website) => (
                        <div key={website.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{website.name}</p>
                            <p className="text-xs text-muted-foreground">{website.domain}</p>
                          </div>
                          <Badge variant="secondary">
                            Active
                          </Badge>
                        </div>
                      ))}
                      {websites.length > 3 && (
                        <p className="text-xs text-center text-muted-foreground">
                          +{websites.length - 3} more websites
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-4">No websites connected yet</p>
                      <Link href="/app/websites">
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Website
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
              {websites.length > 0 && (
                <CardFooter>
                  <Link href="/app/websites" className="w-full">
                    <Button variant="outline" className="w-full">
                      <span>View All Websites</span>
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 