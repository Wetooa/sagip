import {
  Droplets,
  Waves,
  Mountain,
  Cloud,
  Building2,
  Layers,
  MapPin,
  Route,
} from "lucide-react";
import type { HazardCategory } from "app/page";

interface CategoryTabsProps {
  selectedCategory: HazardCategory;
  onCategoryChange: (category: HazardCategory) => void;
}

const categories = [
  { id: "flood" as HazardCategory, label: "Flood", icon: Droplets },
  { id: "storm-surge" as HazardCategory, label: "Storm Surge", icon: Waves },
  { id: "landslide" as HazardCategory, label: "Landslide", icon: Mountain },
];

export function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-2 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onCategoryChange(id)}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px]
              ${
                selectedCategory === id
                  ? "bg-[#6B1515] text-white shadow-md"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium whitespace-nowrap">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
