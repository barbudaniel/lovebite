"use client";

import { useState, useRef, useEffect, use, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SignaturePad, SignaturePadRef } from "@/components/ui/signature-pad";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Heart,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  Camera,
  CreditCard,
  BookOpen,
  X,
  Info,
  Download,
  Check,
  LinkIcon,
  XCircle,
  CalendarIcon,
  Loader2,
} from "lucide-react";

const contentCategories = [
  { id: "lifestyle", label: "Lifestyle" },
  { id: "fitness", label: "Fitness" },
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming" },
  { id: "music", label: "Music" },
  { id: "art", label: "Art & Creative" },
];

const platforms = [
  { id: "onlyfans", label: "OnlyFans" },
  { id: "fansly", label: "Fansly" },
  { id: "patreon", label: "Patreon" },
  { id: "other", label: "Other" },
];

const languages = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "italian", label: "Italian" },
  { id: "portuguese", label: "Portuguese" },
  { id: "romanian", label: "Romanian" },
  { id: "other", label: "Other" },
];

const experienceLevels = [
  { id: "new", label: "New to content creation" },
  { id: "1-2years", label: "1-2 years experience" },
  { id: "3plus", label: "3+ years experience" },
];

const availabilityOptions = [
  { id: "fulltime", label: "Full-time" },
  { id: "parttime", label: "Part-time" },
  { id: "flexible", label: "Flexible" },
];

interface FormData {
  fullName: string;
  dateOfBirth: Date | undefined;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  idType: "passport" | "national_id" | "";
  idNumber: string;
  idFrontImage: string | null;
  idBackImage: string | null;
  selfieWithId: string | null;
  agreedToTerms: boolean;
  signature: string;
  stageName: string;
  categories: string[];
  platforms: string[];
  languages: string[];
  experience: string;
  availability: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  currentEarnings: string;
  goals: string;
  additionalNotes: string;
}

const initialFormData: FormData = {
  fullName: "",
  dateOfBirth: undefined,
  address: "",
  city: "",
  postalCode: "",
  country: "",
  idType: "",
  idNumber: "",
  idFrontImage: null,
  idBackImage: null,
  selfieWithId: null,
  agreedToTerms: false,
  signature: "",
  stageName: "",
  categories: [],
  platforms: [],
  languages: [],
  experience: "",
  availability: "",
  instagram: "",
  tiktok: "",
  twitter: "",
  currentEarnings: "",
  goals: "",
  additionalNotes: "",
};

// Helper to format address
const formatFullAddress = (formData: FormData) => {
  const parts = [formData.address, formData.city, formData.postalCode, formData.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
};

// Dynamic contract sections generator
const getContractSections = (formData: FormData, signatureDataUrl: string | null, currentDate: string) => {
  const today = currentDate || new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fullAddress = formatFullAddress(formData);

  return [
    {
      id: "header",
      title: "EXCLUSIVE MANAGEMENT AND CONTENT AGENCY AGREEMENT",
      content: `THIS AGREEMENT is made on ${today}.

BETWEEN:
(1) TRUST CHARGE SOLUTIONS LTD, a private limited company incorporated in England and Wales, with its registered office at 20 Wenlock Road, London, England, N1 7GU, represented by Gabriel marius Cosoi ("The Agency" or "Partner A");

AND

(2) {{fullName}}, an individual residing at {{address}}, (ID/Birth Reg No: {{idNumber}}) ("The Talent" or "Partner B").

(Collectively referred to as the "Parties").`,
      fields: ["fullName", "address", "idNumber"],
    },
    {
      id: "background",
      title: "1. BACKGROUND",
      content: `(A) The Agency operates in the business of digital marketing, social media management, and the production/promotion of adult entertainment content.

(B) The Talent is a creator of personal and artistic content, including adult-oriented material.

(C) The Parties wish to enter into this Agreement whereby the Talent engages the Agency to manage, promote, and monetize the Talent's content on adult content platforms, on an exclusive basis.`,
      fields: [],
    },
    {
      id: "duration",
      title: "2. DURATION",
      content: `2.1 Term: This Agreement shall commence on the date of signature and continue for a fixed period of two (2) years (the "Initial Term").

2.2 Automatic Renewal: Unless the Talent provides written notice of non-renewal at least three (3) months prior to the end of the Initial Term, this Agreement shall automatically renew for a subsequent period of two (2) years.`,
      fields: [],
    },
    {
      id: "relationship",
      title: "3. RELATIONSHIP OF THE PARTIES",
      content: `3.1 Independent Contractor: The Talent is an independent contractor. Nothing in this Agreement shall render the Talent an employee, worker, agent, or partner of the Agency. The Talent shall be solely responsible for their own income tax and National Insurance contributions (or local equivalent).

3.2 No Employment Rights: The Talent acknowledges that this is a business-to-business arrangement and they do not have rights to holiday pay, sick pay, or pension contributions.`,
      fields: [],
    },
    {
      id: "talent-obligations",
      title: '4. OBLIGATIONS OF THE TALENT ("PARTNER B")',
      content: `4.1 Content Deliverables: The Talent undertakes to produce and deliver high-quality photographs and video recordings ("The Content") primarily of an adult/sexual nature, in accordance with the Agency's instructions.

4.2 Minimum Quotas: To qualify for the full commission rates (see Clause 7), the Talent aims to deliver monthly volumes of Content as specified in Schedule.

4.3 Exclusivity: The Talent grants the Agency the exclusive right to manage their presence on the Platforms. The Talent shall not, without prior written consent:
(a) Post Content to any other adult platform;
(b) Engage any other agency or manager;
(c) Create new profiles or alter existing login credentials provided to the Agency.

4.4 Account Security: The Talent must provide all login credentials to the Agency. The Talent strictly agrees not to change passwords, recovery emails, or settings without the Agency's permission. Any unauthorized change of credentials shall be deemed a Material Breach.

4.5 Custom Requests: The Talent agrees to fulfil "Custom Video" requests from subscribers within seven (7) calendar days of the Agency's notification.

4.6 Professional Conduct: The Talent agrees not to consume alcohol or illegal substances during the production of Content (unless simulated for artistic purposes using non-branded liquids).`,
      fields: [],
    },
    {
      id: "agency-obligations",
      title: '5. OBLIGATIONS OF THE AGENCY ("PARTNER A")',
      content: `5.1 Management Services: The Agency shall provide account management, marketing, subscriber communication (chatting), and administrative support to maximize Revenue.

5.2 Platform Selection: The Agency has the sole discretion to determine which Platforms (Web Portals) are used to monetize the Content.

5.3 Pseudonym: The Parties shall agree on a pseudonym (stage name) for the Talent. The Talent acknowledges that the Pseudonym is the intellectual property of the Agency.`,
      fields: [],
    },
    {
      id: "ip-consent",
      title: "6. INTELLECTUAL PROPERTY AND CONSENT",
      content: `6.1 Assignment: The Talent hereby assigns to the Agency, with full title guarantee, the entire copyright and all other intellectual property rights in the Content created during the Term, for the full period of copyright and all extensions and renewals.

6.2 Waiver of Moral Rights: The Talent irrevocably waives all moral rights under Chapter IV of the Copyright, Designs and Patents Act 1988 (UK) in relation to the Content.

6.3 Consent (Online Safety Act 2023): The Talent expressly consents to the upload, storage, and commercial distribution of their intimate/sexual image on the Platforms managed by the Agency. The Talent confirms they are over 18 years of age.

6.4 Use after Termination: Upon termination, the Agency retains a license to archive the Content. The Talent may not use the Content or the Pseudonym without the Agency's written consent.`,
      fields: [],
    },
    {
      id: "financial",
      title: "7. FINANCIAL TERMS AND COMMISSION",
      content: `7.1 Revenue Collection: All Gross Revenue generated from the Platforms shall be collected by the Agency into the Agency's bank account.

7.2 Talent's Share: The Agency shall pay the Talent a share of the Net Revenue ("Turnover of the Profiles") based on the quantity of Content delivered in that calendar month (the "Performance Tier"). The Talent acknowledges this tiered structure is a material condition of this Agreement.

7.3 Calculation: The "Discriminatory Clause" applies: If the Talent meets the Photo requirement for Tier A but only the Video requirement for Tier C, the payout will be calculated at the lower tier (Tier C).

7.4 Payment Terms: Payments shall be made to the Talent's nominated bank account by the end of the calendar month following the month in which the Agency received the funds from the Platform.

7.5 Currency: The Agency may pay the Talent in USD. The Agency is not liable for exchange rate fluctuations.`,
      fields: [],
      hasTable: true,
    },
    {
      id: "non-compete",
      title: "8. NON-COMPETE AND RESTRICTIVE COVENANTS",
      content: `8.1 Non-Compete: During the Term and for a period of six (6) months following termination, the Talent shall not:
(a) Operate a competing profile on OnlyFans or similar adult subscription platforms;
(b) Solicit or attempt to migrate subscribers from the Agency-managed Profiles to any other account.

8.2 Reasonableness: The Talent acknowledges that these restrictions are reasonable and necessary to protect the Agency's investment in marketing and know-how.`,
      fields: [],
    },
    {
      id: "breach",
      title: "9. BREACH AND LIQUIDATED DAMAGES",
      content: `Note: Under English Law, punitive penalties are unenforceable. The following clauses are drafted as Liquidated Damages (genuine pre-estimates of loss) or Indemnities.

9.1 General Indemnity: The Talent agrees to indemnify the Agency against all losses, damages, and reasonable legal costs arising from any breach of the warranties or obligations in this Agreement.

9.2 Specific Liquidated Damages:
(a) Unauthorised Disclosure: If the Talent breaches confidentiality (Clause 10), they shall be liable for liquidated damages of €3,000 per breach.
(b) Misuse of Pseudonym: Usage of the Pseudonym after termination shall incur liquidated damages of €1,500.
(c) Breach of Non-Compete: Breach of Clause 8 (Non-Compete) shall incur liquidated damages of €15,000, representing a genuine estimate of the marketing investment and lost revenue attributable to the Talent.
(d) Failure to Deliver Custom Video: Failure to deliver a pre-paid Custom Video incurs a debt equal to the price of that video.`,
      fields: [],
    },
    {
      id: "confidentiality",
      title: "10. CONFIDENTIALITY",
      content: `10.1 The Parties undertake to keep strictly confidential the terms of this Agreement (specifically the financial percentages) and all trade secrets ("Confidential Information") indefinitely.

10.2 Disclosure is permitted only if required by law or to professional advisors (accountants/lawyers).`,
      fields: [],
    },
    {
      id: "termination",
      title: "11. TERMINATION",
      content: `11.1 Notice: Either party may terminate this Agreement by giving two (2) months' written notice.

11.2 Immediate Termination: The Agency may terminate immediately ("Summary Termination") if the Talent:
(a) Fails to start delivering content within 21 days;
(b) Changes profile passwords or locks the Agency out;
(c) Breaches the Exclusivity or Non-Compete clauses.

11.3 Early Termination Fee: If the Talent wishes to terminate immediately without cause, they must agree a "Sum of Early Termination" with the Agency to compensate for lost future profits.`,
      fields: [],
    },
    {
      id: "data-protection",
      title: "12. DATA PROTECTION (UK GDPR)",
      content: `12.1 The Agency acts as the Data Controller. The Agency shall process the Talent's personal data (including images, ID, and banking details) for the performance of this contract and legal compliance.

12.2 The Talent's data may be shared with accountants, legal advisors, and Platform operators (e.g., OnlyFans).`,
      fields: [],
    },
    {
      id: "general",
      title: "13. GENERAL PROVISIONS",
      content: `13.1 Governing Law: This Agreement and any dispute or claim arising out of or in connection with it shall be governed by and construed in accordance with the law of England and Wales.

13.2 Jurisdiction: The courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of this Agreement.

13.3 Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all previous agreements.

13.4 Counterparts: This Agreement may be executed in counterparts (including electronic copies).`,
      fields: [],
    },
    {
      id: "signature",
      title: "SIGNATURE",
      content: `IN WITNESS WHEREOF, the Parties have signed this Agreement on the dates set out below.

SIGNED by Partner A (The Agency)
TRUST CHARGE SOLUTIONS LTD
Name: Gabriel Marius Cosoi
Date: ${today}

SIGNED by Partner B (The Talent)
Name: {{fullName}}
Date: ${today}`,
      fields: ["fullName"],
      hasSignature: true,
      signatureDataUrl,
    },
  ];
};

// Editable field component for contract
function ContractField({
  value,
  placeholder,
  onChange,
  fieldName,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  fieldName: string;
}) {
  const isEmpty = !value || value.trim() === "";
  
  return (
    <span className="relative inline-block">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`inline-block border-b-2 bg-transparent outline-none min-w-[150px] px-1 py-0.5 text-sm transition-all ${
          isEmpty
            ? "border-brand-400 text-brand-600 placeholder:text-brand-400"
            : "border-green-500 text-slate-900"
        }`}
        style={{ width: `${Math.max(150, value.length * 8 + 20)}px` }}
      />
      {!isEmpty && (
        <Check className="inline-block w-3 h-3 text-green-500 ml-1" />
      )}
    </span>
  );
}

