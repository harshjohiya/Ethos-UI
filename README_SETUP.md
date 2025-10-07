# Ethos UI - Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account and project
- Your database schema already set up in Supabase

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure Supabase credentials:**
   - Go to your Supabase project: https://app.supabase.com
   - Navigate to Project Settings > API
   - Copy the following values to your `.env` file:
     - `VITE_SUPABASE_URL`: Your project URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your anon/public key

## Database Schema

The application expects the following tables in your Supabase database:

- `profiles` - Entity profiles (students, staff, etc.)
- `campus_card_swipes` - Card swipe logs
- `wifi_associations_logs` - WiFi connection logs
- `bookings` - Room booking records
- `library_checkouts` - Library checkout records
- `cctv_frames` - CCTV detection logs
- `face_embeddings` - Face recognition data
- `face_images` - Face image storage
- `free_text_notes` - Free-form notes
- `entity_resolution_map` - Entity resolution mappings

Refer to the database schema provided in your project documentation.

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Features

### Entity Resolution
- Search and track entities across multiple data sources
- View unified timelines aggregating card swipes, WiFi logs, bookings, library checkouts, and CCTV detections
- Resolution scoring based on available identifiers

### Dashboard
- Real-time entity statistics
- Campus activity monitoring
- Location-based activity tracking
- Alert management

### Data Integration
- Direct Supabase integration with type-safe queries
- Production-grade error handling
- Optimized query performance with React Query caching

## Project Structure

```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks (useSearch, useTimeline)
├── integrations/     # External service integrations
│   └── supabase/    # Supabase client and provider
├── lib/             # Utility functions and query helpers
│   └── supabase-queries.ts  # Production-grade database queries
├── pages/           # Application pages
├── types/           # TypeScript type definitions
│   └── database.types.ts    # Auto-generated Supabase types
└── App.tsx          # Main application component
```

## Key Files

- **`src/lib/supabase-queries.ts`**: All database query functions
- **`src/integrations/supabase/client.ts`**: Supabase client configuration
- **`src/types/database.types.ts`**: TypeScript types matching your database schema
- **`src/hooks/useSearch.ts`**: Entity search functionality
- **`src/hooks/useTimeline.ts`**: Entity timeline aggregation

## Troubleshooting

### TypeScript Errors
The codebase uses `as any` type assertions in some places due to Supabase's strict typing. These are intentional workarounds and will not affect runtime behavior.

### Missing Data
Ensure your Supabase database has the correct schema and Row Level Security (RLS) policies configured to allow data access.

### Authentication Issues
Check that your Supabase anon key has the correct permissions and that RLS policies are properly configured.

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider (Vercel, Netlify, etc.)

3. **Set environment variables** in your hosting platform's dashboard

4. **Configure CORS** in Supabase if deploying to a different domain

## Support

For issues or questions, refer to the project documentation or contact the development team.
