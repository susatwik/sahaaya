import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Home,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getDB, Household } from '../core/storage/db';
import { SyncQueueManager } from '../core/sync/syncQueue';

export const HouseholdRegister: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [visibleLimit, setVisibleLimit] = useState<number>(30);

  // New Household form fields
  const [headName, setHeadName] = useState<string>('');
  const [village, setVillage] = useState<string>('Rythu Basti');
  const [ward, setWard] = useState<string>('Ward 5');
  const [address, setAddress] = useState<string>('');
  const [rationCard, setRationCard] = useState<string>('');

  const loadHouseholds = async () => {
    const db = await getDB();
    const all = await db.getAll('households');
    setHouseholds(all);
  };

  useEffect(() => {
    loadHouseholds();
    const unsub = SyncQueueManager.getInstance().subscribe(loadHouseholds);
    return () => unsub();
  }, []);

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headName.trim()) return;

    const db = await getDB();
    const newId = `AP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newHH: Household = {
      id: newId,
      headOfHousehold: headName.trim(),
      village,
      ward,
      address: address.trim() || `${village}, ${ward}`,
      rationCard: rationCard.trim() || `WAP${Math.floor(10000000 + Math.random() * 90000000)}`,
      membersCount: 1,
      highRiskCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    await db.put('households', newHH);
    await SyncQueueManager.getInstance().enqueue('UPDATE_HOUSEHOLD', newId, newHH);

    setShowAddModal(false);
    setHeadName('');
    setAddress('');
    setRationCard('');
    loadHouseholds();
    navigate(`/households/${newId}`);
  };

  const isTe = language === 'te';

  const filtered = households.filter((h) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.headOfHousehold.toLowerCase().includes(q) ||
      (h.headOfHouseholdTe && h.headOfHouseholdTe.includes(q)) ||
      h.id.toLowerCase().includes(q) ||
      h.village.toLowerCase().includes(q) ||
      h.ward.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in pb-10">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.householdsTitle}
          </h1>
          <p className="text-xs text-slate-500">
            {isTe ? 'గ్రామ పరిధిలోని కుటుంబాల రిజిస్టర్ మరియు సభ్యుల వివరాలు' : 'Verified household directory for field tracking'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-sahaaya-navy hover:bg-sahaaya-navy-light active:scale-95 shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isTe ? 'కొత్త కుటుంబం' : 'Add Household'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchHouseholds}
          className="w-full text-xs sm:text-sm bg-white border border-slate-200 focus:border-sahaaya-navy rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-2xs"
        />
      </div>

      {/* Household Cards */}
      <div className="space-y-3">
        {filtered.slice(0, visibleLimit).map((hh) => {
          const name = isTe && hh.headOfHouseholdTe ? hh.headOfHouseholdTe : hh.headOfHousehold;

          return (
            <div
              key={hh.id}
              onClick={() => navigate(`/households/${hh.id}`)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xs p-4 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <img
                    src="/illustrations/household-family.jpg"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/illustrations/family.svg'; }}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sahaaya-navy transition-colors">
                      {name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.2 rounded-md">
                      {hh.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hh.village}, {hh.ward}</span>
                    </span>
                    <span>•</span>
                    <span>{hh.membersCount} {isTe ? 'సభ్యులు' : 'Members'}</span>
                  </div>

                  {hh.highRiskCount > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{hh.highRiskCount} {isTe ? 'హై-రిస్క్ లబ్ధిదారుడు' : 'High-risk case'}</span>
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          );
        })}

        {filtered.length > visibleLimit && (
          <button
            onClick={() => setVisibleLimit((prev) => prev + 40)}
            className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-sahaaya-navy text-xs font-bold rounded-2xl shadow-2xs transition-colors"
          >
            {isTe
              ? `మరిన్ని కుటుంబాలను చూడండి (${visibleLimit} / ${filtered.length})`
              : `Load More Families (${visibleLimit} of ${filtered.length} shown)`}
          </button>
        )}
      </div>

      {/* Add Household Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHousehold}
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-scale-in"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'కొత్త కుటుంబాన్ని నమోదు చేయండి' : 'Register New Household'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'కుటుంబ పెద్ద / ఇంటి పేరు' : 'Family / Head of Household Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={headName}
                  onChange={(e) => setHeadName(e.target.value)}
                  placeholder="e.g. Lakshmi Family / వెంకటేశ్వర్లు"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTe ? 'గ్రామం' : 'Village / Locality'}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-sahaaya-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTe ? 'వార్డు నెంబర్' : 'Ward / Habitation'}
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-sahaaya-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'డోర్ నెంబర్ / చిరునామా' : 'Door No / Street Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Door No 4-22, Near Water Tank"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'రేషన్ కార్డు నెంబర్' : 'Ration Card Number'}
                </label>
                <input
                  type="text"
                  value={rationCard}
                  onChange={(e) => setRationCard(e.target.value)}
                  placeholder="e.g. WAP05128934"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-sahaaya-navy"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-sahaaya-navy hover:bg-sahaaya-navy-light rounded-xl shadow-xs"
              >
                {isTe ? 'సేవ్ చేయండి' : 'Create Record'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
