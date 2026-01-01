import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">About Genie</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Our Mission</h2>
              <p className="mb-4 text-gray-700">
                Genie is dedicated to connecting communities with trusted local service
                providers. We believe that everyone should have easy access to
                quality services, from home repair to healthcare, agriculture to education.
              </p>
              <p className="text-gray-700">
                Our platform empowers local service providers to grow their businesses while making
                it easier for customers to find reliable, verified professionals in their area.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">What We Offer</h2>
              <ul className="list-disc space-y-2 text-gray-700">
                <li>12 major service categories covering all rural needs</li>
                <li>Verified provider profiles with reviews and ratings</li>
                <li>Direct contact via WhatsApp and phone calls</li>
                <li>Easy-to-use interface</li>
                <li>Free registration for both customers and providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">For Customers</h2>
              <p className="mb-4 text-gray-700">
                Find trusted service providers in your area. Browse by category,
                read reviews, and contact providers directly. All providers are verified and rated
                by the community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">For Service Providers</h2>
              <p className="mb-4 text-gray-700">
                Grow your business by reaching more customers in your area. Create a free profile,
                showcase your services, and receive direct leads. Build your reputation through
                customer reviews and ratings.
              </p>
              <Link
                href="/register/provider"
                className="inline-block rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 transition-colors"
              >
                Register as Provider
              </Link>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Contact Us</h2>
              <p className="text-gray-700">
                Have questions or suggestions? We'd love to hear from you. Reach out to us through
                our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
