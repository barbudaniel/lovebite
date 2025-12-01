"use client";

import React, { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./button";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
  fromDataURL: (dataURL: string) => void;
}

interface SignaturePadProps {
  onChange?: (isEmpty: boolean) => void;
  className?: string;
  initialValue?: string; // URL or data URL to load on mount only
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onChange, className, initialValue }, ref) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const hasLoadedRef = useRef(false);
    const hasUserDrawnRef = useRef(false);

    // Load initial signature ONCE when it first becomes available
    useEffect(() => {
      // Only load if we haven't loaded yet and user hasn't started drawing
      if (hasLoadedRef.current || hasUserDrawnRef.current) return;
      if (!initialValue || !sigCanvas.current) return;
      
      hasLoadedRef.current = true;
      sigCanvas.current.fromDataURL(initialValue, {
        width: 500,
        height: 160,
      });
    }, [initialValue]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        sigCanvas.current?.clear();
        hasUserDrawnRef.current = false;
        hasLoadedRef.current = false; // Allow reloading if cleared
        onChange?.(true);
      },
      isEmpty: () => sigCanvas.current?.isEmpty() ?? true,
      toDataURL: () => sigCanvas.current?.toDataURL() ?? "",
      fromDataURL: (dataURL: string) => {
        sigCanvas.current?.clear();
        sigCanvas.current?.fromDataURL(dataURL, {
          width: 500,
          height: 160,
        });
        hasLoadedRef.current = true;
        onChange?.(false);
      },
    }));

    const handleClear = () => {
      sigCanvas.current?.clear();
      hasUserDrawnRef.current = false;
      hasLoadedRef.current = false;
      onChange?.(true);
    };

    const handleEnd = () => {
      hasUserDrawnRef.current = true; // User has drawn, don't reload initial
      onChange?.(sigCanvas.current?.isEmpty() ?? true);
    };

    return (
      <div className={cn("space-y-2", className)}>
        <div className="relative rounded-lg border-2 border-dashed border-slate-300 bg-white overflow-hidden">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: "w-full h-40 cursor-crosshair",
              style: { width: "100%", height: "160px" },
            }}
            penColor="#1e293b"
            onEnd={handleEnd}
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-400 pointer-events-none">
            Sign above
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-slate-500 hover:text-slate-700"
          >
            <Eraser className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";

export { SignaturePad };

