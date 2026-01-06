'use client';

/**
 * Phone Number Manager Component
 * 
 * Allows users to add, verify, and manage phone numbers for WhatsApp integration via Twilio
 */

import { useState } from 'react';
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
import { Phone, Loader2, CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface PhoneNumberManagerProps {
  entityType: 'creator' | 'studio' | 'user';
  entityId: string;
  currentPhone?: string | null;
  verified?: boolean;
  onUpdate: () => void;
}

export function PhoneNumberManager({
  entityType,
  entityId,
  currentPhone,
  verified = false,
  onUpdate,
}: PhoneNumberManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const formatPhoneInput = (value: string) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhoneNumber(formatted);
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    // Validate E.164 format
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(phoneNumber)) {
      toast.error('Please enter a valid phone number in international format (e.g., +40712345678)');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/twilio/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          entityType,
          entityId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      toast.success('Verification code sent! Check your WhatsApp.');
      setStep('verify');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send code');
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/twilio/verify-phone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
          entityType,
          entityId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      toast.success('Phone number verified successfully!');
      setShowModal(false);
      setStep('input');
      setVerificationCode('');
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setStep('input');
    setVerificationCode('');
    setPhoneNumber(currentPhone || '');
  };

  return (
    <>
      {/* Display current phone number */}
      <div className="space-y-2">
        <Label htmlFor="phone">WhatsApp Phone Number</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
            <Phone className="w-4 h-4 text-slate-400" />
            {currentPhone ? (
              <>
                <span className="text-slate-900">{currentPhone}</span>
                {verified ? (
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-500 ml-auto" />
                )}
              </>
            ) : (
              <span className="text-slate-400">No phone number set</span>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowModal(true)}
          >
            {currentPhone ? 'Change' : 'Add Number'}
          </Button>
        </div>
        {currentPhone && !verified && (
          <p className="text-xs text-amber-600">
            Phone number not verified. Click "Change" to verify.
          </p>
        )}
      </div>

      {/* Modal for adding/verifying phone number */}
      {showModal && (
        <Dialog open onOpenChange={handleClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {step === 'input' ? 'Add Phone Number' : 'Verify Phone Number'}
              </DialogTitle>
              <DialogDescription>
                {step === 'input' 
                  ? 'Enter your WhatsApp number in international format'
                  : 'Enter the 6-digit code sent to your WhatsApp'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {step === 'input' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phoneInput">Phone Number</Label>
                    <Input
                      id="phoneInput"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="+40712345678"
                      disabled={isSending}
                    />
                    <p className="text-xs text-slate-500">
                      Format: +[country code][number] (e.g., +40712345678 for Romania)
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> You must have a WhatsApp account registered with this number. 
                      You'll receive a verification code via WhatsApp.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="codeInput">Verification Code</Label>
                    <Input
                      id="codeInput"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      disabled={isVerifying}
                    />
                    <p className="text-xs text-slate-500">
                      Enter the 6-digit code sent to {phoneNumber}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-sm text-slate-600">
                      Didn't receive the code?{' '}
                      <button
                        onClick={() => {
                          setStep('input');
                          setVerificationCode('');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Try a different number
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step === 'input' ? (
                <Button
                  onClick={sendVerificationCode}
                  disabled={isSending || !phoneNumber}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Code
                </Button>
              ) : (
                <Button
                  onClick={verifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Verify
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

