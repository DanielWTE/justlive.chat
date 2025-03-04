'use client';

import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { UpdateNameForm } from "@/components/settings/UpdateNameForm";
import { UpdateEmailForm } from "@/components/settings/UpdateEmailForm";
import { UpdatePasswordForm } from "@/components/settings/UpdatePasswordForm";

export default function SettingsPage() {
  const { user } = useSession();
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Password</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateNameForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Change your email address. You'll need to verify your current password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateEmailForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password. You'll need to verify your current password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdatePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 