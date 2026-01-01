import { Navbar } from '@/components/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing or using Genie, you agree to be bound by these Terms of Service.
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Use of Service</h2>
              <p className="mb-4 text-gray-700">You agree to use Genie only for lawful purposes and in accordance with these Terms.</p>
              <ul className="list-disc space-y-2 text-gray-700">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must not use the service to harm others or violate any laws</li>
                <li>You must not spam, harass, or abuse other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Service Provider Responsibilities</h2>
              <p className="mb-4 text-gray-700">
                Service providers are responsible for the quality of their services and must:
              </p>
              <ul className="list-disc space-y-2 text-gray-700">
                <li>Provide accurate service information</li>
                <li>Maintain professional standards</li>
                <li>Respond to customer inquiries promptly</li>
                <li>Honor commitments and agreements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Customer Responsibilities</h2>
              <p className="mb-4 text-gray-700">Customers agree to:</p>
              <ul className="list-disc space-y-2 text-gray-700">
                <li>Provide accurate contact information</li>
                <li>Respect service providers' time and expertise</li>
                <li>Leave honest and fair reviews</li>
                <li>Follow through on service agreements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
              <p className="text-gray-700">
                Genie is a platform connecting customers with service providers. We are not
                responsible for the quality, safety, or legality of services provided by third-party
                service providers.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. Your continued use of the
                service constitutes acceptance of any changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
