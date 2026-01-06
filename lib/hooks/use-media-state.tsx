"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { createApiClient, type Media } from "@/lib/media-api";

// ============================================
// TYPES
// ============================================

export interface MediaCounts {
  image: number;
  video: number;
  audio: number;
  total: number;
}

export interface CreatorMediaCounts {
  [creatorId: string]: MediaCounts;
}

export interface UploadingItem {
  id: string;
  file: File;
  creatorId: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  preview?: string;
  media?: Media;
  error?: string;
  category?: string;
}

interface MediaStateContextType {
  // Counts
  globalCounts: MediaCounts;
  creatorMediaCounts: CreatorMediaCounts;
  isCountsLoading: boolean;
  
  // Uploading items (for displaying in media grid)
  uploadingItems: UploadingItem[];
  
  // Methods
  refreshCounts: () => Promise<void>;
  addUploadingItem: (item: UploadingItem) => void;
  updateUploadingItem: (id: string, updates: Partial<UploadingItem>) => void;
  removeUploadingItem: (id: string) => void;
  completeUpload: (id: string, media: Media) => void;
  clearCompletedUploads: () => void;
  
  // Increment counts locally (for optimistic updates)
  incrementCounts: (creatorId: string, mediaType: "image" | "video" | "audio") => void;
}

const MediaStateContext = createContext<MediaStateContextType | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

interface MediaStateProviderProps {
  children: React.ReactNode;
  apiKey: string | null;
  userRole: "admin" | "business" | "independent" | null;
  userCreatorId?: string | null;
  userStudioId?: string | null;
}

export function MediaStateProvider({
  children,
  apiKey,
  userRole,
  userCreatorId,
  userStudioId,
}: MediaStateProviderProps) {
  const [globalCounts, setGlobalCounts] = useState<MediaCounts>({ image: 0, video: 0, audio: 0, total: 0 });
  const [creatorMediaCounts, setCreatorMediaCounts] = useState<CreatorMediaCounts>({});
  const [uploadingItems, setUploadingItems] = useState<UploadingItem[]>([]);
  const [isCountsLoading, setIsCountsLoading] = useState(false);
  
  // Track if counts have been loaded initially
  const countsLoadedRef = useRef(false);

  // Fetch media counts using the dedicated counts endpoint
  const refreshCounts = useCallback(async () => {
    if (!apiKey) return;

    setIsCountsLoading(true);
    try {
      const api = createApiClient(apiKey);
      
      // Determine studio filter based on user role
      const studioIdParam = userRole === "business" ? userStudioId || undefined : undefined;
      
      // Use the dedicated counts endpoint for efficiency
      const response = await api.getMediaCounts({
        studio_id: studioIdParam,
      });
      
      if (response.success && response.data) {
        setCreatorMediaCounts(response.data.data);
        setGlobalCounts(response.data.totals);
      } else {
        console.error("Failed to fetch media counts:", response.error);
      }
      
      countsLoadedRef.current = true;
    } catch (err) {
      console.error("Error refreshing media counts:", err);
    } finally {
      setIsCountsLoading(false);
    }
  }, [apiKey, userRole, userStudioId]);

  // Load counts on mount
  useEffect(() => {
    if (apiKey && !countsLoadedRef.current) {
      refreshCounts();
    }
  }, [apiKey, refreshCounts]);

  // Add uploading item
  const addUploadingItem = useCallback((item: UploadingItem) => {
    setUploadingItems(prev => [item, ...prev]);
  }, []);

  // Update uploading item
  const updateUploadingItem = useCallback((id: string, updates: Partial<UploadingItem>) => {
    setUploadingItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  // Remove uploading item
  const removeUploadingItem = useCallback((id: string) => {
    setUploadingItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  // Complete an upload - updates counts and marks item as complete
  const completeUpload = useCallback((id: string, media: Media) => {
    setUploadingItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "complete", media, progress: 100 } : item
      )
    );

    // Update counts optimistically
    const creatorId = media.creator_id;
    const mediaType = media.media_type as "image" | "video" | "audio";

    setCreatorMediaCounts(prev => {
      const existing = prev[creatorId] || { image: 0, video: 0, audio: 0, total: 0 };
      return {
        ...prev,
        [creatorId]: {
          ...existing,
          [mediaType]: existing[mediaType] + 1,
          total: existing.total + 1,
        },
      };
    });

    setGlobalCounts(prev => ({
      ...prev,
      [mediaType]: prev[mediaType] + 1,
      total: prev.total + 1,
    }));
  }, []);

  // Clear completed uploads from the uploading list
  const clearCompletedUploads = useCallback(() => {
    setUploadingItems(prev => {
      // Revoke preview URLs for completed items
      prev.forEach(item => {
        if (item.status === "complete" && item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
      return prev.filter(item => item.status !== "complete");
    });
  }, []);

  // Increment counts locally (for optimistic updates)
  const incrementCounts = useCallback((creatorId: string, mediaType: "image" | "video" | "audio") => {
    setCreatorMediaCounts(prev => {
      const existing = prev[creatorId] || { image: 0, video: 0, audio: 0, total: 0 };
      return {
        ...prev,
        [creatorId]: {
          ...existing,
          [mediaType]: existing[mediaType] + 1,
          total: existing.total + 1,
        },
      };
    });

    setGlobalCounts(prev => ({
      ...prev,
      [mediaType]: prev[mediaType] + 1,
      total: prev.total + 1,
    }));
  }, []);

  const value: MediaStateContextType = {
    globalCounts,
    creatorMediaCounts,
    isCountsLoading,
    uploadingItems,
    refreshCounts,
    addUploadingItem,
    updateUploadingItem,
    removeUploadingItem,
    completeUpload,
    clearCompletedUploads,
    incrementCounts,
  };

  return (
    <MediaStateContext.Provider value={value}>
      {children}
    </MediaStateContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useMediaState() {
  const context = useContext(MediaStateContext);
  if (!context) {
    throw new Error("useMediaState must be used within a MediaStateProvider");
  }
  return context;
}

// Optional hook that returns null if not in provider (for components that might be used outside dashboard)
export function useMediaStateOptional() {
  return useContext(MediaStateContext);
}

