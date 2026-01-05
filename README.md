# Electricity Bill OS

A comprehensive electricity bill management and analysis platform built with Next.js, designed to help businesses in India understand, audit, optimize, and act on their electricity bills using AI-powered insights.


## 🚀 Features

### Bill Management
- **Smart Bill Upload** - Upload electricity bills (images/PDFs) with automatic processing
- **OCR Support** - Extract data from bill images (requires Gemini API)
- **Bill Archive** - Store and manage all uploaded bills with search and filters

### AI-Powered Analysis
- **Automated Insights** - Get AI-generated analysis of your electricity consumption
- **Smart Recommendations** - Receive actionable suggestions to reduce costs
- **Risk Assessment** - Identify potential issues with your electricity usage

### Site Management
- **Multi-Site Support** - Manage multiple locations and meters
- **Site-wise Analysis** - Compare consumption across different sites

### Dashboard & Reporting
- **Real-time Dashboard** - Overview of all bills, consumption, and savings
- **Visual Analytics** - Interactive charts and statistics
- **Export Options** - Download bills and reports

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS with Glassmorphism design
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Google Gemini API (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional, for persistence)
- Google Gemini API key (optional, for AI features)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/electricity-bill-os.git
   cd electricity-bill-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # Supabase (optional - enables persistence)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Google Gemini (optional - enables AI features)
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Set up database (if using Supabase)**
   - Go to Supabase SQL Editor
   - Run `supabase/schema.sql` to create tables
   - Run `supabase/fix_rls.sql` to set up RLS policies

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t electricity-bill-os .
docker run -p 3000:3000 electricity-bill-os
```

## 📁 Project Structure

```
electricity-bill-os/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── login/           # Authentication pages
│   │   └── signup/
│   ├── components/          # Reusable UI components
│   │   ├── ai/              # AI-related components
│   │   ├── effects/         # Visual effects (aurora, snowfall)
│   │   └── layout/          # Layout components
│   ├── context/             # React Context providers
│   └── lib/                 # Utilities and clients
│       ├── gemini/          # Gemini AI client
│       └── supabase/        # Supabase client
├── supabase/                # Database schemas and migrations
└── public/                  # Static assets
```

## 🔒 Demo Mode

The app works in demo mode without any backend configuration:
- Bills are stored in memory (reset on page refresh)
- AI insights use mock data
- Full UI/UX experience available

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- AI features by [Google Gemini](https://ai.google.dev/)
