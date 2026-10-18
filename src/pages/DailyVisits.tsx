import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Check,
  RotateCcw,
  Calendar,
  Menu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getDB, Visit, VisitPriority } from '../core/storage/db';
import { SyncQueueManager } from '../core/sync/syncQueue';

export const DailyVisits: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();

  const [visits, setVisits] = useState<Visit[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVisitForCompletion, setSelectedVisitForCompletion] = useState<Visit | null>(null);
  const [outcomeNote, setOutcomeNote] = useState<string>('');
  const [bpInput, setBpInput] = useState<string>('');
  const [weightInput, setWeightInput] = useState<string>('');
  const [visibleLimit, setVisibleLimit] = useState<number>(30);

  const loadVisits = async () => {
    const db = await getDB();
    const all = await db.getAll('visits');
    setVisits(all);
  };

  useEffect(() => {
    loadVisits();
    const unsub = SyncQueueManager.getInstance().subscribe(loadVisits);

    // Initial filter from query params
    const f = searchParams.get('filter');
    if (f) setFilterType(f);

    return () => unsub();
  }, [searchParams]);

  const handleMarkComplete = async (v: Visit) => {
    setSelectedVisitForCompletion(v);
    setOutcomeNote('');
    setBpInput(v.bpMeasurement || '');
    setWeightInput(v.weightKg ? v.weightKg.toString() : '');
  };

  const handleConfirmCompletion = async () => {
    if (!selectedVisitForCompletion) return;
    await SyncQueueManager.getInstance().completeVisit(
      selectedVisitForCompletion.id,
      outcomeNote,
      bpInput || undefined,
      weightInput ? parseFloat(weightInput) : undefined
    );
    setSelectedVisitForCompletion(null);
    loadVisits();
  };

  const handleUndoComplete = async (visitId: string) => {
    await SyncQueueManager.getInstance().undoCompleteVisit(visitId);
    loadVisits();
  };

  const isTe = language === 'te';

  const getBeneficiaryAvatar = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('lakshmi')) return '/illustrations/avatars/lakshmi.jpg';
    if (lower.includes('raju')) return '/illustrations/avatars/raju.jpg';
    if (lower.includes('saraswati')) return '/illustrations/avatars/saraswati.jpg';
    if (lower.includes('imran')) return '/illustrations/avatars/imran.jpg';
    if (lower.includes('anasuya')) return '/illustrations/avatars/lakshmi.jpg';
    if (lower.includes('ravi')) return '/illustrations/avatars/ravi.jpg';
    if (lower.includes('ananya') || lower.includes('baby')) return '/illustrations/avatars/ananya.jpg';
    return '/illustrations/avatars/lakshmi.jpg';
  };

  // Filtering
  const filteredVisits = visits.filter((v) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.beneficiaryName.toLowerCase().includes(q) || (v.beneficiaryNameTe && v.beneficiaryNameTe.includes(q));
      const matchLoc = v.village.toLowerCase().includes(q) || v.ward.toLowerCase().includes(q);
      const matchService = v.serviceDue.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchService) return false;
    }

    // Filter pill
    if (filterType === 'high') {
      return v.priority === 'HIGH' && v.status === 'PENDING';
    }
    if (filterType === 'today') {
      return v.dueDate === '2026-10-15' && v.status === 'PENDING';
    }
    if (filterType === 'overdue') {
      return (v.isOverdue || v.priority === 'OVERDUE') && v.status === 'PENDING';
    }
    if (filterType === 'completed') {
      return v.status === 'COMPLETED';
    }
    return true;
  });

  // Sort: High priority first, then Overdue, then Due, then Completed
  const priorityOrder: Record<string, number> = {
    HIGH: 1,
    OVERDUE: 2,
    MEDIUM: 3,
    DUE: 4,
    DONE: 5,
  };

  const sortedVisits = [...filteredVisits].sort((a, b) => {
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
    return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
  });

  const allCount = visits.length;
  const highCount = visits.filter((v) => v.priority === 'HIGH' && v.status === 'PENDING').length;
  const overdueCount = visits.filter((v) => (v.isOverdue || v.priority === 'OVERDUE') && v.status === 'PENDING').length;

  const getPriorityBadge = (priority: VisitPriority, status: string) => {
    if (status === 'COMPLETED') {
      return (
        <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          {t.priorityCompleted}
        </span>
      );
    }
    switch (priority) {
      case 'HIGH':
        return (
          <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#EF4444] text-white shadow-2xs">
            {t.priorityHigh}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#D97706] text-white shadow-2xs">
            {t.priorityMedium}
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            {t.priorityOverdue}
          </span>
        );
      case 'DUE':
      default:
        return (
          <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-blue-100 text-sahaaya-navy border border-blue-200">
            {t.priorityDue}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in pb-12">
      {/* Top Bar matching Screen 3 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.visitListTitle}
          </h1>
        </div>

        <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors">
          <Calendar className="w-5 h-5 text-sahaaya-navy" />
        </button>
      </div>

      {/* Date Navigator matching Screen 3: "< Today, 15 Oct 2026 >" */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
        <button className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-sahaaya-teal" />
          <span className="text-sm font-bold text-slate-800">
            {isTe ? 'నేడు, 15 అక్టోబర్ 2026' : 'Today, 15 Oct 2026'}
          </span>
        </div>
        <button className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchVisits}
          className="w-full text-xs sm:text-sm bg-white border border-slate-200 focus:border-sahaaya-navy rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-2xs"
        />
      </div>

      {/* Filter Chips matching Screen 3: "All (12)", "High Priority (4)", "Due Today", "Overdue" */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setFilterType('all')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterType === 'all'
              ? 'bg-sahaaya-navy text-white shadow-2xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {t.filterAll} ({allCount})
        </button>

        <button
          onClick={() => setFilterType('high')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterType === 'high'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {t.filterHighPriority} ({highCount})
        </button>

        <button
          onClick={() => setFilterType('today')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterType === 'today'
              ? 'bg-sahaaya-teal text-white shadow-2xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {t.filterDueToday}
        </button>

        <button
          onClick={() => setFilterType('overdue')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterType === 'overdue'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {t.filterOverdue} ({overdueCount})
        </button>

        <button
          onClick={() => setFilterType('completed')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterType === 'completed'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {t.filterCompleted}
        </button>
      </div>

      {/* Beneficiary Visit Cards List matching Screen 3 */}
      <div className="space-y-3">
        {sortedVisits.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3 shadow-2xs">
            <img
              src="/illustrations/empty-visits.svg"
              alt="All visits completed"
              className="w-32 h-24 mx-auto object-contain"
            />
            <p className="text-base font-bold text-slate-800">{t.noVisitsFound}</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isTe ? 'అన్ని సందర్శనలను చూడటానికి ఫిల్టర్‌ను మార్చండి.' : 'Try adjusting your search or switch to All visits.'}
            </p>
          </div>
        ) : (
          <>
            {sortedVisits.slice(0, visibleLimit).map((visit) => {
              const isCompleted = visit.status === 'COMPLETED';
              const name = isTe && visit.beneficiaryNameTe ? visit.beneficiaryNameTe : visit.beneficiaryName;
              const details = isTe && visit.beneficiaryDetailsTe ? visit.beneficiaryDetailsTe : visit.beneficiaryDetails;
              const subtasks = isTe && visit.subtasksTe && visit.subtasksTe.length > 0 ? visit.subtasksTe : visit.subtasks;
              const avatarUrl = getBeneficiaryAvatar(visit.beneficiaryName);

              return (
                <div
                  key={visit.id}
                  className={`group bg-white rounded-2xl border transition-all duration-200 p-4 shadow-2xs ${
                    isCompleted
                      ? 'border-slate-200 bg-slate-50/60 opacity-80'
                      : visit.priority === 'HIGH'
                      ? 'border-rose-200/90 hover:border-rose-300 hover:shadow-xs'
                      : 'border-slate-200 hover:border-blue-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left Illustrated Character Avatar & Details */}
                    <div
                      onClick={() => navigate(`/households/${visit.householdId}`)}
                      className="flex items-start gap-3.5 flex-1 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs bg-slate-100 group-hover:scale-105 transition-transform">
                        <img
                          src={avatarUrl}
                          onError={(e) => {
                            const svgFallback = avatarUrl.replace('.jpg', '.svg');
                            (e.currentTarget as HTMLImageElement).src = svgFallback;
                          }}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-sahaaya-navy transition-colors">
                            {name}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            ({details})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {visit.village}, {visit.ward}
                          </span>
                        </div>

                        {/* Subtasks matching Screen 3 list */}
                        <ul className="mt-2.5 space-y-1 text-xs text-slate-700">
                          {subtasks.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-slate-400 font-bold">•</span>
                              <span className={isCompleted ? 'line-through text-slate-400' : ''}>
                                {task}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* Outcome Note if completed */}
                        {isCompleted && visit.outcomeNote && (
                          <div className="mt-2.5 text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
                            <span className="font-bold">{isTe ? 'ఫలితం:' : 'Outcome:'} </span>
                            <span>{visit.outcomeNote}</span>
                            {visit.bpMeasurement && (
                              <span className="ml-2 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">BP: {visit.bpMeasurement}</span>
                            )}
                            {visit.weightKg && (
                              <span className="ml-1.5 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">{visit.weightKg} kg</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side Priority Badge and Actions */}
                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      {getPriorityBadge(visit.priority, visit.status)}

                      <div className="flex items-center gap-1.5 mt-2">
                        {isCompleted ? (
                          <button
                            onClick={() => handleUndoComplete(visit.id)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-200 flex items-center gap-1 transition-colors"
                            title="Undo completion"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.undoCompleted}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkComplete(visit)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-sahaaya-navy hover:bg-sahaaya-navy-light active:scale-95 shadow-2xs flex items-center gap-1.5 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isTe ? 'పూర్తయింది' : 'Mark Done'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/households/${visit.householdId}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View Household Details"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {sortedVisits.length > visibleLimit && (
              <button
                onClick={() => setVisibleLimit((prev) => prev + 30)}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-sahaaya-navy text-xs font-bold rounded-2xl shadow-2xs transition-colors"
              >
                {isTe
                  ? `మరిన్ని సందర్శనలను చూడండి (${visibleLimit} / ${sortedVisits.length})`
                  : `Load More Visits (${visibleLimit} of ${sortedVisits.length} shown)`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Completion Dialog Modal */}
      {selectedVisitForCompletion && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {isTe ? 'సందర్శన పూర్తి చేయండి' : 'Record Visit Outcome'}
              </h3>
              <button
                onClick={() => setSelectedVisitForCompletion(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {selectedVisitForCompletion.beneficiaryName} ({selectedVisitForCompletion.beneficiaryDetails})
              </p>
              <p className="text-xs text-slate-500">
                {selectedVisitForCompletion.serviceDue}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'పరిశీలన నోట్స్ / సలహాలు' : 'Clinical Notes / Service Provided'}
                </label>
                <textarea
                  rows={2}
                  value={outcomeNote}
                  onChange={(e) => setOutcomeNote(e.target.value)}
                  placeholder={isTe ? 'ఉదా: మందులు అందించబడ్డాయి, ఆరోగ్యం నిలకడగా ఉంది...' : 'e.g., Tablets dispensed, examined vitals, no danger signs...'}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-sahaaya-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    BP (mmHg)
                  </label>
                  <input
                    type="text"
                    value={bpInput}
                    onChange={(e) => setBpInput(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
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
                    placeholder="e.g. 52.5"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedVisitForCompletion(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="px-5 py-2.5 text-xs font-bold text-white bg-sahaaya-navy hover:bg-sahaaya-navy-light rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{t.markCompleted}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
