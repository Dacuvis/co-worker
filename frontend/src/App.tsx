import { useEffect, useState } from "react";
import { Archive, Bell, Bot, CheckCircle2, ClipboardList, Clock3, KeyRound, LayoutGrid, Loader2, Menu, Search, Send, Settings, Sparkles, Trash2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import "./index.css";

type Task = { _id?: string; title: string; description: string; completed: boolean; archived?: boolean };
type HistoryItem = { _id?: string; message: string; response: string; owner?: string; createdAt: string; archived?: boolean };
type Theme = "pink" | "summer" | "cold" | "spring";

const API_URL = "http://localhost:3000";

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

async function apiRequest<T>(path: string, apiKey: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.body?.message ?? data?.message ?? "Permintaan gagal");
  return data?.body ?? data;
}

export function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("co-worker-api-key") ?? "");
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState("");
  const [taskContext, setTaskContext] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRecommendation, setSelectedRecommendation] = useState<HistoryItem | null>(null);
  const [activeView, setActiveView] = useState<"notes" | "history" | "archive" | "trash">("notes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingRecommendation, setEditingRecommendation] = useState<HistoryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editResponse, setEditResponse] = useState("");
  const [personalComposerOpen, setPersonalComposerOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("co-worker-theme") as Theme) || "pink");

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem("co-worker-theme", nextTheme);
  }

  async function loadWorkspace() {
    if (!apiKey) return;
    const [loadedTasks, loadedHistory] = await Promise.all([
      apiRequest<Task[]>("/tasks", apiKey),
      apiRequest<HistoryItem[]>("/recommendations/history?limit=6", apiKey),
    ]);
    setTasks(loadedTasks);
    setHistory(loadedHistory);
  }

  useEffect(() => {
    if (!apiKey) return;
    localStorage.setItem("co-worker-api-key", apiKey);
    loadWorkspace().catch((requestError: Error) => setError(requestError.message));
  }, [apiKey]);

  async function createTask() {
    if (!apiKey || !taskTitle.trim() || !taskDescription.trim()) {
      return setError("Isi judul, deskripsi, dan API key terlebih dahulu.");
    }
    setError("");
    try {
      await apiRequest("/tasks", apiKey, {
        method: "POST",
        body: JSON.stringify({ title: taskTitle, description: taskDescription, completed: taskCompleted }),
      });
      setTaskTitle("");
      setTaskDescription("");
      setTaskCompleted(false);
      await loadWorkspace();
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }

  async function toggleTask(task: Task) {
    if (!task._id) return;
    try {
      await apiRequest(`/tasks/${task._id}`, apiKey, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed }),
      });
      await loadWorkspace();
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }

  async function updateTask(task: Task, changes: Partial<Task>) {
    if (!task._id) return;
    try {
      await apiRequest(`/tasks/${task._id}`, apiKey, { method: "PATCH", body: JSON.stringify(changes) });
      await loadWorkspace();
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }

  async function deleteTask(task: Task) {
    if (!task._id) return;
    await updateTask(task, { archived: false });
    try {
      await apiRequest(`/tasks/${task._id}`, apiKey, { method: "DELETE" });
      await loadWorkspace();
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }

  async function updateRecommendation(item: HistoryItem, changes: Partial<HistoryItem>) {
    if (!item._id) return;
    try {
      await apiRequest(`/recommendations/history/${item._id}`, apiKey, { method: "PATCH", body: JSON.stringify(changes) });
      await loadWorkspace();
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }

  async function deleteRecommendation(item: HistoryItem) {
    if (!item._id) return;
    try {
      await apiRequest(`/recommendations/history/${item._id}`, apiKey, { method: "DELETE" });
      setSelectedRecommendation(null);
      await loadWorkspace();
    } catch (requestError) {
      setError((requestError as Error).message);
    }
  }

  async function saveEdit() {
    if (editingTask) {
      await updateTask(editingTask, { title: editTitle, description: editDescription });
      setEditingTask(null);
    }
    if (editingRecommendation) {
      await updateRecommendation(editingRecommendation, { response: editResponse });
      setEditingRecommendation(null);
    }
  }

  async function askRecommendation() {
    if (!apiKey || !message.trim()) return setError("Isi API key dan pesan terlebih dahulu.");
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ recommendation: string; historyId: string; createdAt: string }>("/recommendations/chat", apiKey, {
        method: "POST",
        body: JSON.stringify({ message, owner: owner || undefined, taskContext: taskContext || undefined }),
      });
      setRecommendation(result.recommendation);
      setMessage("");
      const updatedHistory = await apiRequest<HistoryItem[]>("/recommendations/history?limit=6", apiKey);
      setHistory(updatedHistory);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const matchingTasks = tasks.filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase()));
  const matchingHistory = history.filter((item) => `${item.message} ${item.response}`.toLowerCase().includes(search.toLowerCase()));
  const visibleTasks = activeView === "archive" ? matchingTasks.filter((task) => task.archived) : activeView === "notes" ? matchingTasks.filter((task) => !task.archived) : [];
  const visibleHistory = activeView === "archive" ? matchingHistory.filter((item) => item.archived) : activeView === "history" ? matchingHistory.filter((item) => !item.archived) : [];

  return (
    <motion.main data-theme={theme} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="theme-shell min-h-screen text-slate-800">
      <motion.header initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="theme-surface sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-slate-200 px-4 sm:px-6">
        <button type="button" aria-label="Ubah ukuran menu" onClick={() => { if (window.innerWidth < 768) { setSidebarOpen(!sidebarOpen); } else { setSidebarCollapsed(!sidebarCollapsed); } }} className="rounded-full p-2 hover:bg-slate-100"><Menu size={22} /></button>
        <div className="flex min-w-[120px] items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-yellow-300 to-pink-500 text-white"><Sparkles size={18} /></div><span className="text-xl font-medium">Co-Worker</span></div>
        <div className="flex max-w-xl flex-1 items-center gap-3 rounded-lg bg-slate-100 px-4 py-2.5"><Search size={19} className="text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Telusuri catatan" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" /></div>
        <div className="ml-auto flex items-center gap-1"><button type="button" aria-label="Pengingat" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><Bell size={20} /></button><button type="button" aria-label="Tampilan grid" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><LayoutGrid size={20} /></button><div className="relative"><button type="button" aria-label="Pengaturan" onClick={() => setSettingsOpen(!settingsOpen)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><Settings size={20} /></button><AnimatePresence>{settingsOpen && <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.16 }} className="theme-card absolute right-0 top-12 w-72 rounded-lg border border-slate-200 p-4 text-left shadow-lg"><p className="mb-1 text-sm font-semibold">Pengaturan</p><p className="mb-3 text-xs text-slate-500">API key dan tampilan workspace.</p><div className="mb-4 flex items-center gap-2"><KeyRound size={16} className="text-pink-500" /><Input aria-label="API key backend" type="password" placeholder="Masukkan API key" value={apiKey} onChange={(event) => setApiKey(event.target.value)} className="h-9" /></div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Theme</p><div className="grid grid-cols-2 gap-2">{(["pink", "summer", "cold", "spring"] as Theme[]).map((item) => <button type="button" key={item} onClick={() => changeTheme(item)} className={`rounded-md border px-3 py-2 text-left text-xs font-semibold capitalize transition ${theme === item ? "theme-choice-active" : "border-slate-200 hover:bg-slate-50"}`}><span className={`theme-dot theme-dot-${item}`} /> {item}</button>)}</div></motion.div>}</AnimatePresence></div></div>
      </motion.header>

      <div className="flex">
        <AnimatePresence initial={false}><motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: sidebarCollapsed ? 64 : 256, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }} className={`${sidebarOpen ? "fixed inset-y-[68px] left-0 z-30 translate-x-0 shadow-xl" : "pointer-events-none fixed inset-y-[68px] left-0 z-30 -translate-x-full md:pointer-events-auto md:static md:translate-x-0"} min-h-[calc(100vh-68px)] shrink-0 overflow-hidden border-r border-slate-100 bg-white px-2 py-5 transition-transform duration-200 md:sticky md:top-[68px] md:h-[calc(100vh-68px)] md:shadow-none`}><nav className="w-60 space-y-1 text-sm"><button title="Catatan" onClick={() => { setActiveView("notes"); setSidebarOpen(false); }} className={`flex w-full items-center gap-4 rounded-r-full px-4 py-3 font-medium ${activeView === "notes" ? "bg-yellow-100" : "hover:bg-slate-100"}`}><ClipboardList size={19} /><span className={sidebarCollapsed ? "hidden" : ""}>Catatan</span></button><button title="Riwayat AI" onClick={() => { setActiveView("history"); setSidebarOpen(false); }} className={`flex w-full items-center gap-4 rounded-r-full px-4 py-3 ${activeView === "history" ? "bg-yellow-100 font-medium" : "text-slate-600 hover:bg-slate-100"}`}><Clock3 size={19} /><span className={sidebarCollapsed ? "hidden" : ""}>Riwayat AI</span></button><button title="Arsipkan" onClick={() => { setActiveView("archive"); setSidebarOpen(false); }} className={`flex w-full items-center gap-4 rounded-r-full px-4 py-3 ${activeView === "archive" ? "bg-yellow-100 font-medium" : "text-slate-600 hover:bg-slate-100"}`}><Archive size={19} /><span className={sidebarCollapsed ? "hidden" : ""}>Arsipkan</span></button><button title="Sampah" onClick={() => { setActiveView("trash"); setSidebarOpen(false); }} className={`flex w-full items-center gap-4 rounded-r-full px-4 py-3 ${activeView === "trash" ? "bg-yellow-100 font-medium" : "text-slate-600 hover:bg-slate-100"}`}><Trash2 size={19} /><span className={sidebarCollapsed ? "hidden" : ""}>Sampah</span></button></nav></motion.aside></AnimatePresence>
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, duration: 0.4 }} className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Buat catatan..." className="min-h-12 resize-none border-0 p-1 shadow-none focus-visible:ring-0" /><div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3"><Input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Pemilik" className="h-9 max-w-[150px]" /><Input value={taskContext} onChange={(event) => setTaskContext(event.target.value)} placeholder="Konteks" className="h-9 max-w-[180px]" /><Button onClick={askRecommendation} disabled={loading} className="ml-auto bg-pink-500 text-white hover:bg-pink-600">{loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Bot className="mr-2" size={16} />} Tanya AI</Button></div></motion.div>
          <div className="mb-4 mt-10 flex items-center justify-between"><h2 className="text-sm font-medium text-slate-500">{activeView === "notes" ? "Catatan saya" : activeView === "history" ? "Riwayat AI" : activeView === "archive" ? "Arsipkan" : "Sampah"}</h2><span className="text-xs text-slate-400">{activeView === "history" ? `${visibleHistory.length} percakapan` : `${visibleTasks.length + visibleHistory.length} catatan`}</span></div>
          <AnimatePresence initial={false}>{activeView === "notes" && <motion.div layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">{!personalComposerOpen ? <button type="button" onClick={() => setPersonalComposerOpen(true)} className="flex min-h-14 w-full items-center px-4 text-left text-sm text-slate-400 hover:bg-slate-50"><ClipboardList size={17} className="mr-3 text-pink-500" /> Buat catatan pribadi...</button> : <div className="p-4"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold"><ClipboardList size={17} className="text-pink-500" /> Catatan pribadi</div><button type="button" onClick={() => setPersonalComposerOpen(false)} className="text-xs text-slate-400 hover:text-slate-700">Tutup</button></div><Input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Judul catatan" className="mb-3" /><Textarea value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} placeholder="Tulis isi catatan..." className="mb-3 min-h-20 resize-none" /><label className="mb-3 flex items-center gap-2 text-sm text-slate-500"><input type="checkbox" checked={taskCompleted} onChange={(event) => setTaskCompleted(event.target.checked)} /> Tandai selesai</label><div className="flex gap-2"><Button onClick={createTask} className="bg-slate-800 text-white hover:bg-slate-700">Simpan catatan</Button><Button variant="ghost" onClick={() => setPersonalComposerOpen(false)}>Batal</Button></div></div>}</motion.div>}</AnimatePresence>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">{visibleTasks.map((task, index) => <motion.div key={task._id ?? task.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -3 }}><Card className="mb-4 break-inside-avoid border-slate-200 bg-white shadow-sm"><CardContent className="p-5"><div className="flex gap-3"><button type="button" onClick={() => toggleTask(task)} aria-label={`Tandai ${task.title}`}><CheckCircle2 size={19} className={task.completed ? "text-emerald-500" : "text-slate-300"} /></button><div className="min-w-0 flex-1"><h3 className={task.completed ? "font-semibold text-slate-400 line-through" : "font-semibold"}>{task.title}</h3><p className="mt-2 text-sm text-slate-500">{task.description}</p><div className="mt-4 flex gap-3 text-xs text-slate-400"><button type="button" onClick={() => { setEditingTask(task); setEditTitle(task.title); setEditDescription(task.description); }} className="hover:text-pink-600">Edit</button><button type="button" onClick={() => updateTask(task, { archived: !task.archived })} className="hover:text-pink-600">{task.archived ? "Pulihkan" : "Arsipkan"}</button><button type="button" onClick={() => deleteTask(task)} className="hover:text-red-600">Hapus</button></div></div></div></CardContent></Card></motion.div>)}{!visibleTasks.length && activeView !== "history" && <p className="col-span-full py-8 text-center text-sm text-slate-400">Belum ada catatan task.</p>}</div>

          {(activeView === "notes" || activeView === "history" || activeView === "archive") && <div className="columns-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleHistory.map((item, index) => <motion.button key={item._id ?? item.createdAt} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -3 }} onClick={() => setSelectedRecommendation(item)} className="mb-4 block w-full break-inside-avoid text-left"><Card className="border-slate-200 bg-white shadow-sm transition hover:border-pink-300 hover:shadow-md"><CardContent className="p-5"><div className="mb-3 flex items-center gap-2 text-xs font-medium text-pink-600"><Bot size={15} /> Rekomendasi AI</div><p className="line-clamp-2 text-sm font-semibold">{item.message}</p><p className="mt-3 text-xs text-slate-400">{item.owner ? `Untuk ${item.owner} · ` : ""}{new Date(item.createdAt).toLocaleDateString("id-ID")}</p></CardContent></Card></motion.button>)}{!visibleHistory.length && activeView !== "notes" && <p className="col-span-full py-8 text-center text-sm text-slate-400">Belum ada rekomendasi AI.</p>}</div>}

          <AnimatePresence>{selectedRecommendation && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setSelectedRecommendation(null)}><motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} role="dialog" aria-modal="true" aria-labelledby="recommendation-title" className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 id="recommendation-title" className="font-semibold">{selectedRecommendation.owner ? `Untuk ${selectedRecommendation.owner}` : "Rekomendasi AI"}</h2><p className="text-xs text-slate-400">{new Date(selectedRecommendation.createdAt).toLocaleString("id-ID")}</p></div><button type="button" aria-label="Tutup detail" onClick={() => setSelectedRecommendation(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={19} /></button></div><div className="px-5 py-4"><p className="mb-5 text-sm font-medium text-slate-700">{selectedRecommendation.message}</p><MarkdownContent content={selectedRecommendation.response} /><div className="mt-6 flex gap-3 border-t border-slate-100 pt-4 text-sm"><button type="button" onClick={() => { setEditingRecommendation(selectedRecommendation); setEditResponse(selectedRecommendation.response); setSelectedRecommendation(null); }} className="text-slate-600 hover:text-pink-600">Edit</button><button type="button" onClick={() => updateRecommendation(selectedRecommendation, { archived: !selectedRecommendation.archived })} className="text-slate-600 hover:text-pink-600">{selectedRecommendation.archived ? "Pulihkan" : "Arsipkan"}</button><button type="button" onClick={() => deleteRecommendation(selectedRecommendation)} className="text-red-500 hover:text-red-700">Hapus</button></div></div></motion.div></motion.div>}</AnimatePresence>

          <AnimatePresence>{(editingTask || editingRecommendation) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><motion.div initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} role="dialog" aria-modal="true" className="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-semibold">Edit catatan</h2><button type="button" aria-label="Tutup edit" onClick={() => { setEditingTask(null); setEditingRecommendation(null); }} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={19} /></button></div>{editingTask ? <div className="mt-5 space-y-3"><Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} placeholder="Judul" /><Textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} placeholder="Deskripsi" /></div> : <Textarea value={editResponse} onChange={(event) => setEditResponse(event.target.value)} placeholder="Isi rekomendasi Markdown" className="mt-5 min-h-48" />}<Button onClick={saveEdit} className="mt-5 w-full bg-pink-500 text-white hover:bg-pink-600">Simpan perubahan</Button></motion.div></motion.div>}</AnimatePresence>
        </div></section>
      </div>
    </motion.main>
  );
}

export default App;
