# Genie - Service Marketplace

A comprehensive platform connecting communities with local service providers. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Overview

Genie is a service marketplace that helps users find trusted local service providers across 12 major categories:

1. **Home Repair & Maintenance** - Electricians, plumbers, carpenters, masons, appliance repair
2. **Agriculture Essentials** - Tractor rental, harvesting equipment, farm labor, soil testing
3. **Healthcare** - Doctor visits, ambulance, medicine delivery, veterinary services
4. **Transport** - Goods vehicles, bike taxi, tractor trolley, event transport
5. **Event Services** - DJ, catering, tents, photography, priests
6. **Professional Help** - Documentation, accounting, insurance, legal consultation
7. **Construction** - JCB rental, contractors, material suppliers
8. **Education** - Home tutors, computer training, exam coaching
9. **Beauty & Personal** - Salon services, bridal makeup, mehendi
10. **Security & Installation** - CCTV, solar panels, security guards
11. **Daily Essentials** - LPG delivery, water delivery, grocery delivery
12. **Digital Services** - Mobile recharge, internet setup, computer repair

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gram_seva
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**
   
   - Create a new Supabase project
   - Run the database migrations (see `/lib/database-schema.md` for SQL commands)
   - Create storage buckets for profile photos and work photos

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
gram_seva/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/landing page
│   ├── services/          # Services browsing
│   ├── register/          # Registration pages
│   └── dashboard/         # User dashboards
├── components/            # React components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Navbar.tsx
├── lib/                   # Utilities and configs
│   ├── supabase.ts       # Supabase client
│   ├── utils.ts          # Utility functions
│   └── iconMap.ts        # Icon mapping
├── types/                 # TypeScript types
│   └── database.types.ts # Database and category types
└── public/               # Static assets
```

## 🎨 Features

### Current (Phase 1)
- ✅ Landing page with 12 service categories
- ✅ Service browsing and filtering
- ✅ User registration (customer & provider)
- ✅ Service provider profiles
- ✅ Direct contact (WhatsApp/Call)
- ✅ Basic search functionality
- ✅ Responsive mobile-first design

### Planned (Phase 2)
- ⏳ Payment integration (Razorpay/PhonePe)
- ⏳ In-app chat system
- ⏳ Booking system with calendar
- ⏳ Advanced search with maps
- ⏳ Push notifications
- ⏳ Admin dashboard
- ⏳ Review and rating system

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 📝 Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for production)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built for rural communities in India to connect with local service providers and grow their businesses.

## 📞 Support

For support, create an issue in the repository.
