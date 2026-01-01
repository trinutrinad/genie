'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/AuthContext';
import { Search, Heart, MessageCircle, Clock, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [savedProviders, setSavedProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get contacts
        const contactsResponse = await fetch('/api/contacts');
        const contactsData = await contactsResponse.json();
        setRecentContacts(contactsData.contacts || []);

        // Get saved providers
        const savedResponse = await fetch('/api/saved');
        if (savedResponse.ok) {
          const savedData = await savedResponse.json();
          setSavedProviders(savedData.providers || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Dummy data fallback
  const dummyContacts = [
    {
      id: '1',
      providerName: 'Rajesh Electrician',
      serviceType: 'Home Repair & Maintenance',
      date: '2026-01-01',
      status: 'contacted',
    },
    {
      id: '2',
      providerName: 'Kumar Plumber',
      serviceType: 'Home Repair & Maintenance',
      date: '2025-12-30',
      status: 'new',
    },
  ];

  const dummySavedProviders = [
    {
      id: '1',
      name: 'Rajesh Electrician',
      category: 'Home Repair',
      rating: 4.5,
      location: 'Village A',
    },
    {
      id: '2',
      name: 'Priya Healthcare',
      category: 'Healthcare',
      rating: 4.8,
      location: 'Village B',
    },
  ];

  const popularServices = [
    'Home Repair',
    'Agriculture',
    'Healthcare',
    'Transport',
    'Event Services',
  ];

  // Prepare data for rendering
  const displayContacts = recentContacts.length > 0 ? recentContacts : dummyContacts;
  const displaySavedProviders = savedProviders.length > 0 ? savedProviders : dummySavedProviders;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-2 text-gray-600">
            Find trusted service providers in your area
          </p>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search for Services
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by service, provider name, or location..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Popular Services:</p>
              <div className="flex flex-wrap gap-2">
                {popularServices.map((service) => (
                  <Link
                    key={service}
                    href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                    className="rounded-full bg-primary-100 px-4 py-1 text-sm text-primary-700 hover:bg-primary-200 transition-colors"
                  >
                    {service}
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-gray-500">Loading...</div>
                ) : displayContacts.length > 0 ? (
                  <div className="space-y-4">
                    {displayContacts.map((contact: any) => {
                      const provider = contact.provider || {};
                      const providerProfile = provider.profiles || {};
                      const providerName = providerProfile.full_name || provider.service_category || contact.providerName || 'Provider';
                      const serviceType = provider.service_category || contact.serviceType || 'Service';
                      
                      return (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{providerName}</h3>
                          <p className="text-sm text-gray-600">{serviceType}</p>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {new Date(contact.created_at || contact.date).toLocaleDateString()}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 ${
                                contact.status === 'new'
                                  ? 'bg-blue-100 text-blue-700'
                                  : contact.status === 'contacted'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {contact.status}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Contact Again
                        </Button>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <MessageCircle className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p>No contacts yet</p>
                    <Link href="/services" className="mt-2 text-primary-600 hover:text-primary-700">
                      Browse services
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Your Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Your Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center text-gray-500">
                  <Star className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p>No reviews yet</p>
                  <p className="mt-1 text-sm">Reviews you write will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Providers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Saved Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-4 text-center text-sm text-gray-500">Loading...</div>
                ) : displaySavedProviders.length > 0 ? (
                  <div className="space-y-4">
                    {displaySavedProviders.map((provider: any) => {
                      const providerName = provider.profiles?.full_name || provider.name || 'Provider';
                      const category = provider.service_category || provider.category || 'Service';
                      const rating = provider.rating_avg || provider.rating || 0;
                      const location = provider.profiles?.village || provider.location || 'Unknown';
                      
                      return (
                      <div
                        key={provider.id || provider.provider_id}
                        className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900">{providerName}</h3>
                        <p className="text-sm text-gray-600">{category}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-700">{rating}</span>
                          </div>
                          <span className="flex items-center text-xs text-gray-500">
                            <MapPin className="mr-1 h-3 w-3" />
                            {location}
                          </span>
                        </div>
                        <Link href={`/services/${category.toLowerCase().replace(/\s+/g, '-')}/${provider.id || provider.provider_id}`}>
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm text-gray-500">
                    <p>No saved providers</p>
                    <p className="mt-1 text-xs">Save providers to access them quickly</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Change Location
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

