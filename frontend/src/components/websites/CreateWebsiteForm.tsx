"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { DomainInput } from "./DomainInput";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateWebsiteFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateWebsiteForm({
  onClose,
  onSuccess,
}: CreateWebsiteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const domain = formData.get("domain") as string;

    const promise = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}websites/create`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, domain }),
      }
    );

    toast.promise(promise, {
      loading: 'Creating website...',
      success: (response) => {
        mutate(`${process.env.NEXT_PUBLIC_API_URL}websites/list`);
        onSuccess?.();
        onClose();
        return 'Website created successfully';
      },
      error: (err) => {
        setError(err instanceof Error ? err.message : "An error occurred");
        return 'Failed to create website';
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
            placeholder="My Online Store"
            required
            disabled={isLoading}
          />
        </div>
        <DomainInput
          disabled={isLoading}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Website"
          )}
        </Button>
      </div>
    </form>
  );
}
