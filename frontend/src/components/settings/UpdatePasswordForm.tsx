"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updatePasswordSchema, type UpdatePasswordFormData } from "@/schemas/settings";
import { useSettings } from "@/hooks/useSettings";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UpdatePasswordForm() {
  const { isLoading, error, success, updatePassword, clearMessages } = useSettings();
  
  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: UpdatePasswordFormData) {
    const success = await updatePassword(data);
    if (success) {
      form.reset();
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 text-green-800 border border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    {...field} 
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    onChange={(e) => {
                      clearMessages();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    {...field} 
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    onChange={(e) => {
                      clearMessages();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    {...field} 
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    onChange={(e) => {
                      clearMessages();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 