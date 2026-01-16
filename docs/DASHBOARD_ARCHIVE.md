# Lovdash Dashboard Archive

> **Document Purpose:** This file provides a comprehensive record of the dashboard functionality that was removed from the marketing landing page project to create a clean separation between marketing and application code.
>
> **Date Archived:** January 2026  
> **Project:** lovebite_landingpage (now marketing-only)  
> **Dashboard moved to:** app.lovdash.com

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Dashboard Routes](#dashboard-routes)
4. [API Endpoints](#api-endpoints)
5. [Components](#components)
6. [Database Schema](#database-schema)
7. [Authentication System](#authentication-system)
8. [Features in Detail](#features-in-detail)
9. [Server Actions](#server-actions)
10. [Hooks & Utilities](#hooks--utilities)
11. [Third-Party Integrations](#third-party-integrations)
12. [Environment Variables](#environment-variables)

---

## Overview

The Lovdash Dashboard was a comprehensive creator management platform providing:

- **Media Library Management** - Upload, organize, AI-tag media files
- **Bio Link Builder** - Customizable link-in-bio pages (bites.bio)
- **Analytics Dashboard** - Traffic, engagement, and revenue metrics
- **Multi-Platform Account Management** - Store credentials for OnlyFans, Fansly, etc.
- **Contract Management** - Digital contract generation and signing
- **Team/Studio Management** - Multi-creator agencies with role-based access
- **WhatsApp Integration** - Bot and assistant for creator communication
- **Onboarding System** - New creator registration and verification

### User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `admin` | Platform administrators | Full access to all features and all creators |
| `business` | Agency/studio managers | Access to their studio's creators and team features |
| `independent` | Individual creators | Access to their own content and settings only |

---

## Architecture

### Hybrid Database Architecture

The dashboard used a hybrid database approach:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOVDASH ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐         ┌─────────────────────────────┐      │
│   │   SUPABASE      │ ──sync→ │        MONGODB              │      │
│   │   (Auth Only)   │         │   (All Business Data)       │      │
│   ├─────────────────┤         ├─────────────────────────────┤      │
│   │ • auth.users    │         │ • users (synced from auth)  │      │
│   │ • sessions      │         │ • creators                  │      │
│   │ • verify_codes  │         │ • studios                   │      │
│   └─────────────────┘         │ • media                     │      │
│                               │ • mediaMetadata             │      │
│                               │ • bioLinks                  │      │
│                               │ • socialAccounts            │      │
│                               │ • analytics                 │      │
│                               │ • onboardings               │      │
│                               │ • contracts                 │      │
│                               │ • whatsappGroups            │      │
│                               │ • notifications             │      │
│                               │ • activityLogs              │      │
│                               └─────────────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Supabase** handled:
- User authentication (email/password, magic links)
- Session management
- Email verification codes
- Password reset flows

**MongoDB** stored:
- All business/application data
- Creator profiles and settings
- Media metadata and analysis results
- Bio link configurations
- Analytics events

---

## Dashboard Routes

### Main Dashboard Pages

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Home | Overview with stats, charts, quick actions |
| `/dashboard/activity` | Activity Log | User actions and audit trail |
| `/dashboard/statistics` | Analytics | Detailed traffic and engagement metrics |
| `/dashboard/media` | Media Library | Upload, organize, tag media files |
| `/dashboard/albums` | Scenarios | Group media into collections/scenarios |
| `/dashboard/bio-links` | Bio Link Editor | Customize bio link page |
| `/dashboard/bio-links/domains` | Custom Domains | Configure custom domains |
| `/dashboard/accounts` | Platform Accounts | Manage OnlyFans, Fansly credentials |
| `/dashboard/contracts` | Contracts | View and sign contracts |
| `/dashboard/settings` | Settings | User preferences and profile |

### Admin/Business Routes

| Route | Page | Access |
|-------|------|--------|
| `/dashboard/models` | Models Management | business, admin |
| `/dashboard/onboarding` | Onboarding Management | business, admin |
| `/dashboard/onboarding/wizard` | Onboarding Wizard | business, admin |
| `/dashboard/studios` | Studios Management | admin only |
| `/dashboard/whatsapp` | WhatsApp Bot | admin only |
| `/dashboard/whatsapp-assistant` | WhatsApp Assistant | all roles |
| `/dashboard/admin` | Admin Panel | admin only |
| `/dashboard/admin/migration` | Data Migration Tools | admin only |

### Auth Routes

| Route | Page |
|-------|------|
| `/dashboard/login` | Sign In |
| `/dashboard/login/forgot-password` | Password Reset Request |
| `/dashboard/login/reset-password` | Set New Password |
| `/dashboard/setup` | Initial Profile Setup |

### Social Routes (Dev Only)

| Route | Page |
|-------|------|
| `/dashboard/social/calendar` | Content Calendar |
| `/dashboard/social/automations` | Posting Automations |

---

## API Endpoints

### Authentication (`/api/auth/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/me` | GET | Get current user profile |
| `/api/auth/callback` | GET | OAuth callback handler |
| `/api/auth/create-user` | POST | Create new dashboard user |
| `/api/auth/sync-user` | POST | Sync Supabase auth to MongoDB |
| `/api/auth/2fa` | POST | Two-factor authentication |
| `/api/auth/phone-login` | POST | Phone number login |
| `/api/auth/send-verification` | POST | Send email verification |
| `/api/auth/verify-email` | POST | Verify email address |
| `/api/auth/send-password-reset` | POST | Send password reset email |
| `/api/auth/reset-password` | POST | Complete password reset |
| `/api/auth/send-welcome` | POST | Send welcome email |

### Media (`/api/media/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/media/[mediaId]/metadata` | GET/PATCH | Get/update media metadata |
| `/api/media/labels` | GET/POST | Manage media labels |
| `/api/media/sync-pinecone` | POST | Sync to Pinecone vector DB |

### Analytics (`/api/analytics/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/track` | POST | Track analytics events |
| `/api/analytics/bio/[bioLinkId]` | GET | Get bio link analytics |
| `/api/analytics/bio/models` | GET | Get analytics for multiple models |

### Onboarding & Contracts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-onboarding` | POST | Start new onboarding |
| `/api/send-onboarding` | POST | Send onboarding email |
| `/api/send-rejection` | POST | Send rejection email |
| `/api/generate-contract` | POST | Generate PDF contract |
| `/api/send-contract-success` | POST | Send contract signed email |

### WhatsApp & Twilio

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/whatsapp/register-model` | POST | Register creator for WhatsApp |
| `/api/whatsapp/templates` | GET/POST | Manage message templates |
| `/api/whatsapp-bot/[...path]` | ALL | WhatsApp bot webhook |
| `/api/twilio/send-message` | POST | Send SMS/WhatsApp message |
| `/api/twilio/verify-phone` | POST | Verify phone number |
| `/api/twilio/webhook` | POST | Twilio webhook handler |
| `/api/send-whatsapp-code` | POST | Send WhatsApp verification |

### Studio & Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/studio/leave` | POST | Leave a studio |
| `/api/studio-invites` | GET/POST | Manage studio invitations |
| `/api/studio-invites/[inviteId]` | PATCH | Accept/decline invite |
| `/api/admin/create-user` | POST | Admin user creation |
| `/api/notifications` | GET/PATCH | User notifications |
| `/api/activity` | GET | Activity log |

### Utility

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/data` | GET | Data export |
| `/api/migrate` | POST | Data migration |
| `/api/media-proxy/[...path]` | GET | Proxy media files |

---

## Components

### Dashboard-Specific Components

```
components/
├── accounts/
│   └── AccountsGrid.tsx          # Platform account management grid
├── bio-links/
│   ├── BioAnalytics.tsx          # Bio link analytics display
│   └── MediaLinkCard.tsx         # Link item with media preview
├── contracts/
│   ├── ContractCreator.tsx       # Contract generation form
│   └── ContractTemplates.tsx     # Contract template selector
├── dashboard/
│   └── protected-route.tsx       # Auth guard wrapper
├── media/
│   ├── LabelManager.tsx          # Tag/label management
│   ├── MediaGrid.tsx             # Media library grid view
│   ├── MediaViewer.tsx           # Full-screen media viewer
│   └── MobileUploader.tsx        # Mobile-optimized uploader
├── notifications/
│   └── NotificationCenter.tsx    # Notification dropdown
├── tags/
│   └── TagManager.tsx            # Global tag management
├── team/
│   └── TeamManagement.tsx        # Studio team management
├── verification/
│   └── VerificationSystem.tsx    # ID verification flow
├── whatsapp/
│   └── phone-number-manager.tsx  # WhatsApp number setup
└── ui/
    ├── chart.tsx                 # Recharts wrapper
    ├── sidebar.tsx               # Dashboard navigation sidebar
    ├── signature-pad.tsx         # Digital signature canvas
    └── calendar.tsx              # Date picker component
```

### Dashboard Layout Structure

The main dashboard layout (`app/dashboard/layout.tsx`) provided:

1. **Sidebar Navigation** - Collapsible sidebar with role-based menu items
2. **Header** - Notification center, user dropdown
3. **Context Provider** - `DashboardContext` with user, creator, API key
4. **Media State Provider** - Global media counts and state

Navigation sections:
- Home (Dashboard, Activity)
- Analytics (Statistics)
- Content (Media Library, Scenarios)
- Bio Links (Manage, Domains)
- Accounts (Platform Accounts, Contracts)
- Social (Calendar, Automations) - dev only
- Team (Models, Onboarding, Studios) - role-restricted
- Tools (WhatsApp Assistant, WhatsApp Bot)
- Settings

---

## Database Schema

### Supabase Tables (Auth)

```sql
-- dashboard_users: Bridge between Supabase Auth and application
CREATE TABLE dashboard_users (
  id UUID PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id),
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'business', 'independent')),
  creator_id UUID REFERENCES creators(id),
  studio_id UUID REFERENCES studios(id),
  display_name TEXT,
  avatar_url TEXT,
  enabled BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- email_verification_codes
CREATE TABLE email_verification_codes (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- password_reset_codes
CREATE TABLE password_reset_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### MongoDB Collections

#### creators
```javascript
{
  _id: ObjectId,
  username: String,              // Unique
  displayName: String,
  email: String,
  phone: String,
  bio: String,
  storageFolder: String,         // DigitalOcean Spaces folder
  bioLink: String,
  studioId: ObjectId,            // Reference to studios
  whatsappGroupId: String,       // WhatsApp group JID
  enabled: Boolean,
  taggingConfig: {
    bodyCategories: [String],
    styleCategories: [String],
    scenarioCategories: [String],
    customTags: [String],
  },
  stats: {
    totalMedia: Number,
    totalPhotos: Number,
    totalVideos: Number,
    storageUsedBytes: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### media
```javascript
{
  _id: ObjectId,
  creatorId: ObjectId,
  mediaType: String,             // "image" | "video" | "audio"
  fileName: String,
  storageUrl: String,
  thumbnailUrl: String,
  contentHash: String,           // For deduplication
  category: String,
  fileSizeBytes: Number,
  duration: Number,
  dimensions: { width: Number, height: Number },
  aiAnalysis: {
    description: String,
    isNsfw: Boolean,
    bodyFocus: [String],
    style: String,
    scenario: String,
    contentTags: [String],
    analyzedAt: Date,
    pineconeId: String,
  },
  tags: [ObjectId],              // References to tags
  labels: [String],
  albums: [ObjectId],
  sourceType: String,            // "upload" | "whatsapp" | "api"
  createdAt: Date,
  updatedAt: Date
}
```

#### bioLinks
```javascript
{
  _id: ObjectId,
  creatorId: ObjectId,
  slug: String,                  // URL slug
  name: String,
  tagline: String,
  subtitle: String,
  profileImageUrl: String,
  galleryImageUrl: String,
  welcomeTitle: String,
  welcomeText: String,
  theme: Object,
  isPublished: Boolean,
  customDomain: String,
  items: [{
    _id: ObjectId,
    label: String,
    subText: String,
    href: String,
    iconType: String,
    iconColor: String,
    pillText: String,
    pillColor: String,
    mediaId: ObjectId,
    mediaUrl: String,
    sortOrder: Number,
    enabled: Boolean
  }],
  socialLinks: [{
    _id: ObjectId,
    platform: String,
    url: String,
    sortOrder: Number,
    enabled: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### studios
```javascript
{
  _id: ObjectId,
  name: String,
  whatsappGroupId: String,
  contactPhone: String,
  enabled: Boolean,
  settings: {
    defaultTaggingConfig: Object,
    autoAssignTags: Boolean,
    notificationPreferences: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### onboardings
```javascript
{
  _id: ObjectId,
  email: String,
  status: String,                // "pending" | "email_sent" | "in_progress" | "submitted" | "approved" | "rejected"
  fullName: String,
  stageName: String,
  dateOfBirth: Date,
  address: { street, city, postalCode, country },
  identification: {
    idType: String,
    idNumber: String,
    idFrontPath: String,
    idBackPath: String,
    selfieWithIdPath: String
  },
  signaturePath: String,
  signedContractPath: String,
  preferences: {
    categories: [String],
    platforms: [String],
    languages: [String]
  },
  socials: { instagram, tiktok, twitter },
  linkedCreatorId: ObjectId,
  dashboardUserId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

#### socialAccounts
```javascript
{
  _id: ObjectId,
  creatorId: ObjectId,
  platform: String,              // "onlyfans" | "fansly" | "instagram"
  email: String,
  password: String,              // Encrypted
  username: String,
  label: String,
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,       // Encrypted
  notes: String,
  enabled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### analytics
```javascript
{
  _id: ObjectId,
  type: String,                  // "pageView" | "linkClick" | "mediaView"
  bioLinkId: ObjectId,
  bioLinkItemId: ObjectId,
  creatorId: ObjectId,
  visitorId: String,
  ipHash: String,
  country: String,
  city: String,
  referrer: String,
  userAgent: String,
  deviceType: String,
  browser: String,
  os: String,
  metadata: Object,
  createdAt: Date
}
```

#### notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,                  // "studio_invite" | "invite_accepted" | "model_left"
  title: String,
  message: String,
  data: Object,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

#### activityLogs
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  creatorId: ObjectId,
  studioId: ObjectId,
  action: String,                // "media_upload" | "login" | "bio_update" | etc.
  description: String,
  metadata: Object,
  source: String,                // "dashboard" | "api" | "whatsapp"
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

---

## Authentication System

### Login Flow

1. User enters email/password at `/dashboard/login`
2. Supabase Auth validates credentials
3. On success, middleware refreshes session cookies
4. Dashboard layout fetches user profile via `/api/auth/me`
5. If no `dashboard_users` record, redirect to `/dashboard/setup`

### Session Management

```typescript
// Middleware (middleware.ts) handled:
// 1. Session refresh for dashboard routes
// 2. Redirect unauthenticated users to login
// 3. Redirect authenticated users away from login page

// Session check in dashboard layout:
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  router.push("/dashboard/login");
}
```

### Role-Based Access Control

```typescript
// lib/auth.ts
export function hasRole(userRole: string | null, requiredRoles: string[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export function canAccessCreator(
  userRole: string,
  userCreatorId: string | null,
  userStudioId: string | null,
  targetCreatorId: string,
  targetStudioId: string | null
): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'independent') {
    return userCreatorId === targetCreatorId;
  }
  if (userRole === 'business') {
    return userStudioId === targetStudioId;
  }
  return false;
}
```

---

## Features in Detail

### Media Library

The media library provided:

- **Multi-file upload** with drag-and-drop
- **AI-powered tagging** via external service
- **Category organization** (user-defined folders)
- **Label system** for quick filtering
- **Bulk operations** (move, delete, re-categorize)
- **Search** by filename, tags, labels
- **Preview** with full-screen viewer
- **Mobile-optimized** TikTok-style upload experience

Media was stored in DigitalOcean Spaces with paths like:
```
lovdash/{creator_username}/{category}/{filename}
```

### Bio Link System

Bio links (bites.bio) featured:

- **Customizable profile** - name, tagline, images
- **Drag-and-drop links** with icons and badges
- **Custom domains** - Connect your own domain
- **QR code generator** with color customization
- **Analytics** - Views, clicks, CTR, country breakdown
- **Publish/Draft states**

Link types supported:
- Crown (premium content)
- Heart (wishlist/tips)
- Video (video content)
- Footprints (feet content)
- Link (generic)
- Globe (website)
- Zap (special offers)
- Sparkles (featured)

### Contract System

Digital contracts included:

- **Template selection** from predefined contracts
- **Form filling** with validation
- **Digital signature** capture (canvas)
- **PDF generation** with jsPDF/pdf-lib
- **Email delivery** of signed contracts
- **Secure storage** of signed documents

### WhatsApp Integration

WhatsApp features:

- **Bot** for automated media collection from WhatsApp groups
- **Assistant** for AI-powered messaging
- **Group management** - Link creators to groups
- **Message templates** for common responses
- **Phone verification** via Twilio

---

## Server Actions

Located in `lib/actions/`:

### `auth.ts`
- `signIn(email, password)` - User login
- `signOut()` - User logout
- `signUp(data)` - New user registration

### `media.ts`
- `getMediaLibrary(params)` - Fetch media with filters
- `getMediaStats(creatorId)` - Get media statistics
- `updateMediaCategory(mediaId, category)` - Change category
- `updateMediaLabels(mediaId, labels)` - Update labels
- `batchUpdateMediaCategory(mediaIds, category)` - Bulk update
- `batchDeleteMedia(mediaIds)` - Bulk delete
- `getMediaCategories(creatorId)` - List categories
- `getMediaLabels(creatorId)` - List labels

### `bio-links.ts`
- `getBioLink(creatorId)` - Fetch bio link
- `updateBioLink(id, data)` - Update settings
- `addBioLinkItem(bioLinkId, data)` - Add link
- `updateBioLinkItem(id, data)` - Edit link
- `deleteBioLinkItem(id)` - Remove link
- `reorderBioLinkItems(items)` - Change order

### `accounts.ts`
- `getPlatformAccounts(creatorId)` - List accounts
- `addPlatformAccount(data)` - Add account
- `updatePlatformAccount(id, data)` - Update account
- `deletePlatformAccount(id)` - Remove account

### `dashboard.ts`
- `getDashboardStats(userId)` - Overview statistics
- `getRecentActivity(userId)` - Activity log
- `getCreatorOverview(creatorId)` - Creator summary

---

## Hooks & Utilities

### Hooks (`lib/hooks/`)

#### `use-media-state.tsx`
Global media state management:
```typescript
interface MediaStateContext {
  globalCounts: MediaCounts | null;
  creatorMediaCounts: Record<string, MediaCounts>;
  refreshCounts: () => Promise<void>;
  updateCountsOnUpload: (creatorId: string, mediaType: string) => void;
  updateCountsOnDelete: (creatorId: string, mediaType: string, count: number) => void;
}
```

#### `use-permissions.ts`
Permission checking hook:
```typescript
function usePermissions() {
  const { user } = useDashboard();
  return {
    canManageCreators: user?.role === 'admin' || user?.role === 'business',
    canViewAllMedia: user?.role === 'admin',
    canManageStudios: user?.role === 'admin',
    // ...
  };
}
```

#### `use-whatsapp-status.ts`
WhatsApp connection status:
```typescript
function useWhatsappStatus() {
  // Returns connection state, phone number, QR code for pairing
}
```

### Utilities (`lib/`)

#### `utils.ts`
```typescript
// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### `permissions.ts`
```typescript
// Role-based permission constants and helpers
export const PERMISSIONS = {
  MANAGE_CREATORS: ['admin', 'business'],
  MANAGE_STUDIOS: ['admin'],
  VIEW_ALL_MEDIA: ['admin'],
  // ...
};
```

#### `media-api.ts`
```typescript
// API client for media operations
export function createApiClient(apiKey: string) {
  return {
    uploadMedia: (file, options) => ...,
    getCreatorStats: (creatorId, months) => ...,
    getPlatformOverview: () => ...,
    // ...
  };
}
```

#### `email-templates.ts`
```typescript
// HTML email templates for:
// - Welcome emails
// - Onboarding invitations
// - Contract signed confirmations
// - Password reset
// - Email verification
```

#### `twilio.ts`
```typescript
// Twilio client for SMS/WhatsApp
export async function sendSMS(to: string, body: string) { ... }
export async function sendWhatsApp(to: string, body: string) { ... }
export async function verifyPhone(phoneNumber: string) { ... }
```

---

## Third-Party Integrations

### Supabase
- **Purpose:** Authentication and user management
- **Features used:** Auth, PostgreSQL, Row Level Security
- **Packages:** `@supabase/supabase-js`, `@supabase/ssr`

### MongoDB
- **Purpose:** Application data storage
- **Connection:** Self-hosted replica set
- **Package:** `mongodb`

### Resend
- **Purpose:** Transactional email delivery
- **Templates:** Welcome, verification, contracts, onboarding
- **Package:** `resend`

### Twilio
- **Purpose:** SMS and WhatsApp messaging
- **Features:** Phone verification, WhatsApp bot
- **Package:** Custom integration

### Recharts
- **Purpose:** Dashboard analytics charts
- **Charts:** Area, Line, Bar charts
- **Package:** `recharts`

### DigitalOcean Spaces
- **Purpose:** Media file storage
- **Features:** S3-compatible object storage
- **Access:** Via presigned URLs

### Pinecone
- **Purpose:** Vector database for AI search
- **Features:** Semantic media search
- **Integration:** `/api/media/sync-pinecone`

---

## Environment Variables

```bash
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MongoDB
MONGODB_URI=mongodb://user:pass@host:27017/?replicaSet=rs0&authSource=admin
MONGODB_DATABASE=lovdash

# Resend Email
RESEND_API_KEY=re_xxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx

# DigitalOcean Spaces
DO_SPACES_KEY=xxx
DO_SPACES_SECRET=xxx
DO_SPACES_BUCKET=lovdash
DO_SPACES_REGION=nyc3
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com

# Media API
MEDIA_API_URL=https://api.lovdash.com
MEDIA_API_KEY=xxx

# WhatsApp
WHATSAPP_API_URL=xxx
WHATSAPP_API_TOKEN=xxx
```

---

## Migration Notes

### Files Removed

```
app/dashboard/                    # All dashboard routes
app/(auth)/dashboard/             # Auth routes (login, setup)
app/ai/                           # AI page
app/register/                     # Registration flow
app/api/* (most routes)           # All API routes except health

components/accounts/              # Account management
components/bio-links/             # Bio link components
components/contracts/             # Contract system
components/dashboard/             # Dashboard utilities
components/media/                 # Media library
components/notifications/         # Notifications
components/tags/                  # Tag management
components/team/                  # Team management
components/verification/          # ID verification
components/whatsapp/              # WhatsApp integration
components/ui/chart.tsx           # Charts
components/ui/sidebar.tsx         # Dashboard sidebar
components/ui/signature-pad.tsx   # Signature capture
components/ui/calendar.tsx        # Date picker

lib/actions/                      # Server actions
lib/auth.ts                       # Auth utilities
lib/mongodb/                      # MongoDB client
lib/supabase.ts                   # Supabase browser client
lib/supabase-server.ts            # Supabase server client
lib/database.types.ts             # TypeScript types
lib/permissions.ts                # Permission helpers
lib/media-api.ts                  # Media API client
lib/twilio.ts                     # Twilio integration
lib/email-templates.ts            # Email templates
lib/hooks/                        # Custom hooks

scripts/                          # Migration scripts
supabase/                         # Supabase migrations
```

### Dependencies Removed

```json
{
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.86.0",
  "@types/react-signature-canvas": "^1.0.7",
  "jspdf": "^3.0.4",
  "mongodb": "^7.0.0",
  "pdf-lib": "^1.17.1",
  "qrcode.react": "^4.2.0",
  "react-day-picker": "^9.11.3",
  "react-signature-canvas": "^1.1.0-alpha.2",
  "recharts": "^2.15.4",
  "resend": "^6.5.2"
}
```

---

## Reconstruction Guide

To rebuild the dashboard from this documentation:

1. **Set up authentication** with Supabase Auth
2. **Create MongoDB collections** per schema above
3. **Implement API routes** for each endpoint
4. **Build dashboard layout** with sidebar navigation
5. **Create page components** for each route
6. **Add server actions** for data mutations
7. **Integrate third-party services** (Resend, Twilio, etc.)
8. **Implement role-based access** throughout

The dashboard now lives at **app.lovdash.com** as a separate application.

---

*Document version: 1.0*  
*Last updated: January 2026*
