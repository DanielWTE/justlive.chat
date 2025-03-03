'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Website } from '@/types/website';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { mutate } from 'swr';
import { DomainInput } from './DomainInput';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WebsiteDetailsProps {
  website: Website;
  onClose: () => void;
}

export function WebsiteDetails({ website, onClose }: WebsiteDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;

    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}websites/${website.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, domain }),
    });

    toast.promise(promise, {
      loading: 'Saving changes...',
      success: (response) => {
        mutate(`${process.env.NEXT_PUBLIC_API_URL}websites/list`);
        onClose();
        return 'Website updated successfully';
      },
      error: (err) => {
        setError(err instanceof Error ? err.message : "An error occurred");
        return 'Failed to update website';
      },
      finally: () => {
        setIsLoading(false);
      }
    });
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}websites/${website.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    toast.promise(promise, {
      loading: 'Deleting website...',
      success: (response) => {
        mutate(`${process.env.NEXT_PUBLIC_API_URL}websites/list`);
        onClose();
        return 'Website deleted successfully';
      },
      error: (err) => {
        setError(err instanceof Error ? err.message : "An error occurred");
        return 'Failed to delete website';
      },
      finally: () => {
        setIsLoading(false);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Website Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={website.name}
            required
            disabled={isLoading}
          />
        </div>
        <DomainInput
          defaultValue={website.domain}
          disabled={isLoading}
          required
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  website and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
} 