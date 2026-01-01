import { Navbar } from '@/components/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Introduction</h2>
              <p className="text-gray-700">
                Genie ("we", "our", or "us") is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, and safeguard your personal
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Information We Collect</h2>
              <ul className="list-disc space-y-2 text-gray-700">
                <li>Name, phone number, and location details</li>
                <li>Service provider information and photos</li>
                <li>Contact and booking history</li>
                <li>Reviews and ratings</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
              <ul className="list-disc space-y-2 text-gray-700">
                <li>To provide and improve our services</li>
                <li>To connect customers with service providers</li>
                <li>To verify provider identities</li>
                <li>To send important updates and notifications</li>
                <li>To analyze usage patterns and improve user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information.
                However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Your Rights</h2>
              <p className="text-gray-700">
                You have the right to access, update, or delete your personal information. You can
                also opt-out of certain communications from us.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
