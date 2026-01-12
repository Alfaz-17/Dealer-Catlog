# AutoCard Dealer Catalog

A modern, mobile-first Progressive Web App (PWA) that allows businesses to create their own storefronts and showcase their inventory online.

## 🚀 Features

- **Multi-tenant Architecture**: Each business gets a unique storefront URL
- **Product Management**: Easy-to-use dashboard for managing inventory
- **Social Media Card Generator**: Download branded product cards for Instagram, Facebook, WhatsApp
- **Mobile-First Design**: Optimized for mobile devices with PWA support
- **Authentication**: Secure login and registration system
- **Image Management**: Cloudinary integration for image uploads and optimization
- **SEO Optimized**: Each storefront is indexed by search engines

## 📋 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth v5
- **Image Storage**: Cloudinary
- **Social Cards**: html2canvas
- **Deployment**: Vercel-ready

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
cd "AutoCard Dealer Catalog"
npm install
```

### 2. Environment Variables

Create `.env.local` file with the following:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autocard-catalog

# NextAuth
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Services

#### MongoDB Atlas (Free):
1. Visit [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create account & cluster
3. Get connection string
4. Add to `.env.local`

#### Cloudinary (Free):
1. Visit [cloudinary.com](https://cloudinary.com)
2. Create account
3. Get cloud name, API key, API secret from dashboard
4. Add to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 PWA Installation

The app can be installed on mobile devices:
1. Visit the site on mobile browser
2. Look for "Add to Home Screen" prompt
3. Install and use like a native app

## 🎨 Key Features

### For Business Owners:
- Create business profile
- Add unlimited products (Pro plan)
- Upload product images
- Generate social media cards
- Track product views & clicks
- Custom storefront URL

### For Customers:
- Browse products easily
- View detailed product information
- Contact business via WhatsApp/Call
- Share products with friends

## 📦 Project Structure

```
├── app/                  # Next.js app router
│   ├── (auth)/          # Auth pages (login, register)
│   ├── (dashboard)/     # Business dashboard
│   ├── store/           # Public storefronts
│   └── api/             # API routes
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Auth forms
│   ├── dashboard/      # Dashboard components
│   ├── products/       # Product management
│   ├── storefront/     # Public store components
│   └── social-card/    # Card generator
├── lib/                # Utilities
├── models/             # MongoDB models
├── types/              # TypeScript types
└── public/             # Static files
```

## 🚀 Deployment

### Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use Vercel Dashboard:
1. Import GitHub repo
2. Add environment variables
3. Deploy

## 📄 License

MIT License - feel free to use for your projects!

## 🤝 Support

For issues or questions, contact the development team.

---

**Built with ❤️ using Next.js, Tailwind CSS, and MongoDB**
