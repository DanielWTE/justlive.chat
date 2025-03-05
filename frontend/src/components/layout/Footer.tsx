import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-2 space-y-3 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-lg font-bold md:text-xl">justlive.chat</span>
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground">
              Live chat solution for your website. Connect with your visitors in
              real-time.
            </p>
          </div>

          <div>
            <h3 className="mb-2 md:mb-4 text-sm font-medium">Product</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
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
            <h3 className="mb-2 md:mb-4 text-sm font-medium">Legal</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
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

        <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6 text-center text-xs md:text-sm text-muted-foreground">
          <p>© {currentYear} justlive.chat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
