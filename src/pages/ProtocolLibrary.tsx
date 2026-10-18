import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  ShieldAlert,
  Syringe,
  Baby,
  Activity,
  AlertTriangle,
  FileText,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PROTOCOL_CORPUS, ProtocolDocument } from '../data/protocolCorpus';

export const ProtocolLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isTe = language === 'te';

  // Category card styles matching Phone Screen 5
  const getCardStyle = (category: string) => {
    switch (category) {
      case 'antenatal':
        return {
          bg: 'bg-rose-50/70 hover:bg-rose-100/80',
          border: 'border-rose-200/80',
          iconBg: 'bg-rose-100 text-rose-600',
          Icon: UserCheck,
        };
      case 'immunisation':
        return {
          bg: 'bg-sky-50/70 hover:bg-sky-100/80',
          border: 'border-sky-200/80',
          iconBg: 'bg-sky-100 text-sky-600',
          Icon: Syringe,
        };
      case 'child_health':
        return {
          bg: 'bg-emerald-50/70 hover:bg-emerald-100/80',
          border: 'border-emerald-200/80',
          iconBg: 'bg-emerald-100 text-emerald-600',
          Icon: Baby,
        };
      case 'chronic':
        return {
          bg: 'bg-amber-50/70 hover:bg-amber-100/80',
          border: 'border-amber-200/80',
          iconBg: 'bg-amber-100 text-amber-600',
          Icon: Activity,
        };
      case 'danger_signs':
        return {
          bg: 'bg-purple-50/70 hover:bg-purple-100/80',
          border: 'border-purple-200/80',
          iconBg: 'bg-purple-100 text-purple-600',
          Icon: AlertTriangle,
        };
      case 'job_aids':
      default:
        return {
          bg: 'bg-slate-50/90 hover:bg-slate-100',
          border: 'border-slate-200',
          iconBg: 'bg-slate-200 text-slate-700',
          Icon: FileText,
        };
    }
  };

  const filtered = PROTOCOL_CORPUS.filter((doc) => {
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
    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in pb-12">
      {/* Top Bar matching Screen 5 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.guidesTitle}
          </h1>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        {isTe ? 'అధికారిక జాతీయ ఆరోగ్య మిషన్ (NHM) ప్రొటోకాల్స్ మరియు సూచనలు' : 'Simplified, easy-to-read guides from official government protocols'}
      </p>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchGuides}
          className="w-full text-xs sm:text-sm bg-white border border-slate-200 focus:border-sahaaya-navy rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-2xs"
        />
      </div>

      {/* Protocol Category Cards List matching Screen 5 */}
      <div className="space-y-3">
        {filtered.map((doc) => {
          const style = getCardStyle(doc.category);
          const Icon = style.Icon;
          const title = isTe ? doc.titleTe : doc.title;
          const subtitle = isTe ? doc.subtitleTe : doc.subtitle;
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

          const artworkSrc = getCategoryArtwork(doc.category);

          return (
            <div
              key={doc.id}
              onClick={() => navigate(`/protocols/${doc.id}`)}
              className={`group ${style.bg} border ${style.border} rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-13 h-13 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform bg-white/60"
                >
                  <img
                    src={artworkSrc}
                    onError={(e) => {
                      const svgFallback = artworkSrc.replace('.jpg', '.svg');
                      (e.currentTarget as HTMLImageElement).src = svgFallback;
                    }}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight group-hover:text-sahaaya-navy transition-colors">
                    {title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    {subtitle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    {doc.sections.length} {isTe ? 'విభాగాలు' : 'Verified Sections'} • {doc.sourceDoc}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
