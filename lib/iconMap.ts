import {
  Wrench,
  Sprout,
  HeartPulse,
  Truck,
  Calendar,
  Briefcase,
  Hammer,
  GraduationCap,
  Sparkles,
  Shield,
  ShoppingBag,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  wrench: Wrench,
  sprout: Sprout,
  'heart-pulse': HeartPulse,
  truck: Truck,
  calendar: Calendar,
  briefcase: Briefcase,
  hammer: Hammer,
  'graduation-cap': GraduationCap,
  sparkles: Sparkles,
  shield: Shield,
  'shopping-bag': ShoppingBag,
  smartphone: Smartphone,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Wrench; // Default to wrench if icon not found
}
