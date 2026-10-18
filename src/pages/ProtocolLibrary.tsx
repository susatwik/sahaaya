import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Syringe,
  Baby,
  Activity,
  AlertTriangle,
  FileText,
  UserCheck,
  BookOpen,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PROTOCOL_CORPUS } from '../data/protocolCorpus';

export const ProtocolLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get('cat') || 'all';
  });

  const isTe = language === 'te';

  // Category card styles and visual tokens matching Phone Screen 5
  const getCardStyle = (category: string) => {
    switch (category) {
      case 'antenatal':
        return {
          bg: 'bg-rose-50/70 hover:bg-rose-100/80',
          border: 'border-rose-200/80',
          badgeBg: 'bg-rose-100',
          badgeText: 'text-rose-700',
          iconBg: 'bg-rose-100 text-rose-600',
          Icon: UserCheck,
          label: isTe ? 'గర్భిణీ సంరక్షణ' : 'Antenatal Care',
        };
      case 'immunisation':
        return {
          bg: 'bg-sky-50/70 hover:bg-sky-100/80',
          border: 'border-sky-200/80',
          badgeBg: 'bg-sky-100',
          badgeText: 'text-sky-700',
          iconBg: 'bg-sky-100 text-sky-600',
          Icon: Syringe,
          label: isTe ? 'టీకాలు' : 'Immunisation',
        };
      case 'child_health':
        return {
          bg: 'bg-emerald-50/70 hover:bg-emerald-100/80',
          border: 'border-emerald-200/80',
          badgeBg: 'bg-emerald-100',
          badgeText: 'text-emerald-700',
          iconBg: 'bg-emerald-100 text-emerald-600',
          Icon: Baby,
          label: isTe ? 'శిశు ఆరోగ్యం' : 'Child Health',
        };
      case 'chronic':
        return {
          bg: 'bg-amber-50/70 hover:bg-amber-100/80',
          border: 'border-amber-200/80',
          badgeBg: 'bg-amber-100',
          badgeText: 'text-amber-700',
          iconBg: 'bg-amber-100 text-amber-600',
          Icon: Activity,
          label: isTe ? 'దీర్ఘకాలిక వ్యాధులు' : 'Chronic Diseases',
        };
      case 'danger_signs':
        return {
          bg: 'bg-purple-50/70 hover:bg-purple-100/80',
          border: 'border-purple-200/80',
          badgeBg: 'bg-purple-100',
          badgeText: 'text-purple-700',
          iconBg: 'bg-purple-100 text-purple-600',
          Icon: AlertTriangle,
          label: isTe ? 'ప్రమాద సంకేతాలు' : 'Danger Signs',
        };
      case 'job_aids':
      default:
        return {
          bg: 'bg-slate-50/90 hover:bg-slate-100',
          border: 'border-slate-200',
          badgeBg: 'bg-slate-200',
          badgeText: 'text-slate-700',
          iconBg: 'bg-slate-200 text-slate-700',
          Icon: FileText,
          label: isTe ? 'జాబ్ ఎయిడ్స్' : 'Job Aids',
        };
    }
  };

  const categories = [
    { id: 'all', label: isTe ? 'అన్నీ' : 'All' },
    { id: 'antenatal', label: isTe ? 'గర్భిణీ' : 'Antenatal' },
    { id: 'immunisation', label: isTe ? 'టీకాలు' : 'Immunisation' },
    { id: 'child_health', label: isTe ? 'శిశు ఆరోగ్యం' : 'Child Health' },
    { id: 'chronic', label: isTe ? 'దీర్ఘకాలిక' : 'Chronic' },
    { id: 'danger_signs', label: isTe ? 'ప్రమాద సంకేతాలు' : 'Danger Signs' },
    { id: 'job_aids', label: isTe ? 'జాబ్ ఎయిడ్స్' : 'Job Aids' },
  ];

  const getCategoryArtwork = (cat: string): string => {
    switch (cat) {
      case 'antenatal':
        return '/illustrations/categories/antenatal.jpg';
      case 'immunisation':
        return '/illustrations/categories/immunisation.jpg';
      case 'child_health':
        return '/illustrations/categories/child-health.jpg';
      case 'chronic':
        return '/illustrations/categories/chronic.jpg';
      case 'danger_signs':
        return '/illustrations/categories/danger-signs.jpg';
      case 'job_aids':
      default:
        return '/illustrations/categories/job-aids.svg';
    }
  };

  const filtered = PROTOCOL_CORPUS.filter((doc) => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = doc.title.toLowerCase().includes(q) || doc.titleTe.includes(q);
    const subMatch = doc.subtitle.toLowerCase().includes(q) || doc.subtitleTe.includes(q);
    const sectionMatch = doc.sections.some(
      (s) => s.heading.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
    );
    return titleMatch || subMatch || sectionMatch;
  });

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in pb-28 sm:pb-12 w-full min-w-0 box-border overflow-x-hidden">
      {/* Top Bar matching Screen 5 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {t.guidesTitle}
          </h1>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        {isTe ? 'అధికారిక జాతీయ ఆరోగ్య మిషన్ (NHM) ప్రొటోకాల్స్ మరియు సూచనలు' : 'Simplified, easy-to-read guides from official government protocols'}
      </p>

      {/* Search Bar */}
      <div className="relative w-full min-w-0">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchGuides}
          className="w-full text-xs sm:text-sm bg-white border border-slate-200 focus:border-sahaaya-navy rounded-xl pl-9 pr-9 py-2.5 outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-2xs box-border"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full min-w-0">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs border ${
                isSelected
                  ? 'bg-sahaaya-navy text-white border-sahaaya-navy shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Protocol Category Cards List matching Screen 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
        {filtered.map((doc) => {
          const style = getCardStyle(doc.category);
          const title = isTe ? doc.titleTe : doc.title;
          const subtitle = isTe ? doc.subtitleTe : doc.subtitle;
          const artworkSrc = getCategoryArtwork(doc.category);

          return (
            <div
              key={doc.id}
              onClick={() => navigate(`/protocols/${doc.id}`)}
              className={`group ${style.bg} border ${style.border} rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs w-full min-w-0 box-border relative overflow-hidden`}
            >
              <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                {/* Illustration thumbnail container with explicit aspect ratio */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-2xs border border-white/80 bg-white/80 group-hover:scale-105 transition-transform relative">
                  <img
                    src={artworkSrc}
                    onError={(e) => {
                      const svgFallback = artworkSrc.replace('.jpg', '.svg');
                      (e.currentTarget as HTMLImageElement).src = svgFallback;
                    }}
                    alt={title}
                    className="w-full h-full object-cover object-center max-w-full"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badgeBg} ${style.badgeText} uppercase tracking-wider`}>
                      {style.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium inline-flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-sahaaya-teal shrink-0" />
                      <span>{doc.sections.length} {isTe ? 'విభాగాలు' : 'Sections'}</span>
                    </span>
                  </div>

                  <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-sahaaya-navy transition-colors break-words">
                    {title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-snug break-words line-clamp-2">
                    {subtitle}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate max-w-full pt-0.5" title={doc.sourceDoc}>
                    {doc.sourceDoc}
                  </p>
                </div>
              </div>

              {/* Action chevron */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 group-hover:bg-white text-slate-400 group-hover:text-sahaaya-navy flex items-center justify-center shrink-0 border border-slate-200/60 shadow-2xs group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2 shadow-2xs">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              {isTe ? 'ప్రొటోకాల్స్ కనుగొనబడలేదు' : 'No protocols found'}
            </p>
            <p className="text-xs text-slate-500">
              {isTe ? 'దయచేసి మీ శోధన పదాన్ని మార్చండి లేదా వేరే వర్గాన్ని ఎంచుకోండి.' : 'Try adjusting your search query or choosing another category.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
