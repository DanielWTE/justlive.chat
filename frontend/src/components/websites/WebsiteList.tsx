"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Code,
  Copy,
  Globe,
  ExternalLink,
  Settings,
  Loader2,
} from "lucide-react";
import { Website } from "@/types/website";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface WebsiteListProps {
  websites: Website[];
  onSettingsClick: (websiteId: string) => void;
  onCopyEmbedCode: (code: string) => void;
  onCustomizeClick: (websiteId: string) => void;
}

export function WebsiteList({
  websites,
  onSettingsClick,
  onCopyEmbedCode,
  onCustomizeClick,
}: WebsiteListProps) {
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const handleCopyClick = async (websiteId: string, code: string) => {
    setCopyingId(websiteId);
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Embed code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy embed code");
    } finally {
      setCopyingId(null);
    }
  };

  if (websites.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle>No websites yet</CardTitle>
          <CardDescription>
            Add your first website to get started with JustLive.Chat
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Website
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {websites.map((website) => (
        <Card key={website.id} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center text-lg">
                  <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                  {website.name}
                </CardTitle>
                <CardDescription>
                  <a
                    href={`https://${website.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline"
                  >
                    {website.domain}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSettingsClick(website.id)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Embed Code</label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    value={`<script src="${process.env.NEXT_PUBLIC_EMBED_URL}?id=${website.id}"></script>`}
                    className="pr-10 font-mono text-sm bg-muted"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      handleCopyClick(
                        website.id,
                        `<script src="${process.env.NEXT_PUBLIC_EMBED_URL}?id=${website.id}"></script>`
                      )
                    }
                  >
                    {copyingId === website.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCustomizeClick(website.id)}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Added {new Date(website.createdAt).toLocaleDateString()}
              </span>
              <span>0 conversations this month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
