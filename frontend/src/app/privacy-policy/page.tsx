import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | justlive.chat",
  description: "Privacy Policy for justlive.chat - Learn how we handle your data",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 pt-24 md:pt-32 md:py-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to justlive.chat. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
            <li><strong>Chat Data</strong> includes the content of chat messages sent through our platform.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
          <p>
            We use your data to provide and improve our services. By using justlive.chat, you agree to the collection and use of information in accordance with this policy. <strong>justlive.chat stores data but does not sell it or share it with third parties.</strong>
          </p>
          <p>
            We may use your data for the following purposes:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Storage and Security</h2>
          <p>
            The security of your data is important to us. We strive to use commercially acceptable means to protect your personal data, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>
          <p>
            Your data is stored on secure servers and we implement appropriate technical and organizational measures to protect your data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We will retain your personal data only for as long as is necessary for the purposes set out in this privacy policy. We will retain and use your personal data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Data Protection Rights</h2>
          <p>
            You have the following data protection rights:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>The right to access, update or delete the information we have on you</li>
            <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
            <li>The right to object - the right to object to our processing of your personal data</li>
            <li>The right of restriction - the right to request that we restrict the processing of your personal data</li>
            <li>The right to data portability - the right to be provided with a copy of the data we have on you in a structured, machine-readable format</li>
            <li>The right to withdraw consent - the right to withdraw your consent at any time where we relied on your consent to process your personal information</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used.
          </p>
          <p>
            These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
          <p>
            Our service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
          <p>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
          </p>
          <p>
            You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us:
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