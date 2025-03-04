import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-xl font-bold">justlive.chat</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Live chat solution for your website. Connect with your visitors in
              real-time.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} justlive.chat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