// Image upload component with Supabase Storage
function ImageUpload({
  label,
  value,
  storagePath,
  onUpload,
  onRemove,
  hint,
  icon: Icon,
  isUploading,
}: {
  label: string;
  value: string | null; // URL or path
  storagePath: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  hint: string;
  icon: React.ElementType;
  isUploading?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
  };

  const handleRemove = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          value
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 hover:border-brand-400 bg-slate-50"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-2" />
            <span className="text-sm text-slate-600">Uploading...</span>
          </div>
        ) : value ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
              <Icon className="w-6 h-6 text-slate-500" />
            </div>
            <span className="text-sm font-medium text-slate-700 mb-1">
              Click to upload
            </span>
            <span className="text-xs text-slate-500 text-center">{hint}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}

// Invalid/Expired Link Component
function InvalidLinkPage({ id }: { id: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-lg"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Link Expired or Invalid
        </h1>
        <p className="text-slate-600 mb-4">
          The registration link you are trying to access is either expired, invalid, or has already been used.
        </p>
        <div className="bg-slate-100 rounded-lg p-3 mb-6">
          <p className="text-xs text-slate-500 mb-1">Attempted Registration ID:</p>
          <p className="font-mono text-sm text-slate-700 break-all">{id}</p>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            If you believe this is an error, please contact our support team or request a new registration link.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/#contact">
                <LinkIcon className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button asChild className="flex-1 bg-brand-600 hover:bg-brand-700">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Back to Top Button Component
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition-colors flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function RegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  // Registration validation state
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [onboardingEmail, setOnboardingEmail] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["header"]);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [contractValidationError, setContractValidationError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const signatureRef = useRef<SignaturePadRef>(null);
  const contractRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Supabase storage paths
  const [storagePaths, setStoragePaths] = useState<{
    idFront: string | null;
    idBack: string | null;
    selfieWithId: string | null;
    signature: string | null;
  }>({
    idFront: null,
    idBack: null,
    selfieWithId: null,
    signature: null,
  });
  
  // Upload loading states
  const [uploadingStates, setUploadingStates] = useState<{
    idFront: boolean;
    idBack: boolean;
    selfieWithId: boolean;
    signature: boolean;
  }>({
    idFront: false,
    idBack: false,
    selfieWithId: false,
    signature: false,
  });
  
  // Auto-save state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = 2;
  
  // Real-time date state
  const [currentDate, setCurrentDate] = useState<string>("");
  
  // Validate registration ID and load existing data from Supabase
  useEffect(() => {
    const validateAndLoadData = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        
        // First check if onboarding exists and is valid
        const { data: validationData, error: validationError } = await supabase
          .rpc('get_onboarding_for_registration', { p_id: id });
        
        if (validationError || !validationData || validationData.length === 0) {
          setIsValidId(false);
          setIsValidating(false);
          return;
        }
        
        setIsValidId(true);
        setOnboardingEmail(validationData[0].email);
        
        // Load full onboarding data
        const { data: onboardingData, error: loadError } = await supabase
          .from('onboardings')
          .select('*')
          .eq('id', id)
          .single();
        
        if (!loadError && onboardingData) {
          // Restore form data from database
          setFormData({
            fullName: onboardingData.full_name || "",
            dateOfBirth: onboardingData.date_of_birth ? new Date(onboardingData.date_of_birth) : undefined,
            address: onboardingData.address || "",
            city: onboardingData.city || "",
            postalCode: onboardingData.postal_code || "",
            country: onboardingData.country || "",
            idType: (onboardingData.id_type as "passport" | "national_id" | "") || "",
            idNumber: onboardingData.id_number || "",
            idFrontImage: null, // Will be loaded separately
            idBackImage: null,
            selfieWithId: null,
            agreedToTerms: onboardingData.agreed_to_terms || false,
            signature: "",
            stageName: onboardingData.stage_name || "",
            categories: onboardingData.categories || [],
            platforms: onboardingData.platforms || [],
            languages: onboardingData.languages || [],
            experience: onboardingData.experience || "",
            availability: onboardingData.availability || "",
            instagram: onboardingData.instagram || "",
            tiktok: onboardingData.tiktok || "",
            twitter: onboardingData.twitter || "",
            currentEarnings: onboardingData.current_earnings || "",
            goals: onboardingData.goals || "",
            additionalNotes: onboardingData.additional_notes || "",
          });
          
          // Set storage paths and load images
          setStoragePaths({
            idFront: onboardingData.id_front_path,
            idBack: onboardingData.id_back_path,
            selfieWithId: onboardingData.selfie_with_id_path,
            signature: onboardingData.signature_path,
          });
          
          // Load images from storage if paths exist
          const loadImage = async (path: string | null) => {
            if (!path) return null;
            const { data } = supabase.storage
              .from('onboarding-documents')
              .getPublicUrl(path);
            return data.publicUrl;
          };
          
          // Load signature as data URL (needed for canvas)
          const loadSignatureAsDataUrl = async (path: string | null) => {
            if (!path) return null;
            const { data } = supabase.storage
              .from('onboarding-documents')
              .getPublicUrl(path);
            
            try {
              // Fetch and convert to data URL for canvas compatibility
              const response = await fetch(data.publicUrl);
              const blob = await response.blob();
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
            } catch {
              return null;
            }
          };
          
          if (onboardingData.id_front_path) {
            const url = await loadImage(onboardingData.id_front_path);
            if (url) setFormData(prev => ({ ...prev, idFrontImage: url }));
          }
          if (onboardingData.id_back_path) {
            const url = await loadImage(onboardingData.id_back_path);
            if (url) setFormData(prev => ({ ...prev, idBackImage: url }));
          }
          if (onboardingData.selfie_with_id_path) {
            const url = await loadImage(onboardingData.selfie_with_id_path);
            if (url) setFormData(prev => ({ ...prev, selfieWithId: url }));
          }
          // Load signature from localStorage first, then fall back to Supabase
          const savedSignature = localStorage.getItem(`lovebite-signature-${id}`);
          if (savedSignature) {
            setSignatureDataUrl(savedSignature);
          } else if (onboardingData.signature_path) {
            const dataUrl = await loadSignatureAsDataUrl(onboardingData.signature_path);
            if (dataUrl) {
              setSignatureDataUrl(dataUrl);
              // Also save to localStorage for consistency
              localStorage.setItem(`lovebite-signature-${id}`, dataUrl);
            }
          }
        }
        
        // Mark onboarding as in_progress
        await supabase.rpc('start_onboarding', { p_id: id });
        
      } catch (err) {
        console.error("Error validating/loading onboarding:", err);
        setIsValidId(false);
      } finally {
        setIsValidating(false);
        setIsHydrated(true);
      }
    };
    
    validateAndLoadData();
  }, [id]);
  
  // Debounced auto-save to Supabase
  const saveToSupabase = useCallback(async () => {
    if (!isValidId || isSubmitted) return;
    
    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      const { error } = await supabase
        .from('onboardings')
        .update({
          full_name: formData.fullName || null,
          date_of_birth: formData.dateOfBirth?.toISOString().split('T')[0] || null,
          address: formData.address || null,
          city: formData.city || null,
          postal_code: formData.postalCode || null,
          country: formData.country || null,
          id_type: formData.idType || null,
          id_number: formData.idNumber || null,
          stage_name: formData.stageName || null,
          categories: formData.categories,
          platforms: formData.platforms,
          languages: formData.languages,
          experience: formData.experience || null,
          availability: formData.availability || null,
          instagram: formData.instagram || null,
          tiktok: formData.tiktok || null,
          twitter: formData.twitter || null,
          current_earnings: formData.currentEarnings || null,
          goals: formData.goals || null,
          additional_notes: formData.additionalNotes || null,
          agreed_to_terms: formData.agreedToTerms,
        })
        .eq('id', id);
      
      if (!error) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error("Error saving to Supabase:", err);
    } finally {
      setIsSaving(false);
    }
  }, [id, formData, isValidId, isSubmitted]);

  // Auto-save with debounce when form data changes
  useEffect(() => {
    if (!isHydrated || isSubmitted || !isValidId) return;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase();
    }, 1500); // Save 1.5 seconds after last change
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, isHydrated, isSubmitted, isValidId, saveToSupabase]);
  
  // Upload file to Supabase Storage
  const uploadToStorage = useCallback(async (
    file: File,
    fileType: 'idFront' | 'idBack' | 'selfieWithId' | 'signature'
  ): Promise<string | null> => {
    const supabase = getSupabaseBrowserClient();
    
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${id}/${fileType}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('onboarding-documents')
      .upload(fileName, file, { upsert: true });
    
    if (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      return null;
    }
    
    // Update the path in the database
    const pathColumn = {
      idFront: 'id_front_path',
      idBack: 'id_back_path',
      selfieWithId: 'selfie_with_id_path',
      signature: 'signature_path',
    }[fileType];
    
    await supabase
      .from('onboardings')
      .update({ [pathColumn]: fileName })
      .eq('id', id);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('onboarding-documents')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  }, [id]);
  
  // Handle image upload
  const handleImageUpload = useCallback(async (
    file: File,
    fileType: 'idFront' | 'idBack' | 'selfieWithId'
  ) => {
    setUploadingStates(prev => ({ ...prev, [fileType]: true }));
    
    try {
      const url = await uploadToStorage(file, fileType);
      
      if (url) {
        const formField = {
          idFront: 'idFrontImage',
          idBack: 'idBackImage',
          selfieWithId: 'selfieWithId',
        }[fileType] as keyof FormData;
        
        setFormData(prev => ({ ...prev, [formField]: url }));
        setStoragePaths(prev => ({ ...prev, [fileType]: `${id}/${fileType}.${file.name.split('.').pop()}` }));
        toast.success("Image uploaded successfully");
      }
    } finally {
      setUploadingStates(prev => ({ ...prev, [fileType]: false }));
    }
  }, [id, uploadToStorage]);
  
  // Handle image removal
  const handleImageRemove = useCallback(async (
    fileType: 'idFront' | 'idBack' | 'selfieWithId'
  ) => {
    const path = storagePaths[fileType];
    if (path) {
      const supabase = getSupabaseBrowserClient();
      await supabase.storage.from('onboarding-documents').remove([path]);
      
      const pathColumn = {
        idFront: 'id_front_path',
        idBack: 'id_back_path',
        selfieWithId: 'selfie_with_id_path',
      }[fileType];
      
      await supabase
        .from('onboardings')
        .update({ [pathColumn]: null })
        .eq('id', id);
    }
    
    const formField = {
      idFront: 'idFrontImage',
      idBack: 'idBackImage',
      selfieWithId: 'selfieWithId',
    }[fileType] as keyof FormData;
    
    setFormData(prev => ({ ...prev, [formField]: null }));
    setStoragePaths(prev => ({ ...prev, [fileType]: null }));
  }, [id, storagePaths]);
  
  // Update date on mount (client-side only for real-time)
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }));
    };
    updateDate();
    // Update every minute to keep it real-time
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to section helper using ID and optionally focus an input
  const scrollToElement = useCallback((elementId: string, focusInputId?: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Calculate position with offset for fixed header
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Add a brief highlight effect and focus input after scroll
      setTimeout(() => {
        element.classList.add("ring-2", "ring-brand-500", "ring-offset-2");
        
        // Focus the input if specified
        if (focusInputId) {
          const input = document.getElementById(focusInputId);
          if (input) {
            (input as HTMLInputElement).focus();
          }
        }
        
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-brand-500", "ring-offset-2");
        }, 2000);
      }, 600);
    }
  }, []);

  // Get dynamic contract sections
  const contractSections = getContractSections(formData, signatureDataUrl, currentDate);

  // Auto-expand sections on scroll
  useEffect(() => {
    if (isValidating || !isValidId) return;
    
    const handleScroll = () => {
      if (!contractRef.current) return;

      const contractRect = contractRef.current.getBoundingClientRect();
      const viewportMiddle = window.innerHeight / 2;

      sectionRefs.current.forEach((element, sectionId) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        
        // If section is near the viewport middle, expand it
        if (rect.top < viewportMiddle && rect.bottom > viewportMiddle - 100) {
          setExpandedSections((prev) => {
            if (!prev.includes(sectionId)) {
              return [...prev, sectionId];
            }
            return prev;
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isValidating, isValidId]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [currentStep]);

  // Update signature when it changes - save to localStorage only
  const handleSignatureChange = useCallback((isEmpty: boolean) => {
    if (!isEmpty && signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL();
      setSignatureDataUrl(dataUrl);
      // Save to localStorage for persistence
      try {
        localStorage.setItem(`lovebite-signature-${id}`, dataUrl);
      } catch (err) {
        console.error("Error saving signature to localStorage:", err);
      }
    } else {
      setSignatureDataUrl(null);
      // Clear from localStorage
      try {
        localStorage.removeItem(`lovebite-signature-${id}`);
      } catch (err) {
        console.error("Error removing signature from localStorage:", err);
      }
    }
  }, [id]);
  
  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-slate-600">Validating registration link...</p>
        </motion.div>
      </div>
    );
  }
  
  // Show invalid link page if ID is not valid
  if (!isValidId) {
    return <InvalidLinkPage id={id} />;
  }

  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setContractValidationError(null);
  };

  const toggleArrayField = (
    field: "categories" | "platforms" | "languages",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const expandAllSections = () => {
    setExpandedSections(contractSections.map((s) => s.id));
  };

  // Check if contract fields are filled
  const isContractComplete = (): boolean => {
    const fullAddress = formatFullAddress(formData);
    return !!(
      formData.fullName.trim() &&
      fullAddress &&
      formData.idNumber.trim() &&
      signatureDataUrl &&
      formData.agreedToTerms
    );
  };

  // Check if all step 1 requirements are met
  const isStep1Complete = (): boolean => {
    return !!(
      formData.fullName.trim() &&
      formData.dateOfBirth &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.postalCode.trim() &&
      formData.country.trim() &&
      formData.idType &&
      formData.idNumber.trim() &&
      formData.idFrontImage &&
      (formData.idType === "passport" || formData.idBackImage) &&
      formData.selfieWithId &&
      formData.agreedToTerms &&
      signatureDataUrl
    );
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Check contract completion first
    if (!isContractComplete()) {
      setContractValidationError(
        "Please fill in all contract fields (name, address, ID number) and sign the contract before proceeding."
      );
      return false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!formData.idType) {
      newErrors.idType = "Please select an ID type";
    }
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "ID number is required";
    }
    if (!formData.idFrontImage) {
      newErrors.idFrontImage = "ID front image is required";
    }
    if (formData.idType === "national_id" && !formData.idBackImage) {
      newErrors.idBackImage = "ID back image is required for national ID";
    }
    if (!formData.selfieWithId) {
      newErrors.selfieWithId = "Selfie with ID is required";
    }
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms";
    }
    if (!signatureDataUrl) {
      newErrors.signature = "Signature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.stageName.trim()) {
      newErrors.stageName = "Stage name is required";
    }
    if (formData.categories.length === 0) {
      newErrors.categories = "Select at least one category";
    }
    if (formData.platforms.length === 0) {
      newErrors.platforms = "Select at least one platform";
    }
    if (!formData.experience) {
      newErrors.experience = "Experience level is required";
    }
    if (!formData.availability) {
      newErrors.availability = "Availability is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      if (signatureRef.current) {
        updateFormData("signature", signatureRef.current.toDataURL());
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    
    try {
      const supabase = getSupabaseBrowserClient();
      
      // Upload signature from localStorage if exists
      let signaturePath = storagePaths.signature;
      if (signatureDataUrl) {
        // Convert data URL to blob and upload
        const response = await fetch(signatureDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'signature.png', { type: 'image/png' });
        
        const fileName = `${id}/signature.png`;
        const { error: uploadError } = await supabase.storage
          .from('onboarding-documents')
          .upload(fileName, file, { upsert: true });
        
        if (!uploadError) {
          signaturePath = fileName;
        }
      }

      // Generate and upload the contract PDF
      let contractPdfPath: string | null = null;
      try {
        const pdfBlob = await generateContractPdfBlob();
        const pdfFile = new File([pdfBlob], `contract-${id}.pdf`, { type: 'application/pdf' });
        const pdfFileName = `${id}/contract.pdf`;
        
        const { error: pdfUploadError } = await supabase.storage
          .from('onboarding-documents')
          .upload(pdfFileName, pdfFile, { upsert: true });
        
        if (!pdfUploadError) {
          contractPdfPath = pdfFileName;
        } else {
          console.error("PDF upload error:", pdfUploadError);
        }
      } catch (pdfErr) {
        console.error("Error generating/uploading PDF:", pdfErr);
        // Continue with submission even if PDF upload fails
      }
      
      // Submit the complete onboarding
      const { error } = await supabase
        .from('onboardings')
        .update({
          status: 'submitted',
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth?.toISOString().split('T')[0],
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          id_type: formData.idType,
          id_number: formData.idNumber,
          signature_path: signaturePath,
          contract_pdf_path: contractPdfPath,
          stage_name: formData.stageName,
          categories: formData.categories,
          platforms: formData.platforms,
          languages: formData.languages,
          experience: formData.experience,
          availability: formData.availability,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          twitter: formData.twitter,
          current_earnings: formData.currentEarnings,
          goals: formData.goals,
          additional_notes: formData.additionalNotes,
          agreed_to_terms: true,
          contract_signed_at: new Date().toISOString(),
          submitted_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        toast.error(`Failed to submit: ${error.message || 'Unknown error'}`);
        console.error("Submit error:", JSON.stringify(error, null, 2));
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", error.details);
        return;
      }
      
      setIsSubmitted(true);
      toast.success("Registration submitted successfully!");
      
      // Clear signature from localStorage after successful submission
      try {
        localStorage.removeItem(`lovebite-signature-${id}`);
      } catch {
        // Ignore localStorage errors
      }
      
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("An error occurred while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if download requirements are met
  const canDownloadContract = (): boolean => {
    const fullAddress = formatFullAddress(formData);
    return !!(
      formData.fullName.trim() &&
      fullAddress &&
      formData.idNumber.trim() &&
      signatureDataUrl &&
      formData.agreedToTerms
    );
  };

  // Get missing requirements for download
  const getMissingRequirements = (): string[] => {
    const missing: string[] = [];
    const fullAddress = formatFullAddress(formData);
    
    if (!formData.fullName.trim()) missing.push("Full Name");
    if (!fullAddress) missing.push("Address");
    if (!formData.idNumber.trim()) missing.push("ID Number");
    if (!signatureDataUrl) missing.push("Signature");
    if (!formData.agreedToTerms) missing.push("Agreement to Terms");
    
    return missing;
  };

  // Handle download button click
  const handleDownloadClick = () => {
    if (!canDownloadContract()) {
      const missing = getMissingRequirements();
      toast.error("Cannot download contract", {
        description: `Please complete the following: ${missing.join(", ")}`,
      });
      return;
    }
    handleDownloadContract();
  };

  // Download contract as PDF - uses the same generation as upload for consistency
  const handleDownloadContract = async () => {
    try {
      const blob = await generateContractPdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lovebite-contract-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Contract downloaded successfully", {
        description: "Your signed contract has been saved as a PDF.",
      });
    } catch (err) {
      console.error("Error downloading contract:", err);
      toast.error("Failed to download contract");
    }
  };

  // Generate PDF as blob for upload
  const generateContractPdfBlob = async (): Promise<Blob> => {
    const fullAddress = formatFullAddress(formData);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Helper: Convert URL to base64 data URL (handles CORS)
    const urlToDataUrl = async (url: string): Promise<string> => {
      if (url.startsWith('data:')) return url;
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(url);
          reader.readAsDataURL(blob);
        });
      } catch {
        return url;
      }
    };

    // Helper: Compress image to reduce file size
    const compressImage = async (imageUrl: string, maxWidth: number = 400, quality: number = 0.6): Promise<string> => {
      // First convert URL to data URL to avoid CORS issues
      const dataUrl = await urlToDataUrl(imageUrl);
      
      return new Promise((resolve) => {
        const img = new window.Image();
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Scale down if needed
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
            }
            
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch {
            // Fallback to original data URL
            resolve(dataUrl);
          }
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      });
    };

    // Pre-compress images for smaller PDF
    const compressedIdFront = formData.idFrontImage ? await compressImage(formData.idFrontImage, 300, 0.5) : null;
    const compressedIdBack = formData.idBackImage ? await compressImage(formData.idBackImage, 300, 0.5) : null;
    const compressedSelfie = formData.selfieWithId ? await compressImage(formData.selfieWithId, 300, 0.5) : null;
    const compressedSignature = signatureDataUrl ? await compressImage(signatureDataUrl, 400, 0.7) : null;

    // Helper: Add page header
    const addPageHeader = (title: string) => {
      pdf.setFillColor(190, 24, 93);
      pdf.rect(0, 0, pageWidth, 20, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("LOVEBITE", margin, 13);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(title, pageWidth - margin, 13, { align: "right" });
      yPosition = 30;
      pdf.setTextColor(0, 0, 0);
    };

    // Helper: Check if new page needed
    const checkNewPage = (neededHeight: number): boolean => {
      if (yPosition + neededHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper: Add wrapped text
    const addWrappedText = (text: string, maxWidth: number, lineHeight: number, fontSize: number = 9) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        checkNewPage(lineHeight);
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Helper: Add section title
    const addSectionTitle = (title: string, bgColor: [number, number, number] = [241, 245, 249]) => {
      checkNewPage(15);
      pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      pdf.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, "F");
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 41, 59);
      pdf.text(title, margin + 4, yPosition + 5.5);
      yPosition += 12;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 65, 85);
    };

    // Helper: Add labeled field
    const addLabeledField = (label: string, value: string, x: number = margin, width: number = contentWidth) => {
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(label, x, yPosition);
      yPosition += 4;
      pdf.setFontSize(10);
      pdf.setTextColor(30, 41, 59);
      const lines = pdf.splitTextToSize(value || "—", width);
      lines.forEach((line: string) => {
        pdf.text(line, x, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    };

    // ==================== PAGE 1: CONTRACT ====================
    addPageHeader("Agency Agreement");

    // Title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 41, 59);
    pdf.text("EXCLUSIVE MANAGEMENT AND CONTENT AGENCY AGREEMENT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    // Registration info box
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPosition, contentWidth, 10, 2, 2, "F");
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Registration ID: ${id}`, margin + 4, yPosition + 6);
    pdf.text(`Date: ${currentDate}`, pageWidth - margin - 4, yPosition + 6, { align: "right" });
    yPosition += 16;

    // Contract sections
    contractSections.forEach((section) => {
      addSectionTitle(section.title);
      
      let content = section.content;
      content = content.replace(/\{\{fullName\}\}/g, formData.fullName || "[NOT PROVIDED]");
      content = content.replace(/\{\{address\}\}/g, fullAddress || "[NOT PROVIDED]");
      content = content.replace(/\{\{idNumber\}\}/g, formData.idNumber || "[NOT PROVIDED]");
      
      addWrappedText(content, contentWidth, 4.5, 9);
      yPosition += 2;

      // Commission table
      if (section.hasTable) {
        checkNewPage(30);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text("COMMISSION STRUCTURE:", margin, yPosition);
        yPosition += 5;

        // Table header
        pdf.setFillColor(190, 24, 93);
        pdf.rect(margin, yPosition, contentWidth, 6, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text("Period", margin + 4, yPosition + 4);
        pdf.text("Agency Share", margin + 55, yPosition + 4);
        pdf.text("Talent Share", margin + 100, yPosition + 4);
        yPosition += 6;

        const rows = [
          ["Recuuring Commission", "70%", "30%"],
        ];

        pdf.setTextColor(51, 65, 85);
        rows.forEach((row, idx) => {
          if (idx % 2 === 0) {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin, yPosition, contentWidth, 5, "F");
          }
          pdf.text(row[0], margin + 4, yPosition + 3.5);;
          yPosition += 5;
        });
        yPosition += 4;
      }
      yPosition += 3;
    });

    // ==================== SIGNATURE SECTION ====================
    checkNewPage(65);
    pdf.setFillColor(254, 242, 242);
    pdf.roundedRect(margin, yPosition, contentWidth, 55, 3, 3, "F");
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 41, 59);
    pdf.text("DIGITAL SIGNATURE", margin + 4, yPosition + 8);
    
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Signed by: ${formData.fullName}`, margin + 4, yPosition + 16);
    pdf.text(`Date: ${currentDate}`, margin + 4, yPosition + 22);
    pdf.text(`ID/Passport: ${formData.idNumber}`, margin + 4, yPosition + 28);

    if (compressedSignature) {
      try {
        const sigWidth = 80;
        const sigHeight = 32;
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin + 75, yPosition + 10, sigWidth + 4, sigHeight + 4, 2, 2, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(margin + 75, yPosition + 10, sigWidth + 4, sigHeight + 4, 2, 2, "S");
        pdf.addImage(compressedSignature, "JPEG", margin + 77, yPosition + 12, sigWidth, sigHeight);
      } catch {
        pdf.text("[Signature on file]", margin + 95, yPosition + 28);
      }
    }
    yPosition += 60;

    // ==================== PAGE 2: IDENTITY VERIFICATION ====================
    pdf.addPage();
    addPageHeader("Identity Verification");

    // ID Info Section
    addSectionTitle("IDENTITY INFORMATION", [240, 253, 244]);
    
    const col1X = margin;
    const col2X = margin + contentWidth / 2;
    const savedY = yPosition;
    
    addLabeledField("ID Type", formData.idType === "passport" ? "Passport" : "National ID Card", col1X, contentWidth / 2 - 5);
    const afterCol1 = yPosition;
    yPosition = savedY;
    addLabeledField("ID Number", formData.idNumber, col2X, contentWidth / 2 - 5);
    yPosition = Math.max(afterCol1, yPosition) + 5;

    // ID Images
    addSectionTitle("VERIFICATION DOCUMENTS", [240, 253, 244]);
    
    const imgWidth = 50;
    const imgHeight = 35;
    const imgSpacing = 8;
    const totalImgWidth = (imgWidth * 3) + (imgSpacing * 2);
    const imgStartX = margin + (contentWidth - totalImgWidth) / 2;

    // ID Front
    if (compressedIdFront) {
      try {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(imgStartX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(imgStartX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "S");
        pdf.addImage(compressedIdFront, "JPEG", imgStartX, yPosition, imgWidth, imgHeight);
        pdf.setFontSize(7);
        pdf.setTextColor(107, 114, 128);
        pdf.text("ID Front", imgStartX + imgWidth / 2, yPosition + imgHeight + 6, { align: "center" });
      } catch {
        pdf.text("[ID Front]", imgStartX + imgWidth / 2, yPosition + imgHeight / 2, { align: "center" });
      }
    } else {
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(imgStartX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text("No ID Front", imgStartX + imgWidth / 2, yPosition + imgHeight / 2, { align: "center" });
    }

    // ID Back
    const img2X = imgStartX + imgWidth + imgSpacing;
    if (compressedIdBack) {
      try {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(img2X - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(img2X - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "S");
        pdf.addImage(compressedIdBack, "JPEG", img2X, yPosition, imgWidth, imgHeight);
        pdf.setFontSize(7);
        pdf.setTextColor(107, 114, 128);
        pdf.text("ID Back", img2X + imgWidth / 2, yPosition + imgHeight + 6, { align: "center" });
      } catch {
        pdf.text("[ID Back]", img2X + imgWidth / 2, yPosition + imgHeight / 2, { align: "center" });
      }
    } else {
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(img2X - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text("No ID Back", img2X + imgWidth / 2, yPosition + imgHeight / 2, { align: "center" });
    }

    // Selfie with ID
    const img3X = img2X + imgWidth + imgSpacing;
    if (compressedSelfie) {
      try {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(img3X - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.roundedRect(img3X - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "S");
        pdf.addImage(compressedSelfie, "JPEG", img3X, yPosition, imgWidth, imgHeight);
        pdf.setFontSize(7);
        pdf.setTextColor(107, 114, 128);
        pdf.text("Selfie with ID", img3X + imgWidth / 2, yPosition + imgHeight + 6, { align: "center" });
      } catch {
        pdf.text("[Selfie]", img3X + imgWidth / 2, yPosition + imgHeight / 2, { align: "center" });
      }
    } else {
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(img3X - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text("No Selfie", img3X + imgWidth / 2, yPosition + imgHeight / 2, { align: "center" });
    }

    yPosition += imgHeight + 15;

    // ==================== PAGE 3: MODEL PREFERENCES ====================
    pdf.addPage();
    addPageHeader("Model Preferences");

    // Personal Info
    addSectionTitle("CREATOR PROFILE", [254, 242, 242]);
    
    const prefCol1X = margin;
    const prefCol2X = margin + contentWidth / 2;
    let prefY = yPosition;
    
    addLabeledField("Stage Name", formData.stageName, prefCol1X, contentWidth / 2 - 5);
    const afterPrefCol1 = yPosition;
    yPosition = prefY;
    addLabeledField("Full Name", formData.fullName, prefCol2X, contentWidth / 2 - 5);
    yPosition = Math.max(afterPrefCol1, yPosition) + 3;

    // Content Categories
    addSectionTitle("CONTENT PREFERENCES", [254, 242, 242]);
    
    prefY = yPosition;
    addLabeledField("Categories", formData.categories?.join(", ") || "—", prefCol1X, contentWidth / 2 - 5);
    const afterCat = yPosition;
    yPosition = prefY;
    addLabeledField("Languages", formData.languages?.join(", ") || "—", prefCol2X, contentWidth / 2 - 5);
    yPosition = Math.max(afterCat, yPosition) + 3;

    prefY = yPosition;
    addLabeledField("Platforms", formData.platforms?.join(", ") || "—", prefCol1X, contentWidth / 2 - 5);
    const afterPlat = yPosition;
    yPosition = prefY;
    addLabeledField("Experience", formData.experience || "—", prefCol2X, contentWidth / 2 - 5);
    yPosition = Math.max(afterPlat, yPosition) + 3;

    addLabeledField("Availability", formData.availability || "—", margin, contentWidth);

    // Social Media
    addSectionTitle("SOCIAL MEDIA", [239, 246, 255]);
    
    prefY = yPosition;
    addLabeledField("Instagram", formData.instagram || "—", prefCol1X, contentWidth / 3 - 5);
    const afterInsta = yPosition;
    yPosition = prefY;
    addLabeledField("TikTok", formData.tiktok || "—", margin + contentWidth / 3, contentWidth / 3 - 5);
    const afterTiktok = yPosition;
    yPosition = prefY;
    addLabeledField("Twitter/X", formData.twitter || "—", margin + (contentWidth / 3) * 2, contentWidth / 3 - 5);
    yPosition = Math.max(afterInsta, afterTiktok, yPosition) + 3;

    // Additional Info
    addSectionTitle("ADDITIONAL INFORMATION", [240, 253, 244]);
    
    addLabeledField("Current Monthly Earnings", formData.currentEarnings || "—", margin, contentWidth);
    addLabeledField("Goals & Aspirations", formData.goals || "—", margin, contentWidth);
    
    if (formData.additionalNotes) {
      addLabeledField("Additional Notes", formData.additionalNotes, margin, contentWidth);
    }

    // ==================== ADD FOOTERS TO ALL PAGES ====================
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7);
      pdf.setTextColor(156, 163, 175);
      pdf.text(
        `Page ${i} of ${totalPages}  •  Lovebite Agency Contract  •  ID: ${id}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    }

    return pdf.output('blob');
  };

  // Render contract content with editable fields
  const renderContractContent = (section: ReturnType<typeof getContractSections>[number]) => {
    let content = section.content;
    const fullAddress = formatFullAddress(formData);

    // Replace placeholders with editable fields or values
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\{\{(\w+)\}\}/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      // Add the editable field
      const fieldName = match[1];
      let value = "";
      let placeholder = "";

      switch (fieldName) {
        case "fullName":
          value = formData.fullName;
          placeholder = "Enter full legal name";
          parts.push(
            <ContractField
              key={`${section.id}-${fieldName}-${match.index}`}
              value={value}
              placeholder={placeholder}
              onChange={(v) => updateFormData("fullName", v)}
              fieldName={fieldName}
            />
          );
          break;
        case "address":
          value = fullAddress || "";
          placeholder = "Click to fill address";
          parts.push(
            <button
              type="button"
              key={`${section.id}-${fieldName}-${match.index}`}
              onClick={() => scrollToElement("personal-info-section", "address")}
              className={`inline-block border-b-2 px-1 py-0.5 min-w-[200px] text-left transition-all hover:bg-brand-50 rounded ${
                value ? "border-green-500 text-slate-900" : "border-brand-400 text-brand-600 cursor-pointer hover:text-brand-700"
              }`}
            >
              {value || placeholder}
              {value && <Check className="inline-block w-3 h-3 text-green-500 ml-1" />}
              {!value && <ArrowRight className="inline-block w-3 h-3 ml-1 animate-bounce" />}
            </button>
          );
          break;
        case "idNumber":
          value = formData.idNumber;
          placeholder = "Enter ID/Passport number";
          parts.push(
            <ContractField
              key={`${section.id}-${fieldName}-${match.index}`}
              value={value}
              placeholder={placeholder}
              onChange={(v) => updateFormData("idNumber", v)}
              fieldName={fieldName}
            />
          );
          break;
        default:
          parts.push(match[0]);
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl p-8 text-center border border-slate-200"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Registration Complete!
          </h1>
          <p className="text-slate-600 mb-6">
            Thank you for registering with Lovebite. Our team will review your
            application and contact you within 48 hours.
          </p>
          <div className="space-y-3">
            <Button onClick={handleDownloadClick} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button asChild className="w-full bg-brand-600 hover:bg-brand-700">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Lovebite</span>
            </Link>
            <div className="flex items-center gap-4">
             
              {/* Auto-save indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                    <span className="text-slate-400">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-slate-400">Saved</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">


          {/* Steps UI - Fixed */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep >= 1
                      ? "bg-brand-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  } ${currentStep === 1 ? "ring-4 ring-brand-100" : ""}`}
                >
                  {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep >= 1 ? "text-brand-600" : "text-slate-400"
                  }`}
                >
                  Contract & Signage
                </span>
              </div>

              {/* Connector */}
              <div
                className={`w-16 h-1 rounded-full transition-colors ${
                  currentStep > 1 ? "bg-brand-600" : "bg-slate-200"
                }`}
              />

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep >= 2
                      ? "bg-brand-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  } ${currentStep === 2 ? "ring-4 ring-brand-100" : ""}`}
                >
                  {currentStep > 2 ? <Check className="w-5 h-5" /> : "2"}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep >= 2 ? "text-brand-600" : "text-slate-400"
                  }`}
                >
                  Model Preferences
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >

                {/* Contract Validation Error */}
                {contractValidationError && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-800">{contractValidationError}</span>
                  </div>
                )}

                {/* Contract Section */}
                <div
                  ref={contractRef}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-600" />
                          Agency Agreement
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Read and fill the highlighted fields</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={expandAllSections}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                        >
                          Expand all
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadClick}
                          disabled={!canDownloadContract()}
                          className="text-xs"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {contractSections.map((section) => (
                      <div
                        key={section.id}
                        ref={(el) => {
                          if (el) sectionRefs.current.set(section.id, el);
                        }}
                        className="group"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">
                              {section.title}
                            </span>
                            {section.fields && section.fields.length > 0 && (
                              <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                                Requires input
                              </span>
                            )}
                          </div>
                          <motion.div
                            animate={{
                              rotate: expandedSections.includes(section.id) ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedSections.includes(section.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50/50">
                                {renderContractContent(section)}

                                {/* Commission Table */}
                                {section.hasTable && (
                                  <div className="mt-6">
                                    <p className="font-semibold text-slate-800 mb-3">
                                      COMMISSION STRUCTURE:
                                    </p>
                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-brand-600 text-white">
                                            <th className="px-4 py-3 text-left font-semibold">
                                              Period
                                            </th>
                                            <th className="px-4 py-3 text-center font-semibold">
                                              Agency Share
                                            </th>
                                            <th className="px-4 py-3 text-center font-semibold">
                                              Talent Share
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                          <tr className="bg-white hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                              Recuuring Commission
                                            </td>
                                            <td className="px-4 py-3 text-center text-slate-600">
                                              70%
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                30%
                                              </span>
                                            </td>
                                          </tr >
                                          
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {/* Signature Display */}
                                {section.hasSignature && (
                                  <div className="mt-4">
                                    <p className="font-semibold text-slate-800 mb-2">
                                      Digital Signature:
                                    </p>
                                    {signatureDataUrl ? (
                                      <div className="border-2 border-green-500 rounded-lg p-2 bg-white inline-block">
                                        <Image
                                          src={signatureDataUrl}
                                          alt="Signature"
                                          width={200}
                                          height={80}
                                          className="max-h-20 w-auto"
                                        />
                                      </div>
                                    ) : (
                                      <p className="text-brand-600 text-sm">
                                        [Sign below to see your signature here]
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div 
                  id="personal-info-section"
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all scroll-mt-24"
                >
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-600" />
                      Personal Information
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">Auto-fills contract fields above</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName">Full Legal Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            updateFormData("fullName", e.target.value)
                          }
                          placeholder="As shown on your ID"
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-500">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label>Date of Birth *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.dateOfBirth && "text-muted-foreground",
                                errors.dateOfBirth && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.dateOfBirth ? (
                                format(formData.dateOfBirth, "d MMMM yyyy")
                              ) : (
                                <span>Select your date of birth</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.dateOfBirth}
                              onSelect={(date) => updateFormData("dateOfBirth", date)}
                              disabled={(date) => {
                                const today = new Date();
                                const eighteenYearsAgo = new Date(
                                  today.getFullYear() - 18,
                                  today.getMonth(),
                                  today.getDate()
                                );
                                return date > eighteenYearsAgo || date < new Date("1900-01-01");
                              }}
                              defaultMonth={formData.dateOfBirth || new Date(new Date().getFullYear() - 25, 0)}
                              captionLayout="dropdown"
                              fromYear={1940}
                              toYear={new Date().getFullYear() - 18}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.dateOfBirth && (
                          <p className="text-xs text-red-500">
                            {errors.dateOfBirth}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          updateFormData("address", e.target.value)
                        }
                        placeholder="Street name and number"
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            updateFormData("city", e.target.value)
                          }
                          placeholder="Your city"
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-xs text-red-500">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) =>
                            updateFormData("postalCode", e.target.value)
                          }
                          placeholder="Postal code"
                          className={errors.postalCode ? "border-red-500" : ""}
                        />
                        {errors.postalCode && (
                          <p className="text-xs text-red-500">
                            {errors.postalCode}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) =>
                            updateFormData("country", e.target.value)
                          }
                          placeholder="Your country"
                          className={errors.country ? "border-red-500" : ""}
                        />
                        {errors.country && (
                          <p className="text-xs text-red-500">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID Verification */}
                <div 
                  id="id-verification-section"
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all scroll-mt-24"
                >
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-brand-600" />
                      Identity Verification
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">Upload a valid government-issued ID</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* ID Type Selection */}
                    <div className="space-y-3">
                      <Label>Select ID Type *</Label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormData("idType", "passport")}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            formData.idType === "passport"
                              ? "border-brand-600 bg-brand-50"
                              : "border-slate-200 hover:border-brand-300"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              formData.idType === "passport"
                                ? "bg-brand-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p
                              className={`font-semibold ${
                                formData.idType === "passport"
                                  ? "text-brand-700"
                                  : "text-slate-700"
                              }`}
                            >
                              Passport
                            </p>
                            <p className="text-xs text-slate-500">
                              International travel document
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateFormData("idType", "national_id")}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            formData.idType === "national_id"
                              ? "border-brand-600 bg-brand-50"
                              : "border-slate-200 hover:border-brand-300"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              formData.idType === "national_id"
                                ? "bg-brand-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p
                              className={`font-semibold ${
                                formData.idType === "national_id"
                                  ? "text-brand-700"
                                  : "text-slate-700"
                              }`}
                            >
                              National ID Card
                            </p>
                            <p className="text-xs text-slate-500">
                              Government-issued ID card
                            </p>
                          </div>
                        </button>
                      </div>
                      {errors.idType && (
                        <p className="text-xs text-red-500">{errors.idType}</p>
                      )}
                    </div>

                    {/* ID Number */}
                    <div className="space-y-1.5">
                      <Label htmlFor="idNumber">
                        {formData.idType === "passport"
                          ? "Passport Number"
                          : "ID Number"}{" "}
                        *
                      </Label>
                      <Input
                        id="idNumber"
                        value={formData.idNumber}
                        onChange={(e) =>
                          updateFormData("idNumber", e.target.value)
                        }
                        placeholder={
                          formData.idType === "passport"
                            ? "Enter passport number"
                            : "Enter ID number"
                        }
                        className={errors.idNumber ? "border-red-500" : ""}
                      />
                      {errors.idNumber && (
                        <p className="text-xs text-red-500">{errors.idNumber}</p>
                      )}
                    </div>

                    {/* Upload Guide */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <h4 className="font-semibold text-blue-900 text-sm">
                            Photo Upload Guidelines
                          </h4>
                          <ul className="text-xs text-blue-800 space-y-1">
                            <li>
                              • Ensure the entire document is visible and in focus
                            </li>
                            <li>
                              • Photos must be well-lit with no glare or shadows
                            </li>
                            <li>• All text must be clearly readable</li>
                            <li>• Accepted formats: JPG, PNG (max 10MB each)</li>
                            <li>• Do not edit or crop the document photo</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Image Uploads */}
                    {formData.idType && (
                      <div className="space-y-4">
                        <div
                          className={`grid gap-4 ${
                            formData.idType === "passport"
                              ? "sm:grid-cols-2"
                              : "sm:grid-cols-3"
                          }`}
                        >
                          <ImageUpload
                            label={
                              formData.idType === "passport"
                                ? "Passport Photo Page"
                                : "ID Front Side"
                            }
                            value={formData.idFrontImage}
                            storagePath={storagePaths.idFront}
                            onUpload={(file) => handleImageUpload(file, 'idFront')}
                            onRemove={() => handleImageRemove('idFront')}
                            hint={
                              formData.idType === "passport"
                                ? "Photo page with your picture"
                                : "Front side with your photo"
                            }
                            icon={CreditCard}
                            isUploading={uploadingStates.idFront}
                          />

                          {formData.idType === "national_id" && (
                            <ImageUpload
                              label="ID Back Side"
                              value={formData.idBackImage}
                              storagePath={storagePaths.idBack}
                              onUpload={(file) => handleImageUpload(file, 'idBack')}
                              onRemove={() => handleImageRemove('idBack')}
                              hint="Back side of your ID card"
                              icon={CreditCard}
                              isUploading={uploadingStates.idBack}
                            />
                          )}

                          <ImageUpload
                            label="Selfie with ID"
                            value={formData.selfieWithId}
                            storagePath={storagePaths.selfieWithId}
                            onUpload={(file) => handleImageUpload(file, 'selfieWithId')}
                            onRemove={() => handleImageRemove('selfieWithId')}
                            hint="Hold your ID next to your face"
                            icon={Camera}
                            isUploading={uploadingStates.selfieWithId}
                          />
                        </div>

                        {(errors.idFrontImage ||
                          errors.idBackImage ||
                          errors.selfieWithId) && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <ul className="text-xs text-red-600 space-y-1">
                              {errors.idFrontImage && (
                                <li>• {errors.idFrontImage}</li>
                              )}
                              {errors.idBackImage && (
                                <li>• {errors.idBackImage}</li>
                              )}
                              {errors.selfieWithId && (
                                <li>• {errors.selfieWithId}</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Digital Signature */}
                <div 
                  id="signature-section"
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all scroll-mt-24"
                >
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900">
                      ✍️ Your Signature
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">Draw your signature to sign the contract</p>
                  </div>
                  <div className="p-6">
                    <SignaturePad 
                      ref={signatureRef} 
                      onChange={handleSignatureChange}
                      initialValue={signatureDataUrl || undefined}
                    />
                    {errors.signature && (
                      <p className="text-xs text-red-500 mt-2">
                        {errors.signature}
                      </p>
                    )}
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        updateFormData("agreedToTerms", checked === true)
                      }
                    />
                    <Label
                      htmlFor="agreedToTerms"
                      className="text-sm text-slate-600 leading-relaxed cursor-pointer"
                    >
                      I have read, understood, and agree to be bound by the terms
                      of this Exclusive Management and Content Agency Agreement.
                      I confirm that I am at least 18 years of age and that all
                      information provided is accurate and truthful.
                    </Label>
                  </div>
                  {errors.agreedToTerms && (
                    <p className="text-xs text-red-500 mt-2 ml-8">
                      {errors.agreedToTerms}
                    </p>
                  )}
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      if (!isStep1Complete()) {
                        const missing = getMissingRequirements();
                        toast.error("Cannot proceed to next step", {
                          description: `Please complete: ${missing.join(", ")}`,
                        });
                        return;
                      }
                      handleNext();
                    }}
                    className={`transition-all ${
                      isStep1Complete()
                        ? "bg-brand-600 hover:bg-brand-700"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
                  >
                    Continue to Preferences
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          Model Preferences
                        </h2>
                        <p className="text-sm text-slate-500">
                          Tell us about yourself and your content
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Stage Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="stageName">Stage/Display Name *</Label>
                      <Input
                        id="stageName"
                        value={formData.stageName}
                        onChange={(e) =>
                          updateFormData("stageName", e.target.value)
                        }
                        placeholder="Your creator name"
                        className={errors.stageName ? "border-red-500" : ""}
                      />
                      <p className="text-xs text-slate-500">
                        This will be your pseudonym on the platforms
                      </p>
                      {errors.stageName && (
                        <p className="text-xs text-red-500">
                          {errors.stageName}
                        </p>
                      )}
                    </div>

                    {/* Content Categories */}
                    <div className="space-y-3">
                      <Label>Content Categories *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {contentCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() =>
                              toggleArrayField("categories", category.id)
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                              formData.categories.includes(category.id)
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                            }`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                      {errors.categories && (
                        <p className="text-xs text-red-500">
                          {errors.categories}
                        </p>
                      )}
                    </div>

                    {/* Platforms */}
                    <div className="space-y-3">
                      <Label>Platforms *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {platforms.map((platform) => (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() =>
                              toggleArrayField("platforms", platform.id)
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                              formData.platforms.includes(platform.id)
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                            }`}
                          >
                            {platform.label}
                          </button>
                        ))}
                      </div>
                      {errors.platforms && (
                        <p className="text-xs text-red-500">
                          {errors.platforms}
                        </p>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="space-y-3">
                      <Label>Languages Spoken</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() =>
                              toggleArrayField("languages", lang.id)
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                              formData.languages.includes(lang.id)
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-3">
                      <Label>Experience Level *</Label>
                      <div className="space-y-2">
                        {experienceLevels.map((level) => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() =>
                              updateFormData("experience", level.id)
                            }
                            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all border text-left ${
                              formData.experience === level.id
                                ? "bg-brand-50 text-brand-700 border-brand-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  formData.experience === level.id
                                    ? "border-brand-600"
                                    : "border-slate-300"
                                }`}
                              >
                                {formData.experience === level.id && (
                                  <div className="w-2 h-2 rounded-full bg-brand-600" />
                                )}
                              </div>
                              {level.label}
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.experience && (
                        <p className="text-xs text-red-500">
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="space-y-3">
                      <Label>Availability *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {availabilityOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              updateFormData("availability", option.id)
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                              formData.availability === option.id
                                ? "bg-brand-600 text-white border-brand-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {errors.availability && (
                        <p className="text-xs text-red-500">
                          {errors.availability}
                        </p>
                      )}
                    </div>

                    {/* Social Media */}
                    <div className="space-y-4">
                      <Label>Social Media Profiles</Label>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="instagram"
                            className="text-xs text-slate-500"
                          >
                            Instagram
                          </Label>
                          <Input
                            id="instagram"
                            value={formData.instagram}
                            onChange={(e) =>
                              updateFormData("instagram", e.target.value)
                            }
                            placeholder="@username"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="tiktok"
                            className="text-xs text-slate-500"
                          >
                            TikTok
                          </Label>
                          <Input
                            id="tiktok"
                            value={formData.tiktok}
                            onChange={(e) =>
                              updateFormData("tiktok", e.target.value)
                            }
                            placeholder="@username"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="twitter"
                            className="text-xs text-slate-500"
                          >
                            Twitter/X
                          </Label>
                          <Input
                            id="twitter"
                            value={formData.twitter}
                            onChange={(e) =>
                              updateFormData("twitter", e.target.value)
                            }
                            placeholder="@username"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="space-y-1.5">
                      <Label htmlFor="goals">What are your goals?</Label>
                      <Textarea
                        id="goals"
                        value={formData.goals}
                        onChange={(e) => updateFormData("goals", e.target.value)}
                        placeholder="Tell us what you hope to achieve..."
                        rows={3}
                      />
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalNotes">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={(e) =>
                          updateFormData("additionalNotes", e.target.value)
                        }
                        placeholder="Anything else you'd like us to know..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-brand-600 hover:bg-brand-700"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Registration
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Note */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Your information is kept confidential and secure. By registering, you
            agree to our Privacy Policy.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}
