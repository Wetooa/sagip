import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export type DebugModalType =
  | null
  | "are-you-safe"
  | "offline-sos"
  | "bluetooth-mesh"
  | "drift-analysis"
  | "lora-sos"
  | "lora-drift"
  | "stranded"
  | "location-sent";

export function DebugModals({
  modal,
  setModal,
  onStatus,
}: {
  modal: DebugModalType;
  setModal: (m: DebugModalType) => void;
  onStatus?: (status: string) => void;
}) {
  // Helper to close and optionally trigger next
  const close = () => setModal(null);

  // Modal content logic
  switch (modal) {
    case "stranded":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Status: Stranded</AlertDialogTitle>
              <AlertDialogDescription>
                You are marked as stranded. Status sent to Command Center.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={close}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "are-you-safe":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you safe?</AlertDialogTitle>
              <AlertDialogDescription>
                Please confirm your status so we can assist you.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  onStatus?.("yes");
                  close();
                }}
              >
                Yes, I am safe
              </AlertDialogAction>
              <AlertDialogAction
                onClick={() => {
                  onStatus?.("no");
                  close();
                }}
              >
                No, I need help
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "offline-sos":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Offline SOS Ping</AlertDialogTitle>
              <AlertDialogDescription>
                No internet detected. Try sending an SOS via Bluetooth Mesh?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  onStatus?.("bluetooth");
                  close();
                }}
              >
                Try Bluetooth Mesh
              </AlertDialogAction>
              <AlertDialogCancel onClick={close}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "bluetooth-mesh":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bluetooth Mesh</AlertDialogTitle>
              <AlertDialogDescription>
                No nearby mesh detected. Command Center will analyze your last
                known location.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  onStatus?.("drift");
                  close();
                }}
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "drift-analysis":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Drift Analysis</AlertDialogTitle>
              <AlertDialogDescription>
                Command Center is dispatching rescue to your predicted
                coordinates.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={close}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "location-sent":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Location Sent</AlertDialogTitle>
              <AlertDialogDescription>
                Your current location is sent to the authorities.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={close}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "lora-sos":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>LoRa SOS</AlertDialogTitle>
              <AlertDialogDescription>
                LoRa device triggered. Command Center will dispatch rescue to
                device coordinates.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={close}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "lora-drift":
      return (
        <AlertDialog open onOpenChange={(v) => !v && close()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Drift Analysis</AlertDialogTitle>
              <AlertDialogDescription>
                No LoRa device. Command Center is dispatching rescue to your
                predicted coordinates.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={close}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    default:
      return null;
  }
}
