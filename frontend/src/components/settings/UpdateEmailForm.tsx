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
import { updateEmailSchema, type UpdateEmailFormData } from "@/schemas/settings";
import { useSettings } from "@/hooks/useSettings";
import { useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UpdateEmailForm() {
  const { profile, isLoading, error, success, updateEmail, clearMessages } = useSettings();
  
  const form = useForm<UpdateEmailFormData>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: profile?.email || "",
      currentPassword: "",
    },
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile?.email) {
      form.setValue("email", profile.email);
    }
  }, [profile, form]);

  async function onSubmit(data: UpdateEmailFormData) {
    await updateEmail(data);
    if (!error) {
      form.reset({ email: data.email, currentPassword: "" });
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    {...field} 
                    type="email"
                    autoComplete="email"
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 