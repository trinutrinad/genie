'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/types/database.types';
import { getIcon } from '@/lib/iconMap';
import { Search, Filter, Star, MapPin, Phone, MessageCircle, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
  category: string;
};

export default function CategoryClient({ category }: Props) {
  // Convert URL slug to ServiceCategory enum
  // Handle both formats: "home_repair" or "home-repair" -> home_repair
  // The URL can be: home-repair, home_repair, or HOME_REPAIR
  // We need to normalize to lowercase with underscores to match enum values
  const normalizedCategory = category
    ?.toLowerCase()
    .replace(/-/g, '_') || '';
  
  // Find matching category key (enum values are lowercase with underscores)
  const categoryKey = Object.keys(SERVICE_CATEGORIES).find(
    (key) => key.toLowerCase() === normalizedCategory
  ) as ServiceCategory | undefined;
  
  const categoryData = categoryKey ? SERVICE_CATEGORIES[categoryKey] : undefined;

  // If category doesn't exist or is invalid, show error
  if (!category || !categoryData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <h1 className="mb-4 text-2xl font-bold text-gray-900">Category Not Found</h1>
              <p className="mb-4 text-gray-600">
                The service category you're looking for doesn't exist.
              </p>
              <Link href="/services">
                <Button variant="primary">Back to All Services</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const CategoryIcon = getIcon(categoryData.icon);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch providers from API
  React.useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category: categoryKey || '',
        });
        if (searchQuery) params.append('search', searchQuery);
        if (selectedLocation) params.append('location', selectedLocation);
        params.append('available', 'true');
        params.append('sort', 'rating');

        const response = await fetch(`/api/providers?${params}`);
        if (!response.ok) throw new Error('Failed to fetch providers');
        
        const data = await response.json();
        setProviders(data.providers || []);
      } catch (err: any) {
        setError(err.message);
        // Fallback to empty array
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryKey) {
      fetchProviders();
    }
  }, [categoryKey, searchQuery, selectedLocation]);

  // Dummy data fallback - will be replaced with actual data from Supabase
  const dummyProviders = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      serviceCategory: categoryData.name,
      specificServices: ['Electrician', 'Plumber'],
      experience: 5,
      rating: 4.5,
      ratingCount: 12,
      priceMin: 500,
      priceMax: 2000,
      location: 'Village A',
      isAvailable: true,
      isVerified: true,
      profilePhoto: null,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      serviceCategory: categoryData.name,
      specificServices: ['Carpenter', 'Mason'],
      experience: 3,
      rating: 4.8,
      ratingCount: 8,
      priceMin: 300,
      priceMax: 1500,
      location: 'Village B',
      isAvailable: true,
      isVerified: false,
      profilePhoto: null,
    },
    {
      id: '3',
      name: 'Amit Singh',
      serviceCategory: categoryData.name,
      specificServices: ['Mobile Repair', 'Appliance Repair'],
      experience: 7,
      rating: 4.2,
      ratingCount: 15,
      priceMin: 200,
      priceMax: 1000,
      location: 'Village C',
      isAvailable: false,
      isVerified: true,
      profilePhoto: null,
    },
  ];

  const filteredProviders = (providers.length > 0 ? providers : dummyProviders).filter((provider: any) => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specificServices.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !selectedLocation || provider.location === selectedLocation;
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center space-x-4">
            <div className="rounded-full bg-primary-100 p-4">
              <CategoryIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{categoryData.name}</h1>
            </div>
          </div>
          <p className="text-gray-600">
            Find trusted {categoryData.name.toLowerCase()} providers in your area
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search Providers
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or service..."
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="">All Locations</option>
                    <option value="Village A">Village A</option>
                    <option value="Village B">Village B</option>
                    <option value="Village C">Village C</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedLocation) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Filters:</span>
                {searchQuery && (
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedLocation && (
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700">
                    Location: {selectedLocation}
                    <button
                      onClick={() => setSelectedLocation('')}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation('');
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredProviders.length}</span> provider(s)
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Loading providers...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600">{error}</p>
              <p className="mt-2 text-sm text-gray-600">
                Showing sample data. Connect to Supabase to see real providers.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Providers Grid */}
        {!loading && filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider: any) => {
              const profile = provider.profiles || {};
              const providerName = profile.full_name || provider.name || 'Unknown';
              const providerLocation = profile.village || provider.location || 'Unknown';
              
              return (
              <Card key={provider.id} hover className="h-full">
                <CardContent className="p-6">
                  {/* Provider Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                        <span className="text-lg font-semibold">
                          {providerName
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{providerName}</h3>
                        <div className="flex items-center space-x-2">
                          {provider.isVerified && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              Verified
                            </span>
                          )}
                          <span
                            className={`h-2 w-2 rounded-full ${
                              provider.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                            title={provider.isAvailable ? 'Available' : 'Busy'}
                          />
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                    {/* Services */}
                    <div className="mb-4">
                      <p className="mb-1 text-sm font-medium text-gray-700">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {(provider.specific_services || provider.specificServices || []).map((service: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-4 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {provider.rating_avg || provider.rating || 0}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({provider.rating_count || provider.ratingCount || 0} reviews)
                      </span>
                    </div>

                    {/* Experience & Price */}
                    <div className="mb-4 space-y-1 text-sm text-gray-600">
                      <p>Experience: {provider.experience_years || provider.experience || 0} years</p>
                      {(provider.price_min || provider.priceMax) && (
                        <p>
                          Price: ₹{(provider.price_min || provider.priceMin || 0).toLocaleString()} - ₹
                          {(provider.price_max || provider.priceMax || 0).toLocaleString()}
                        </p>
                      )}
                      <p className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {providerLocation}
                      </p>
                    </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="primary" className="flex-1" size="sm">
                      Contact Provider
                    </Button>
                    <Button variant="outline" size="sm" icon={<MessageCircle className="h-4 w-4" />}>
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" icon={<Phone className="h-4 w-4" />}>
                      Call
                    </Button>
                    </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No providers found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedLocation
                  ? 'Try adjusting your filters'
                  : 'No providers available in this category yet'}
              </p>
              {(searchQuery || selectedLocation) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Back to Services */}
        <div className="mt-8">
          <Link href="/services">
            <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
              Back to All Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

