'use client';

/**
 * Create WhatsApp Group Modal
 * Production component for creating new WhatsApp groups
 */

import { useState, useEffect } from 'react';
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
import { MessageCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { MediaApiClient, type Creator } from '@/lib/media-api';

interface CreateGroupModalProps {
  apiKey: string;
  open: boolean;
  onClose: () => void;
  onCreated: (groupId: string) => void;
  preselectedCreatorId?: string;
}

export function CreateGroupModal({
  apiKey,
  open,
  onClose,
  onCreated,
  preselectedCreatorId,
}: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState<string[]>(['']);
  const [creatorId, setCreatorId] = useState<string>(preselectedCreatorId || 'none');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreators, setLoadingCreators] = useState(true);

  useEffect(() => {
    if (open) {
      loadCreators();
      if (preselectedCreatorId) {
        setCreatorId(preselectedCreatorId);
      }
    } else {
      // Reset form when closed
      setName('');
      setParticipants(['']);
      setCreatorId(preselectedCreatorId || '');
    }
  }, [open, preselectedCreatorId]);

  const loadCreators = async () => {
    setLoadingCreators(true);
    try {
      const client = new MediaApiClient(apiKey);
      const response = await client.listCreators({ enabled: true, limit: 200 });

      if (response.success && Array.isArray(response.data)) {
        setCreators(response.data);
      }
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoadingCreators(false);
    }
  };

  const handleAddParticipant = () => {
    setParticipants([...participants, '']);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Group name is required');
      return;
    }

    const validParticipants = participants
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (validParticipants.length === 0) {
      toast.error('At least one participant is required');
      return;
    }

    // Validate phone numbers (basic check)
    const invalidParticipants = validParticipants.filter(p => 
      !/^\+?\d{10,15}$/.test(p.replace(/[\s\-()]/g, ''))
    );

    if (invalidParticipants.length > 0) {
      toast.error(`Invalid phone numbers: ${invalidParticipants.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const client = new MediaApiClient(apiKey);
      const response = await client.createGroup({
        name: name.trim(),
        participants: validParticipants,
        creatorId: creatorId && creatorId !== 'none' ? creatorId : undefined,
      });

      if (response.success && response.data) {
        toast.success(`Group "${name}" created successfully!`);
        onCreated(response.data.groupId);
        onClose();
      } else {
        toast.error(response.error || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Create WhatsApp Group
            </DialogTitle>
            <DialogDescription>
              Create a new WhatsApp group and optionally link it to a creator
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Group Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Creator Name 📸"
                disabled={loading}
                required
              />
            </div>

            {/* Link to Creator */}
            <div className="space-y-2">
              <Label htmlFor="creator">Link to Creator (Optional)</Label>
              {loadingCreators ? (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-slate-600">Loading creators...</span>
                </div>
              ) : (
                <Select
                  value={creatorId}
                  onValueChange={setCreatorId}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Don't link now" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Don't link now</SelectItem>
                    {creators.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id}>
                        {creator.username}
                        {creator.studio && (
                          <span className="text-xs text-slate-500 ml-2">
                            ({creator.studio.name})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {creatorId && creatorId !== 'none' && (
                <p className="text-xs text-slate-600">
                  The group will be automatically linked to this creator after creation
                </p>
              )}
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Participants <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddParticipant}
                  disabled={loading}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={participant}
                      onChange={(e) => handleParticipantChange(index, e.target.value)}
                      placeholder="Phone number (e.g., 40712345678 or +40712345678)"
                      disabled={loading}
                      className="flex-1"
                    />
                    {participants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveParticipant(index)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-600">
                Include country codes (e.g., 40 for Romania, 1 for USA). You can add multiple participants.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Create Group
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

