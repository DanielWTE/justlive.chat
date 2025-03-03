'use client';

import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Plus, User, Calendar, BarChart3, Globe, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useWebsites } from "@/hooks/useWebsites";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { user } = useSession();
  const { profile, loading } = useProfile();
  const { websites, isLoading: websitesLoading } = useWebsites();

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
            Welcome back, {profile?.name || user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Ongoing conversations
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
                <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateProfileCompletion(profile)}%</div>
                <Progress 
                  value={calculateProfileCompletion(profile)} 
                  className="h-2 mt-2" 
                />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  <span>Complete Profile</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.createdAt
                    ? `Joined ${new Date(profile.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
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
                    <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name || user?.email || ""} />
                    <AvatarFallback>{profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{profile?.name || "No name set"}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {profile?.name && <Badge variant="outline" className="mt-1">Verified</Badge>}
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{profile?.name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bio</p>
                    <p className="text-sm text-muted-foreground">{profile?.bio || "No bio added yet"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile Details
                </Button>
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
        
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Chat Statistics</CardTitle>
                <CardDescription>Your chat activity overview</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Statistics will appear here as you use the chat feature</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Website Traffic</CardTitle>
                <CardDescription>Visitor statistics</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Traffic data will appear here as your websites receive visitors</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User interaction data</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Engagement metrics will appear here as users interact with your chat</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function calculateProfileCompletion(profile: any) {
  if (!profile) return 0;
  
  const fields = ['name', 'bio', 'avatarUrl'];
  const completedFields = fields.filter(field => !!profile[field]);
  return Math.round((completedFields.length / fields.length) * 100);
} 