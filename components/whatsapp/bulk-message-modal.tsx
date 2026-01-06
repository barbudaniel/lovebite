'use client';

import { useState, useEffect } from 'react';
import { X, Send, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { MediaApiClient, type WhatsAppGroup, type BulkSendResponse } from '@/lib/media-api';

interface BulkMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

export function BulkMessageModal({ isOpen, onClose, apiKey }: BulkMessageModalProps) {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [delayMs, setDelayMs] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [result, setResult] = useState<BulkSendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    setError(null);
    try {
      const api = new MediaApiClient(apiKey);
      const response = await api.listGroups();
      
      if (response.success && response.data) {
        setGroups(response.data);
      } else {
        setError('Failed to load groups');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
    } finally {
      setLoadingGroups(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const selectAll = () => {
    setSelectedGroups(new Set(groups.map(g => g.id)));
  };

  const deselectAll = () => {
    setSelectedGroups(new Set());
  };

  const handleSend = async () => {
    if (selectedGroups.size === 0) {
      setError('Please select at least one group');
      return;
    }

    if (!message.trim() && !imageUrl.trim()) {
      setError('Please enter a message or image URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const api = new MediaApiClient(apiKey);
      const response = await api.sendToMultipleGroups(
        Array.from(selectedGroups),
        message.trim(),
        imageUrl.trim() || undefined,
        undefined,
        delayMs
      );

      if (response.success && response.data) {
        setResult(response.data);
        setMessage('');
        setImageUrl('');
      } else {
        setError(response.error || 'Failed to send messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send messages');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
    setMessage('');
    setImageUrl('');
    setSelectedGroups(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📱 Bulk Message to Groups
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Send the same message to multiple WhatsApp groups at once
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Group Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Groups ({selectedGroups.size} selected)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  disabled={loadingGroups}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
                >
                  Select All
                </button>
                <span className="text-xs text-gray-400">•</span>
                <button
                  onClick={deselectAll}
                  disabled={loadingGroups}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {loadingGroups ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading groups...</span>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No groups available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border dark:border-gray-700 rounded-lg p-3">
                {groups.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.has(group.id)}
                      onChange={() => toggleGroup(group.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {group.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {group.participantCount || 0} participants
                        {group.type && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                            {group.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message Text *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          {/* Image URL Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          {/* Delay Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Delay Between Messages: {delayMs / 1000}s
            </label>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1s (faster, may trigger rate limits)</span>
              <span>10s (slower, safer)</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {result.message}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Successfully sent to {result.summary.successful} out of {result.summary.total} groups
                    {result.summary.failed > 0 && ` (${result.summary.failed} failed)`}
                  </p>
                </div>
              </div>

              {/* Detailed Results */}
              {result.results.some(r => !r.success) && (
                <div className="border dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Failed Groups:
                  </h4>
                  <div className="space-y-2">
                    {result.results
                      .filter(r => !r.success)
                      .map((r, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-gray-900 dark:text-white font-medium">
                              {groups.find(g => g.id === r.groupId)?.name || r.groupId}
                            </span>
                            {r.error && (
                              <span className="text-red-600 dark:text-red-400 ml-2">
                                {r.error}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {result ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={handleSend}
            disabled={loading || selectedGroups.size === 0 || (!message.trim() && !imageUrl.trim())}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {selectedGroups.size} Group{selectedGroups.size !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



