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
  Copy,
  Globe,
  ExternalLink,
  Settings,
  Loader2,
  ChevronDown,
  ChevronUp,
  Palette,
  MessageSquare,
  Info,
} from "lucide-react";
import { Website } from "@/types/website";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebsiteListProps {
  websites: Website[];
  onSettingsClick: (websiteId: string) => void;
  onCopyEmbedCode: (code: string) => void;
  onCustomizeClick: (websiteId: string) => void;
}

// Color presets available in the embed script
const COLOR_PRESETS = [
  { value: "blue", label: "Blue", color: "#1E88E5" },
  { value: "green", label: "Green", color: "#43A047" },
  { value: "purple", label: "Purple", color: "#9C27B0" },
  { value: "red", label: "Red", color: "#E53935" },
  { value: "orange", label: "Orange", color: "#F57C00" },
  { value: "dark", label: "Dark", color: "#111827" },
];

// Languages available in the embed script
const LANGUAGES = [
  { value: "auto", label: "Auto (Browser Default)" },
  { value: "en", label: "English" },
  { value: "de", label: "German (Deutsch)" },
];

interface EmbedCustomizerProps {
  websiteId: string;
  onCopyEmbedCode: (code: string) => void;
}

function EmbedCustomizer({ websiteId, onCopyEmbedCode }: EmbedCustomizerProps) {
  const [colorPreset, setColorPreset] = useState("blue");
  const [language, setLanguage] = useState("auto");
  const [debug, setDebug] = useState(false);
  const [copying, setCopying] = useState(false);
  const [activeTab, setActiveTab] = useState("customize");
  const [useDefer, setUseDefer] = useState(false);
  const [useAsync, setUseAsync] = useState(false);

  // Generate the embed code with the selected options
  const generateEmbedCode = () => {
    let embedUrl = `${process.env.NEXT_PUBLIC_EMBED_URL}?id=${websiteId}`;

    if (colorPreset !== "blue") {
      embedUrl += `&colorPreset=${colorPreset}`;
    }

    if (language !== "auto") {
      embedUrl += `&language=${language}`;
    }

    if (debug) {
      embedUrl += `&debug=true`;
    }

    let scriptTag = `<script src="${embedUrl}"`;

    if (useDefer) {
      scriptTag += " defer";
    }

    if (useAsync) {
      scriptTag += " async";
    }

    scriptTag += "></script>";

    return scriptTag;
  };

  const handleCopyClick = async () => {
    setCopying(true);
    try {
      const code = generateEmbedCode();
      await navigator.clipboard.writeText(code);
      onCopyEmbedCode(code);
      toast.success("Customized embed code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy embed code");
    } finally {
      setCopying(false);
    }
  };

  // Preview color for the selected preset
  const selectedColor =
    COLOR_PRESETS.find((p) => p.value === colorPreset)?.color || "#1E88E5";

  // Chat widget preview styles based on selected options
  const chatPreviewStyles = {
    chatButton: {
      backgroundColor: selectedColor,
      color: "white",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      position: "relative" as const,
    },
    pulseEffect: {
      position: "absolute" as const,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "pulse 2s infinite",
      backgroundColor: `${selectedColor}40`, // 25% opacity
      zIndex: -1,
    },
    chatWindow: {
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      overflow: "hidden",
      width: "300px",
      height: "400px",
      display: "flex",
      flexDirection: "column" as const,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      marginBottom: "16px",
    },
    chatHeader: {
      backgroundColor: selectedColor,
      color: "white",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    chatBody: {
      padding: "16px",
      flexGrow: 1,
      backgroundColor: "#f8fafc",
      overflowY: "auto" as const,
    },
    chatFooter: {
      borderTop: "1px solid #e2e8f0",
      padding: "12px 16px",
      backgroundColor: "white",
      display: "flex",
    },
    chatInput: {
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "8px 16px",
      flexGrow: 1,
      marginRight: "8px",
      fontSize: "14px",
    },
    chatSendButton: {
      backgroundColor: selectedColor,
      color: "white",
      border: "none",
      borderRadius: "8px",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    message: {
      padding: "8px 12px",
      borderRadius: "12px",
      maxWidth: "80%",
      marginBottom: "8px",
      fontSize: "14px",
    },
    userMessage: {
      backgroundColor: selectedColor,
      color: "white",
      alignSelf: "flex-end",
      marginLeft: "auto",
    },
    agentMessage: {
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      alignSelf: "flex-start",
    },
  };

  return (
    <div className="space-y-3 pt-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="customize" className="text-xs">
            Customize
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs">
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customize" className="space-y-3 pt-3">
          {/* Main options in a compact grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left column - Color and Language */}
            <div className="space-y-3">
              {/* Color Theme */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1">
                  <Label
                    htmlFor={`color-preset-${websiteId}`}
                    className="text-xs"
                  >
                    Color Theme
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="w-[180px] text-xs">
                          Choose a color theme for your chat widget.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={colorPreset} onValueChange={setColorPreset}>
                  <SelectTrigger
                    id={`color-preset-${websiteId}`}
                    className="w-full h-8 text-xs"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-1.5"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <SelectValue placeholder="Select color" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_PRESETS.map((preset) => (
                      <SelectItem
                        key={preset.value}
                        value={preset.value}
                        className="text-xs"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-1.5"
                            style={{ backgroundColor: preset.color }}
                          />
                          {preset.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1">
                  <Label htmlFor={`language-${websiteId}`} className="text-xs">
                    Language
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="w-[180px] text-xs">
                          Set the default language for the chat widget.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    id={`language-${websiteId}`}
                    className="w-full h-8 text-xs"
                  >
                    <SelectValue placeholder="Auto (Browser Default)" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem
                        key={lang.value}
                        value={lang.value}
                        className="text-xs"
                      >
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right column - Debug and Loading options */}
            <div className="space-y-3">
              {/* Debug Mode */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1">
                  <Label
                    htmlFor={`debug-mode-${websiteId}`}
                    className="text-xs"
                  >
                    Debug Mode
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="w-[180px] text-xs">
                          Enable debug mode to see detailed logs in the browser
                          console.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`debug-mode-${websiteId}`}
                    checked={debug}
                    onCheckedChange={setDebug}
                    className="scale-75 data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={`debug-mode-${websiteId}`}
                    className="text-xs"
                  >
                    {debug ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>

              {/* Loading Optimization */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1">
                  <Label className="text-xs">Loading Options</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="w-[180px] text-xs">
                          Choose how the script loads to optimize page
                          performance.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`defer-${websiteId}`}
                      checked={useDefer}
                      onCheckedChange={(checked) => {
                        setUseDefer(checked);
                        if (checked) setUseAsync(false);
                      }}
                      className="scale-75 data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor={`defer-${websiteId}`} className="text-xs">
                      Use defer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`async-${websiteId}`}
                      checked={useAsync}
                      onCheckedChange={(checked) => {
                        setUseAsync(checked);
                        if (checked) setUseDefer(false);
                      }}
                      className="scale-75 data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor={`async-${websiteId}`} className="text-xs">
                      Use async
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code sections */}
          <div className="space-y-3">
            {/* Embed Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Embed Code</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyClick}
                  className="h-6 text-xs px-2"
                >
                  {copying ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
              <div className="relative">
                <Input
                  readOnly
                  value={generateEmbedCode()}
                  className="pr-8 font-mono text-xs bg-muted h-8"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="pt-3">
          <div className="flex flex-col items-center">
            {/* Chat Window Preview - Smaller version */}
            <div
              style={{
                ...chatPreviewStyles.chatWindow,
                width: "240px",
                height: "320px",
                marginBottom: "12px",
              }}
            >
              <div style={chatPreviewStyles.chatHeader}>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">
                    {language === "de" ? "Chat mit uns" : "Chat with us"}
                  </span>
                </div>
                <div className="flex items-center">
                  {/* Burger menu */}
                  <div className="mr-2 cursor-pointer">
                    <div className="flex flex-col justify-between h-3 w-4">
                      <span className="bg-white h-0.5 w-full rounded-sm"></span>
                      <span className="bg-white h-0.5 w-full rounded-sm"></span>
                      <span className="bg-white h-0.5 w-full rounded-sm"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={chatPreviewStyles.chatBody}>
                <div className="flex flex-col">
                  <div
                    style={{
                      ...chatPreviewStyles.message,
                      ...chatPreviewStyles.agentMessage,
                      fontSize: "11px",
                    }}
                  >
                    {language === "de"
                      ? "Hallo! Wie kann ich Ihnen heute helfen?"
                      : "Hello! How can I help you today?"}
                  </div>
                  <div
                    style={{
                      ...chatPreviewStyles.message,
                      ...chatPreviewStyles.userMessage,
                      fontSize: "11px",
                    }}
                  >
                    {language === "de"
                      ? "Ich habe eine Frage zu meiner Bestellung"
                      : "I have a question about my order"}
                  </div>
                  <div
                    style={{
                      ...chatPreviewStyles.message,
                      ...chatPreviewStyles.agentMessage,
                      fontSize: "11px",
                    }}
                  >
                    {language === "de"
                      ? "Natürlich! Können Sie mir bitte Ihre Bestellnummer mitteilen?"
                      : "Of course! Could you please provide your order number?"}
                  </div>
                </div>
              </div>
              <div style={chatPreviewStyles.chatFooter}>
                <input
                  style={{ ...chatPreviewStyles.chatInput, fontSize: "11px" }}
                  placeholder={
                    language === "de"
                      ? "Nachricht eingeben..."
                      : "Type a message..."
                  }
                  readOnly
                />
                <button
                  style={{
                    ...chatPreviewStyles.chatSendButton,
                    width: "32px",
                    height: "28px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Button Preview - Smaller version */}
            <div
              style={{
                ...chatPreviewStyles.chatButton,
                width: "48px",
                height: "48px",
              }}
            >
              <div style={chatPreviewStyles.pulseEffect}></div>
              <MessageSquare className="h-5 w-5" />
            </div>

            <style jsx global>{`
              @keyframes pulse {
                0% {
                  transform: scale(1);
                  opacity: 0.7;
                }
                70% {
                  transform: scale(1.5);
                  opacity: 0;
                }
                100% {
                  transform: scale(1.5);
                  opacity: 0;
                }
              }
            `}</style>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Preview of your chat widget with selected options
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function WebsiteList({
  websites,
  onSettingsClick,
  onCopyEmbedCode,
  onCustomizeClick,
}: WebsiteListProps) {
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [expandedCustomizers, setExpandedCustomizers] = useState<
    Record<string, boolean>
  >({});

  const handleCopyClick = async (websiteId: string, code: string) => {
    setCopyingId(websiteId);
    try {
      await navigator.clipboard.writeText(code);
      onCopyEmbedCode(code);
      toast.success("Embed code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy embed code");
    } finally {
      setCopyingId(null);
    }
  };

  const toggleCustomizer = (websiteId: string) => {
    setExpandedCustomizers((prev) => ({
      ...prev,
      [websiteId]: !prev[websiteId],
    }));
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
          <Button onClick={() => onCustomizeClick("add")}>
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
              </div>
            </div>

            <div>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex justify-between items-center"
                onClick={() => toggleCustomizer(website.id)}
              >
                <span className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Customize Widget
                </span>
                {expandedCustomizers[website.id] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {expandedCustomizers[website.id] && (
                <>
                  <Separator className="my-4" />
                  <EmbedCustomizer
                    websiteId={website.id}
                    onCopyEmbedCode={onCopyEmbedCode}
                  />
                </>
              )}
            </div>

            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Added {new Date(website.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
