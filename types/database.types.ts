// Service Categories with sub-services
export enum ServiceCategory {
  HOME_REPAIR = 'home_repair',
  AGRICULTURE = 'agriculture',
  HEALTHCARE = 'healthcare',
  TRANSPORT = 'transport',
  EVENT_SERVICES = 'event_services',
  PROFESSIONAL_HELP = 'professional_help',
  CONSTRUCTION = 'construction',
  EDUCATION = 'education',
  BEAUTY_PERSONAL = 'beauty_personal',
  SECURITY_INSTALLATION = 'security_installation',
  DAILY_ESSENTIALS = 'daily_essentials',
  DIGITAL_SERVICES = 'digital_services',
}

export const SERVICE_CATEGORIES = {
  [ServiceCategory.HOME_REPAIR]: {
    name: 'Home Repair & Maintenance',
    icon: 'wrench',
    services: [
      'Electrician',
      'Plumber',
      'Carpenter',
      'Mason/Mistri',
      'Mobile/appliance repair',
    ],
  },
  [ServiceCategory.AGRICULTURE]: {
    name: 'Agriculture Essentials',
    icon: 'sprout',
    services: [
      'Tractor rental (with driver)',
      'Harvesting equipment rental',
      'Spraying/pesticide services',
      'Farm labor booking',
      'Soil testing',
    ],
  },
  [ServiceCategory.HEALTHCARE]: {
    name: 'Healthcare',
    icon: 'heart-pulse',
    services: [
      'Doctor home visits',
      'Ambulance booking',
      'Medicine delivery',
      'Lab sample collection',
      'Veterinary services (for livestock)',
    ],
  },
  [ServiceCategory.TRANSPORT]: {
    name: 'Transport',
    icon: 'truck',
    services: [
      'Goods vehicle/tempo',
      'Bike taxi/auto',
      'Tractor trolley for goods',
      'Marriage/event transport',
    ],
  },
  [ServiceCategory.EVENT_SERVICES]: {
    name: 'Event Services',
    icon: 'calendar',
    services: [
      'DJ & sound system',
      'Caterers',
      'Tent/decoration',
      'Photographer',
      'Priest/Pandit',
    ],
  },
  [ServiceCategory.PROFESSIONAL_HELP]: {
    name: 'Professional Help',
    icon: 'briefcase',
    services: [
      'Government documentation (Aadhaar, PAN, schemes)',
      'Accountant/tax filing',
      'Insurance agents',
      'Lawyer consultation',
    ],
  },
  [ServiceCategory.CONSTRUCTION]: {
    name: 'Construction',
    icon: 'hammer',
    services: [
      'JCB/excavator rental',
      'Building contractors',
      'Sand/cement suppliers',
    ],
  },
  [ServiceCategory.EDUCATION]: {
    name: 'Education',
    icon: 'graduation-cap',
    services: [
      'Home tutors',
      'Computer training',
      'Competitive exam coaching',
    ],
  },
  [ServiceCategory.BEAUTY_PERSONAL]: {
    name: 'Beauty & Personal',
    icon: 'sparkles',
    services: [
      'Salon at home',
      'Bridal makeup',
      'Mehendi artist',
    ],
  },
  [ServiceCategory.SECURITY_INSTALLATION]: {
    name: 'Security & Installation',
    icon: 'shield',
    services: [
      'CCTV installation',
      'Solar panel setup',
      'Security guard',
    ],
  },
  [ServiceCategory.DAILY_ESSENTIALS]: {
    name: 'Daily Essentials',
    icon: 'shopping-bag',
    services: [
      'LPG cylinder delivery',
      'Water can delivery',
      'Grocery delivery',
    ],
  },
  [ServiceCategory.DIGITAL_SERVICES]: {
    name: 'Digital Services',
    icon: 'smartphone',
    services: [
      'Mobile/DTH recharge',
      'Internet/WiFi setup',
      'Computer repair',
    ],
  },
} as const;

export type UserRole = 'customer' | 'provider';

export type ContactStatus = 'new' | 'contacted' | 'completed';

export type ContactMethod = 'call' | 'whatsapp';

// Database Types
export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  whatsapp_number?: string;
  village?: string;
  block?: string;
  district?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  service_category: ServiceCategory;
  specific_services: string[];
  experience_years: number;
  price_min: number;
  price_max: number;
  service_area: string[];
  about?: string;
  profile_photo_url?: string;
  work_photos: string[];
  aadhaar_number?: string;
  is_verified: boolean;
  is_available: boolean;
  rating_avg: number;
  rating_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  customer_id: string;
  provider_id: string;
  service_type: string;
  message?: string;
  contact_method: ContactMethod;
  status: ContactStatus;
  created_at: string;
}

export interface Review {
  id: string;
  provider_id: string;
  customer_id: string;
  lead_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedProvider {
  customer_id: string;
  provider_id: string;
  created_at: string;
}
