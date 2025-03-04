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
import { updateNameSchema, type UpdateNameFormData } from "@/schemas/settings";
import { useSettings } from "@/hooks/useSettings";
import { useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UpdateNameForm() {
  const { profile, isLoading, error, success, updateName, clearMessages } = useSettings();
  
  const form = useForm<UpdateNameFormData>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: profile?.name || "",
    },
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile?.name) {
      form.setValue("name", profile.name);
    }
  }, [profile, form]);

  async function onSubmit(data: UpdateNameFormData) {
    await updateName(data);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your name" 
                    {...field} 
                    autoComplete="name"
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
            {isLoading ? "Updating..." : "Update Name"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 