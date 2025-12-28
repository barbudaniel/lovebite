'use client';

/**
 * WhatsApp Group Selector Component
 * Production component for selecting and managing WhatsApp groups
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageCircle, Loader2, RefreshCw, Plus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { MediaApiClient, type WhatsAppGroup } from '@/lib/media-api';

interface GroupSelectorProps {
  apiKey: string;
  value?: string | null;
  onChange: (groupId: string | null) => void;
  disabled?: boolean;
  label?: string;
  allowCreate?: boolean;
  creatorId?: string;
  onCreateGroup?: () => void;
}

export function GroupSelector({
  apiKey,
  value,
  onChange,
  disabled = false,
  label = 'WhatsApp Group',
  allowCreate = false,
  creatorId,
  onCreateGroup,
}: GroupSelectorProps) {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [botOnline, setBotOnline] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const client = new MediaApiClient(apiKey);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      loadGroups();
    }
  }, [apiKey]);

  const selectedGroup = groups.find(g => g.id === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {label}
          {!botOnline && (
            <span className="text-xs text-amber-600">(Bot Offline)</span>
          )}
        </Label>
        <div className="flex items-center gap-2">
          {allowCreate && onCreateGroup && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateGroup}
              disabled={disabled}
            >
              <Plus className="w-3 h-3 mr-1" />
              Create
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={loadGroups}
            disabled={loading || disabled}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-4 border rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm text-slate-600">Loading groups...</span>
        </div>
      ) : groups.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center">
          <p className="text-sm text-slate-600 mb-2">
            {botOnline ? 'No groups available' : 'Bot offline - No groups in database'}
          </p>
          {allowCreate && onCreateGroup && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateGroup}
              disabled={disabled}
            >
              <Plus className="w-3 h-3 mr-1" />
              Create First Group
            </Button>
          )}
        </div>
      ) : (
        <>
          <Select
            value={value || 'none'}
            onValueChange={(val) => onChange(val === 'none' ? null : val)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a group..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No group</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{group.name}</span>
                    {group.linked_to && (
                      <span className="text-xs text-slate-500 ml-2">
                        ({group.linked_to.type}: {group.linked_to.name})
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedGroup && (
            <div className="text-xs text-slate-600 space-y-1">
              <p>ID: {selectedGroup.id}</p>
              {selectedGroup.participantCount !== undefined && (
                <p>Participants: {selectedGroup.participantCount}</p>
              )}
              {selectedGroup.linked_to && (
                <p className="text-amber-600">
                  ⚠️ Already linked to {selectedGroup.linked_to.type}: {selectedGroup.linked_to.name}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

