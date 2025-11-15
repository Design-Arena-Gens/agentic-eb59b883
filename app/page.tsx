'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Brain,
  Heart,
  Target,
  TrendingUp,
  Calendar,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  Moon,
  Sun,
  Droplets,
  Footprints,
  Apple,
  Clock,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'work' | 'personal' | 'health';
  createdAt: Date;
}

interface HealthLog {
  date: string;
  sleep: number;
  water: number;
  exercise: number;
  mood: number;
  steps: number;
}

interface ProductivityLog {
  date: string;
  focusTime: number;
  tasksCompleted: number;
  energy: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'health' | 'ai'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [taskCategory, setTaskCategory] = useState<'work' | 'personal' | 'health'>('work');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Health tracking state
  const [todayHealth, setTodayHealth] = useState({
    sleep: 7,
    water: 4,
    exercise: 30,
    mood: 7,
    steps: 5000
  });

  const [healthHistory, setHealthHistory] = useState<HealthLog[]>([]);
  const [productivityHistory, setProductivityHistory] = useState<ProductivityLog[]>([]);

  // Initialize data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedHealth = localStorage.getItem('healthHistory');
    const savedProductivity = localStorage.getItem('productivityHistory');
    const savedTodayHealth = localStorage.getItem('todayHealth');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHealth) setHealthHistory(JSON.parse(savedHealth));
    if (savedProductivity) setProductivityHistory(JSON.parse(savedProductivity));
    if (savedTodayHealth) setTodayHealth(JSON.parse(savedTodayHealth));

    // Initialize with sample data if empty
    if (!savedHealth || JSON.parse(savedHealth).length === 0) {
      const sampleHealth = Array.from({ length: 7 }, (_, i) => ({
        date: format(subDays(new Date(), 6 - i), 'MMM dd'),
        sleep: Math.floor(Math.random() * 3) + 6,
        water: Math.floor(Math.random() * 4) + 4,
        exercise: Math.floor(Math.random() * 40) + 20,
        mood: Math.floor(Math.random() * 4) + 6,
        steps: Math.floor(Math.random() * 5000) + 5000
      }));
      setHealthHistory(sampleHealth);
      localStorage.setItem('healthHistory', JSON.stringify(sampleHealth));
    }

    if (!savedProductivity || JSON.parse(savedProductivity).length === 0) {
      const sampleProductivity = Array.from({ length: 7 }, (_, i) => ({
        date: format(subDays(new Date(), 6 - i), 'MMM dd'),
        focusTime: Math.floor(Math.random() * 4) + 3,
        tasksCompleted: Math.floor(Math.random() * 8) + 3,
        energy: Math.floor(Math.random() * 4) + 6
      }));
      setProductivityHistory(sampleProductivity);
      localStorage.setItem('productivityHistory', JSON.stringify(sampleProductivity));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Save health data
  useEffect(() => {
    localStorage.setItem('todayHealth', JSON.stringify(todayHealth));
  }, [todayHealth]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        category: taskCategory,
        createdAt: new Date()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateHealthMetric = (metric: keyof typeof todayHealth, value: number) => {
    setTodayHealth(prev => ({ ...prev, [metric]: value }));
  };

  const saveHealthLog = () => {
    const newLog: HealthLog = {
      date: format(new Date(), 'MMM dd'),
      ...todayHealth
    };
    const updatedHistory = [...healthHistory.slice(-6), newLog];
    setHealthHistory(updatedHistory);
    localStorage.setItem('healthHistory', JSON.stringify(updatedHistory));
  };

  const getAiInsights = async () => {
    setIsAiLoading(true);

    // Simulate AI response with personalized insights
    await new Promise(resolve => setTimeout(resolve, 1500));

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(0) : '0';
    const avgSleep = healthHistory.length > 0
      ? (healthHistory.reduce((acc, h) => acc + h.sleep, 0) / healthHistory.length).toFixed(1)
      : todayHealth.sleep.toString();
    const avgMood = healthHistory.length > 0
      ? (healthHistory.reduce((acc, h) => acc + h.mood, 0) / healthHistory.length).toFixed(1)
      : todayHealth.mood.toString();

    let response = '';

    if (aiPrompt.toLowerCase().includes('productivity') || aiPrompt.toLowerCase().includes('task')) {
      response = `Based on your data, you have a ${completionRate}% task completion rate. `;
      if (parseInt(completionRate) < 50) {
        response += "Consider breaking tasks into smaller chunks and using the Pomodoro technique (25min focus + 5min break). Try tackling your most important task first thing in the morning when energy is highest.";
      } else {
        response += "Great job! To maintain momentum, try time-blocking your day and batch similar tasks together.";
      }
    } else if (aiPrompt.toLowerCase().includes('sleep') || aiPrompt.toLowerCase().includes('tired')) {
      response = `Your average sleep is ${avgSleep} hours. `;
      if (parseFloat(avgSleep) < 7) {
        response += "You're under the recommended 7-9 hours. Try: setting a consistent bedtime, avoiding screens 1hr before bed, keeping your room cool (65-68°F), and establishing a relaxing pre-sleep routine.";
      } else {
        response += "You're getting good sleep! Maintain your routine and consider tracking sleep quality factors like room temperature and caffeine timing.";
      }
    } else if (aiPrompt.toLowerCase().includes('mood') || aiPrompt.toLowerCase().includes('stress')) {
      response = `Your average mood score is ${avgMood}/10. `;
      response += "To boost mood: get 20min morning sunlight, move for 30min daily, practice gratitude journaling, maintain social connections, and consider meditation or deep breathing exercises.";
    } else if (aiPrompt.toLowerCase().includes('exercise') || aiPrompt.toLowerCase().includes('workout')) {
      const avgExercise = healthHistory.length > 0
        ? (healthHistory.reduce((acc, h) => acc + h.exercise, 0) / healthHistory.length).toFixed(0)
        : todayHealth.exercise.toString();
      response = `You're averaging ${avgExercise} minutes of exercise. `;
      if (parseInt(avgExercise) < 30) {
        response += "Aim for 150min/week of moderate activity. Start small: 10min walks after meals, take stairs, do desk stretches. Build gradually to avoid burnout.";
      } else {
        response += "Excellent! Mix cardio, strength, and flexibility work. Remember rest days are crucial for recovery.";
      }
    } else {
      response = `Overall Analysis:\n\n`;
      response += `📊 Productivity: ${completionRate}% task completion\n`;
      response += `😴 Sleep: ${avgSleep}hrs average\n`;
      response += `😊 Mood: ${avgMood}/10 average\n\n`;
      response += `Top Recommendations:\n`;
      response += `1. ${parseFloat(avgSleep) < 7 ? 'Prioritize sleep - aim for 7-9 hours' : 'Maintain your sleep schedule'}\n`;
      response += `2. ${parseInt(completionRate) < 60 ? 'Break tasks into smaller steps' : 'Great task management!'}\n`;
      response += `3. Schedule exercise as non-negotiable appointments\n`;
      response += `4. Track energy levels to identify peak performance times\n`;
      response += `5. Practice stress management daily (meditation, journaling, walks)`;
    }

    setAiResponse(response);
    setIsAiLoading(false);
  };

  const radarData = [
    { metric: 'Sleep', value: (todayHealth.sleep / 10) * 100 },
    { metric: 'Hydration', value: (todayHealth.water / 12) * 100 },
    { metric: 'Exercise', value: (todayHealth.exercise / 60) * 100 },
    { metric: 'Mood', value: todayHealth.mood * 10 },
    { metric: 'Activity', value: (todayHealth.steps / 10000) * 100 }
  ];

  const completedToday = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedToday / tasks.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Sparkles className="text-purple-600" size={40} />
            Wellness & Productivity Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Your intelligent companion for a balanced, productive life</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'tasks', icon: CheckCircle2, label: 'Tasks' },
            { id: 'health', icon: Heart, label: 'Health' },
            { id: 'ai', icon: Brain, label: 'AI Coach' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Target className="text-blue-600" size={28} />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Task Completion</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Moon className="text-purple-600" size={28} />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{todayHealth.sleep}h</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Sleep Tonight</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Droplets className="text-cyan-600" size={28} />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{todayHealth.water}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Glasses of Water</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Footprints className="text-green-600" size={28} />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{(todayHealth.steps / 1000).toFixed(1)}k</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Steps Today</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="text-purple-600" />
                  Health Trends (7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} name="Sleep (hrs)" />
                    <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} name="Mood" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" />
                  Wellness Balance
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Today" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Productivity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-green-600" />
                Productivity Metrics
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productivityHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="focusTime" fill="#3b82f6" name="Focus Hours" />
                  <Bar dataKey="tasksCompleted" fill="#10b981" name="Tasks Done" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="text-purple-600" />
                Task Manager
              </h2>

              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 outline-none"
                />
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 outline-none"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                </select>
                <button
                  onClick={addTask}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks yet. Add one to get started!</p>
                ) : (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border ${
                        task.completed
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="text-green-600" size={24} />
                        ) : (
                          <Circle className="text-gray-400" size={24} />
                        )}
                      </button>
                      <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                        {task.text}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.category === 'work' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        task.category === 'personal' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {task.category}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Heart className="text-red-600" />
                Health Tracker
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
                    <Moon className="text-purple-600" />
                    Sleep (hours)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={todayHealth.sleep}
                    onChange={(e) => updateHealthMetric('sleep', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-purple-600 mt-2">{todayHealth.sleep}h</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
                    <Droplets className="text-cyan-600" />
                    Water (glasses)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={todayHealth.water}
                    onChange={(e) => updateHealthMetric('water', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-cyan-600 mt-2">{todayHealth.water} glasses</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
                    <Activity className="text-green-600" />
                    Exercise (minutes)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={todayHealth.exercise}
                    onChange={(e) => updateHealthMetric('exercise', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-green-600 mt-2">{todayHealth.exercise} min</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
                    <Sun className="text-yellow-600" />
                    Mood (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={todayHealth.mood}
                    onChange={(e) => updateHealthMetric('mood', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-yellow-600 mt-2">{todayHealth.mood}/10</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-900 dark:text-white font-medium mb-2">
                    <Footprints className="text-blue-600" />
                    Steps
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={todayHealth.steps}
                    onChange={(e) => updateHealthMetric('steps', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-2xl font-bold text-blue-600 mt-2">{todayHealth.steps.toLocaleString()}</div>
                </div>
              </div>

              <button
                onClick={saveHealthLog}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
              >
                Save Today's Health Data
              </button>
            </div>
          </div>
        )}

        {/* AI Coach Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain className="text-purple-600" />
                AI Wellness Coach
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ask about productivity tips, health advice, or get personalized insights based on your data.
              </p>

              <div className="space-y-4">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask me anything... e.g., 'How can I improve my sleep?' or 'Give me productivity tips' or 'Analyze my overall wellness'"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 outline-none min-h-[100px]"
                />

                <button
                  onClick={getAiInsights}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Get AI Insights
                    </>
                  )}
                </button>

                {aiResponse && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Brain className="text-purple-600" />
                      AI Coach Response:
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{aiResponse}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setAiPrompt('How can I improve my productivity?');
                    setTimeout(getAiInsights, 100);
                  }}
                  className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-left"
                >
                  <p className="font-medium text-gray-900 dark:text-white">💼 Productivity Tips</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Get personalized productivity advice</p>
                </button>

                <button
                  onClick={() => {
                    setAiPrompt('How can I improve my sleep quality?');
                    setTimeout(getAiInsights, 100);
                  }}
                  className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-left"
                >
                  <p className="font-medium text-gray-900 dark:text-white">😴 Sleep Better</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Improve your sleep quality</p>
                </button>

                <button
                  onClick={() => {
                    setAiPrompt('Give me an overall wellness analysis');
                    setTimeout(getAiInsights, 100);
                  }}
                  className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-left"
                >
                  <p className="font-medium text-gray-900 dark:text-white">📊 Overall Analysis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Get a complete wellness overview</p>
                </button>

                <button
                  onClick={() => {
                    setAiPrompt('What exercise routine should I follow?');
                    setTimeout(getAiInsights, 100);
                  }}
                  className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-left"
                >
                  <p className="font-medium text-gray-900 dark:text-white">💪 Exercise Plan</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Design your workout routine</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
