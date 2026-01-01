'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/types/database.types';
import { getIcon } from '@/lib/iconMap';
import { getWhatsAppLink, formatPrice, timeAgo, getInitials } from '@/lib/utils';
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle,
  Heart,
  Share2,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function ProviderDetailPage() {
  const params = useParams();
  const category = params?.category as string;
  const providerId = params?.id as string;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Normalize category
  const normalizedCategory = category?.toLowerCase().replace(/-/g, '_') || '';
  const categoryKey = Object.keys(SERVICE_CATEGORIES).find(
    (key) => key.toLowerCase() === normalizedCategory
  ) as ServiceCategory | undefined;
  const categoryData = categoryKey ? SERVICE_CATEGORIES[categoryKey] : null;

  // Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/providers/${providerId}`);
        if (!response.ok) throw new Error('Failed to fetch provider');
        
        const data = await response.json();
        setProvider(data);
        setReviews(data.reviews || []);
      } catch (err: any) {
        setError(err.message);
        // Use dummy data as fallback
        const fallbackCategoryName = categoryData?.name || 'Service';
        setProvider({
          id: providerId,
          name: 'Provider',
          serviceCategory: fallbackCategoryName,
          specificServices: [],
          experience: 0,
          rating: 0,
          ratingCount: 0,
          priceMin: 0,
          priceMax: 0,
          location: 'Unknown',
          profiles: { full_name: 'Provider', village: 'Unknown' },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId, categoryData]);

  // Dummy provider data fallback
  const dummyProvider = {
    id: providerId,
    name: 'Rajesh Kumar',
    serviceCategory: categoryData?.name || 'Home Repair & Maintenance',
    specificServices: ['Electrician', 'Plumber', 'Carpenter'],
    experience: 5,
    rating: 4.5,
    ratingCount: 12,
    priceMin: 500,
    priceMax: 2000,
    location: 'Village A',
    block: 'Block A',
    district: 'District X',
    serviceArea: ['Village A', 'Village B', 'Village C'],
    isAvailable: true,
    isVerified: true,
    about: 'Experienced electrician and plumber with 5+ years of experience. Specialized in home repairs, electrical installations, and plumbing work. Available for emergency services.',
    profilePhoto: null,
    workPhotos: [
      'https://via.placeholder.com/400x300?text=Work+Photo+1',
      'https://via.placeholder.com/400x300?text=Work+Photo+2',
      'https://via.placeholder.com/400x300?text=Work+Photo+3',
      'https://via.placeholder.com/400x300?text=Work+Photo+4',
    ],
    phone: '9876543210',
    whatsappNumber: '9876543210',
    viewCount: 45,
  };

  const currentProvider = provider || dummyProvider;
  const profile = currentProvider.profiles || {};
  const providerName = profile.full_name || currentProvider.name || 'Unknown';
  const providerPhone = profile.phone || currentProvider.phone || '';
  const providerWhatsApp = profile.whatsapp_number || currentProvider.whatsappNumber || providerPhone;
  const providerLocation = profile.village || currentProvider.location || 'Unknown';
  const providerBlock = profile.block || currentProvider.block || '';
  const providerDistrict = profile.district || currentProvider.district || '';

  const dummyReviews = [
    {
      id: '1',
      customerName: 'Ramesh Kumar',
      rating: 5,
      comment: 'Excellent service! Very professional and completed the work on time.',
      date: '2025-12-28',
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      rating: 4,
      comment: 'Good work, would recommend to others.',
      date: '2025-12-25',
    },
    {
      id: '3',
      customerName: 'Amit Singh',
      rating: 5,
      comment: 'Best electrician in the area. Very satisfied!',
      date: '2025-12-20',
    },
  ];

  // Calculate rating breakdown from reviews
  const ratingBreakdown = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const currentReviews = reviews.length > 0 ? reviews : dummyReviews;

  const similarProviders = [
    {
      id: '2',
      name: 'Kumar Plumber',
      category: categoryData?.name || 'Home Repair',
      rating: 4.8,
      location: 'Village A',
    },
    {
      id: '3',
      name: 'Amit Electrician',
      category: categoryData?.name || 'Home Repair',
      rating: 4.2,
      location: 'Village A',
    },
  ];

  const handleWhatsApp = async () => {
    const message = `Hi ${providerName}, I need ${currentProvider.service_category || categoryData?.name} services in ${providerLocation}. Can you help?`;
    const url = getWhatsAppLink(providerWhatsApp, message);
    
    // Track contact
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: providerId,
          service_type: currentProvider.service_category || categoryData?.name,
          message,
          contact_method: 'whatsapp',
        }),
      });
    } catch (err) {
      console.error('Failed to track contact:', err);
    }
    
    window.open(url, '_blank');
  };

  const handleCall = async () => {
    // Track contact
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: providerId,
          service_type: currentProvider.service_category || categoryData?.name,
          contact_method: 'call',
        }),
      });
    } catch (err) {
      console.error('Failed to track contact:', err);
    }
    
    window.location.href = `tel:${providerPhone}`;
  };

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <h1 className="mb-4 text-2xl font-bold text-gray-900">Category Not Found</h1>
              <Link href="/services">
                <Button variant="primary">Back to Services</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Loading provider...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <h1 className="mb-4 text-2xl font-bold text-gray-900">Provider Not Found</h1>
              <p className="mb-4 text-gray-600">{error}</p>
              <Link href={`/services/${category}`}>
                <Button variant="primary">Back to {categoryData.name}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href={`/services/${category}`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />} className="mb-4">
            Back to {categoryData.name}
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Profile Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Profile Photo */}
                  <div className="flex-shrink-0">
                    {currentProvider.profile_photo_url ? (
                      <img
                        src={currentProvider.profile_photo_url}
                        alt={providerName}
                        className="h-32 w-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-100 text-2xl font-semibold text-primary-600">
                        {getInitials(providerName)}
                      </div>
                    )}
                  </div>

                  {/* Provider Info */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-gray-900">{providerName}</h1>
                      {(currentProvider.is_verified || currentProvider.isVerified) && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          <CheckCircle className="mr-1 inline h-3 w-3" />
                          Verified
                        </span>
                      )}
                      <span
                        className={`h-3 w-3 rounded-full ${
                          (currentProvider.is_available !== undefined ? currentProvider.is_available : currentProvider.isAvailable) ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        title={(currentProvider.is_available !== undefined ? currentProvider.is_available : currentProvider.isAvailable) ? 'Available' : 'Busy'}
                      />
                    </div>

                    <p className="mb-2 text-lg text-gray-600">{currentProvider.service_category || categoryData.name}</p>

                    {/* Rating */}
                    <div className="mb-4 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold text-gray-900">
                          {currentProvider.rating_avg || currentProvider.rating || 0}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        ({(currentProvider.rating_count || currentProvider.ratingCount || 0)} reviews)
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{(currentProvider.experience_years || currentProvider.experience || 0)} years experience</span>
                    </div>

                    {/* Location & Price */}
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {providerLocation}{providerBlock ? `, ${providerBlock}` : ''}{providerDistrict ? `, ${providerDistrict}` : ''}
                      </p>
                      {(currentProvider.price_min || currentProvider.priceMin) && (
                        <p>Price Range: {formatPrice(currentProvider.price_min || currentProvider.priceMin || 0, currentProvider.price_max || currentProvider.priceMax || 0)}</p>
                      )}
                      {(currentProvider.service_area || currentProvider.serviceArea) && (
                        <p>Service Area: {(currentProvider.service_area || currentProvider.serviceArea || []).join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{currentProvider.about || 'No description available.'}</p>

                <div className="mt-6">
                  <h3 className="mb-3 font-semibold text-gray-900">Services Offered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(currentProvider.specific_services || currentProvider.specificServices || []).map((service: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos Gallery */}
            {((currentProvider.work_photos || currentProvider.workPhotos || []).length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Work Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {(currentProvider.work_photos || currentProvider.workPhotos || []).map((photo: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(photo)}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-primary-500 transition-colors"
                      >
                        <img
                          src={photo}
                          alt={`Work photo ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({(currentProvider.rating_count || currentProvider.ratingCount || 0)})</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Rating Breakdown */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="text-center">
                      <div className="mb-1 text-2xl font-bold text-gray-900">
                        {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{rating}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {currentReviews.length > 0 ? (
                    currentReviews.map((review: any) => {
                      const reviewerName = review.profiles?.full_name || review.customerName || 'Anonymous';
                      return (
                      <div key={review.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{reviewerName}</h4>
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
                      <p className="mb-2 text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500">
                        {timeAgo(new Date(review.date))}
                      </p>
                    </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-600">No reviews yet.</p>
                  )}
                </div>

                <Button variant="outline" className="mt-4">
                  Write a Review
                </Button>
              </CardContent>
            </Card>

            {/* Similar Providers */}
            {similarProviders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {similarProviders.map((similar) => (
                      <Link
                        key={similar.id}
                        href={`/services/${category}/${similar.id}`}
                        className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900">{similar.name}</h4>
                        <p className="text-sm text-gray-600">{similar.category}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-700">{similar.rating}</span>
                          <span className="text-sm text-gray-500">• {similar.location}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Section */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  icon={<MessageCircle className="h-5 w-5" />}
                  onClick={handleWhatsApp}
                >
                  WhatsApp
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  icon={<Phone className="h-5 w-5" />}
                  onClick={handleCall}
                >
                  Call Now
                </Button>
                <Button className="w-full" size="lg" variant="outline">
                  Request Booking
                </Button>
                <div className="flex space-x-2">
                  <Button variant="ghost" className="flex-1" size="sm" icon={<Heart className="h-4 w-4" />}>
                    Save
                  </Button>
                  <Button variant="ghost" className="flex-1" size="sm" icon={<Share2 className="h-4 w-4" />}>
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Views:</span>
                  <span className="font-medium text-gray-900">{currentProvider.view_count || currentProvider.viewCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium text-gray-900">Usually within 1 hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span
                    className={`font-medium ${
                      (currentProvider.is_available !== undefined ? currentProvider.is_available : currentProvider.isAvailable) ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {(currentProvider.is_available !== undefined ? currentProvider.is_available : currentProvider.isAvailable) ? 'Available Now' : 'Busy'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-gray-900 hover:bg-gray-100"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Work photo"
            className="max-h-full max-w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

