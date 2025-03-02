import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Authentication - JustLive.Chat",
  description: "Login or sign up to JustLive.Chat",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const testimonials = [
    {
      text: "JustLive.Chat transformed how we interact with our community. The real-time support has increased our customer satisfaction by 85%.",
      author: "Sarah Johnson",
      role: "Community Manager",
      company: "TechCorp Inc.",
      avatar: "SJ"
    },
    {
      text: "Setting up took less than 5 minutes. The interface is intuitive, and our support team loves how easy it is to manage multiple conversations.",
      author: "Michael Chen",
      role: "Tech Lead",
      company: "StartupHub",
      avatar: "MC"
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left side - Testimonials */}
      <div className="hidden lg:flex lg:w-1/2 bg-black p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.8),rgba(0,0,0,0.9))]" />
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to justlive.chat</h1>
            <p className="text-lg text-gray-300">Join thousands of businesses providing excellent customer support.</p>
          </div>
          
          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:border-white/20 text-white"
              >
                <div className="flex items-start gap-4 p-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg mb-4">{testimonial.text}</p>
                    <div>
                      <p className="font-medium text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-300">{testimonial.role}</p>
                      <p className="text-sm text-gray-400">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md p-6">
          {children}
        </Card>
      </div>
    </div>
  );
} 