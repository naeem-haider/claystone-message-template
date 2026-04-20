"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, Languages, Send, Edit3, Home } from "lucide-react";

const templates = [
  "Update Message",
  "Full Update Message",
  "Delivery Message",
  "Polish Message",
  "Generate From Scratch",
];

export default function MessageGenerator() {
  const router = useRouter();
  const [template, setTemplate] = useState("Update Message");
  const [clientName, setClientName] = useState("");
  const [url, setUrl] = useState("");
  const [senderName, setSenderName] = useState("");
  const [tasks, setTasks] = useState("1. ");
  const [pages, setPages] = useState("1. ");
  const [policies, setPolicies] = useState("1. ");
  const [apps, setApps] = useState("1. ");
  const [notes, setNotes] = useState("");
  const [draft, setDraft] = useState("");
  const [output, setOutput] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [translationCopied, setTranslationCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const outputRef = useRef(null);
  const showTaskFields = ["Update Message", "Full Update Message", "Delivery Message"].includes(template);
  const showDetailFields = ["Full Update Message", "Delivery Message"].includes(template);
  const showDraftField = ["Polish Message", "Generate From Scratch"].includes(template);

  useEffect(() => {
    if (!loading) return;
    setProgress(5);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 10 + 5);
        return next >= 98 ? 98 : next;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [loading]);

  const handleKeyDown = (e, setter, value) => {
    if (e.key === "Enter") {
      const lines = value.split("\n");
      const lastLine = lines[lines.length - 1];
      const match = lastLine.match(/^(\d+)\./);
      if (match) {
        e.preventDefault();
        const nextNum = parseInt(match[1], 10) + 1;
        setter(value + "\n" + nextNum + ". ");
      }
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setShowResult(false);
    setProgress(0);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          clientName,
          url,
          senderName,
          tasks,
          pages,
          policies,
          apps,
          notes,
          draft,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOutput(data.text || "");
        setTranslation(data.translation || "");
      } else {
        setOutput(`Error: ${data.error}`);
        setTranslation("");
      }
      setShowResult(true);
    } catch (error) {
      setOutput("Request failed. Check your connection.");
      setTranslation("");
      setShowResult(true);
    } finally {
      setProgress(100);
      setTimeout(() => setLoading(false), 250);
    }
  };

  const handleGenerateAgain = () => {
    setShowResult(false);
    setOutput("");
    setTranslation("");
    setClientName("");
    setUrl("");
    setSenderName("");
    setTasks("1. ");
    setPages("1. ");
    setPolicies("1. ");
    setApps("1. ");
    setNotes("");
    setDraft("");
    router.push("/generate");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const copyTranslationToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      setTranslationCopied(true);
      setTimeout(() => setTranslationCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const goHome = () => router.push("/");
  const focusOutput = () => outputRef.current?.focus();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto ">
        {/* <aside className="hidden lg:flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-black p-6 shadow-sm">
          <div>
            <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Navigation</div>
            <p className="mt-3 text-sm text-slate-600">Quick access to message generation.</p>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => router.push("/generate")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-900 px-5 py-4 text-left text-slate-50 shadow-sm hover:bg-slate-800 transition"
            >
              Generate Message
            </button>
          </nav>
        </aside> */}

        <main className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Generate Message</h1>
              <p className="mt-2 text-sm text-slate-500">Create a professional English message with Bangla translation.</p>
            </div>
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <Home size={18} /> Home
            </button>
          </div>

          {!showResult && (
            <div className="space-y-6 bg-white p-8 rounded-[32px] shadow-[0_30px_80px_rgba(15,23,42,0.08)] border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-linear-to-br from-blue-600 to-sky-500 rounded-2xl text-white">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Message Studio</h2>
                  <p className="text-sm text-slate-500 mt-1">Choose a template and fill the fields to generate a message.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.24em] text-slate-400">Select Message Template</label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="mt-3 w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {templates.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Client Name</span>
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. JDM Auto Glass"
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Sender Name</span>
                    <input
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Arafat"
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Website URL</span>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                {showTaskFields && (
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-700">Tasks Completed</label>
                    <textarea
                      value={tasks}
                      onKeyDown={(e) => handleKeyDown(e, setTasks, tasks)}
                      onChange={(e) => setTasks(e.target.value)}
                      rows={7}
                      placeholder="1. Task one..."
                      className="w-full p-4 bg-slate-50 rounded-3xl border border-slate-200 outline-none resize-none overflow-y-auto min-h-55 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}

                {showDetailFields && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Pages Created</span>
                        <textarea
                          value={pages}
                          onKeyDown={(e) => handleKeyDown(e, setPages, pages)}
                          onChange={(e) => setPages(e.target.value)}
                          rows={5}
                          placeholder="1. Home\n2. Services..."
                          className="w-full p-4 bg-slate-50 rounded-3xl border border-slate-200 outline-none resize-none overflow-y-auto min-h-45 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-slate-700">Policy Pages</span>
                          <textarea
                            value={policies}
                            onKeyDown={(e) => handleKeyDown(e, setPolicies, policies)}
                            onChange={(e) => setPolicies(e.target.value)}
                            rows={5}
                            placeholder="1. Privacy Policy\n2. Refund Policy..."
                            className="w-full p-4 bg-slate-50 rounded-3xl border border-slate-200 outline-none resize-none overflow-y-auto min-h-45 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-slate-700">Apps Integrated</span>
                          <textarea
                            value={apps}
                            onKeyDown={(e) => handleKeyDown(e, setApps, apps)}
                            onChange={(e) => setApps(e.target.value)}
                            rows={5}
                            placeholder="1. Live chatting\n2. Loyalty app..."
                            className="w-full p-4 bg-slate-50 rounded-3xl border border-slate-200 outline-none resize-none overflow-y-auto min-h-45 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {showDraftField && (
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-700">Draft Message</label>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={12}
                      placeholder="Paste or type the draft message here..."
                      className="w-full p-4 bg-slate-50 rounded-3xl border border-slate-200 outline-none resize-none overflow-y-auto min-h-60 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}

                {showTaskFields && (
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Write Notes</span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                      placeholder="Add any extra project notes..."
                      className="w-full p-4 bg-slate-50 rounded-3xl border border-slate-200 outline-none resize-none overflow-y-auto min-h-45 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 text-white rounded-3xl font-semibold hover:bg-blue-700 transition-all disabled:cursor-not-allowed disabled:bg-slate-300 flex items-center justify-center gap-3"
                >
                  {loading ? "Generating..." : <><Send size={18} /> Generate Message</>}
                </button>
              </div>
            </div>
          )}

          {showResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-[#0F172A] p-8 rounded-[32px] shadow-[0_30px_80px_rgba(15,23,42,0.15)] border border-slate-800">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-blue-300 font-mono text-xs uppercase tracking-[0.3em]">English Output</span>
                      <p className="text-slate-400 mt-2 text-sm">Editable generated message.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-200 hover:bg-slate-800 transition"
                      >
                        <motion.span animate={{ scale: copied ? 1.2 : 1 }} transition={{ duration: 0.18 }}>
                          {copied ? <Check className="text-emerald-400" /> : <Copy size={18} />}
                        </motion.span>
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={focusOutput}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-200 hover:bg-slate-800 transition"
                      >
                        <Edit3 size={18} /> Edit
                      </button>
                    </div>
                  </div>
                  <textarea
                    ref={outputRef}
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    rows={18}
                    className="w-full bg-transparent text-slate-100 outline-none border border-slate-800/60 rounded-[28px] p-5 resize-none overflow-y-auto min-h-105 font-sans text-sm leading-7 placeholder:text-slate-500"
                  />
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4 gap-3 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Languages size={18} />
                      <span className="text-xs font-bold uppercase tracking-[0.28em]">Bangla Translation</span>
                    </div>
                    <button
                      onClick={copyTranslationToClipboard}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 hover:bg-slate-100 transition"
                    >
                      <motion.span animate={{ scale: translationCopied ? 1.2 : 1 }} transition={{ duration: 0.18 }}>
                        {translationCopied ? <Check className="text-emerald-500" /> : <Copy size={18} />}
                      </motion.span>
                      <span>{translationCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <textarea
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    rows={18}
                    className="w-full bg-slate-50 text-slate-800 outline-none border border-slate-200 rounded-[28px] p-5 resize-none overflow-y-auto min-h-105 font-sans text-sm leading-7"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-slate-500 text-sm">You can regenerate a new message or adjust the content above before copying.</div>
                <button
                  onClick={handleGenerateAgain}
                  className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-4 text-white font-semibold shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition"
                >
                  Generate Again
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl rounded-[32px] border border-slate-700 bg-slate-900/95 p-8 text-center shadow-2xl shadow-slate-950/40">
            <div className="mb-6 text-slate-100 text-xl font-semibold">Generating your message...</div>
            <div className="relative h-4 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-blue-500 to-cyan-400"
              />
            </div>
            <div className="mt-4 text-slate-300">Progress: {Math.min(progress, 99)}%</div>
            <div className="mt-4 text-sm text-slate-500">Please keep this window open while the AI finishes generating your message.</div>
          </div>
        </div>
      )}
    </div>
  );
}
