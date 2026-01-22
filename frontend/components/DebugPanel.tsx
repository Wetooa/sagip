import { useEffect, useState } from "react";

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
}: {
  onChange?: (state: DebugState) => void;
  onLoraSOS?: () => void;
}) {
  const [duringTyphoon, setDuringTyphoon] = useState(false);
  const [phoneDead, setPhoneDead] = useState(false);
  const [internet, setInternet] = useState(true);
  const [bluetoothMesh, setBluetoothMesh] = useState(true); // ON by default
  const [loraDevice, setLoraDevice] = useState(false);

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
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 z-50 flex flex-col gap-2 w-64">
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
    </div>
  );
}
