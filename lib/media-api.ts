// ============================================
// Lovdash MEDIA API CLIENT
// ============================================
// This client interfaces with the external media management microservice
// Uses a local proxy to avoid mixed content (HTTPS -> HTTP) issues

// Use our internal proxy to avoid mixed content errors
// The proxy forwards requests to the actual Media API on port 3002
const API_BASE_URL = '/api/media-proxy';

// For file uploads, bypass the proxy and go directly to the backend
// to avoid Vercel's 4.5MB serverless function body size limit
const DIRECT_API_URL = process.env.NEXT_PUBLIC_MEDIA_API_URL || 'https://api.lovdash.com';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// ============================================
// TYPES
// ============================================

export interface ApiUser {
  id: string;
  username: string;
  api_key?: string;
  role: 'admin' | 'business' | 'independent';
  creator_id: string | null;
  studio_id: string | null;
  enabled: boolean;
  accessible_creators?: number;
  created_at: string;
  updated_at: string;
}

export interface Creator {
  id: string;
  username: string;
  group_id: string;
  storage_folder: string;
  enabled: boolean;
  bio_link: string | null;
  studio_id: string | null;
  created_at: string;
  updated_at: string;
  studio?: {
    id: string;
    name: string;
  } | null;
  whatsapp_group?: {
    id: string;
    type: string;
  };
}

export interface Studio {
  id: string;
  name: string;
  group_id: string;
  enabled: boolean;
  created_at: string;
  creator_count?: number;
  whatsapp_group?: {
    id: string;
    type: string;
  };
}

export interface Media {
  id: string;
  creator_id: string;
  media_type: 'image' | 'video' | 'audio';
  file_name: string;
  storage_url: string;
  content_hash: string | null;
  category: string | null;
  file_size_bytes: number | null;
  thumbnail_url: string | null;
  created_at: string;
  creator?: {
    id: string;
    username: string;
    group_id: string;
    studio_id: string | null;
  };
}

export interface MediaCategory {
  name: string;
  count: number;
}

export interface MediaAlbum {
  category?: string;
  month?: string;
  date?: string;
  count: number;
  media_types: {
    image: number;
    video: number;
    audio: number;
  };
  items?: Media[];
}

export interface CreatorStats {
  creator: Creator;
  current_month: {
    name: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  };
  all_time: {
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  };
  monthly_history?: Array<{
    month: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
  }>;
  category_breakdown?: MediaCategory[];
}

export interface StudioStats {
  studio: Studio;
  creator_count: number;
  current_month: {
    name: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  };
  all_time: {
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  };
  creator_stats?: Array<{
    id: string;
    username: string;
    enabled: boolean;
    monthly: {
      photos: number;
      videos: number;
      audios: number;
      customs: number;
      total: number;
    };
    all_time: {
      photos: number;
      videos: number;
      audios: number;
      customs: number;
      total: number;
    };
  }>;
}

export interface PlatformOverview {
  counts: {
    creators: number;
    studios: number;
    total_media: number;
  };
  current_month: {
    name: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  };
  all_time: {
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  };
  timestamp: string;
}

export interface LinkedEntity {
  type: 'creator' | 'studio';
  id: string;
  name: string;
  enabled: boolean;
}

export interface WhatsAppGroup {
  id: string;
  name: string;
  participantCount?: number;
  type?: 'creator' | 'studio' | 'other';
  linked_to?: LinkedEntity | null;
}

export interface GroupsResponse {
  success: boolean;
  data: WhatsAppGroup[];
  count: number;
  bot_online: boolean;
  bot_error?: string;
  message?: string;
}

export interface BulkSendResponse {
  success: boolean;
  message: string;
  results: {
    groupId: string;
    success: boolean;
    error?: string;
  }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// ============================================
// API CLIENT CLASS
// ============================================

export class MediaApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============================================
  // USER ENDPOINTS
  // ============================================

  async getCurrentUser(): Promise<ApiResponse<ApiUser>> {
    return this.request<ApiUser>('/api/v1/users/me');
  }

