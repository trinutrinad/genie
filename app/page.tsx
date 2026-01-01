import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Navbar } from '@/components/Navbar';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/types/database.types';
import { getIcon } from '@/lib/iconMap';
import { Search, Users, CheckCircle, MessageCircle, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const CategoryIcon = ({ categoryKey }: { categoryKey: ServiceCategory }) => {
    const category = SERVICE_CATEGORIES[categoryKey];
    const IconComponent = getIcon(category.icon);
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Navbar />

      {/* HERO IMAGE SECTION */}
      <section className="relative h-screen w-full">
        <Image
          src="/images/genie.png"
          alt="Genie Service Marketplace"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Genie
          </h1>

          <p className="text-white text-lg md:text-xl max-w-2xl mb-6">
            Your Service Marketplace
          </p>

          <div className="flex gap-4">
            <Link href="/services">
              <Button className="bg-green-600 text-white px-6 py-3">
                Find Services
              </Button>
            </Link>

            <Link href="/register/provider">
              <Button className="bg-white text-green-700 px-6 py-3">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Our Service Categories
          </h2>
          <p className="text-lg text-gray-600">
            Browse services by category and find the right provider for your needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
            <Link key={key} href={`/services/${key.toLowerCase().replace(/_/g, '-')}`}>
              <Card hover className="h-full cursor-pointer transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="rounded-full bg-primary-100 p-4 text-primary-600">
                      <CategoryIcon categoryKey={key as ServiceCategory} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <ul className="space-y-1 text-xs text-gray-500">
                    {category.services.slice(0, 3).map((service, idx) => (
                      <li key={idx}>• {service}</li>
                    ))}
                    {category.services.length > 3 && (
                      <li className="text-primary-600">
                        +{category.services.length - 3} more
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* For Customers */}
            <div>
              <h3 className="mb-6 text-2xl font-semibold text-gray-900">For Customers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">Browse Services</h4>
                    <p className="text-gray-600">
                      Search and filter through verified service providers in your area
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">Contact Provider</h4>
                    <p className="text-gray-600">
                      Reach out directly via WhatsApp or phone call
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">Get Service</h4>
                    <p className="text-gray-600">
                      Receive quality service and leave a review to help others
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Providers */}
            <div>
              <h3 className="mb-6 text-2xl font-semibold text-gray-900">For Providers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-600 text-white">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">Register</h4>
                    <p className="text-gray-600">
                      Create your profile and list your services in minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-600 text-white">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">Get Leads</h4>
                    <p className="text-gray-600">
                      Receive direct contacts from customers looking for your services
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-600 text-white">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">Earn Money</h4>
                    <p className="text-gray-600">
                      Grow your business and build your reputation through reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Why Choose Genie
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary-100 p-4">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Verified Providers</h3>
            <p className="text-gray-600">
              All providers are verified and reviewed by the community
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary-100 p-4">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Easy Communication</h3>
            <p className="text-gray-600">
              Direct contact with providers for seamless communication
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary-100 p-4">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Direct Contact</h3>
            <p className="text-gray-600">
              Contact providers directly via WhatsApp or phone call
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary-100 p-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Community Ratings</h3>
            <p className="text-gray-600">
              Read and write reviews to help others make informed decisions
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-primary-100">
            Join thousands of users connecting with local service providers
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary-600 hover:bg-gray-100"
                icon={<Search className="h-5 w-5" />}
              >
                Find Services
              </Button>
            </Link>
            <Link href="/register/provider">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-primary-700"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Genie. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/about" className="hover:text-primary-600">
                About
              </Link>
              <Link href="/privacy" className="hover:text-primary-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
