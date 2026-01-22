"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SicknessType } from "@/types/geojson";
import { SICKNESS_COLORS, SICKNESS_NAMES } from "@/types/geojson";
type HazardCategory =
  | "flood"
  | "storm-surge";

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

  // Category selection
  selectedCategory: HazardCategory;
  onCategoryChange: (category: HazardCategory) => void;

  // Return period for flood maps
  returnPeriod?: string;
  onReturnPeriodChange?: (period: string) => void;

  // Advisory level for storm surge maps
  advisoryLevel?: string;
  onAdvisoryLevelChange?: (level: string) => void;
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
  selectedCategory,
  onCategoryChange,
  returnPeriod = "5yr",
  onReturnPeriodChange,
  advisoryLevel = "1",
  onAdvisoryLevelChange,
}: LayerControlsProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Map Layers</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Category Selection - Vertical for Desktop */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Hazard Type</Label>
            <div className="space-y-2">
              {[
                { id: "flood" as HazardCategory, label: "Flood" },
                { id: "storm-surge" as HazardCategory, label: "Storm Surge" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onCategoryChange(id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                    selectedCategory === id
                      ? "bg-[#6B1515] text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Return Period Selection for Flood */}
          {selectedCategory === "flood" && onReturnPeriodChange && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-semibold mb-3 block">Return Period</Label>
                <div className="space-y-2">
                  {["5yr", "25yr", "100yr"].map((period) => (
                    <button
                      key={period}
                      onClick={() => onReturnPeriodChange(period)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        returnPeriod === period
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Advisory Level Selection for Storm Surge */}
          {selectedCategory === "storm-surge" && onAdvisoryLevelChange && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-semibold mb-3 block">Advisory Level</Label>
                <div className="space-y-2">
                  {["1", "2", "3", "4"].map((level) => (
                    <button
                      key={level}
                      onClick={() => onAdvisoryLevelChange(level)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        advisoryLevel === level
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Level {level}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Layer Toggles */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Data Layers</Label>
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
          </div>

          {/* Health Risk Selection (only when barangay layer is enabled) */}
          {barangayEnabled && (
            <>
              <Separator />
              <div className="space-y-4">
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
      </ScrollArea>
    </div>
  );
}
