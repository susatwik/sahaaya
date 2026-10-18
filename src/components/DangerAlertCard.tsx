import React from 'react';
import { AlertTriangle, BookOpen, PhoneCall, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { EscalationRule } from '../core/safety/escalationRules';
import { useLanguage } from '../context/LanguageContext';

interface DangerAlertCardProps {
  rule: EscalationRule;
  onCall108?: () => void;
}

export const DangerAlertCard: React.FC<DangerAlertCardProps> = ({ rule, onCall108 }) => {
  const { language, t } = useLanguage();
  const [showExcerpt, setShowExcerpt] = React.useState(false);

  const isTe = language === 'te';
  const title = isTe ? rule.titleTe : rule.title;
  const actionText = isTe ? rule.immediateActionTe : rule.immediateAction;
  const keyPoints = isTe ? rule.keyPointsTe : rule.keyPoints;

  const isCritical = rule.severity === 'CRITICAL';
  const isRefusal = rule.severity === 'OUT_OF_SCOPE';

  return (
    <div
      className={`rounded-2xl border-2 p-4 sm:p-5 shadow-sm transition-all duration-200 ${
        isRefusal
          ? 'bg-amber-50/70 border-amber-300 text-slate-800'
          : isCritical
          ? 'bg-rose-50/80 border-rose-400 text-slate-900 animate-danger-highlight'
          : 'bg-orange-50/80 border-orange-300 text-slate-900'
      }`}
    >
      {/* Header Banner */}
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isRefusal
              ? 'bg-amber-100 text-amber-700'
              : 'bg-rose-100 text-rose-700 animate-pulse'
          }`}
        >
          {isRefusal ? (
            <ShieldAlert className="w-6 h-6" />
          ) : (
            <AlertTriangle className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`text-base sm:text-lg font-bold tracking-tight ${
                isRefusal ? 'text-amber-900' : 'text-rose-900'
              }`}
            >
              {title}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isRefusal
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-rose-200 text-rose-900'
              }`}
            >
              {rule.severity}
            </span>
          </div>

          <p className="mt-1.5 text-sm text-slate-800 leading-relaxed font-medium">
            {actionText}
          </p>
        </div>
      </div>

      {/* Verified Source Citation Box */}
      <div className="mt-3.5 bg-white/90 rounded-xl p-3 border border-slate-200 shadow-2xs flex items-start gap-2.5 text-xs text-slate-700">
        <BookOpen className="w-4 h-4 text-sahaaya-navy shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-slate-900">
            {t.sourceLabel}: {rule.source.title}
          </p>
          <p className="text-slate-600 mt-0.5">
            {t.sectionLabel}: {rule.source.section}{' '}
            {rule.source.page ? `(Page ${rule.source.page})` : ''}
          </p>
        </div>
      </div>

      {/* Key Points Checklist */}
      {keyPoints && keyPoints.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-rose-200/60">
          <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
            {t.keyPointsLabel}
          </h4>
          <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-800">
            {keyPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span className="leading-snug">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Emergency Action Buttons */}
      {!isRefusal && (
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <a
            href="tel:108"
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.call108Ambulance}</span>
          </a>

          <button
            onClick={() => setShowExcerpt(!showExcerpt)}
            className="min-h-[44px] sm:min-h-0 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
          >
            <span>{showExcerpt ? t.collapseExcerpt : t.expandExcerpt}</span>
            {showExcerpt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Collapsible Excerpt */}
      {showExcerpt && (
        <div className="mt-3 p-3 bg-white rounded-xl border border-rose-200 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 mb-1">
            {isTe ? 'అధికారిక మార్గదర్శక వివరాలు:' : 'Official Guideline Excerpt:'}
          </p>
          <p>
            {isTe
              ? 'గర్భిణీ లేదా నవజాత శిశువుల్లో ప్రమాద సంకేతాలు కనిపించినప్పుడు తక్షణమే ఆసుపత్రి స్థాయి చికిత్స అవసరం. ఆశా కార్యకర్తలు 108 ద్వారా తక్షణ రవాణాను ఏర్పాటు చేయాలి మరియు ఎఫ్ఆర్​యూ వైద్య బృందానికి ముందస్తు సమాచారం అందించాలి.'
              : 'Obstetric and neonatal danger signs require immediate facility-level intervention. Frontline workers must initiate rapid emergency transfer via 108, notify the FRU medical team, and maintain left-lateral tilt positioning to optimize maternal-fetal oxygenation.'}
          </p>
        </div>
      )}
    </div>
  );
};
