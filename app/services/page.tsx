import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/Card';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/types/database.types';
import { getIcon } from '@/lib/iconMap';
import Link from 'next/link';

export default function ServicesPage() {
  const CategoryIcon = ({ categoryKey }: { categoryKey: ServiceCategory }) => {
    const category = SERVICE_CATEGORIES[categoryKey];
    const IconComponent = getIcon(category.icon);
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Browse Services</h1>
          <p className="text-lg text-gray-600">
            Find service providers in your area across all categories
          </p>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
            <Link key={key} href={`/services/${key}`}>
              <Card hover className="h-full cursor-pointer transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="rounded-lg bg-primary-100 p-2 text-primary-600">
                      <CategoryIcon categoryKey={key as ServiceCategory} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500">Available Services:</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {category.services.map((service, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-primary-600">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 rounded-lg bg-primary-50 border border-primary-200 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Provider Listings Coming Soon
          </h2>
          <p className="mb-4 text-gray-600">
            We're working on adding provider profiles. In the meantime, you can register as a
            provider to get started.
          </p>
          <Link
            href="/register/provider"
            className="inline-block rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 transition-colors"
          >
            Register as Provider
          </Link>
        </div>
      </div>
    </div>
  );
}
