import { useState, useEffect, useCallback } from 'react';

export interface WhatsAppStatus {
  online: boolean;
  connected: boolean;
  connectionState: string;
  maintenanceMode: boolean;
  error?: string;
  timestamp: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lovebite.studio/api';

/**
 * Hook to check WhatsApp bot status
 * Polls every 30 seconds when enabled
 */
export function useWhatsAppStatus(pollInterval = 30000) {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/whatsapp/status`, {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setError(null);
      } else {
        setStatus({
          online: false,
          connected: false,
          connectionState: 'offline',
          maintenanceMode: false,
          error: 'API error',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      setStatus({
        online: false,
        connected: false,
        connectionState: 'offline',
        maintenanceMode: false,
        error: 'Network error',
        timestamp: new Date().toISOString(),
      });
      setError('Failed to check WhatsApp status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    
    // Poll every pollInterval ms
    const interval = setInterval(checkStatus, pollInterval);
    
    return () => clearInterval(interval);
  }, [checkStatus, pollInterval]);

  return {
    status,
    loading,
    error,
    isOnline: status?.online ?? false,
    isConnected: status?.connected ?? false,
    isInMaintenance: status?.maintenanceMode ?? false,
    refresh: checkStatus,
  };
}

/**
 * Check if WhatsApp features should be disabled
 */
export function useWhatsAppEnabled() {
  const { isOnline, isConnected, isInMaintenance } = useWhatsAppStatus();
  
  return {
    canSendMessages: isOnline && isConnected && !isInMaintenance,
    canCreateGroups: isOnline && isConnected && !isInMaintenance,
    canViewGroups: true, // Always can view from database
    reason: !isOnline 
      ? 'WhatsApp bot is offline' 
      : !isConnected 
        ? 'WhatsApp not connected' 
        : isInMaintenance 
          ? 'WhatsApp in maintenance mode' 
          : null,
  };
}

