'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/AuthContext';
import { 
  User, Eye, Star, MessageCircle, 
  Edit, ExternalLink, Image as ImageIcon, 
  MapPin, BarChart3, ToggleLeft, ToggleRight 
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function ProviderDashboardContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const { user, profile } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    profileViews: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch provider data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !profile || profile.role !== 'provider') {
        setLoading(false);
        return;
      }

      try {
        // Get provider profile
        const providerResponse = await fetch('/api/providers');
        const providerData = await providerResponse.json();
        const myProvider = providerData.providers?.find((p: any) => p.user_id === user.id);
        
        if (myProvider) {
          setProviderProfile(myProvider);
          setIsAvailable(myProvider.is_available);
          setStats({
            totalLeads: 0, // Will be updated from contacts
            profileViews: myProvider.view_count || 0,
            averageRating: parseFloat(myProvider.rating_avg) || 0,
            totalReviews: myProvider.rating_count || 0,
          });
        }

        // Get contacts/inquiries
        const contactsResponse = await fetch('/api/contacts');
        const contactsData = await contactsResponse.json();
        setRecentInquiries(contactsData.contacts || []);

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalLeads: contactsData.contacts?.length || 0,
        }));

        // Get reviews
        if (myProvider) {
          const reviewsResponse = await fetch(`/api/reviews?provider_id=${myProvider.id}`);
          const reviewsData = await reviewsResponse.json();
          setRecentReviews(reviewsData.reviews?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile]);

  const profileCompletion = providerProfile ? 75 : 0; // Calculate based on profile completeness

  const dummyInquiries = [
    {
      id: '1',
      customerName: 'Ramesh Kumar',
      serviceRequested: 'Electrical Repair',
      date: '2026-01-01',
      time: '14:30',
      status: 'new',
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      serviceRequested: 'Plumbing Work',
      date: '2025-12-31',
      time: '10:15',
      status: 'contacted',
    },
    {
      id: '3',
      customerName: 'Amit Singh',
      serviceRequested: 'AC Installation',
      date: '2025-12-30',
      time: '16:45',
      status: 'completed',
    },
  ];

  const dummyReviews = [
    {
      id: '1',
      customerName: 'Ramesh Kumar',
      rating: 5,
      comment: 'Excellent service! Very professional.',
      date: '2025-12-28',
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      rating: 4,
      comment: 'Good work, would recommend.',
      date: '2025-12-25',
    },
  ];

  // Prepare data for rendering
  const displayInquiries = recentInquiries.length > 0 ? recentInquiries : dummyInquiries;
  const displayReviews = recentReviews.length > 0 ? recentReviews : dummyReviews;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {registered && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-800">
              ✅ Registration successful! Complete your profile to get more leads.
            </p>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, Provider!</h1>
              <p className="mt-2 text-gray-600">Manage your profile and track your leads</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/services/provider/me">
                <Button variant="outline" icon={<ExternalLink className="h-4 w-4" />}>
                  View Public Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Profile Completion</span>
              <span className="font-medium text-gray-900">{profileCompletion}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Profile Views</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                  <p className="mt-1 text-xs text-gray-500">This month</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <div className="mt-1 flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Inquiries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-gray-500">Loading...</div>
                ) : displayInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {displayInquiries.map((inquiry: any) => {
                      const customer = inquiry.customer || {};
                      const customerName = customer.full_name || 'Unknown Customer';
                      return (
                      <div
                        key={inquiry.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{customerName}</h3>
                          <p className="text-sm text-gray-600">{inquiry.service_type || inquiry.serviceRequested}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(inquiry.created_at || inquiry.date).toLocaleDateString()} at {new Date(inquiry.created_at || inquiry.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              inquiry.status === 'new'
                                ? 'bg-blue-100 text-blue-700'
                                : inquiry.status === 'contacted'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {inquiry.status}
                          </span>
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <MessageCircle className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p>No inquiries yet</p>
                    <p className="mt-1 text-sm">Complete your profile to get more leads</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-gray-500">Loading...</div>
                ) : displayReviews.length > 0 ? (
                  <div className="space-y-4">
                    {displayReviews.map((review: any) => {
                      const reviewer = review.profiles || {};
                      const reviewerName = reviewer.full_name || review.customerName || 'Anonymous';
                      return (
                      <div
                        key={review.id}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{reviewerName}</h3>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{review.comment || 'No comment'}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(review.created_at || review.date).toLocaleDateString()}
                        </p>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <Star className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p>No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Management */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" icon={<Edit className="h-4 w-4" />}>
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full" icon={<ImageIcon className="h-4 w-4" />}>
                  Update Photos
                </Button>
                <Button variant="outline" className="w-full" icon={<MapPin className="h-4 w-4" />}>
                  Change Service Area
                </Button>
              </CardContent>
            </Card>

            {/* Availability Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <button
                  onClick={async () => {
                    const newStatus = !isAvailable;
                    setIsAvailable(newStatus);
                    
                    // Update in database
                    if (providerProfile) {
                      try {
                        await fetch(`/api/providers/${providerProfile.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ is_available: newStatus }),
                        });
                      } catch (err) {
                        console.error('Failed to update availability:', err);
                        setIsAvailable(!newStatus); // Revert on error
                      }
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border p-4 transition-colors ${
                    isAvailable
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isAvailable ? (
                      <ToggleRight className="h-6 w-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {isAvailable ? 'Available' : 'Busy'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAvailable
                          ? 'Receiving new leads'
                          : 'Not receiving new leads'}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-6 w-12 rounded-full transition-colors ${
                      isAvailable ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                        isAvailable ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" size="sm" icon={<BarChart3 className="h-4 w-4" />}>
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Download Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProviderDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <ProviderDashboardContent />
    </Suspense>
  );
}

