'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Code, Copy, Globe, ExternalLink } from "lucide-react";

interface Website {
  id: string;
  name: string;
  domain: string;
  embedCode: string;
  createdAt: string;
}

// Example data - will be replaced with real data later
const exampleWebsites: Website[] = [
  {
    id: "1",
    name: "My Online Store",
    domain: "mystore.com",
    embedCode: '<script src="https://justlive.chat/embed.js?id=xyz123"></script>',
    createdAt: "2024-03-01",
  },
];

export default function WebsitesPage() {
  const copyEmbedCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: Add toast notification
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Websites</h2>
          <p className="text-muted-foreground">
            Manage your websites and get embed codes
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Website
        </Button>
      </div>

      {exampleWebsites.length > 0 ? (
        <div className="grid gap-4">
          {exampleWebsites.map((website) => (
            <Card key={website.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
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
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Embed Code</label>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        readOnly
                        value={website.embedCode}
                        className="pr-24 font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => copyEmbedCode(website.embedCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="sm" variant="outline">
                      <Code className="mr-2 h-4 w-4" />
                      Customize
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Added on {new Date(website.createdAt).toLocaleDateString()}</span>
                  <span>0 conversations this month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No websites yet</CardTitle>
            <CardDescription>
              Add your first website to get started with JustLive.Chat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Website
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 