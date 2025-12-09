import type { Metadata } from 'next';
import { getCreator } from '@/lib/creators';
import CreatorBioClient from './CreatorBioClient';
import NotFoundClient from './NotFoundClient';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface PageProps {
  params: Promise<{ creatorID: string }>;
}

// ============================================
// DYNAMIC METADATA
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { creatorID } = await params;
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
  const creator = getCreator(creatorID);

  // Show "Not Found" screen if creator doesn't exist
  if (!creator) {
    return <NotFoundClient />;
  }

  // Render the client component with creator data
  return <CreatorBioClient creator={creator} />;
}
