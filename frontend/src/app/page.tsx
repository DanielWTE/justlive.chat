"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MessageSquare,
  Globe,
  Zap,
  Code,
  Smile,
  ArrowRight,
  Palette,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";

export default function Home() {
  const { user, isLoading } = useSession();
  const isLoggedIn = !!user && !isLoading;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">justlive.chat</span>
          </Link>
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button asChild>
                <Link href="/app">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-background to-muted/30 pt-24 w-full">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-[64rem] text-center space-y-8">
              <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm mb-4">
                <span className="font-medium">100% Free & Unbranded</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Connect with your website visitors in real-time
              </h1>
              <p className="mx-auto max-w-[42rem] text-muted-foreground text-lg sm:text-xl">
                Add a beautiful chat widget to your website in minutes. Engage
                with your visitors, answer questions, and provide support - all
                completely free and without any branding.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isLoggedIn ? (
                  <Button size="lg" asChild className="gap-2">
                    <Link href="/app">
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" asChild className="gap-2">
                    <Link href="/signup">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">See Features</Link>
                </Button>
              </div>
              <div className="mt-12 relative mx-auto max-w-4xl">
                <div className="aspect-video overflow-hidden rounded-xl border shadow-xl">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full flex items-center justify-center">
                    <div className="bg-white/5 rounded-lg p-6 w-3/4 h-3/4 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-8 w-32 bg-white/10 rounded"></div>
                        <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="h-12 w-3/4 bg-white/10 rounded-lg mb-3 ml-auto"></div>
                        <div className="h-12 w-2/3 bg-white/10 rounded-lg mb-3"></div>
                        <div className="h-12 w-3/4 bg-white/10 rounded-lg mb-3 ml-auto"></div>
                      </div>
                      <div className="h-10 bg-white/10 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything you need, completely free
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                justlive.chat provides all the essential features you need to
                connect with your website visitors, without any hidden costs or
                limitations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-muted/30 p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
                <p className="text-muted-foreground">
                  Engage with your visitors in real-time with instant messaging.
                  See when they're typing and respond immediately.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Multiple Websites
                </h3>
                <p className="text-muted-foreground">
                  Add the chat widget to multiple websites and manage all
                  conversations from a single dashboard.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
                <p className="text-muted-foreground">
                  Add the chat widget to your website with a simple code
                  snippet. No technical knowledge required.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
                <p className="text-muted-foreground">
                  Our chat widget is designed to look great on any website with
                  a modern, clean interface your visitors will love.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Smile className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Visitor Information
                </h3>
                <p className="text-muted-foreground">
                  See when visitors are online and collect basic information to
                  provide better support.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Branding</h3>
                <p className="text-muted-foreground">
                  Unlike other services, our chat widget is completely
                  unbranded. Your visitors will never see our logo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-muted/30 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get started with justlive.chat in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-muted-foreground">
                  Sign up for a free account in seconds. No credit card
                  required.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Add Your Website</h3>
                <p className="text-muted-foreground">
                  Enter your website details and get a unique embed code.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Chatting</h3>
                <p className="text-muted-foreground">
                  Add the code to your website and start engaging with visitors.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              {isLoggedIn ? (
                <Button size="lg" asChild>
                  <Link href="/app">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started Now</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Customization Section */}
        <section className="py-24 bg-background w-full">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Customize to match your brand
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Make the chat widget your own with extensive customization
                  options. Change colors, position, and appearance to perfectly
                  match your website's design.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Multiple color themes and presets</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Adjustable widget position and size</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Custom welcome messages and chat bubbles</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Light and dark mode support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  {isLoggedIn ? (
                    <Button asChild>
                      <Link href="/app">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/signup">Start Customizing</Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="bg-muted/30 rounded-xl p-6 border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-lg bg-blue-500/30 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="aspect-square rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-lg bg-purple-500/30 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="aspect-square rounded-lg bg-green-500/20 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-lg bg-green-500/30 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="aspect-square rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-lg bg-amber-500/30 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to know about justlive.chat
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Is justlive.chat really free?
                </h3>
                <p className="text-muted-foreground">
                  Yes, justlive.chat is completely free to use. There are no
                  hidden fees, no credit card required, and no limitations on
                  usage.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  How many websites can I add?
                </h3>
                <p className="text-muted-foreground">
                  You can add as many websites as you want to your account.
                  There's no limit on the number of websites you can manage.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Will there be any branding on the chat widget?
                </h3>
                <p className="text-muted-foreground">
                  No, the chat widget is completely unbranded. Your visitors
                  will never see our logo or any mention of justlive.chat.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Can I customize the appearance of the chat widget?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can customize the colors and appearance of the chat
                  widget to match your website's design with multiple themes and
                  style options.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  How do I get notified of new messages?
                </h3>
                <p className="text-muted-foreground">
                  You'll receive real-time notifications in the dashboard when
                  you're online. We're working on email notifications for when
                  you're offline.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MessageSquare className="h-5 w-5" />
              <span className="text-lg font-bold">justlive.chat</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign Up
              </Link>
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} justlive.chat. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