  async listUsers(params?: {
    role?: string;
    enabled?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<ApiUser[]>> {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.set('role', params.role);
    if (params?.enabled !== undefined) searchParams.set('enabled', String(params.enabled));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    
    const query = searchParams.toString();
    return this.request<ApiUser[]>(`/api/v1/users${query ? `?${query}` : ''}`);
  }

  // ============================================
  // CREATOR ENDPOINTS
  // ============================================

  async listCreators(params?: {
    enabled?: boolean;
    studio_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Creator[]>> {
    const searchParams = new URLSearchParams();
    if (params?.enabled !== undefined) searchParams.set('enabled', String(params.enabled));
    if (params?.studio_id) searchParams.set('studio_id', params.studio_id);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    
    const query = searchParams.toString();
    return this.request<Creator[]>(`/api/v1/creators${query ? `?${query}` : ''}`);
  }

  async getCreator(id: string): Promise<ApiResponse<Creator>> {
    return this.request<Creator>(`/api/v1/creators/${id}`);
  }

  async getCreatorByUsername(username: string): Promise<ApiResponse<Creator>> {
    return this.request<Creator>(`/api/v1/creators/username/${username}`);
  }

  // ============================================
  // STUDIO ENDPOINTS
  // ============================================

  async listStudios(params?: {
    enabled?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Studio[]>> {
    const searchParams = new URLSearchParams();
    if (params?.enabled !== undefined) searchParams.set('enabled', String(params.enabled));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    
    const query = searchParams.toString();
    return this.request<Studio[]>(`/api/v1/studios${query ? `?${query}` : ''}`);
  }

  async getStudio(id: string): Promise<ApiResponse<Studio>> {
    return this.request<Studio>(`/api/v1/studios/${id}`);
  }

  async getStudioCreators(studioId: string): Promise<ApiResponse<Creator[]>> {
    return this.request<Creator[]>(`/api/v1/studios/${studioId}/creators`);
  }

  // ============================================
  // MEDIA ENDPOINTS
  // ============================================

  async listMedia(params?: {
    type?: 'image' | 'video' | 'audio';
    category?: string;
    creator_id?: string;
    studio_id?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
    sort_by?: 'created_at' | 'file_name';
    sort_order?: 'asc' | 'desc';
  }): Promise<ApiResponse<Media[]>> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.creator_id) searchParams.set('creator_id', params.creator_id);
    if (params?.studio_id) searchParams.set('studio_id', params.studio_id);
    if (params?.date_from) searchParams.set('date_from', params.date_from);
    if (params?.date_to) searchParams.set('date_to', params.date_to);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params?.sort_order) searchParams.set('sort_order', params.sort_order);
    
    const query = searchParams.toString();
    return this.request<Media[]>(`/api/v1/media${query ? `?${query}` : ''}`);
  }

  async getMediaAlbums(params?: {
    group_by?: 'date' | 'category' | 'month';
    creator_id?: string;
  }): Promise<ApiResponse<MediaAlbum[]>> {
    const searchParams = new URLSearchParams();
    if (params?.group_by) searchParams.set('group_by', params.group_by);
    if (params?.creator_id) searchParams.set('creator_id', params.creator_id);
    
    const query = searchParams.toString();
    return this.request<MediaAlbum[]>(`/api/v1/media/albums${query ? `?${query}` : ''}`);
  }

  async getMediaCategories(params?: { creator_id?: string; studio_id?: string }): Promise<ApiResponse<MediaCategory[]>> {
    const searchParams = new URLSearchParams();
    if (params?.creator_id) searchParams.set('creator_id', params.creator_id);
    if (params?.studio_id) searchParams.set('studio_id', params.studio_id);
    const query = searchParams.toString();
    return this.request<MediaCategory[]>(`/api/v1/media/categories${query ? `?${query}` : ''}`);
  }

  /**
   * Get media counts per creator
   * Returns counts of images, videos, and audio grouped by creator ID
   */
  async getMediaCounts(params?: { studio_id?: string }): Promise<ApiResponse<{
    data: Record<string, { image: number; video: number; audio: number; total: number }>;
    totals: { image: number; video: number; audio: number; total: number };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.studio_id) searchParams.set('studio_id', params.studio_id);
    const query = searchParams.toString();
    return this.request(`/api/v1/media/counts${query ? `?${query}` : ''}`);
  }

  async searchMedia(query: string, params?: {
    creator_id?: string;
    limit?: number;
  }): Promise<ApiResponse<Array<{
    score: number;
    url: string;
    description: string;
    creator: string;
    tags: string[];
    media_type: string;
  }>>> {
    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    if (params?.creator_id) searchParams.set('creator_id', params.creator_id);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    
    return this.request(`/api/v1/media/search?${searchParams.toString()}`);
  }

  async getMedia(id: string): Promise<ApiResponse<Media>> {
    return this.request(`/api/v1/media/${id}`);
  }

  async deleteMedia(id: string): Promise<ApiResponse<{
    id: string;
    file_name: string;
    storage_url: string;
  }>> {
    return this.request(`/api/v1/media/${id}`, { method: 'DELETE' });
  }

  async batchDeleteMedia(ids: string[]): Promise<ApiResponse<{
    requested: number;
    found: number;
    deleted: number;
    errors: string[];
  }>> {
    return this.request('/api/v1/media/batch', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  async updateMediaCategory(id: string, category: string): Promise<ApiResponse<Media>> {
    return this.request(`/api/v1/media/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ category }),
    });
  }

  // ============================================
  // PENDING MEDIA ENDPOINTS
  // ============================================

  /**
   * List pending media files in storage that haven't been processed yet
   */
  async listPendingMedia(params?: {
    creator_id?: string;
    storage_folder?: string;
  }): Promise<ApiResponse<Array<{
    key: string;
    storage_folder: string;
    creator_id: string | null;
    creator_username: string;
    file_name: string;
    content_hash: string;
    url: string;
    size: number;
    last_modified: string;
  }>>> {
    const searchParams = new URLSearchParams();
    if (params?.creator_id) searchParams.set('creator_id', params.creator_id);
    if (params?.storage_folder) searchParams.set('storage_folder', params.storage_folder);
    
    const query = searchParams.toString();
    return this.request(`/api/v1/media/pending${query ? `?${query}` : ''}`);
  }

  /**
   * Process pending media files manually (when RabbitMQ workers aren't available)
   * Moves files from pending to uncategorized folder
   */
  async processPendingMedia(params: {
    keys?: string[];
    creator_id?: string;
    all?: boolean;
    limit?: number;
  }): Promise<ApiResponse<{
    processed: number;
    failed: number;
    errors: string[];
    media: Media[];
  }>> {
    return this.request('/api/v1/media/pending/process', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async uploadMedia(params: {
    file: File;
    creator_id: string;
    category?: string;
    onProgress?: (progress: number) => void;
  }): Promise<ApiResponse<Media>> {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('creator_id', params.creator_id);
    if (params.category) {
      formData.append('category', params.category);
    }

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      // Upload directly to backend API to bypass Vercel's 4.5MB body size limit
      xhr.open('POST', `${DIRECT_API_URL}/api/v1/media/upload`);
      xhr.setRequestHeader('X-API-Key', this.apiKey);

      if (params.onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            params.onProgress!(progress);
          }
        };
      }

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response);
          } else {
            resolve({
              success: false,
              error: response.error || `HTTP ${xhr.status}`,
            });
          }
        } catch {
          resolve({
            success: false,
            error: 'Failed to parse response',
          });
        }
      };

      xhr.onerror = () => {
        resolve({
          success: false,
          error: 'Network error',
        });
      };

      xhr.send(formData);
    });
  }

  async uploadMultipleMedia(params: {
    files: File[];
    creator_id: string;
    category?: string;
    onFileProgress?: (fileIndex: number, progress: number) => void;
    onFileComplete?: (fileIndex: number, success: boolean, media?: Media) => void;
  }): Promise<ApiResponse<{ uploaded: number; failed: number; media: Media[] }>> {
    const results: Media[] = [];
    let failed = 0;

    for (let i = 0; i < params.files.length; i++) {
      const file = params.files[i];
      const response = await this.uploadMedia({
        file,
        creator_id: params.creator_id,
        category: params.category,
        onProgress: (progress) => {
          params.onFileProgress?.(i, progress);
        },
      });

      if (response.success && response.data) {
        results.push(response.data);
        params.onFileComplete?.(i, true, response.data);
      } else {
        failed++;
        params.onFileComplete?.(i, false);
      }
    }

    return {
      success: true,
      data: {
        uploaded: results.length,
        failed,
        media: results,
      },
    };
  }

  // ============================================
  // STATISTICS ENDPOINTS
  // ============================================

  async getPlatformOverview(): Promise<ApiResponse<PlatformOverview>> {
    return this.request<PlatformOverview>('/api/v1/stats/overview');
  }

  async getCreatorStats(creatorId: string, months?: number): Promise<ApiResponse<CreatorStats>> {
    const query = months ? `?months=${months}` : '';
    return this.request<CreatorStats>(`/api/v1/stats/creators/${creatorId}${query}`);
  }

  async getStudioStats(studioId: string): Promise<ApiResponse<StudioStats>> {
    return this.request<StudioStats>(`/api/v1/stats/studios/${studioId}`);
  }

  async getLeaderboard(params?: {
    period?: 'month' | 'all_time';
    type?: 'all' | 'photos' | 'videos';
    limit?: number;
  }): Promise<ApiResponse<Array<{
    rank: number;
    creator_id: string;
    username: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  }>>> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    
    const query = searchParams.toString();
    return this.request(`/api/v1/stats/leaderboard${query ? `?${query}` : ''}`);
  }

  // ============================================
  // WHATSAPP GROUPS ENDPOINTS
  // ============================================

  /**
   * List all WhatsApp groups with their linkage status
   * Returns groups from bot if online, otherwise from database
   */
  async listGroups(): Promise<GroupsResponse> {
    const response = await this.request<WhatsAppGroup[]>('/api/v1/groups');
    
    // Ensure data is always an array
    if (!response.success || !Array.isArray(response.data)) {
      return {
        success: false,
        data: [],
        count: 0,
        bot_online: false,
        message: response.error || 'Failed to fetch groups',
      };
    }
    
    return {
      success: response.success,
      data: response.data,
      count: response.data.length,
      bot_online: true,
    };
  }

  /**
   * Get details for a specific WhatsApp group
   */
  async getGroup(groupId: string): Promise<ApiResponse<{
    group_id: string;
    type: 'creator' | 'studio' | 'unknown';
    creator?: Creator & { stats: any };
    studio?: Studio & { creator_count: number; creators: Creator[] };
  }>> {
    return this.request(`/api/v1/groups/${groupId}`);
  }

  /**
   * Create a new WhatsApp group
   */
  async createGroup(params: {
    name: string;
    participants: string[];
    creatorId?: string;
  }): Promise<ApiResponse<{
    groupId: string;
    groupName: string;
  }>> {
    return this.request('/api/v1/groups/create', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Link a WhatsApp group to a creator
   */
  async linkGroupToCreator(groupId: string, creatorId: string): Promise<ApiResponse<Creator>> {
    return this.request(`/api/v1/groups/${groupId}/link/creator`, {
      method: 'POST',
      body: JSON.stringify({ creator_id: creatorId }),
    });
  }

  /**
   * Link a WhatsApp group to a studio
   */
  async linkGroupToStudio(groupId: string, studioId: string): Promise<ApiResponse<Studio>> {
    return this.request(`/api/v1/groups/${groupId}/link/studio`, {
      method: 'POST',
      body: JSON.stringify({ studio_id: studioId }),
    });
  }

  /**
   * Unlink a WhatsApp group from its creator or studio
   */
  async unlinkGroup(groupId: string): Promise<ApiResponse<{
    type: 'creator' | 'studio';
    id: string;
    username?: string;
    name?: string;
  }>> {
    return this.request(`/api/v1/groups/${groupId}/link`, {
      method: 'DELETE',
    });
  }

  /**
   * Get only configured groups (linked to creators/studios)
   */
  async getConfiguredGroups(): Promise<ApiResponse<Array<{
    group_id: string;
    type: 'creator' | 'studio';
    linked_id: string;
    linked_name: string;
    enabled: boolean;
  }>>> {
    return this.request('/api/v1/groups/configured');
  }

  /**
   * Send message to a single group
   */
  async sendToGroup(
    groupId: string, 
    message: string, 
    imageUrl?: string, 
    caption?: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.request(`/api/v1/groups/${groupId}/send`, {
      method: 'POST',
      body: JSON.stringify({ message, image_url: imageUrl, caption }),
    });
  }

  /**
   * Send message to multiple groups (bulk)
   */
  async sendToMultipleGroups(
    groupIds: string[], 
    message: string, 
    imageUrl?: string, 
    caption?: string, 
    delayMs?: number
  ): Promise<ApiResponse<BulkSendResponse>> {
    return this.request('/api/v1/groups/bulk-send', {
      method: 'POST',
      body: JSON.stringify({ 
        group_ids: groupIds, 
        message, 
        image_url: imageUrl, 
        caption,
        delay_ms: delayMs 
      }),
    });
  }
}

// ============================================
// SINGLETON INSTANCE FOR SERVER-SIDE USE
// ============================================

let serverApiClient: MediaApiClient | null = null;

export function getServerApiClient(): MediaApiClient {
  if (!serverApiClient) {
    const apiKey = process.env.MEDIA_API_KEY;
    if (!apiKey) {
      throw new Error('MEDIA_API_KEY environment variable is not set');
    }
    serverApiClient = new MediaApiClient(apiKey);
  }
  return serverApiClient;
}

// ============================================
// CLIENT-SIDE HELPER
// ============================================

export function createApiClient(apiKey: string): MediaApiClient {
  return new MediaApiClient(apiKey);
}






