import type { Metadata } from 'next';
import { getCreator, type CreatorProfile, type CreatorLink } from '@/lib/creators';
import { createClient } from '@supabase/supabase-js';
import CreatorBioClient from './CreatorBioClient';
import NotFoundClient from './NotFoundClient';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface PageProps {
  params: Promise<{ creatorID: string }>;
}

interface BioLinkData {
  id: string;
  creator_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  subtitle: string | null;
  profile_image_url: string | null;
  gallery_image_url: string | null;
  welcome_title: string | null;
  welcome_text: string | null;
  is_published: boolean;
  custom_domain: string | null;
}

interface BioLinkItem {
  id: string;
  bio_link_id: string;
  label: string;
  sub_text: string | null;
  href: string;
  icon_type: string;
  icon_color: string | null;
  pill_text: string | null;
  pill_color: string | null;
  sort_order: number;
  enabled: boolean;
}

interface BioSocialLink {
  id: string;
  bio_link_id: string;
  platform: string;
  url: string;
  enabled: boolean;
}

// Create a Supabase client for server-side use
const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Convert database data to CreatorProfile format for the original component
function convertToCreatorProfile(
  bioLink: BioLinkData,
  items: BioLinkItem[],
  socials: BioSocialLink[]
): CreatorProfile {
  // Convert items to links
  const links: CreatorLink[] = items.map((item) => ({
    id: item.id,
    label: item.label,
    sub: item.sub_text || undefined,
    href: item.href,
    pill: item.pill_text || undefined,
    pillColor: item.pill_color || undefined,
    iconType: (item.icon_type as "crown" | "video" | "heart" | "footprints") || "heart",
    iconColor: item.icon_color || "text-pink-500",
  }));

  // Convert socials to socialLinks format
  const socialLinks: CreatorProfile["socialLinks"] = {};
  socials.forEach((social) => {
    const platform = social.platform.toLowerCase();
    if (platform === "x" || platform === "twitter") {
      socialLinks.x = social.url;
    } else if (platform === "reddit") {
      socialLinks.reddit = social.url;
    } else if (platform === "instagram") {
      socialLinks.instagram = social.url;
    } else if (platform === "tiktok") {
      socialLinks.tiktok = social.url;
    }
  });

  return {
    id: bioLink.slug,
    name: bioLink.name,
    tagline: bioLink.tagline || "Content Creator",
    subtitle: bioLink.subtitle || "",
    profileImage: bioLink.profile_image_url || "",
    galleryImage: bioLink.gallery_image_url || undefined,
    welcomeTitle: bioLink.welcome_title || "Welcome!",
    welcomeText: bioLink.welcome_text || "",
    socialLinks,
    links,
    primaryLink: links[0]?.href || "#",
    customDomains: bioLink.custom_domain ? [bioLink.custom_domain] : undefined,
  };
}

// Fetch bio link data from Supabase
async function getBioLinkFromDatabase(slug: string) {
  try {
    const supabase = getSupabaseClient();
    
    // First try to find by slug (case-insensitive)
    let { data: bioLink, error } = await supabase
      .from('bio_links')
      .select('*')
      .ilike('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !bioLink) {
      // Try to find by custom_domain
      const { data: bioByDomain } = await supabase
        .from('bio_links')
        .select('*')
        .ilike('custom_domain', slug)
        .eq('is_published', true)
        .single();
      
      if (bioByDomain) {
        bioLink = bioByDomain;
      } else {
        return null;
      }
    }

    // Fetch link items
    const { data: items } = await supabase
      .from('bio_link_items')
      .select('*')
      .eq('bio_link_id', bioLink.id)
      .eq('enabled', true)
      .order('sort_order');

    // Fetch social links
    const { data: socials } = await supabase
      .from('bio_social_links')
      .select('*')
      .eq('bio_link_id', bioLink.id)
      .eq('enabled', true)
      .order('sort_order');

    // Convert to CreatorProfile format
    return convertToCreatorProfile(
      bioLink as BioLinkData,
      (items || []) as BioLinkItem[],
      (socials || []) as BioSocialLink[]
    );
  } catch (err) {
    console.error('Error fetching bio link:', err);
    return null;
  }
}

// ============================================
// DYNAMIC METADATA
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { creatorID } = await params;
  
  // First check Supabase
  const dbCreator = await getBioLinkFromDatabase(creatorID);
  
  if (dbCreator) {
    return {
      title: `${dbCreator.name} | Your Private Fantasy Live - Lovebite Bio`,
      description: `${dbCreator.tagline}. ${dbCreator.subtitle}. Join me for exclusive content.`,
      openGraph: {
        title: `${dbCreator.name} | Lovebite Bio`,
        description: `${dbCreator.tagline}. ${dbCreator.subtitle}`,
        images: dbCreator.profileImage ? [dbCreator.profileImage] : [],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${dbCreator.name} | Lovebite Bio`,
        description: `${dbCreator.tagline}. ${dbCreator.subtitle}`,
        images: dbCreator.profileImage ? [dbCreator.profileImage] : [],
      },
    };
  }

  // Fallback to local database
  const creator = getCreator(creatorID);

  if (!creator) {
    return {
      title: 'Bio Not Found | Lovebite',
      description: 'This creator profile does not exist.',
    };
  }

  return {
    title: `${creator.name} | Your Private Fantasy Live - Lovebite Bio`,
    description: `${creator.tagline}. ${creator.subtitle}. Join me for exclusive content.`,
    openGraph: {
      title: `${creator.name} | Lovebite Bio`,
      description: `${creator.tagline}. ${creator.subtitle}`,
      images: [creator.profileImage],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${creator.name} | Lovebite Bio`,
      description: `${creator.tagline}. ${creator.subtitle}`,
      images: [creator.profileImage],
    },
  };
}

// ============================================
// SERVER COMPONENT
// ============================================

export default async function CreatorPage({ params }: PageProps) {
  const { creatorID } = await params;
  
  // First try Supabase database
  const dbCreator = await getBioLinkFromDatabase(creatorID);
  
  if (dbCreator) {
    // Use the original CreatorBioClient with converted data
    return <CreatorBioClient creator={dbCreator} />;
  }

  // Fallback to local database for legacy creators
  const creator = getCreator(creatorID);

  // Show "Not Found" screen if creator doesn't exist in either
  if (!creator) {
    return <NotFoundClient />;
  }

  // Render the client component with creator data
  return <CreatorBioClient creator={creator} />;
}
