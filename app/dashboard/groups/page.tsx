'use client';

/**
 * WhatsApp Groups Management Page
 * Manage WhatsApp groups, create new ones, and link them to creators/studios
 */

import { useState, useEffect } from 'react';
import { useDashboard } from '../layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog-centered';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageCircle,
  Search,
  Plus,
  Link as LinkIcon,
  Unlink,
  Loader2,
  RefreshCw,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { createApiClient, type WhatsAppGroup, type Creator, type Studio } from '@/lib/media-api';
import { CreateGroupModal } from '@/components/whatsapp/create-group-modal';
import { BulkMessageModal } from '@/components/whatsapp/bulk-message-modal';

export default function GroupsPage() {
  const { user, apiKey } = useDashboard();
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'linked' | 'unlinked'>('all');
  const [botOnline, setBotOnline] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
  const [linkingGroup, setLinkingGroup] = useState<WhatsAppGroup | null>(null);
  const [unlinkingGroup, setUnlinkingGroup] = useState<WhatsAppGroup | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (apiKey) {
      loadData();
    }
  }, [apiKey]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadGroups(), loadCreators(), loadStudios()]);
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    if (!apiKey) return;

    try {
      const client = createApiClient(apiKey);
      const response = await client.listGroups();

      if (response.success && Array.isArray(response.data)) {
        setGroups(response.data);
        setBotOnline(response.bot_online);
      } else {
        toast.error('Failed to load groups');
        setGroups([]);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
      setGroups([]);
    }
  };

  const loadCreators = async () => {
    if (!apiKey) return;

    try {
      const client = createApiClient(apiKey);
      const response = await client.listCreators({ enabled: true, limit: 200 });

      if (response.success && Array.isArray(response.data)) {
        setCreators(response.data);
      }
    } catch (error) {
      console.error('Error loading creators:', error);
    }
  };

  const loadStudios = async () => {
    if (!apiKey || !isAdmin) return;

    try {
      const client = createApiClient(apiKey);
      const response = await client.listStudios({ enabled: true, limit: 100 });

      if (response.success && Array.isArray(response.data)) {
        setStudios(response.data);
      }
    } catch (error) {
      console.error('Error loading studios:', error);
    }
  };

  const handleUnlinkGroup = async (groupId: string) => {
    if (!apiKey) return;

    try {
      const client = createApiClient(apiKey);
      const response = await client.unlinkGroup(groupId);

      if (response.success) {
        toast.success('Group unlinked successfully');
        await loadData(); // Reload to show updated status
        setUnlinkingGroup(null);
      } else {
        toast.error(response.error || 'Failed to unlink group');
      }
    } catch (error) {
      console.error('Error unlinking group:', error);
      toast.error('Failed to unlink group');
    }
  };

  // Filter groups
  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'linked' && group.linked_to !== null && group.linked_to !== undefined) ||
      (filterType === 'unlinked' && (!group.linked_to || group.linked_to === null));

    return matchesSearch && matchesFilter;
  });

  const linkedCount = groups.filter(g => g.linked_to).length;
  const unlinkedCount = groups.length - linkedCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">WhatsApp Groups</h1>
          <p className="text-slate-600 mt-1">
            Manage WhatsApp groups and link them to creators or studios
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowBulkMessageModal(true)}
            disabled={!botOnline || groups.length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Bulk Message
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${botOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                Bot: {botOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="text-sm text-slate-600">
              {groups.length} groups total
            </div>
            <div className="text-sm text-slate-600">
              {linkedCount} linked
            </div>
            <div className="text-sm text-slate-600">
              {unlinkedCount} unlinked
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        {!botOnline && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Bot is offline</p>
                <p>Showing linked groups from database. New groups cannot be created until bot is online.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(val: any) => setFilterType(val)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups ({groups.length})</SelectItem>
            <SelectItem value="linked">Linked ({linkedCount})</SelectItem>
            <SelectItem value="unlinked">Unlinked ({unlinkedCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Groups List */}
      {filteredGroups.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">
            {searchQuery ? 'No groups found' : 'No groups available'}
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            {searchQuery
              ? 'Try adjusting your search'
              : botOnline
              ? 'Create your first WhatsApp group to get started'
              : 'Bot is offline. Groups will appear when bot is online or when linked in database.'}
          </p>
          {botOnline && !searchQuery && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Group
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              creators={creators}
              studios={studios}
              isAdmin={isAdmin}
              onLink={() => setLinkingGroup(group)}
              onUnlink={() => setUnlinkingGroup(group)}
            />
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        apiKey={apiKey || ''}
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          loadData();
          setShowCreateModal(false);
        }}
      />

      {/* Link Group Modal */}
      {linkingGroup && (
        <LinkGroupModal
          group={linkingGroup}
          creators={creators}
          studios={studios}
          apiKey={apiKey || ''}
          isAdmin={isAdmin}
          onClose={() => setLinkingGroup(null)}
          onLinked={() => {
            loadData();
            setLinkingGroup(null);
          }}
        />
      )}

      {/* Unlink Confirmation */}
      {unlinkingGroup && (
        <Dialog open onOpenChange={() => setUnlinkingGroup(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unlink Group?</DialogTitle>
              <DialogDescription>
                This will remove the link between "{unlinkingGroup.name}" and{' '}
                {unlinkingGroup.linked_to?.type}: {unlinkingGroup.linked_to?.name}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUnlinkingGroup(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleUnlinkGroup(unlinkingGroup.id)}
              >
                Unlink
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Bulk Message Modal */}
      <BulkMessageModal
        isOpen={showBulkMessageModal}
        onClose={() => setShowBulkMessageModal(false)}
        apiKey={apiKey || ''}
      />
    </div>
  );
}

// Group Card Component
function GroupCard({
  group,
  creators,
  studios,
  isAdmin,
  onLink,
  onUnlink,
}: {
  group: WhatsAppGroup;
  creators: Creator[];
  studios: Studio[];
  isAdmin: boolean;
  onLink: () => void;
  onUnlink: () => void;
}) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="font-semibold text-slate-900">{group.name}</h3>
              <p className="text-sm text-slate-600 font-mono">{group.id}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
            {group.participantCount !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{group.participantCount} participants</span>
              </div>
            )}
            {group.type && (
              <div className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                {group.type}
              </div>
            )}
          </div>

          {/* Linkage Status */}
          {group.linked_to ? (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">
                Linked to {group.linked_to.type}: {group.linked_to.name}
              </span>
              {!group.linked_to.enabled && (
                <span className="text-amber-600">(Disabled)</span>
              )}
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Not linked to any creator or studio</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {group.linked_to ? (
            <Button variant="outline" size="sm" onClick={onUnlink}>
              <Unlink className="w-4 h-4 mr-2" />
              Unlink
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={onLink}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Link
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Link Group Modal Component
function LinkGroupModal({
  group,
  creators,
  studios,
  apiKey,
  isAdmin,
  onClose,
  onLinked,
}: {
  group: WhatsAppGroup;
  creators: Creator[];
  studios: Studio[];
  apiKey: string;
  isAdmin: boolean;
  onClose: () => void;
  onLinked: () => void;
}) {
  const [linkType, setLinkType] = useState<'creator' | 'studio'>('creator');
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLink = async () => {
    if (!selectedId) {
      toast.error('Please select a creator or studio');
      return;
    }

    setLoading(true);

    try {
      const client = createApiClient(apiKey);
      const response =
        linkType === 'creator'
          ? await client.linkGroupToCreator(group.id, selectedId)
          : await client.linkGroupToStudio(group.id, selectedId);

      if (response.success) {
        toast.success(`Group linked to ${linkType} successfully!`);
        onLinked();
      } else {
        toast.error(response.error || `Failed to link group to ${linkType}`);
      }
    } catch (error) {
      console.error('Error linking group:', error);
      toast.error('Failed to link group');
    } finally {
      setLoading(false);
    }
  };

  const availableCreators = creators.filter(c => !c.whatsapp_group_id);
  const availableStudios = studios.filter(s => !s.group_id);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Group</DialogTitle>
          <DialogDescription>
            Link "{group.name}" to a creator or studio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Link Type */}
          {isAdmin && (
            <div className="space-y-2">
              <Label>Link To</Label>
              <Select
                value={linkType}
                onValueChange={(val: any) => {
                  setLinkType(val);
                  setSelectedId('');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Select Creator/Studio */}
          <div className="space-y-2">
            <Label>
              {linkType === 'creator' ? 'Select Creator' : 'Select Studio'}
            </Label>
            {linkType === 'creator' ? (
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a creator..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCreators.length === 0 ? (
                    <div className="p-2 text-sm text-slate-600 text-center">
                      No available creators (all already have groups)
                    </div>
                  ) : (
                    availableCreators.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id}>
                        {creator.username}
                        {creator.studio && ` (${creator.studio.name})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a studio..." />
                </SelectTrigger>
                <SelectContent>
                  {availableStudios.length === 0 ? (
                    <div className="p-2 text-sm text-slate-600 text-center">
                      No available studios (all already have groups)
                    </div>
                  ) : (
                    availableStudios.map((studio) => (
                      <SelectItem key={studio.id} value={studio.id}>
                        {studio.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleLink} disabled={loading || !selectedId}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Linking...
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4 mr-2" />
                Link
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

