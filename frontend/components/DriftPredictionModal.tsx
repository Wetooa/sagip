import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MapPin, Radius, Clock } from "lucide-react";

interface DriftPredictionModalProps {
  open: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  radius: number;
  expiresAt: number;
}

export function DriftPredictionModal({
  open,
  onClose,
  latitude,
  longitude,
  radius,
  expiresAt,
}: DriftPredictionModalProps) {
  const [timeInfo, setTimeInfo] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const updateTime = () => {
      const remaining = expiresAt - Date.now();
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      setTimeInfo({ hours, minutes });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            Drift Prediction Signal
          </AlertDialogTitle>
          <AlertDialogDescription>
            Emergency location prediction for stranded victim
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-purple-600 mt-1 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Coordinates</p>
              <p className="text-xs text-gray-600 font-mono">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Radius className="h-5 w-5 text-purple-600 mt-1 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Prediction Radius
              </p>
              <p className="text-xs text-gray-600">{radius} meters</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-600 mt-1 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Time Remaining
              </p>
              <p className="text-xs text-orange-600">
                {timeInfo.hours}h {timeInfo.minutes}m
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
