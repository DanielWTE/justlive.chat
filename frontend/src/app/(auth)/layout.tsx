import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication - justlive.chat",
  description: "Login or sign up to justlive.chat",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = [
    {
      title: "Real-time Chat",
      description: "Connect with your website visitors instantly. See when they're typing and respond immediately.",
      icon: "💬"
    },
    {
      title: "Easy Setup",
      description: "Add the chat widget to your website with a simple code snippet. No technical knowledge required.",
      icon: "🚀"
    },
    {
      title: "100% Free",
      description: "All features are completely free to use. No hidden fees, no credit card required.",
      icon: "✨"
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.8),rgba(0,0,0,0.9))]" />
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="mb-12">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <MessageSquare className="h-6 w-6" />
              <span className="text-xl font-bold">justlive.chat</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">Connect with your visitors in real-time</h1>
            <p className="text-lg text-gray-300">Add a beautiful chat widget to your website in minutes.</p>
          </div>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:border-white/20 text-white"
              >
                <div className="flex items-start gap-4 p-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex flex-col p-8 bg-background">
        <div className="lg:hidden flex items-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">justlive.chat</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md p-8 border shadow-sm">
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
} 