"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WebsiteList } from "@/components/websites/WebsiteList";
import { CreateWebsiteForm } from "@/components/websites/CreateWebsiteForm";
import { WebsiteDetails } from "@/components/websites/WebsiteDetails";
import { useWebsites } from "@/hooks/useWebsites";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { WebsiteListSkeleton } from "@/components/websites/WebsiteListSkeleton";

export default function WebsitesPage() {
  const { websites, isLoading, isError } = useWebsites();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(
    null
  );

  const handleCopyEmbedCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: Add toast notification
  };

  const selectedWebsite = websites.find((w) => w.id === selectedWebsiteId);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Websites</h2>
          <p className="text-muted-foreground">
            Manage your websites and get embed codes
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Website
        </Button>
      </div>

      {isLoading ? (
        <WebsiteListSkeleton />
      ) : isError ? (
        <div className="flex items-center justify-center h-[200px] text-destructive">
          Error loading websites
        </div>
      ) : (
        <WebsiteList
          websites={websites}
          onSettingsClick={setSelectedWebsiteId}
          onCopyEmbedCode={handleCopyEmbedCode}
          onCustomizeClick={(e) => {
            if (e === "add") {
              setShowCreateDialog(true);
            }
          }}
        />
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogTitle />
          <CreateWebsiteForm onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedWebsiteId}
        onOpenChange={() => setSelectedWebsiteId(null)}
      >
        <DialogContent>
          {selectedWebsite && (
            <>
              <DialogTitle>Website Settings</DialogTitle>
              <WebsiteDetails
                website={selectedWebsite}
                onClose={() => setSelectedWebsiteId(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
