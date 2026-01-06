"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useDashboard } from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  Users,
  AlertCircle,
  Loader2,
  Phone,
  CheckCircle,
  MessageSquare,
  Bot,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-centered";

// ============================================
// TYPES
// ============================================

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'creator' | 'studio' | 'admin';
  verified: boolean;
}

interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  status: string;
}

// ============================================
// SEND MESSAGE MODAL
// ============================================

function SendMessageModal({
  onClose,
  contacts,
}: {
  onClose: () => void;
  contacts: Contact[];
}) {
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!selectedContact || !message.trim()) {
      toast.error("Please select a contact and enter a message");
      return;
    }

    setIsSending(true);
    try {
      const contact = contacts.find((c) => c.id === selectedContact);
      
      const response = await fetch("/api/twilio/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: contact?.type,
          entityId: contact?.id,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success(`Message sent to ${data.sentTo}`);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const selectedContactInfo = contacts.find((c) => c.id === selectedContact);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>Send WhatsApp Message</DialogTitle>
              <DialogDescription>
                Send a direct message via Twilio WhatsApp
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {/* Contact Selection */}
            <div className="space-y-2">
              <Label>Select Contact</Label>
              {contacts.length === 0 ? (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No contacts with verified phone numbers</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        selectedContact === contact.id
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        contact.type === 'admin' ? 'bg-purple-100' :
                        contact.type === 'studio' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <Phone className={`w-5 h-5 ${
                          contact.type === 'admin' ? 'text-purple-600' :
                          contact.type === 'studio' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{contact.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{contact.phoneNumber}</span>
                          {contact.verified && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      </div>
                      {selectedContact === contact.id && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900"
                placeholder="Type your message here..."
              />
              <p className="text-xs text-slate-500">
                {message.length} characters • Emojis supported
              </p>
            </div>

            {/* Preview */}
            {selectedContactInfo && message && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-slate-900 whitespace-pre-wrap">{message}</p>
                    <p className="text-xs text-slate-400 mt-1">To: {selectedContactInfo.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !selectedContact || !message.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function WhatsAppPage() {
  const { user } = useDashboard();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch creators with phone numbers
      const creatorsResponse = await fetch("/api/studio/creators");
      if (creatorsResponse.ok) {
        const creatorsData = await creatorsResponse.json();
        const creatorContacts = (creatorsData.creators || [])
          .filter((c: any) => c.phone_number)
          .map((c: any) => ({
            id: c.id,
            name: c.username || c.display_name,
            phoneNumber: c.phone_number,
            type: 'creator' as const,
            verified: c.phone_number_verified || false,
          }));
        setContacts(creatorContacts);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "business") {
      fetchContacts();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchContacts]);

  if (user?.role !== "admin" && user?.role !== "business") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          Only administrators and studios can access WhatsApp messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-100">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">WhatsApp Messaging</h1>
            <p className="text-slate-500">Direct messaging via Twilio</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowSendModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <MessageSquare className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Twilio WhatsApp Integration</h3>
        </div>
        <p className="text-sm text-green-700 mb-3">
          Send WhatsApp messages directly to creators and studios using Twilio. 
          Each entity has their own phone number for direct communication.
        </p>
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="text-xs text-green-600">
            Twilio Number: <code className="bg-green-100 px-1 rounded">+40 754 644 016</code>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 bg-blue-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{contacts.length}</p>
              <p className="text-sm opacity-80">Total Contacts</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl p-4 bg-green-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {contacts.filter(c => c.verified).length}
              </p>
              <p className="text-sm opacity-80">Verified Numbers</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl p-4 bg-purple-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-sm opacity-80">Messages Sent</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl p-4 bg-amber-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-sm opacity-80">Twilio Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Contacts</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No contacts with phone numbers configured</p>
            <p className="text-xs text-slate-400 mt-2">
              Add phone numbers to creators/studios in their settings
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  contact.type === 'admin' ? 'bg-purple-100' :
                  contact.type === 'studio' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <Phone className={`w-5 h-5 ${
                    contact.type === 'admin' ? 'text-purple-600' :
                    contact.type === 'studio' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{contact.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{contact.phoneNumber}</span>
                    {contact.verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Quick send to this contact
                    setShowSendModal(true);
                  }}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Message
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showSendModal && (
        <SendMessageModal
          onClose={() => setShowSendModal(false)}
          contacts={contacts}
        />
      )}
    </div>
  );
}
