"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import type { SicknessType } from "@/types/geojson";
import { SICKNESS_COLORS, SICKNESS_NAMES } from "@/types/geojson";

interface LayerControlsProps {
  // Layer toggles
  censusEnabled: boolean;
  evacuationCentersEnabled: boolean;
  barangayEnabled: boolean;
  onCensusToggle: (enabled: boolean) => void;
  onEvacuationCentersToggle: (enabled: boolean) => void;
  onBarangayToggle: (enabled: boolean) => void;

  // Health risk selection (only shown when barangay layer is enabled)
  selectedSickness: SicknessType;
  onSicknessChange: (sickness: SicknessType) => void;

  // Sheet state
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LayerControls({
  censusEnabled,
  evacuationCentersEnabled,
  barangayEnabled,
  onCensusToggle,
  onEvacuationCentersToggle,
  onBarangayToggle,
  selectedSickness,
  onSicknessChange,
  open,
  onOpenChange,
}: LayerControlsProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const sheetOpen = isControlled ? open : internalOpen;
  const setSheetOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          className="absolute top-4 left-4 z-30 h-11 w-11 bg-white/95 backdrop-blur shadow-lg hover:bg-white border border-gray-200"
          size="icon"
        >
          <Layers className="h-5 w-5 text-gray-700" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">Map Layers</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {/* Layer Toggles */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="census-toggle"
                checked={censusEnabled}
                onCheckedChange={onCensusToggle}
              />
              <Label htmlFor="census-toggle" className="cursor-pointer">
                Census Data
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="evacuation-toggle"
                checked={evacuationCentersEnabled}
                onCheckedChange={onEvacuationCentersToggle}
              />
              <Label htmlFor="evacuation-toggle" className="cursor-pointer">
                Evacuation Centers
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="barangay-toggle"
                checked={barangayEnabled}
                onCheckedChange={onBarangayToggle}
              />
              <Label htmlFor="barangay-toggle" className="cursor-pointer">
                Barangay Boundaries
              </Label>
            </div>
          </div>

          {/* Health Risk Selection (only when barangay layer is enabled) */}
          {barangayEnabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Sickness Type</Label>
                <RadioGroup
                  value={selectedSickness}
                  onValueChange={(value) =>
                    onSicknessChange(value as SicknessType)
                  }
                >
                  {(
                    Object.keys(SICKNESS_NAMES) as Array<SicknessType>
                  ).map((sickness) => (
                    <div key={sickness} className="flex items-center space-x-2">
                      <RadioGroupItem value={sickness} id={sickness} />
                      <Label
                        htmlFor={sickness}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: SICKNESS_COLORS[sickness],
                          }}
                        />
                        {SICKNESS_NAMES[sickness]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Legend */}
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Legend</Label>
                <div className="text-xs space-y-1 text-gray-600">
                  <div>Opacity = Risk Score</div>
                  <div>0.0 (transparent) → 1.0 (opaque)</div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
