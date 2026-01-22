"use client";

import { useState } from "react";
import { Loader2, X, Camera } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface RescueNeeds {
  water?: boolean;
  food?: boolean;
  medical?: boolean;
  shelter?: boolean;
  evacuation?: boolean;
  other?: string | null;
}

interface RescuePin {
  id: string;
  citizenId?: string | null;
  name?: string | null;
  contact?: string | null;
  householdSize?: number | null;
  status: string;
  urgency: "normal" | "high" | "critical";
  latitude: number;
  longitude: number;
  needs: RescueNeeds;
  note?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

interface RescuePinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coords: { latitude: number; longitude: number } | null;
  pin: RescuePin | null;
  onCreateSuccess: (pin: RescuePin) => void;
  onUrgencyChange: (urgency: "normal" | "high" | "critical") => Promise<void>;
  updatingUrgency: boolean;
}

const formatCoords = (
  coords: { latitude: number; longitude: number } | null,
): string => {
  if (!coords) return "Unknown";
  return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
};

export function RescuePinModal({
  open,
  onOpenChange,
  coords,
  pin,
  onCreateSuccess,
  onUrgencyChange,
  updatingUrgency,
}: RescuePinModalProps) {
  const mode = pin ? "view" : "create";

  // Form state (for create mode)
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [householdSize, setHouseholdSize] = useState<string>("");
  const [urgency, setUrgency] = useState<"normal" | "high" | "critical">(
    "normal",
  );
  const [note, setNote] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [needs, setNeeds] = useState<RescueNeeds>({
    water: false,
    food: false,
    medical: false,
    shelter: false,
    evacuation: false,
    other: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteLength, setNoteLength] = useState(0);
  const MAX_NOTE_LENGTH = 500;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNeedChange = (key: keyof RescueNeeds, value: boolean) => {
    setNeeds({ ...needs, [key]: value });
  };

  const handleNoteChange = (value: string) => {
    if (value.length <= MAX_NOTE_LENGTH) {
      setNote(value);
      setNoteLength(value.length);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!coords) {
      setError("Location is required");
      return;
    }

    const hasAnyNeed = Object.values(needs).some(
      (v) => v === true || (typeof v === "string" && v.trim()),
    );
    if (!hasAnyNeed) {
      setError("Please select at least one need");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("latitude", coords.latitude.toString());
      formData.append("longitude", coords.longitude.toString());
      formData.append("name", name);
      formData.append("urgency", urgency);
      formData.append("needs", JSON.stringify(needs));

      if (contact.trim()) formData.append("contact", contact);
      if (householdSize) formData.append("household_size", householdSize);
      if (note.trim()) formData.append("note", note);
      if (photoFile) formData.append("photo", photoFile);

      const response = await fetch("/api/rescue-requests", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to submit rescue request");
      }

      const result = await response.json();
      onCreateSuccess(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create rescue request";
      setError(message);
      console.error("Error submitting rescue request:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === "view" && pin) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[80vh] max-h-160 w-full rounded-t-3xl border-none p-0 sm:max-w-lg"
        >
          <SheetHeader className="p-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-[#6B1515]" />
              Rescue Request Details
            </div>
            <SheetTitle className="text-lg font-semibold text-[#6B1515]">
              {pin.name || "Rescue Request"}
            </SheetTitle>
            <SheetDescription className="text-sm">
              Location:{" "}
              {formatCoords({
                latitude: pin.latitude,
                longitude: pin.longitude,
              })}
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[calc(80vh-120px)]">
            {pin.contact && (
              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Contact
                </Label>
                <p className="text-sm text-gray-900">{pin.contact}</p>
              </div>
            )}

            {pin.householdSize && (
              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Household Size
                </Label>
                <p className="text-sm text-gray-900">
                  {pin.householdSize} people
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Urgency
                </Label>
                <p className="text-sm text-gray-900 mb-2">{pin.urgency}</p>
              </div>
              <RadioGroup
                value={pin.urgency}
                onValueChange={(value) => {
                  onUrgencyChange(value as "normal" | "high" | "critical");
                }}
                disabled={updatingUrgency}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="normal"
                    id="urgency-normal"
                    disabled={updatingUrgency}
                  />
                  <Label
                    htmlFor="urgency-normal"
                    className="text-xs cursor-pointer"
                  >
                    Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="high"
                    id="urgency-high"
                    disabled={updatingUrgency}
                  />
                  <Label
                    htmlFor="urgency-high"
                    className="text-xs cursor-pointer"
                  >
                    High
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="critical"
                    id="urgency-critical"
                    disabled={updatingUrgency}
                  />
                  <Label
                    htmlFor="urgency-critical"
                    className="text-xs cursor-pointer"
                  >
                    Critical
                  </Label>
                </div>
              </RadioGroup>
              {updatingUrgency && (
                <Loader2 className="h-4 w-4 animate-spin text-[#6B1515]" />
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Needs
              </Label>
              <div className="flex flex-wrap gap-2">
                {pin.needs.water && <Badge variant="secondary">Water</Badge>}
                {pin.needs.food && <Badge variant="secondary">Food</Badge>}
                {pin.needs.medical && (
                  <Badge variant="secondary">Medical</Badge>
                )}
                {pin.needs.shelter && (
                  <Badge variant="secondary">Shelter</Badge>
                )}
                {pin.needs.evacuation && (
                  <Badge variant="secondary">Evacuation</Badge>
                )}
              </div>
            </div>

            {pin.note && (
              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Notes
                </Label>
                <p className="text-sm text-gray-900 italic">"{pin.note}"</p>
              </div>
            )}

            {pin.photoUrl && (
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Photo
                </Label>
                <img
                  src={pin.photoUrl}
                  alt="Rescue location"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold text-gray-700">
                Status
              </Label>
              <p className="text-sm text-gray-900 capitalize">
                {pin.status.replace(/_/g, " ")}
              </p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-700">
                Created
              </Label>
              <p className="text-sm text-gray-900">
                {new Date(pin.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent border-t">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-[#6B1515] hover:bg-[#6B1515]/90"
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] max-h-160 w-full rounded-t-3xl border-none p-0 sm:max-w-lg"
      >
        <SheetHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-[#6B1515]" />
            Tap the map to place a rescue pin
          </div>
          <SheetTitle className="text-lg font-semibold text-[#6B1515]">
            New Rescue Request
          </SheetTitle>
          <SheetDescription className="text-sm">
            Location: {formatCoords(coords)}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-24 space-y-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          {/* Name Input */}
          <div>
            <Label
              htmlFor="name"
              className="text-xs font-semibold text-gray-700"
            >
              Person to Rescue *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="mt-1"
            />
          </div>

          {/* Contact Input */}
          <div>
            <Label
              htmlFor="contact"
              className="text-xs font-semibold text-gray-700"
            >
              Contact (Optional)
            </Label>
            <Input
              id="contact"
              type="tel"
              placeholder="Phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              disabled={submitting}
              className="mt-1"
            />
          </div>

          {/* Household Size */}
          <div>
            <Label
              htmlFor="householdSize"
              className="text-xs font-semibold text-gray-700"
            >
              Household Size (Optional)
            </Label>
            <Input
              id="householdSize"
              type="number"
              placeholder="Number of people"
              min="1"
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              disabled={submitting}
              className="mt-1"
            />
          </div>

          {/* Urgency Selection */}
          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              Urgency Level
            </Label>
            <RadioGroup
              value={urgency}
              onValueChange={(value: any) => setUrgency(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="urgency-normal" />
                <Label
                  htmlFor="urgency-normal"
                  className="text-xs cursor-pointer"
                >
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="urgency-high" />
                <Label
                  htmlFor="urgency-high"
                  className="text-xs cursor-pointer"
                >
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="critical" id="urgency-critical" />
                <Label
                  htmlFor="urgency-critical"
                  className="text-xs cursor-pointer"
                >
                  Critical
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Needs */}
          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              Basic Needs
            </Label>
            <div className="space-y-2">
              {[
                { key: "water", label: "Water" },
                { key: "food", label: "Food" },
                { key: "medical", label: "Medical Help" },
                { key: "shelter", label: "Shelter" },
                { key: "evacuation", label: "Evacuation" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={needs[key as keyof RescueNeeds] as boolean}
                    onCheckedChange={(checked) =>
                      handleNeedChange(
                        key as keyof RescueNeeds,
                        checked as boolean,
                      )
                    }
                    disabled={submitting}
                  />
                  <Label
                    htmlFor={key}
                    className="text-xs cursor-pointer font-normal"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label
              htmlFor="note"
              className="text-xs font-semibold text-gray-700"
            >
              Notes - What Happened? (Optional)
            </Label>
            <Textarea
              id="note"
              placeholder="Describe the situation, injuries, or additional details..."
              value={note}
              onChange={(e) => handleNoteChange(e.target.value)}
              disabled={submitting}
              className="mt-1 resize-none h-24"
              maxLength={MAX_NOTE_LENGTH}
            />
            <p className="text-xs text-gray-500 mt-1">
              {noteLength}/{MAX_NOTE_LENGTH}
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              Photo (Optional)
            </Label>
            {photoPreview ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  disabled={submitting}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition bg-gray-50 hover:bg-gray-100">
                <Camera className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Tap to take or choose photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  disabled={submitting}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent border-t space-y-2">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#6B1515] hover:bg-[#6B1515]/90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Rescue Request"
            )}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={submitting}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
