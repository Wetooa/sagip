import { useEffect, useState } from "react";
import type { DriftPredictionPin } from "@/app/page";

export type DebugState = {
  duringTyphoon: boolean;
  phoneDead: boolean;
  internet: boolean;
  bluetoothMesh: boolean;
  loraDevice: boolean;
};

export default function DebugPanel({
  onChange,
  onLoraSOS,
  driftPin,
  onTriggerDrift,
  onDeleteDrift,
}: {
  onChange?: (state: DebugState) => void;
  onLoraSOS?: () => void;
  driftPin?: DriftPredictionPin | null;
  onTriggerDrift?: () => void;
  onDeleteDrift?: () => void;
}) {
  const [duringTyphoon, setDuringTyphoon] = useState(false);
  const [phoneDead, setPhoneDead] = useState(false);
  const [internet, setInternet] = useState(true);
  const [bluetoothMesh, setBluetoothMesh] = useState(true); // ON by default
  const [loraDevice, setLoraDevice] = useState(false);
  const [expiryTime, setExpiryTime] = useState<string>("");

  // Update expiry countdown
  useEffect(() => {
    if (!driftPin) return;

    const updateExpiry = () => {
      const remaining = driftPin.expiresAt - Date.now();
      if (remaining <= 0) {
        setExpiryTime("Expired");
      } else {
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor(
          (remaining % (60 * 60 * 1000)) / (60 * 1000),
        );
        setExpiryTime(`Expires: ${hours}h ${minutes}m`);
      }
    };

    updateExpiry();
    const interval = setInterval(updateExpiry, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [driftPin]);

  // Notify parent on state change
  useEffect(() => {
    onChange?.({
      duringTyphoon,
      phoneDead,
      internet,
      bluetoothMesh,
      loraDevice,
    });
  }, [duringTyphoon, phoneDead, internet, bluetoothMesh, loraDevice, onChange]);

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 z-50 flex flex-col gap-2 w-64 max-h-96 overflow-y-auto">
      <div className="font-bold mb-2">Debug Panel</div>
      <button
        className={`px-4 py-2 rounded ${duringTyphoon ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
        onClick={() => setDuringTyphoon((v) => !v)}
      >
        {duringTyphoon ? "During Typhoon (ON)" : "During Typhoon (OFF)"}
      </button>
      <button
        className={`px-4 py-2 rounded ${phoneDead ? "bg-red-500 text-white" : "bg-gray-200"}`}
        onClick={() => setPhoneDead((v) => !v)}
      >
        {phoneDead ? "Phone Battery Dead" : "Phone Battery Alive"}
      </button>
      <button
        className={`px-4 py-2 rounded ${internet ? "bg-green-500 text-white" : "bg-gray-200"} ${phoneDead ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !phoneDead && setInternet((v) => !v)}
        disabled={phoneDead}
      >
        {internet ? "Internet Available" : "No Internet"}
      </button>
      <button
        className={`px-4 py-2 rounded ${bluetoothMesh ? "bg-blue-500 text-white" : "bg-gray-200"} ${phoneDead || internet ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !phoneDead && !internet && setBluetoothMesh((v) => !v)}
        disabled={phoneDead || internet}
      >
        {bluetoothMesh ? "Bluetooth Mesh Nearby" : "No Bluetooth Mesh"}
      </button>
      <button
        className={`px-4 py-2 rounded ${loraDevice ? "bg-purple-500 text-white" : "bg-gray-200"} ${!phoneDead ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => phoneDead && setLoraDevice((v) => !v)}
        disabled={!phoneDead}
      >
        {loraDevice ? "LoRa Device Present" : "No LoRa Device"}
      </button>
      <button
        className={`px-4 py-2 rounded bg-orange-500 text-white ${!(phoneDead && loraDevice) ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => phoneDead && loraDevice && onLoraSOS?.()}
        disabled={!(phoneDead && loraDevice)}
      >
        Trigger LoRa SOS
      </button>

      {/* Drift Prediction Controls */}
      <div className="border-t pt-2 mt-2">
        <div className="text-sm font-semibold mb-2">Drift Prediction</div>
        <button
          className={`px-4 py-2 rounded w-full text-white ${driftPin ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"}`}
          onClick={onTriggerDrift}
        >
          {driftPin ? "Drift Signal Active" : "Trigger Drift Signal"}
        </button>
        {driftPin && (
          <>
            <div className="text-xs text-gray-600 mt-2 break">
              Lat: {driftPin.latitude.toFixed(4)}, Lon:{" "}
              {driftPin.longitude.toFixed(4)}
            </div>
            <div className="text-xs text-gray-600">
              Radius: {driftPin.radius}m
            </div>
            <div className="text-xs text-orange-600 font-semibold">
              {expiryTime}
            </div>
            <button
              className="px-4 py-2 rounded w-full bg-red-500 text-white hover:bg-red-600 mt-2"
              onClick={onDeleteDrift}
            >
              Delete Drift Signal
            </button>
          </>
        )}
      </div>
    </div>
  );
}
