'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Plus, Trash2, MapPin, Phone, FileText, Calendar, Users, Heart, Check } from 'lucide-react';

interface FamilyMember {
  id: string;
  fullName: string;
  birthDate: string;
  relationship: string;
  medicalCondition: 'none' | 'sickly' | 'elderly' | 'bedridden' | 'pwd';
}

interface PersonalInfo {
  activeAddress: string;
  phoneNumber: string;
  governmentIdType: string;
  governmentId: string;
  birthDate: string;
  willVolunteer: boolean;
}

interface FamilyInfo {
  familySize: number;
  familyMembers: FamilyMember[];
}

interface CensusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { personal: PersonalInfo; family: FamilyInfo }) => void;
}

const medicalConditions = [
  { id: 'none', label: 'None' },
  { id: 'sickly', label: 'Sickly' },
  { id: 'elderly', label: 'Elderly' },
  { id: 'bedridden', label: 'Bedridden' },
  { id: 'pwd', label: 'PWD' },
];

const relationships = [
  'Self',
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Other',
];

export function CensusModal({ isOpen, onClose, onSubmit }: CensusModalProps) {
  const [step, setStep] = useState<'personal' | 'family' | 'review'>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    activeAddress: '',
    phoneNumber: '',
    governmentIdType: 'national_id',
    governmentId: '',
    birthDate: '',
    willVolunteer: false,
  });

  // Family Info
  const [familySize, setFamilySize] = useState<number>(1);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState<Partial<FamilyMember>>({
    fullName: '',
    birthDate: '',
    relationship: 'Child',
    medicalCondition: 'none',
  });

  // Validation
  const validatePersonal = (): boolean => {
    if (!personalInfo.activeAddress.trim()) {
      setError('Please enter your address');
      return false;
    }
    if (!personalInfo.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!personalInfo.governmentId.trim()) {
      setError('Please enter your government ID');
      return false;
    }
    if (!personalInfo.birthDate) {
      setError('Please select your birth date');
      return false;
    }
    return true;
  };

  const validateFamily = (): boolean => {
    if (familyMembers.length !== familySize) {
      setError(`Please add all ${familySize} family members`);
      return false;
    }
    for (const member of familyMembers) {
      if (!member.fullName.trim()) {
        setError('All members must have a name');
        return false;
      }
      if (!member.birthDate) {
        setError('All members must have a birth date');
        return false;
      }
    }
    return true;
  };

  // Handlers
  const handlePersonalChange = (field: string, value: any) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleAddMember = () => {
    if (!memberForm.fullName?.trim()) {
      setError('Please enter member name');
      return;
    }
    if (!memberForm.birthDate) {
      setError('Please select birth date');
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      fullName: memberForm.fullName,
      birthDate: memberForm.birthDate,
      relationship: memberForm.relationship || 'Child',
      medicalCondition: memberForm.medicalCondition || 'none',
    };

    if (editingMemberId) {
      setFamilyMembers((prev) =>
        prev.map((m) => (m.id === editingMemberId ? { ...newMember, id: m.id } : m))
      );
      setEditingMemberId(null);
    } else {
      setFamilyMembers((prev) => [...prev, newMember]);
    }

    setMemberForm({
      fullName: '',
      birthDate: '',
      relationship: 'Child',
      medicalCondition: 'none',
    });
    setError('');
  };

  const handleEditMember = (member: FamilyMember) => {
    setMemberForm(member);
    setEditingMemberId(member.id);
  };

  const handleDeleteMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmitCensus = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSubmit?.({
        personal: personalInfo,
        family: { familySize, familyMembers },
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setStep('personal');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to submit census. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4">
      {/* Modal - Bottom Sheet Style */}
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] rounded-3xl w-full max-w-sm max-h-[85vh] overflow-hidden border border-white/10 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1a1f35]/95 to-[#111827]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {step === 'personal' && 'Personal Information'}
              {step === 'family' && 'Family Details'}
              {step === 'review' && 'Review Information'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {step === 'personal' && 'Step 1 of 3'}
              {step === 'family' && 'Step 2 of 3'}
              {step === 'review' && 'Step 3 of 3'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-6 space-y-4" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Census submitted successfully!</span>
            </div>
          )}

          {/* STEP 1: PERSONAL INFO */}
          {step === 'personal' && (
            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Active Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <textarea
                    value={personalInfo.activeAddress}
                    onChange={(e) => handlePersonalChange('activeAddress', e.target.value)}
                    placeholder="Enter your complete address"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-transparent transition-all resize-none h-20"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={personalInfo.phoneNumber}
                    onChange={(e) => handlePersonalChange('phoneNumber', e.target.value)}
                    placeholder="09XX XXX XXXX"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Government ID Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">ID Type</label>
                <select
                  value={personalInfo.governmentIdType}
                  onChange={(e) => handlePersonalChange('governmentIdType', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-transparent transition-all"
                >
                  <option value="national_id">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="sss">SSS</option>
                  <option value="philhealth">PhilHealth</option>
                </select>
              </div>

              {/* Government ID */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">ID Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={personalInfo.governmentId}
                    onChange={(e) => handlePersonalChange('governmentId', e.target.value)}
                    placeholder="Enter ID number"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Birth Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={personalInfo.birthDate}
                    onChange={(e) => handlePersonalChange('birthDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Volunteer Checkbox */}
              <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/[7%] transition-all">
                <input
                  type="checkbox"
                  checked={personalInfo.willVolunteer}
                  onChange={(e) => handlePersonalChange('willVolunteer', e.target.checked)}
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded checked:bg-[#ff6b6b] checked:border-[#ff6b6b] cursor-pointer"
                />
                <span className="text-sm text-gray-300">I want to volunteer for SAGIP</span>
              </label>
            </div>
          )}

          {/* STEP 2: FAMILY INFO */}
          {step === 'family' && (
            <div className="space-y-4">
              {/* Family Size */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Family Size</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <select
                    value={familySize}
                    onChange={(e) => setFamilySize(parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Family Members List */}
              {familyMembers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400">
                    Members added: {familyMembers.length}/{familySize}
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start justify-between group hover:bg-white/[7%] transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{member.fullName}</p>
                          <p className="text-xs text-gray-400">{member.relationship}</p>
                          {member.medicalCondition !== 'none' && (
                            <div className="flex items-center gap-1 mt-1">
                              <Heart className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-red-400 capitalize">{member.medicalCondition}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditMember(member)}
                            className="p-1 text-gray-400 hover:text-[#0ea5e9] transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Member Form */}
              {familyMembers.length < familySize && (
                <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-xs font-semibold text-gray-400">Add Family Member</p>

                  {/* Name */}
                  <input
                    type="text"
                    value={memberForm.fullName || ''}
                    onChange={(e) => setMemberForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Full name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
                  />

                  {/* Birth Date */}
                  <input
                    type="date"
                    value={memberForm.birthDate || ''}
                    onChange={(e) => setMemberForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
                  />

                  {/* Relationship */}
                  <select
                    value={memberForm.relationship || 'Child'}
                    onChange={(e) => setMemberForm((prev) => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
                  >
                    {relationships.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>

                  {/* Medical Condition */}
                  <select
                    value={memberForm.medicalCondition || 'none'}
                    onChange={(e) => setMemberForm((prev) => ({ ...prev, medicalCondition: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all"
                  >
                    {medicalConditions.map((cond) => (
                      <option key={cond.id} value={cond.id}>
                        {cond.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddMember}
                    className="w-full py-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[#0ea5e9]/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Personal Info Review */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 mb-1">Phone</p>
                    <p className="text-white font-medium">{personalInfo.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">ID Type</p>
                    <p className="text-white font-medium capitalize">{personalInfo.governmentIdType.replace('_', ' ')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 mb-1">Address</p>
                    <p className="text-white font-medium">{personalInfo.activeAddress}</p>
                  </div>
                  {personalInfo.willVolunteer && (
                    <div className="col-span-2">
                      <p className="text-green-400 text-xs">✓ Willing to volunteer</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Family Info Review */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white">Family Members ({familyMembers.length})</h3>
                <div className="space-y-2">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="text-xs border-l-2 border-[#0ea5e9] pl-3 py-1">
                      <p className="text-white font-medium">{member.fullName}</p>
                      <p className="text-gray-400">{member.relationship} • {member.medicalCondition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-gradient-to-r from-[#1a1f35]/50 to-[#111827]/50 backdrop-blur-xl px-6 py-4 flex gap-3">
          <button
            onClick={() => {
              if (step === 'personal') onClose();
              else if (step === 'family') setStep('personal');
              else setStep('family');
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 flex-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 'personal' ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={() => {
              if (step === 'personal') {
                if (validatePersonal()) setStep('family');
              } else if (step === 'family') {
                if (validateFamily()) setStep('review');
              } else {
                handleSubmitCensus();
              }
            }}
            disabled={loading || success}
            className="px-4 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e72] hover:shadow-lg hover:shadow-[#ff6b6b]/50 text-white rounded-xl font-semibold transition-all disabled:opacity-70 flex items-center justify-center gap-2 flex-1"
          >
            {step === 'review' ? (
              <>
                <Check className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit'}
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
