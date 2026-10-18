import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Share2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PROTOCOL_CORPUS, ProtocolDocument } from '../data/protocolCorpus';

export const ProtocolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const doc = PROTOCOL_CORPUS.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="text-center py-12 text-slate-500">
        Protocol not found.
      </div>
    );
  }

  const isTe = language === 'te';
  const title = isTe ? doc.titleTe : doc.title;
  const subtitle = isTe ? doc.subtitleTe : doc.subtitle;

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isTe ? 'te-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

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

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in pb-28 sm:pb-16 w-full min-w-0 box-border overflow-x-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={() => navigate('/protocols')}
          className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isTe ? 'అన్ని గైడ్లు' : 'All Guides'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-full border transition-all ${
              bookmarked
                ? 'bg-amber-100 text-amber-700 border-amber-300'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Bookmark Protocol"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Protocol Header Card with Category Artwork */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3 w-full min-w-0 box-border">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-2xs border border-slate-200 bg-slate-50">
            <img
              src={getCategoryArtwork(doc.category)}
              onError={(e) => {
                const svgFallback = getCategoryArtwork(doc.category).replace('.jpg', '.svg');
                (e.currentTarget as HTMLImageElement).src = svgFallback;
              }}
              alt={title}
              className="w-full h-full object-cover object-center max-w-full"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <FileCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{t.officialGuideline}</span>
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight break-words">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed break-words">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1 sm:gap-2">
          <span className="break-words">Source: {doc.sourceDoc}</span>
          <span className="shrink-0">Version {doc.version} • Updated {doc.lastUpdated}</span>
        </div>
      </div>

      {/* Ask Question Quick CTA */}
      <div className="bg-sahaaya-soft-blue border border-blue-200/80 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <HelpCircle className="w-5 h-5 text-sahaaya-navy shrink-0" />
          <p className="text-xs font-semibold text-slate-800 leading-tight">
            {isTe ? 'ఈ ప్రొటోకాల్ గురించి సందేహం ఉందా?' : 'Have a question about this protocol?'}
          </p>
        </div>
        <button
          onClick={() => navigate(`/ask?q=${encodeURIComponent(doc.title)}`)}
          className="px-3.5 py-2 rounded-xl bg-sahaaya-navy hover:bg-sahaaya-navy-light text-white text-xs font-bold shrink-0 transition-colors text-center"
        >
          {t.askQuestionTitle}
        </button>
      </div>

      {/* Verified Protocol Sections */}
      <div className="space-y-4">
        {doc.sections.map((section, idx) => {
          const heading = isTe ? section.headingTe : section.heading;
          const content = isTe ? section.contentTe : section.content;
          const keyPoints = isTe ? section.keyPointsTe : section.keyPoints;

          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sahaaya-teal bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Section {idx + 1} • Page {section.page}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    {heading}
                  </h3>
                </div>

                <button
                  onClick={() => handleSpeak(`${heading}. ${content}`)}
                  className="p-1.5 text-slate-400 hover:text-sahaaya-navy rounded-lg hover:bg-slate-100 transition-colors"
                  title="Read aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {content}
              </p>

              {/* Key points */}
              {keyPoints && keyPoints.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t.keyPointsLabel}
                  </p>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-sahaaya-teal font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cautions */}
              {section.cautions && section.cautions.length > 0 && (
                <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Important Caution</span>
                  </div>
                  {section.cautions.map((c, cIdx) => (
                    <p key={cIdx}>{c}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
