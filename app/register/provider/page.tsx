'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { ImageUpload } from '@/components/ImageUpload';
import { SERVICE_CATEGORIES, ServiceCategory } from '@/types/database.types';
import { validatePhone, validateAadhaar } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { uploadImageClient } from '@/lib/upload';
import { 
  User, Phone, MapPin, Briefcase, DollarSign, 
  FileText, Upload, ArrowRight, ArrowLeft, CheckCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import Link from 'next/link';

type FormStep = 1 | 2 | 3;

export default function ProviderRegistrationPage() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    // Step 0: Account Info (if not logged in)
    email: '',
    password: '',
    confirmPassword: '',
    // Step 1: Basic Info
    full_name: '',
    phone: '',
    whatsapp_number: '',
    village: '',
    block: '',
    district: '',
    // Step 2: Service Details
    service_category: '',
    specific_services: [] as string[],
    experience_years: '',
    price_min: '',
    price_max: '',
    service_area: '',
    is_available: true,
    // Step 3: Additional Info
    about: '',
    aadhaar_number: '',
    profile_photo: [] as string[],
    work_photos: [] as string[],
    profilePhotoFiles: [] as File[],
    workPhotoFiles: [] as File[],
  });

  const selectedCategory = formData.service_category as ServiceCategory;
  const availableServices = selectedCategory 
    ? SERVICE_CATEGORIES[selectedCategory]?.services || []
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      specific_services: prev.specific_services.includes(service)
        ? prev.specific_services.filter((s) => s !== service)
        : [...prev.specific_services, service],
    }));
  };

  const validateStep = (step: FormStep): boolean => {
    setError('');

    if (step === 1) {
      if (!user) {
        // Account creation step
        if (!formData.email) {
          setError('Please enter your email');
          return false;
        }
        if (!formData.password || formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
      } else {
        // Basic info step
        if (!formData.full_name.trim()) {
          setError('Please enter your full name');
          return false;
        }
        if (!validatePhone(formData.phone)) {
          setError('Please enter a valid 10-digit phone number');
          return false;
        }
        if (!formData.village.trim()) {
          setError('Please enter your village/location');
          return false;
        }
      }
    }

    if (step === 2) {
      if (!formData.service_category) {
        setError('Please select a service category');
        return false;
      }
      if (formData.specific_services.length === 0) {
        setError('Please select at least one specific service');
        return false;
      }
      if (!formData.experience_years || parseInt(formData.experience_years) < 0) {
        setError('Please enter valid years of experience');
        return false;
      }
    }

    if (step === 3) {
      if (formData.aadhaar_number && !validateAadhaar(formData.aadhaar_number)) {
        setError('Please enter a valid 12-digit Aadhaar number');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    // If on account creation step and not logged in, create account first
    if (!user && currentStep === 1) {
      setLoading(true);
      setError('');
      try {
        await signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          phone: formData.phone,
          role: 'provider',
          village: formData.village,
          block: formData.block,
          district: formData.district,
          whatsapp_number: formData.whatsapp_number || formData.phone,
        });
        // Account created, move to next step
        setCurrentStep(2 as FormStep);
      } catch (err: any) {
        setError(err.message || 'Failed to create account');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Move to next step
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalStep = user ? 3 : 4;
    if (!validateStep(finalStep as FormStep)) return;

    setLoading(true);
    setError('');

    try {
      // User should be logged in at this point (account created in step 1)
      if (!user) {
        setError('Please create an account first');
        setLoading(false);
        return;
      }

      const userId = user.id;

      // Step 2: Upload images
      setUploadingImages(true);
      let profilePhotoUrl = '';
      const workPhotoUrls: string[] = [];

      if (formData.profilePhotoFiles.length > 0 && userId) {
        const result = await uploadImageClient(
          formData.profilePhotoFiles[0],
          'profile-photos',
          userId
        );
        profilePhotoUrl = result.url;
      }

      if (formData.workPhotoFiles.length > 0 && userId) {
        for (const file of formData.workPhotoFiles) {
          const result = await uploadImageClient(
            file,
            'work-photos',
            userId,
            'work'
          );
          workPhotoUrls.push(result.url);
        }
      }

      setUploadingImages(false);

      // Step 3: Create service provider profile
      const providerData = {
        service_category: formData.service_category,
        specific_services: formData.specific_services,
        experience_years: parseInt(formData.experience_years),
        price_min: formData.price_min ? parseInt(formData.price_min) : null,
        price_max: formData.price_max ? parseInt(formData.price_max) : null,
        service_area: formData.service_area
          ? formData.service_area.split(',').map((s) => s.trim())
          : [],
        about: formData.about,
        profile_photo_url: profilePhotoUrl,
        work_photos: workPhotoUrls,
        aadhaar_number: formData.aadhaar_number || null,
        is_available: formData.is_available,
      };

      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create provider profile');
      }

      // Redirect to dashboard
      router.push('/dashboard/provider?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setUploadingImages(false);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = user ? 3 : 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Register as Service Provider</CardTitle>
              <CardDescription>
                Create your profile and start receiving leads from customers
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
                    
                    <Input
                      label="Full Name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      icon={<User className="h-5 w-5" />}
                      required
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      icon={<Phone className="h-5 w-5" />}
                      required
                    />

                    <Input
                      label="WhatsApp Number (if different)"
                      name="whatsapp_number"
                      type="tel"
                      value={formData.whatsapp_number}
                      onChange={handleChange}
                      placeholder="Optional: Different WhatsApp number"
                      maxLength={10}
                      icon={<Phone className="h-5 w-5" />}
                    />

                    <Input
                      label="Village/Location"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="Your village or location"
                      icon={<MapPin className="h-5 w-5" />}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Block/Tehsil"
                        name="block"
                        value={formData.block}
                        onChange={handleChange}
                        placeholder="Block or Tehsil"
                      />

                      <Input
                        label="District"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="District"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Service Details */}
                {currentStep === (user ? 2 : 3) && (
                  <div className="space-y-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Service Details</h3>
                    
                    <Select
                      label="Service Category"
                      name="service_category"
                      value={formData.service_category}
                      onChange={handleChange}
                      options={Object.entries(SERVICE_CATEGORIES).map(([key, cat]) => ({
                        value: key,
                        label: cat.name,
                      }))}
                      required
                    />

                    {formData.service_category && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Specific Services <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableServices.map((service) => (
                            <label
                              key={service}
                              className="flex cursor-pointer items-center space-x-2 rounded-lg border border-gray-300 p-3 hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={formData.specific_services.includes(service)}
                                onChange={() => handleServiceToggle(service)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <Input
                      label="Years of Experience"
                      name="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      icon={<Briefcase className="h-5 w-5" />}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Minimum Price (₹)"
                        name="price_min"
                        type="number"
                        value={formData.price_min}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        icon={<DollarSign className="h-5 w-5" />}
                      />

                      <Input
                        label="Maximum Price (₹)"
                        name="price_max"
                        type="number"
                        value={formData.price_max}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        icon={<DollarSign className="h-5 w-5" />}
                      />
                    </div>

                    <Input
                      label="Service Area (Villages you serve)"
                      name="service_area"
                      value={formData.service_area}
                      onChange={handleChange}
                      placeholder="e.g., Village A, Village B, Village C"
                      icon={<MapPin className="h-5 w-5" />}
                    />

                    {/* Availability Toggle */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Availability Status
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, is_available: !prev.is_available }))}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 transition-colors ${
                          formData.is_available
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {formData.is_available ? (
                            <ToggleRight className="h-6 w-6 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-gray-400" />
                          )}
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              {formData.is_available ? 'Available' : 'Busy'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formData.is_available
                                ? 'Customers can contact you'
                                : 'You will not receive new leads'}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-6 w-12 rounded-full transition-colors ${
                            formData.is_available ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                              formData.is_available ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Info */}
                {currentStep === (user ? 3 : 4) && (
                  <div className="space-y-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Additional Information</h3>
                    
                    {/* Profile Photo Upload */}
                    <ImageUpload
                      label="Profile Photo"
                      maxFiles={1}
                      maxSizeMB={5}
                      value={formData.profile_photo}
                      onChange={(files) => setFormData((prev) => ({ ...prev, profile_photo: files }))}
                      onFileSelect={(files) => {
                        setFormData((prev) => ({ ...prev, profilePhotoFiles: files }));
                      }}
                    />

                    {/* Work Photos Upload */}
                    <ImageUpload
                      label="Work Photos"
                      maxFiles={5}
                      maxSizeMB={5}
                      value={formData.work_photos}
                      onChange={(files) => setFormData((prev) => ({ ...prev, work_photos: files }))}
                      onFileSelect={(files) => {
                        setFormData((prev) => ({ ...prev, workPhotoFiles: files }));
                      }}
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        About You / Description
                      </label>
                      <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        placeholder="Tell customers about your experience, skills, and what makes you special..."
                      />
                    </div>

                    <Input
                      label="Aadhaar Number (Optional - for verification)"
                      name="aadhaar_number"
                      type="text"
                      value={formData.aadhaar_number}
                      onChange={handleChange}
                      placeholder="12-digit Aadhaar number"
                      maxLength={12}
                      icon={<FileText className="h-5 w-5" />}
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      icon={<ArrowLeft className="h-5 w-5" />}
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      icon={<ArrowRight className="h-5 w-5" />}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      isLoading={loading || uploadingImages}
                      icon={<CheckCircle className="h-5 w-5" />}
                    >
                      {uploadingImages ? 'Uploading Images...' : 'Complete Registration'}
                    </Button>
                  )}
                </div>

                {/* Login Link */}
                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

