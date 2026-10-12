import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Code2, 
  Calculator, 
  Timer, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Play, 
  Pause, 
  RotateCcw,
  BookOpen,
  Award
} from 'lucide-react';

// Interfaces
interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string;
}

interface CourseGrade {
  id: string;
  courseName: string;
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export default function UniDash() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assignments' | 'snippets' | 'gpa'>('dashboard');

  // --- Assignments State ---
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('unidash_assignments');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Systems Analysis & Design DFD Diagram', course: 'INS 204', dueDate: '2026-10-15', priority: 'High', status: 'In Progress' },
      { id: '2', title: 'React Component Lifecycle Assignment', course: 'ITF 212', dueDate: '2026-10-18', priority: 'Medium', status: 'Pending' }
    ];
  });
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // --- Snippets State ---
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const saved = localStorage.getItem('unidash_snippets');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Local Storage Custom Hook', language: 'TypeScript', code: 'function useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n  return [storedValue, setStoredValue] as const;\n}', tags: 'react, hooks' }
    ];
  });
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetLang, setSnippetLang] = useState('JavaScript');
  const [snippetCode, setSnippetCode] = useState('');
  const [snippetTags, setSnippetTags] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- GPA State ---
  const [grades, setGrades] = useState<CourseGrade[]>(() => {
    const saved = localStorage.getItem('unidash_grades');
    return saved ? JSON.parse(saved) : [
      { id: '1', courseName: 'Advanced Web Development', units: 3, grade: 'A' },
      { id: '2', courseName: 'Database Management Systems', units: 3, grade: 'B' }
    ];
  });
  const [courseName, setCourseName] = useState('');
  const [courseUnits, setCourseUnits] = useState(3);
  const [courseGrade, setCourseGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');

  // --- Pomodoro Timer State ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');

  // Save to LocalStorage
  useEffect(() => { localStorage.setItem('unidash_assignments', JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem('unidash_snippets', JSON.stringify(snippets)); }, [snippets]);
  useEffect(() => { localStorage.setItem('unidash_grades', JSON.stringify(grades)); }, [grades]);

  // Pomodoro Effect
  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert(timerMode === 'work' ? 'Pomodoro session finished! Take a break.' : 'Break ended! Back to coding.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, timerMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // GPA Calculation
  const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
  const calculateGPA = () => {
    let totalPoints = 0;
    let totalUnits = 0;
    grades.forEach(g => {
      totalPoints += (gradePoints[g.grade] || 0) * g.units;
      totalUnits += Number(g.units);
    });
    return totalUnits === 0 ? '0.00' : (totalPoints / totalUnits).toFixed(2);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">UniDash</h1>
            <p className="text-xs text-slate-400">Dev & Academic Hub</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'assignments', label: 'Assignments & Exams', icon: CheckSquare },
            { id: 'snippets', label: 'Code Snippets', icon: Code2 },
            { id: 'gpa', label: 'GPA Calculator', icon: Calculator },
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Powered by React & TypeScript
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, Developer! 🚀</h2>
                <p className="text-slate-400 text-sm">Here is a quick overview of your semester progress.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-medium">
                📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><CheckSquare className="w-6 h-6" /></div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Pending Tasks</p>
                  <h3 className="text-2xl font-bold">{assignments.filter(a => a.status !== 'Completed').length}</h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Code2 className="w-6 h-6" /></div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Saved Snippets</p>
                  <h3 className="text-2xl font-bold">{snippets.length}</h3>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl"><Award className="w-6 h-6" /></div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Current Semester GPA</p>
                  <h3 className="text-2xl font-bold">{calculateGPA()}</h3>
                </div>
              </div>
            </div>

            {/* Pomodoro Focus Widget */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between">
              <div className="space-y-2 mb-6 md:mb-0">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Timer className="w-5 h-5" />
                  <span className="font-semibold uppercase tracking-wider text-xs">Focus Timer</span>
                </div>
                <h3 className="text-xl font-bold">{timerMode === 'work' ? 'Deep Coding & Study Session' : 'Relaxation Break'}</h3>
                <p className="text-slate-400 text-sm">Stay locked in and build momentum without burnout.</p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl font-mono font-bold tracking-wider">{formatTime(timeLeft)}</div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-600/30"
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
                  </button>
                  <button 
                    onClick={() => { setIsRunning(false); setTimeLeft(timerMode === 'work' ? 25 * 60 : 5 * 60); }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Assignments & Exams Tracker</h2>
            
            {/* Add Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newTitle || !newCourse) return;
              setAssignments([...assignments, { id: Date.now().toString(), title: newTitle, course: newCourse, dueDate: newDueDate || '2026-12-31', priority: newPriority, status: 'Pending' }]);
              setNewTitle(''); setNewCourse(''); setNewDueDate('');
            }} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-5 gap-4">
              <input type="text" placeholder="Task title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 md:col-span-2" />
              <input type="text" placeholder="Course code (e.g. INS 204)" value={newCourse} onChange={e => setNewCourse(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-400" />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/30">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* List */}
            <div className="space-y-3">
              {assignments.map(a => (
                <div key={a.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input 
                      type="checkbox" 
                      checked={a.status === 'Completed'} 
                      onChange={() => setAssignments(assignments.map(item => item.id === a.id ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item))}
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500" 
                    />
                    <div>
                      <h4 className={`font-medium ${a.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>{a.title}</h4>
                      <p className="text-xs text-slate-400">{a.course} • Due: {a.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>{a.priority}</span>
                    <button onClick={() => setAssignments(assignments.filter(item => item.id !== a.id))} className="text-slate-500 hover:text-rose-400 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SNIPPETS TAB */}
        {activeTab === 'snippets' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Code Snippet Vault</h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input type="text" placeholder="Search snippets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            {/* Add Snippet Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!snippetTitle || !snippetCode) return;
              setSnippets([...snippets, { id: Date.now().toString(), title: snippetTitle, language: snippetLang, code: snippetCode, tags: snippetTags }]);
              setSnippetTitle(''); setSnippetCode(''); setSnippetTags('');
            }} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Snippet Title..." value={snippetTitle} onChange={e => setSnippetTitle(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
                <input type="text" placeholder="Tags (e.g. react, utils)" value={snippetTags} onChange={e => setSnippetTags(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <textarea placeholder="Paste your code here..." rows={4} value={snippetCode} onChange={e => setSnippetCode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-500" />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-indigo-600/30">Save Snippet</button>
            </form>

            {/* Snippet Cards */}
            <div className="grid grid-cols-1 gap-4">
              {snippets.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.tags.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-100">{s.title}</h4>
                      <span className="text-xs text-indigo-400 font-medium uppercase tracking-wider">{s.language}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => { navigator.clipboard.writeText(s.code); setCopiedId(s.id); setTimeout(() => setCopiedId(null), 2000); }} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition">
                        {copiedId === s.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setSnippets(snippets.filter(item => item.id !== s.id))} className="p-2 bg-slate-800 hover:bg-rose-500/20 rounded-xl text-slate-400 hover:text-rose-400 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800/60">
                    <code>{s.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GPA TAB */}
        {activeTab === 'gpa' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Semester GPA Calculator</h2>

            {/* Add Grade Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!courseName) return;
              setGrades([...grades, { id: Date.now().toString(), courseName, units: Number(courseUnits), grade: courseGrade }]);
              setCourseName('');
            }} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="Course Name..." value={courseName} onChange={e => setCourseName(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 md:col-span-2" />
              <select value={courseUnits} onChange={e => setCourseUnits(Number(e.target.value))} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-300">
                <option value={1}>1 Credit Unit</option>
                <option value={2}>2 Credit Units</option>
                <option value={3}>3 Credit Units</option>
                <option value={4}>4 Credit Units</option>
                <option value={6}>6 Credit Units</option>
              </select>
              <select value={courseGrade} onChange={e => setCourseGrade(e.target.value as any)} className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-300">
                <option value="A">A (5 points)</option>
                <option value="B">B (4 points)</option>
                <option value="C">C (3 points)</option>
                <option value="D">D (2 points)</option>
                <option value="E">E (1 point)</option>
                <option value="F">F (0 points)</option>
              </select>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl py-2.5 col-span-full md:col-span-4 transition shadow-lg shadow-indigo-600/30">Add Course Grade</button>
            </form>

            {/* Result Card */}
            <div className="bg-indigo-600/10 border border-indigo-500/30 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-indigo-400 font-medium text-sm">Calculated Semester Standing</p>
                <h3 className="text-3xl font-extrabold text-white">{calculateGPA()} <span className="text-sm font-normal text-slate-400">/ 5.00</span></h3>
              </div>
              <BookOpen className="w-10 h-10 text-indigo-400 opacity-60" />
            </div>

            {/* Grades Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                    <th className="p-4">Course Name</th>
                    <th className="p-4">Units</th>
                    <th className="p-4">Grade</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {grades.map(g => (
                    <tr key={g.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-medium">{g.courseName}</td>
                      <td className="p-4 text-slate-400">{g.units} Units</td>
                      <td className="p-4"><span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 font-bold rounded-lg">{g.grade}</span></td>
                      <td className="p-4 text-right">
                        <button onClick={() => setGrades(grades.filter(item => item.id !== g.id))} className="text-slate-500 hover:text-rose-400 transition"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}