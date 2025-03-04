import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | justlive.chat",
  description: "Terms of Service for justlive.chat - Read our terms and conditions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 pt-24 md:pt-32 md:py-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to justlive.chat. These Terms of Service ("Terms") govern your use of our website and services.
            By accessing or using justlive.chat, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Service Usage</h2>
          <p>
            Our service allows you to add a chat widget to your website to communicate with your visitors. You are responsible for all chat communications that occur through your account.
          </p>
          <p>
            You agree not to use the service:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>In any way that violates any applicable national or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation</li>
            <li>To impersonate or attempt to impersonate justlive.chat, a justlive.chat employee, another user, or any other person or entity</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service, or which may harm justlive.chat or users of the service</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of justlive.chat and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of justlive.chat.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
          <p>
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post on or through the service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting Content on or through the service, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms</li>
            <li>The posting of your Content on or through the service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Privacy</h2>
          <p>
            justlive.chat takes the privacy of its users seriously. We store data but do not sell it or share it with third parties. Please refer to our Privacy Policy for more information on how we collect, use, and protect your data.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service or contact us to request account deletion.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p>
            In no event shall justlive.chat, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>Your access to or use of or inability to access or use the service</li>
            <li>Any conduct or content of any third party on the service</li>
            <li>Any content obtained from the service</li>
            <li>Unauthorized access, use or alteration of your transmissions or content</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimer</h2>
          <p>
            Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Germany, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>By email: support@justlive.chat</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 