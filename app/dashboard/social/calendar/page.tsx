"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../../layout";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Image as ImageIcon,
  Video,
  FileText,
  X,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Send,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-centered";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek, addDays, parseISO } from "date-fns";

// ============================================
// TYPES
// ============================================

interface ScheduledPost {
  id: string;
  platform: "reddit" | "twitter" | "instagram" | "onlyfans" | "fansly";
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  scheduledAt: string;
  status: "scheduled" | "published" | "failed" | "draft";
  subreddit?: string;
  createdAt: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_POSTS: ScheduledPost[] = [
  {
    id: "1",
    platform: "reddit",
    title: "New set dropping soon 🔥",
    content: "Check out my latest lingerie set! Link in bio.",
    mediaUrl: "https://via.placeholder.com/400x600",
    mediaType: "image",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    status: "scheduled",
    subreddit: "r/onlyfanspromo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    platform: "twitter",
    title: "",
    content: "Just posted something special 💋 Check my link!",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    platform: "reddit",
    title: "Weekend vibes",
    content: "Who's ready for the weekend?",
    mediaUrl: "https://via.placeholder.com/400x600",
    mediaType: "image",
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "published",
    subreddit: "r/selfie",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    platform: "instagram",
    title: "",
    content: "New content alert! 🚨",
    mediaUrl: "https://via.placeholder.com/400x600",
    mediaType: "image",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "draft",
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// PLATFORM CONFIG
// ============================================

const PLATFORMS: Record<string, { name: string; color: string; icon: string; bg: string }> = {
  reddit: { name: "Reddit", color: "text-orange-500", icon: "🔴", bg: "bg-orange-500/10" },
  twitter: { name: "X / Twitter", color: "text-sky-500", icon: "𝕏", bg: "bg-sky-500/10" },
  instagram: { name: "Instagram", color: "text-pink-500", icon: "📷", bg: "bg-pink-500/10" },
  onlyfans: { name: "OnlyFans", color: "text-blue-500", icon: "💙", bg: "bg-blue-500/10" },
  fansly: { name: "Fansly", color: "text-cyan-500", icon: "💎", bg: "bg-cyan-500/10" },
};

// ============================================
// POST CARD
// ============================================

function PostCard({
  post,
  onEdit,
  onDelete,
  compact = false,
}: {
  post: ScheduledPost;
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}) {
  const platform = PLATFORMS[post.platform];
  const statusColors = {
    scheduled: "bg-blue-100 text-blue-700",
    published: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    draft: "bg-slate-100 text-slate-600",
  };

  if (compact) {
    return (
      <div className={`px-2 py-1 rounded text-xs ${platform.bg} ${platform.color} truncate cursor-pointer hover:opacity-80`}>
        <span className="mr-1">{platform.icon}</span>
        {post.title || post.content.slice(0, 20)}...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-lg ${platform.bg} flex items-center justify-center text-lg shrink-0`}>
            {platform.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-medium ${platform.color}`}>{platform.name}</span>
              {post.subreddit && (
                <span className="text-xs text-slate-500">{post.subreddit}</span>
              )}
            </div>
            {post.title && (
              <p className="font-medium text-slate-900 truncate">{post.title}</p>
            )}
            <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(parseISO(post.scheduledAt), "MMM d, h:mm a")}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

// ============================================
// POST EDITOR MODAL
// ============================================

function PostEditorModal({
  post,
  onSave,
  onClose,
}: {
  post: ScheduledPost | null;
  onSave: (post: Partial<ScheduledPost>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    platform: post?.platform || "reddit",
    title: post?.title || "",
    content: post?.content || "",
    subreddit: post?.subreddit || "",
    scheduledAt: post?.scheduledAt || new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    status: post?.status || "draft",
  });

  const handleSubmit = () => {
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }
    onSave(formData);
    toast.success(post ? "Post updated" : "Post scheduled");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Schedule New Post"}</DialogTitle>
          <DialogDescription>
            {post ? "Update your scheduled post" : "Create a new post to schedule"}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {/* Platform Selection */}
          <div className="space-y-2">
            <Label>Platform</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PLATFORMS).map(([key, platform]) => (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, platform: key as any })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.platform === key
                      ? `${platform.bg} ${platform.color} ring-2 ring-offset-2 ring-${platform.color.replace("text-", "")}`
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {platform.icon} {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subreddit (for Reddit) */}
          {formData.platform === "reddit" && (
            <div className="space-y-2">
              <Label>Subreddit</Label>
              <Input
                value={formData.subreddit}
                onChange={(e) => setFormData({ ...formData, subreddit: e.target.value })}
                placeholder="r/onlyfanspromo"
              />
            </div>
          )}

          {/* Title (optional) */}
          <div className="space-y-2">
            <Label>Title (optional)</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Post title..."
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What do you want to share?"
              className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Schedule Time */}
          <div className="space-y-2">
            <Label>Schedule Time</Label>
            <Input
              type="datetime-local"
              value={formData.scheduledAt.slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, scheduledAt: new Date(e.target.value).toISOString() })}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2">
              {["draft", "scheduled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFormData({ ...formData, status: status as any })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    formData.status === status
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {post ? "Update" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function SocialCalendarPage() {
  const { user } = useDashboard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>(MOCK_POSTS);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // Calendar calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get posts for a specific day
  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => isSameDay(parseISO(post.scheduledAt), day));
  };

  // Get posts for selected date or upcoming
  const selectedPosts = selectedDate
    ? getPostsForDay(selectedDate)
    : posts.filter((p) => new Date(p.scheduledAt) >= new Date()).sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );

  const handleSavePost = (data: Partial<ScheduledPost>) => {
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === editingPost.id ? { ...p, ...data } : p)));
    } else {
      const newPost: ScheduledPost = {
        id: Date.now().toString(),
        platform: data.platform || "reddit",
        title: data.title || "",
        content: data.content || "",
        subreddit: data.subreddit,
        scheduledAt: data.scheduledAt || new Date().toISOString(),
        status: data.status || "draft",
        createdAt: new Date().toISOString(),
      };
      setPosts([...posts, newPost]);
    }
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Delete this scheduled post?")) {
      setPosts(posts.filter((p) => p.id !== id));
      toast.success("Post deleted");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Social Calendar</h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
              Development
            </span>
          </div>
          <p className="text-slate-500">Schedule and manage your social media posts</p>
        </div>
        <Button onClick={() => { setEditingPost(null); setShowEditor(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayPosts = getPostsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={`min-h-[80px] p-2 rounded-lg text-left transition-colors ${
                    !isCurrentMonth
                      ? "bg-slate-50 text-slate-400"
                      : isSelected
                      ? "bg-blue-50 border-2 border-blue-500"
                      : isTodayDate
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-white hover:bg-slate-50 border border-slate-100"
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isTodayDate ? "text-blue-600" : isCurrentMonth ? "text-slate-900" : "text-slate-400"
                  }`}>
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayPosts.slice(0, 2).map((post) => (
                      <PostCard key={post.id} post={post} compact onEdit={() => {}} onDelete={() => {}} />
                    ))}
                    {dayPosts.length > 2 && (
                      <div className="text-xs text-slate-500 text-center">
                        +{dayPosts.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Post List Sidebar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Upcoming Posts"}
            </h3>
            {selectedDate && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {selectedPosts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No posts scheduled</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => { setEditingPost(null); setShowEditor(true); }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Schedule a post
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {selectedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={() => { setEditingPost(post); setShowEditor(true); }}
                  onDelete={() => handleDeletePost(post.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Counts by Platform */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Object.entries(PLATFORMS).map(([key, platform]) => {
          const count = posts.filter((p) => p.platform === key && p.status === "scheduled").length;
          return (
            <div key={key} className={`${platform.bg} rounded-xl p-4 text-center`}>
              <span className="text-2xl">{platform.icon}</span>
              <p className={`font-bold text-lg ${platform.color}`}>{count}</p>
              <p className="text-xs text-slate-600">scheduled</p>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <PostEditorModal
          post={editingPost}
          onSave={handleSavePost}
          onClose={() => { setShowEditor(false); setEditingPost(null); }}
        />
      )}
    </div>
  );
}



