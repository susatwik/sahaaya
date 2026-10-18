import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Plus,
  Check,
  RotateCcw,
  ShieldAlert,
  CalendarCheck,
  User,
  Heart,
  Baby,
  Activity,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getDB, Household, Member, Visit } from '../core/storage/db';
import { SyncQueueManager } from '../core/sync/syncQueue';

export const HouseholdDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'services' | 'history'>('members');

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [memName, setMemName] = useState<string>('');
  const [memAge, setMemAge] = useState<string>('');
  const [memGender, setMemGender] = useState<'FEMALE' | 'MALE' | 'OTHER'>('FEMALE');
  const [memRelationship, setMemRelationship] = useState<string>('Child');
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [gestationalWeeks, setGestationalWeeks] = useState<string>('24');
  const [isHighRisk, setIsHighRisk] = useState<boolean>(false);
  const [dueService, setDueService] = useState<string>('');

  // Complete Visit Modal State
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [outcomeNote, setOutcomeNote] = useState<string>('');
  const [bpInput, setBpInput] = useState<string>('');
  const [weightInput, setWeightInput] = useState<string>('');

  const loadData = async () => {
    if (!id) return;
    const db = await getDB();
    const hh = await db.get('households', id);
    if (hh) {
      setHousehold(hh);
    }

    const allMembers = await db.getAllFromIndex('members', 'by-household', id);
    setMembers(allMembers);

    const allVisits = await db.getAllFromIndex('visits', 'by-household', id);
    setVisits(allVisits);
  };

  useEffect(() => {
    loadData();
    const unsub = SyncQueueManager.getInstance().subscribe(loadData);
    return () => unsub();
  }, [id]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !memName.trim()) return;

    const db = await getDB();
    const newMemberId = `M-${id}-${Date.now().toString().slice(-4)}`;
    const newMember: Member = {
      id: newMemberId,
      householdId: id,
      name: memName.trim(),
      age: memAge.trim() || '25 years',
      gender: memGender,
      relationship: memRelationship,
      isPregnant,
      gestationalWeeks: isPregnant ? parseInt(gestationalWeeks) || 20 : undefined,
      highRisk: isHighRisk,
      dueService: dueService.trim() || undefined,
      chronicConditions: [],
    };

    await db.put('members', newMember);

    // Update household members count
    if (household) {
      const updatedHH: Household = {
        ...household,
        membersCount: household.membersCount + 1,
        highRiskCount: isHighRisk ? household.highRiskCount + 1 : household.highRiskCount,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      await db.put('households', updatedHH);
      setHousehold(updatedHH);
    }

    // Register sync item
    await SyncQueueManager.getInstance().enqueue('ADD_MEMBER', newMemberId, newMember);

    setShowAddMemberModal(false);
    setMemName('');
    setMemAge('');
    setIsPregnant(false);
    setIsHighRisk(false);
    setDueService('');
    loadData();
  };

  const pendingVisit = visits.find((v) => v.status === 'PENDING');

  const handleMarkVisitDone = async () => {
    if (!pendingVisit) return;
    await SyncQueueManager.getInstance().completeVisit(
      pendingVisit.id,
      outcomeNote || 'Routine check-up conducted, guidance delivered.',
      bpInput || undefined,
      weightInput ? parseFloat(weightInput) : undefined
    );
    setShowCompleteModal(false);
    loadData();
  };

  const handleUndoVisit = async (visitId: string) => {
    await SyncQueueManager.getInstance().undoCompleteVisit(visitId);
    loadData();
  };

  const isTe = language === 'te';

  if (!household) {
    return (
      <div className="text-center py-12 text-slate-500">
        Loading household details...
      </div>
    );
  }

  const hhName = isTe && household.headOfHouseholdTe ? household.headOfHouseholdTe : household.headOfHousehold;

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in pb-16">
      {/* Top Bar matching Screen 4 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/households')}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t.householdDetails}
          </h1>
        </div>

        <button className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Household Profile Card matching Screen 4 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
        {/* Family avatar illustration */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs shrink-0">
          <img
            src="/illustrations/household-family.jpg"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/illustrations/family.svg'; }}
            alt={hhName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
            {hhName}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {t.hhId}: {household.id}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {household.address || `${household.village}, ${household.ward}`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs matching Screen 4: "Family Members", "Due Services", "History" */}
      <div className="flex items-center border-b border-slate-200 bg-white rounded-xl px-2 shadow-2xs">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all ${
            activeTab === 'members'
              ? 'border-sahaaya-navy text-sahaaya-navy'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t.familyMembersTab} ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all ${
            activeTab === 'services'
              ? 'border-sahaaya-navy text-sahaaya-navy'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t.dueServicesTab} ({members.filter((m) => m.dueService).length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-sahaaya-navy text-sahaaya-navy'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t.historyTab} ({visits.length})
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* Tab 1: Family Members List matching Screen 4 */}
      {activeTab === 'members' && (
        <div className="space-y-3">
          {members.map((member) => {
            const memberName = isTe && member.nameTe ? member.nameTe : member.name;
            const relationship = isTe && member.relationshipTe ? member.relationshipTe : member.relationship;
            const dueServiceText = isTe && member.dueServiceTe ? member.dueServiceTe : member.dueService;

            const getMemberAvatar = (name: string): string => {
              const lower = name.toLowerCase();
              if (lower.includes('lakshmi')) return '/illustrations/avatars/lakshmi.jpg';
              if (lower.includes('ravi')) return '/illustrations/avatars/ravi.jpg';
              if (lower.includes('baby') || lower.includes('ananya') || lower.includes('girl')) return '/illustrations/avatars/ananya.jpg';
              if (lower.includes('raju')) return '/illustrations/avatars/raju.jpg';
              if (lower.includes('saraswati')) return '/illustrations/avatars/saraswati.jpg';
              if (lower.includes('imran')) return '/illustrations/avatars/imran.jpg';
              return member.isPregnant ? '/illustrations/avatars/lakshmi.jpg' : '/illustrations/avatars/raju.jpg';
            };

            const avatarSrc = getMemberAvatar(member.name);

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-start justify-between gap-3 transition-all hover:border-slate-300"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs bg-slate-100">
                    <img
                      src={avatarSrc}
                      onError={(e) => {
                        const svgFallback = avatarSrc.replace('.jpg', '.svg');
                        (e.currentTarget as HTMLImageElement).src = svgFallback;
                      }}
                      alt={memberName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900">
                        {memberName}
                      </h4>

                      {member.highRisk && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-2xs">
                          {t.highRiskBadge}
                        </span>
                      )}

                      {member.isPregnant && !member.highRisk && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">
                          {t.pregnantBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {member.isPregnant && member.gestationalWeeks
                        ? `${member.gestationalWeeks} ${isTe ? 'వారాల గర్భవతి' : 'weeks pregnant'}`
                        : `${relationship}, ${member.age}`}
                    </p>

                    {dueServiceText && (
                      <div className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{dueServiceText}</span>
                      </div>
                    )}
                  </div>
                </div>

                {member.dueService && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-sahaaya-navy border border-blue-200 shrink-0">
                    {t.priorityDue}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Due Services */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          {members.filter((m) => m.dueService).map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{m.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-sahaaya-navy font-semibold">
                  Due Now
                </span>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {m.dueService}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {visits.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{v.serviceDue}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {v.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">Beneficiary: {v.beneficiaryName} ({v.dueDate})</p>
              {v.outcomeNote && (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                  Note: {v.outcomeNote}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action Buttons matching Screen 4: "+ Add Family Member" and "✓ Mark Visit as Completed" */}
      <div className="pt-2 space-y-2.5">
        <button
          onClick={() => setShowAddMemberModal(true)}
          className="w-full py-3 rounded-2xl border-2 border-slate-300 hover:border-sahaaya-navy text-slate-800 hover:text-sahaaya-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white transition-all shadow-2xs"
        >
          <Plus className="w-4 h-4 text-sahaaya-navy" />
          <span>{t.addMemberBtn}</span>
        </button>

        {pendingVisit ? (
          <button
            onClick={() => setShowCompleteModal(true)}
            className="w-full py-3.5 rounded-2xl bg-sahaaya-navy hover:bg-sahaaya-navy-light active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Check className="w-5 h-5" />
            <span>{t.markCompleted}</span>
          </button>
        ) : (
          <div className="w-full py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{isTe ? 'నేటి సందర్శన విజయవంతంగా పూర్తయింది' : 'Visit Marked Completed For Today'}</span>
          </div>
        )}
      </div>

      {/* Modal: Add Family Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMember}
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3.5 shadow-2xl border border-slate-200 animate-scale-in"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'కుటుంబ సభ్యుడిని చేర్చండి' : 'Add Family Member'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={memName}
                onChange={(e) => setMemName(e.target.value)}
                placeholder="e.g. Baby Girl / Ravi"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={memAge}
                  onChange={(e) => setMemAge(e.target.value)}
                  placeholder="e.g. 3 years / 32"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-sahaaya-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relationship
                </label>
                <select
                  value={memRelationship}
                  onChange={(e) => setMemRelationship(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-sahaaya-navy"
                >
                  <option value="Self">Self</option>
                  <option value="Husband">Husband</option>
                  <option value="Child">Child</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Mother-in-law">Mother-in-law</option>
                </select>
              </div>
            </div>

            {/* Pregnant Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Is Beneficiary Pregnant?</span>
              <input
                type="checkbox"
                checked={isPregnant}
                onChange={(e) => setIsPregnant(e.target.checked)}
                className="w-4 h-4 text-sahaaya-navy rounded"
              />
            </div>

            {isPregnant && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gestational Weeks (e.g. 28)
                </label>
                <input
                  type="number"
                  min="4"
                  max="42"
                  value={gestationalWeeks}
                  onChange={(e) => setGestationalWeeks(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-sahaaya-navy"
                />
              </div>
            )}

            {/* High Risk Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-rose-50/60 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800">High Risk Beneficiary</span>
              <input
                type="checkbox"
                checked={isHighRisk}
                onChange={(e) => setIsHighRisk(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scheduled Service / Vaccine Due
              </label>
              <input
                type="text"
                value={dueService}
                onChange={(e) => setDueService(e.target.value)}
                placeholder="e.g. Immunisation due (DPT Booster)"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-sahaaya-navy hover:bg-sahaaya-navy-light rounded-xl shadow-xs"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Mark Visit Completed */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'సందర్శన వివరాలు నమోదు చేయండి' : 'Record Visit Completion'}
              </h3>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'సందర్శన నోట్స్ / సేవ వివరాలు' : 'Visit Observations & Counsel Provided'}
                </label>
                <textarea
                  rows={2}
                  value={outcomeNote}
                  onChange={(e) => setOutcomeNote(e.target.value)}
                  placeholder="e.g. Conducted BP check, distributed IFA tablets, verified kick count..."
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    value={bpInput}
                    onChange={(e) => setBpInput(e.target.value)}
                    placeholder="120/80"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-sahaaya-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    placeholder="52.0"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-sahaaya-navy"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkVisitDone}
                className="px-4 py-2 text-xs font-bold text-white bg-sahaaya-navy hover:bg-sahaaya-navy-light rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save & Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
