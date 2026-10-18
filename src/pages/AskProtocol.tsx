import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Send,
  Mic,
  MicOff,
  BookOpen,
  AlertTriangle,
  Volume2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { evaluateEscalation, EscalationMatchResult } from '../core/safety/escalationEngine';
import { ProtocolRetriever, AnswerGenerationResult } from '../core/retrieval/retriever';
import { DangerAlertCard } from '../components/DangerAlertCard';
import { getDB, QuestionHistoryItem } from '../core/storage/db';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEscalation?: boolean;
  escalationResult?: EscalationMatchResult;
  groundedAnswer?: AnswerGenerationResult;
}

export const AskProtocol: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<QuestionHistoryItem[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const retrieverRef = useRef<ProtocolRetriever>(new ProtocolRetriever());

  // Load question history from DB
  const loadHistory = async () => {
    const db = await getDB();
    const history = await db.getAll('questionHistory');
    history.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    setHistoryItems(history);
  };

  useEffect(() => {
    loadHistory();

    // Check if query was passed in URL (e.g. from Home or category chip)
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setInputQuery(urlQuery);
      handleProcessQuestion(urlQuery);
    } else {
      // Default initial showcase message matching Phone Screen 2:
      // "3rd trimester lo bleeding unte emi cheyali?"
      const initialUserMsg = '3rd trimester lo bleeding unte emi cheyali?';
      const initialEscalation = evaluateEscalation(initialUserMsg);
      setMessages([
        {
          id: 'msg-init-1',
          sender: 'user',
          text: initialUserMsg,
          timestamp: '9:40 AM',
        },
        {
          id: 'msg-init-2',
          sender: 'assistant',
          text: '',
          timestamp: '9:40 AM',
          isEscalation: true,
          escalationResult: initialEscalation,
        }
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleProcessQuestion = async (queryText: string) => {
    if (!queryText.trim()) return;

    const trimmed = queryText.trim();
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append User Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    // 2. Safety Escalation Engine FIRST (deterministic, before model retrieval)
    const escalation = evaluateEscalation(trimmed);

    // Short processing delay for realistic user feedback
    await new Promise((res) => setTimeout(res, 200));

    const db = await getDB();

    if (escalation.isEscalation && escalation.rule) {
      // Emergency rule triggered! Immediate escalation card displayed
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalation: true,
        escalationResult: escalation,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Save to question history in IndexedDB
      const historyItem: QuestionHistoryItem = {
        id: `Q-${Date.now()}`,
        query: trimmed,
        timestamp: new Date().toISOString(),
        isEscalation: true,
        severity: escalation.severity || 'CRITICAL',
        ruleId: escalation.rule.id,
        title: language === 'te' ? escalation.rule.titleTe : escalation.rule.title,
        answer: language === 'te' ? escalation.rule.immediateActionTe : escalation.rule.immediateAction,
        sourceDoc: escalation.rule.source.title,
        section: escalation.rule.source.section,
        page: escalation.rule.source.page,
        keyPoints: language === 'te' ? escalation.rule.keyPointsTe : escalation.rule.keyPoints,
      };
      await db.put('questionHistory', historyItem);
      loadHistory();
      setIsProcessing(false);
      return;
    }

    // 3. No emergency rule triggered -> Retrieve grounded passage from approved protocols
    const answerResult = retrieverRef.current.generateAnswer(trimmed, language);

    const assistantMsg: ChatMessage = {
      id: `asst-${Date.now()}`,
      sender: 'assistant',
      text: answerResult.shortAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEscalation: false,
      groundedAnswer: answerResult,
    };

    setMessages((prev) => [...prev, assistantMsg]);

    // Save to question history in IndexedDB
    const historyItem: QuestionHistoryItem = {
      id: `Q-${Date.now()}`,
      query: trimmed,
      timestamp: new Date().toISOString(),
      isEscalation: false,
      title: answerResult.shortAnswer,
      answer: answerResult.recommendedAction,
      sourceDoc: answerResult.docTitle,
      section: answerResult.sectionHeading,
      page: answerResult.page,
      keyPoints: answerResult.keyPoints,
      excerpt: answerResult.excerpt,
    };
    await db.put('questionHistory', historyItem);
    loadHistory();
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessQuestion(inputQuery);
  };

  // Voice Input using Web Speech API (with English / Telugu support)
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleProcessQuestion(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Text to Speech reader
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearHistory = async () => {
    const db = await getDB();
    await db.clear('questionHistory');
    setHistoryItems([]);
    setShowHistoryModal(false);
  };

  const topicChips = [
    { label: t.antenatalChip, query: language === 'te' ? 'గర్భిణీ ANC పరీక్షల షెడ్యూల్ ఏమిటి?' : 'What is the mandatory ANC check-up schedule?' },
    { label: t.immunisationChip, query: language === 'te' ? 'పెంటావాలెంట్ 3 టీకా ఎప్పుడు ఇవ్వాలి?' : 'When is Pentavalent 3 and OPV 3 vaccine due?' },
    { label: t.childHealthChip, query: language === 'te' ? 'శిశువుకు ORS మరియు జింక్ ఎలా ఇవ్వాలి?' : 'How to prepare ORS and give Zinc for diarrhea?' },
    { label: t.nutritionChip, query: language === 'te' ? 'MUAC టేప్ ద్వారా పోషకాహార లోపం ఎలా గుర్తించాలి?' : 'How to measure MUAC tape for child malnutrition?' },
    { label: t.chronicDiseasesChip, query: language === 'te' ? 'బీపీ ఎంత ఉంటే వైద్యునికి రిఫర్ చేయాలి?' : 'What BP reading requires hypertension referral?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Bar matching Screen 2 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {t.askHeader}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 hover:text-sahaaya-navy transition-colors relative"
            title={t.conversationHistory}
          >
            <Clock className="w-5 h-5" />
            {historyItems.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sahaaya-teal" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            {msg.sender === 'user' ? (
              // User Question Bubble (Right aligned)
              <div className="flex flex-col items-end">
                <div className="max-w-[85%] sm:max-w-md bg-white border border-slate-200 text-slate-900 px-4 py-3 rounded-2xl rounded-tr-xs shadow-2xs font-medium text-sm break-words">
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ) : (
              // Assistant / Protocol Guidance Box (Left aligned)
              <div className="flex flex-col items-start max-w-full sm:max-w-xl">
                {msg.isEscalation && msg.escalationResult?.rule ? (
                  // Danger Sign Escalation Card
                  <div className="w-full">
                    <DangerAlertCard rule={msg.escalationResult.rule} />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-2">
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {language === 'te' ? 'తక్షణ అత్యవసర ప్రొటోకాల్' : 'Deterministic Emergency Protocol'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                ) : msg.groundedAnswer ? (
                  // Grounded Protocol Guidance Card
                  <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-sahaaya-soft-blue text-sahaaya-navy">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {msg.groundedAnswer.shortAnswer}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleSpeak(`${msg.groundedAnswer?.shortAnswer}. ${msg.groundedAnswer?.recommendedAction}`)}
                        className="p-1 text-slate-400 hover:text-sahaaya-navy transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="font-semibold text-slate-900 mb-1">
                        {language === 'te' ? 'సిఫార్సు చేయబడిన చర్య:' : 'Recommended Action:'}
                      </p>
                      <p>{msg.groundedAnswer.recommendedAction}</p>
                    </div>

                    {/* Source citation */}
                    <div className="text-[11px] bg-blue-50/60 rounded-xl p-2.5 border border-blue-100 text-slate-700 space-y-0.5">
                      <p className="font-semibold text-sahaaya-navy">
                        {t.sourceLabel}: {msg.groundedAnswer.docTitle}
                      </p>
                      <p className="text-slate-600">
                        {t.sectionLabel}: {msg.groundedAnswer.sectionHeading}{' '}
                        {msg.groundedAnswer.page ? `(Page ${msg.groundedAnswer.page})` : ''}
                      </p>
                    </div>

                    {/* Key points */}
                    {msg.groundedAnswer.keyPoints.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                          {t.keyPointsLabel}
                        </p>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {msg.groundedAnswer.keyPoints.map((kp, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-sahaaya-teal font-bold">•</span>
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        {language === 'te' ? 'ధృవీకరించబడిన ప్రొటోకాల్' : 'Verified Clinical Evidence'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 w-fit">
            <div className="w-2 h-2 rounded-full bg-sahaaya-teal animate-ping" />
            <span>{language === 'te' ? 'ప్రొటోకాల్ తనిఖీ చేస్తోంది...' : 'Searching verified guidelines...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips / Quick Topics matching Screen 2 */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {topicChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleProcessQuestion(chip.query)}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Form matching Screen 2 */}
      <form
        onSubmit={handleSubmit}
        className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={isListening ? t.askListening : t.searchPlaceholder}
          className="flex-1 min-w-0 text-sm bg-slate-100 focus:bg-white border border-slate-200 focus:border-sahaaya-navy rounded-full px-4 py-2.5 outline-none transition-all placeholder:text-slate-400 text-slate-800"
        />

        {/* Voice Mic Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`shrink-0 p-2.5 rounded-full transition-all ${
            isListening
              ? 'bg-rose-500 text-white animate-bounce shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Voice input (English / Telugu)"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-sahaaya-navy" />}
        </button>

        {/* Submit Send Button */}
        <button
          type="submit"
          disabled={!inputQuery.trim() || isProcessing}
          className="shrink-0 p-2.5 rounded-full bg-sahaaya-navy hover:bg-sahaaya-navy-light disabled:opacity-40 text-white transition-all shadow-xs"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-sahaaya-navy" />
                <span>{t.conversationHistory}</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {historyItems.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-6">
                  {language === 'te' ? 'సంభాషణల చరిత్ర ఖాళీగా ఉంది.' : 'No saved question history yet.'}
                </p>
              ) : (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowHistoryModal(false);
                      handleProcessQuestion(item.query);
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-xs text-slate-900 line-clamp-1">
                      {item.query}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {item.sourceDoc} • {item.section}
                    </p>
                  </div>
                ))
              )}
            </div>

            {historyItems.length > 0 && (
              <div className="p-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t.clearHistory}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
