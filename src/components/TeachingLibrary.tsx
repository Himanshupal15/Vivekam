import React, { useState } from 'react';
import { TeachingRecord } from '../data/teachings';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  ExternalLink, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface TeachingLibraryProps {
  teachings: TeachingRecord[];
  onAddTeaching: (teaching: TeachingRecord) => void;
  onSelectTeachingForReel: (teaching: TeachingRecord) => void;
}

export const TeachingLibrary: React.FC<TeachingLibraryProps> = ({
  teachings,
  onAddTeaching,
  onSelectTeachingForReel,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  // Form State for Add Teaching
  const [newQuote, setNewQuote] = useState<string>('');
  const [newTheme, setNewTheme] = useState<TeachingRecord['theme']>('Self-belief');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSourceName, setNewSourceName] = useState<string>('Complete Works of Swami Vivekananda');
  const [newVolume, setNewVolume] = useState<string>('Vol. 3');
  const [newChapter, setNewChapter] = useState<string>('Lectures from Colombo to Almora');
  const [newSourceUrl, setNewSourceUrl] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('confidence, youth, action');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<boolean>(false);

  // Themes list
  const themes = ['All', 'Self-belief', 'Fearlessness', 'Concentration', 'Education', 'Service', 'Discipline', 'Character', 'Leadership', 'Youth', 'Strength'];

  // Filtered teachings
  const filtered = teachings.filter((t) => {
    const matchesTheme = selectedTheme === 'All' || t.theme === selectedTheme;
    const matchesSearch = 
      t.teaching.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTheme && matchesSearch;
  });

  const handleSaveTeaching = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim() || !newTitle.trim()) return;

    const newRecord: TeachingRecord = {
      id: `CUSTOM_${Date.now()}`,
      theme: newTheme,
      title: newTitle,
      teaching: newQuote,
      context: `Curated canonical entry in ${newVolume}`,
      sourceName: newSourceName,
      volume: newVolume,
      chapter: newChapter,
      sourceUrl: newSourceUrl,
      sourceStatus: 'unverified',
      tags: newTags.split(',').map(s => s.trim().toLowerCase()),
      matchedFeelings: ["I NEED COURAGE", "I FEEL STUCK", "I WANT DISCIPLINE"],
      languageVersions: {
        en: newQuote,
        hi: newQuote
      },
      presetReel: {
        hook: {
          campus: `Why do we hesitate when we know truth? "${newQuote.slice(0, 40)}..."`,
          career: `Are you holding yourself back? "${newQuote.slice(0, 40)}..."`,
          everyday: `In moments of uncertainty, remember: "${newQuote.slice(0, 40)}..."`
        },
        story: {
          campus: "A student finds clarity during an overwhelming week by remembering this principle.",
          career: "A young professional recalibrates their priorities to stand tall under pressure.",
          everyday: "Taking a quiet breath before responding to difficult circumstances."
        },
        interpretation: "This teaching emphasizes that inner strength is the foundation of all righteous action.",
        takeaway: "Faith in the inherent capacity of the human spirit dissolves fear.",
        action: {
          title: "The Grounded Action",
          instruction: "Apply this principle in your next challenging conversation or task today.",
          difficulty: "Easy",
          timeRequired: "5 minutes",
          deadline: "Tomorrow",
          reflectionPrompt: "How did keeping this teaching in mind guide your decision?"
        }
      }
    };

    onAddTeaching(newRecord);
    setSavedSuccessMsg(true);
    setTimeout(() => {
      setSavedSuccessMsg(false);
      setShowAdminModal(false);
      // Reset form
      setNewQuote('');
      setNewTitle('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#eddcc4] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#c8b598]/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#8b5a2b]" />
              <h1 className="font-serif-vintage text-3xl font-bold text-[#2b1b11]">
                Teaching Library
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#684c36]">
              Source-linked quotations from the Complete Works and Vivekananda archives.
            </p>
          </div>

          <button
            onClick={() => setShowAdminModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#27190f] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#f7eedf] shadow-md hover:bg-[#3d2718] self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 text-[#c38c3e]" />
            <span>Add Teaching</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b5a2b]" />
            <input
              type="text"
              placeholder="Search by quote, concept, keyword, volume..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#c8b598] bg-[#fbf6ed] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#2b1b11] placeholder-[#9c7d61] focus:border-[#8b5a2b] focus:outline-hidden"
            />
          </div>

          {/* Theme Pills Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  selectedTheme === theme
                    ? 'bg-[#27190f] text-[#f7eedf]'
                    : 'border border-[#c8b598]/60 bg-[#f7eedf] text-[#6e513a] hover:bg-[#ebdcc6]'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Teachings Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-5 shadow-xs transition-all hover:border-[#8b5a2b] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#8b5a2b]/15 px-2.5 py-0.5 text-xs font-bold text-[#8b5a2b]">
                    {t.theme}
                  </span>
                  <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold text-[#f7eedf] ${t.sourceStatus === 'verified' ? 'bg-[#27190f]' : 'bg-amber-800'}`}>
                    {t.sourceStatus === 'verified' ? <ShieldCheck className="h-3 w-3 text-[#c38c3e]" /> : <AlertTriangle className="h-3 w-3" />}
                    {t.sourceStatus === 'verified' ? 'SOURCE VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>

                <h3 className="mt-3 font-serif-vintage text-base font-bold text-[#2b1b11]">
                  {t.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed italic text-[#3d2718]">
                  "{t.teaching}"
                </p>

                <div className="mt-3 rounded-lg bg-[#ebdcc6]/60 p-2 text-[11px] text-[#684c36]">
                  <p><span className="font-semibold text-[#2b1b11]">{t.sourceName}</span></p>
                  <p>{t.volume} • {t.chapter}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#dfccaF]/70 pt-3 text-xs">
                <a
                  href={t.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#8b5a2b] hover:text-[#2b1b11] underline underline-offset-2 font-medium"
                >
                  <span>Open original source</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  onClick={() => onSelectTeachingForReel(t)}
                  className="flex items-center gap-1.5 rounded-full bg-[#27190f] px-3.5 py-1.5 font-bold text-xs text-[#f7eedf] hover:bg-[#3d2718]"
                >
                  <Sparkles className="h-3 w-3 text-[#c38c3e]" />
                  <span>Create Reel</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Teaching Admin Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-2xl border border-[#8b5a2b] bg-[#f7eedf] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#dfccaF] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#8b5a2b]" />
                  <h3 className="font-serif-vintage text-xl font-bold text-[#2b1b11]">
                  ADD SOURCE-LINKED TEACHING
                  </h3>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="text-sm font-bold text-[#8b5a2b] hover:text-[#2b1b11]"
                >
                  ✕
                </button>
              </div>

              {savedSuccessMsg ? (
                <div className="my-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="mt-3 font-serif-vintage text-lg font-bold text-emerald-900">
                    Teaching Saved as Unverified
                  </h4>
                  <p className="mt-1 text-xs text-emerald-700">
                    Immediately available in the teaching library and for instant reel generation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveTeaching} className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-[#5e4331] mb-1">
                      Teaching / Quote *
                    </label>
                    <textarea
                      required
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                      placeholder="Enter a historical quotation..."
                      rows={3}
                      className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2.5 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#5e4331] mb-1">
                        Theme
                      </label>
                      <select
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value as any)}
                        className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                      >
                        {themes.filter(t => t !== 'All').map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#5e4331] mb-1">
                        Teaching Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Courage in Adversity"
                        className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#5e4331] mb-1">
                        Source
                      </label>
                      <input
                        type="text"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#5e4331] mb-1">
                        Volume
                      </label>
                      <input
                        type="text"
                        value={newVolume}
                        onChange={(e) => setNewVolume(e.target.value)}
                        className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#5e4331] mb-1">
                      Chapter / Section
                    </label>
                    <input
                      type="text"
                      value={newChapter}
                      onChange={(e) => setNewChapter(e.target.value)}
                      className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#5e4331] mb-1">
                      Direct source page URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                    />
                    <p className="mt-1 text-[11px] text-[#785942]">
                      New entries remain unverified until their wording and source are reviewed.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t border-[#dfccaF]">
                    <button
                      type="button"
                      onClick={() => setShowAdminModal(false)}
                      className="rounded-full px-5 py-2 text-xs font-semibold text-[#6e513a] hover:bg-[#ebdcc6]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-[#27190f] px-6 py-2 text-xs font-bold text-[#f7eedf] hover:bg-[#3d2718]"
                    >
                      [ SAVE AS UNVERIFIED ]
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
