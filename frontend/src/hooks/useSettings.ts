import { useState } from "react";
import { useProfile } from "./useProfile";
import { UpdateNameFormData, UpdateEmailFormData, UpdatePasswordFormData } from "@/schemas/settings";
import { useSession } from "./useSession";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useSettings() {
  const { profile, mutate: refreshProfile } = useProfile();
  const { mutate: refreshSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateName = async (data: UpdateNameFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${API_URL}users/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to update name");
        return false;
      }
      
      await refreshProfile();
      await refreshSession();
      setSuccess("Name updated successfully");
      return true;
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = async (data: UpdateEmailFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${API_URL}users/update-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to update email");
        return false;
      }
      
      await refreshProfile();
      await refreshSession();
      setSuccess("Email updated successfully");
      return true;
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${API_URL}users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to update password");
        return false;
      }
      
      setSuccess("Password updated successfully");
      return true;
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile: profile?.data,
    isLoading,
    error,
    success,
    updateName,
    updateEmail,
    updatePassword,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    }
  };
} 