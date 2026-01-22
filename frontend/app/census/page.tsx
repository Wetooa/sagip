"use client";

import { useState } from "react";
import { CensusModal } from "components/CensusModal";
import { ChevronRight } from "lucide-react";

interface CensusData {
  personal: {
    activeAddress: string;
    phoneNumber: string;
    governmentId: string;
    governmentIdType: string;
    birthDate: string;
    willVolunteer: boolean;
  };
  family: {
    familySize: number;
    familyMembers: Array<{
      id: string;
      fullName: string;
      birthDate: string;
      relationship: string;
      medicalCondition: "none" | "sickly" | "elderly" | "bedridden" | "pwd";
    }>;
  };
}

export default function CensusPage() {
  const [isCensusOpen, setIsCensusOpen] = useState(false);
  const [censusData, setCensusData] = useState<CensusData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCensusSubmit = (data: CensusData) => {
    console.log("Census data submitted:", data);
    setCensusData(data);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative w-full max-w-sm">
        {/* Phone Bezel */}
        <div className="rounded-[3rem] border-[12px] border-[#1a1a1a] shadow-2xl overflow-hidden bg-black">
          {/* Status Bar */}
          <div className="bg-[#1a1a1a] text-white px-6 py-2 flex justify-between items-center text-xs font-semibold">
            <span>9:41</span>
            <div className="flex gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-[#1a1a1a] rounded-b-3xl z-10"></div>

          {/* Screen Content */}
          <div
            className="bg-gradient-to-br from-[#0f172a] via-[#1a1f35] to-[#111827] min-h-screen overflow-y-auto relative"
            style={{ height: "844px" }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8B0000]/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0ea5e9]/10 to-transparent rounded-full blur-3xl"></div>
            </div>
            {/* Header */}
            <header className="bg-gradient-to-r from-[#8B0000]/20 to-[#6B1515]/20 backdrop-blur-md text-white px-4 py-3 shadow-lg sticky top-0 z-10 border-b border-white/10">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="SAGIP" className="h-5" />
              </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-6 pb-8 space-y-4">
              {/* Success Banner */}
              {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 font-semibold text-sm">
                    ✓ Submitted successfully!
                  </p>
                </div>
              )}

              {/* Hero Section */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-4 border border-white/10 hover:border-white/20 transition-all">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e72] bg-clip-text text-transparent mb-2">
                  Digital Census
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  Register your information to get better help during typhoons
                  and floods.
                </p>
                <button
                  onClick={() => setIsCensusOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#8B0000]/50 transition-all duration-300"
                >
                  Start Registration
                </button>
              </div>

              {/* Info Cards */}
              <div className="space-y-3 mb-4">
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl shadow p-4 border border-white/10 hover:border-white/20 transition-all">
                  <p className="text-2xl mb-2">👤</p>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Personal Info
                  </h3>
                  <p className="text-xs text-gray-400">
                    Your contact and ID details
                  </p>
                </div>

                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl shadow p-4 border border-white/10 hover:border-white/20 transition-all">
                  <p className="text-2xl mb-2">👨‍👩‍👧‍👦</p>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Family Data
                  </h3>
                  <p className="text-xs text-gray-400">
                    Register family members
                  </p>
                </div>

                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl shadow p-4 border border-white/10 hover:border-white/20 transition-all">
                  <p className="text-2xl mb-2">🚩</p>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Priority Support
                  </h3>
                  <p className="text-xs text-gray-400">
                    Flag vulnerable members
                  </p>
                </div>
              </div>
              {/* Submitted Data Display */}
              {censusData && (
                <div className="bg-white rounded-xl shadow p-5 space-y-4">
                  <h3 className="font-bold text-gray-900">Your Census Data</h3>

                  {/* Personal Information */}
                  <div>
                    <p className="text-xs font-semibold text-[#8B0000] mb-3">
                      PERSONAL INFORMATION
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-gray-600">Address</span>
                        <span className="font-medium text-gray-900 text-right flex-1 ml-2">
                          {censusData.personal.activeAddress}
                        </span>
                      </div>
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium text-gray-900">
                          {censusData.personal.phoneNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-gray-600">ID</span>
                        <span className="font-medium text-gray-900">
                          {censusData.personal.governmentId}
                        </span>
                      </div>
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-gray-600">DOB</span>
                        <span className="font-medium text-gray-900">
                          {new Date(
                            censusData.personal.birthDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-start text-xs pt-1 border-t">
                        <span className="text-gray-600">Volunteer</span>
                        <span
                          className={`font-bold ${censusData.personal.willVolunteer ? "text-green-600" : "text-gray-600"}`}
                        >
                          {censusData.personal.willVolunteer ? "✓ Yes" : "✗ No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-[#8B0000] mb-3">
                      FAMILY ({censusData.family.familyMembers.length})
                    </p>
                    <div className="space-y-2">
                      {censusData.family.familyMembers.map((member, idx) => (
                        <div
                          key={member.id}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {member.fullName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {member.relationship} •{" "}
                                {new Date(
                                  member.birthDate,
                                ).toLocaleDateString()}
                              </p>
                              {member.medicalCondition !== "none" && (
                                <p className="text-xs font-bold text-red-600 mt-1">
                                  🚩 {member.medicalCondition.toUpperCase()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Census Modal */}
      <CensusModal
        isOpen={isCensusOpen}
        onClose={() => setIsCensusOpen(false)}
        onSubmit={handleCensusSubmit}
      />
    </div>
  );
}
