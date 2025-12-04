import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { UserRole, User, Course, Assignment } from './types';
import { MOCK_USERS, MOCK_COURSES, MOCK_ASSIGNMENTS } from './services/mockData';
import { LiveClass } from './components/LiveClass';
import { AIChat } from './components/AIChat';
import { QuizModal } from './components/QuizModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { BookOpen, Calendar, Clock, Award, TrendingUp, CheckCircle, Video, Upload, Download, Trash2, Edit } from 'lucide-react';

// --- Login Screen Component ---
const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Lumina LMS</h1>
          <p className="text-gray-500 mt-2">Select a role to explore the platform</p>
        </div>
        
        <div className="space-y-4">
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => onLogin(user)}
              className="w-full p-4 flex items-center space-x-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
              <div className="text-left flex-1">
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700">{user.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{user.role}</p>
              </div>
              <div className="text-gray-400 group-hover:text-indigo-500">→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLiveClassActive, setIsLiveClassActive] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  
  // App State (Simple Store)
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);

  if (!user) {
    return <LoginScreen onLogin={(u) => { setUser(u); setCurrentView('dashboard'); }} />;
  }

  // --- Helpers ---
  const handleLogout = () => {
    setUser(null);
    setIsLiveClassActive(false);
  };

  // --- Role Based View Rendering ---

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.STUDENT:
        return <StudentDashboard onStartQuiz={() => setIsQuizModalOpen(true)} onJoinClass={() => setIsLiveClassActive(true)} courses={courses} assignments={assignments} />;
      case UserRole.TEACHER:
        return <TeacherDashboard onStartClass={() => setIsLiveClassActive(true)} courses={courses} assignments={assignments} />;
      case UserRole.PARENT:
        return <ParentDashboard />;
      case UserRole.ADMIN:
        return <AdminDashboard courses={courses} setCourses={setCourses} />;
      default:
        return <div>Unknown Role</div>;
    }
  };

  const renderContent = () => {
    if (currentView === 'dashboard') return renderDashboard();
    
    // Generic Fallback views for demo
    if (currentView === 'messages') return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Messages & AI Tutor</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><AIChat /></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
            <h3 className="font-semibold mb-4">Direct Messages</h3>
            <div className="space-y-4">
               {MOCK_USERS.filter(u => u.id !== user.id).map(u => (
                 <div key={u.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                   <img src={u.avatar} className="w-10 h-10 rounded-full" />
                   <div>
                     <p className="text-sm font-medium">{u.name}</p>
                     <p className="text-xs text-gray-500">Click to chat</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    );
    
    if (currentView === 'courses' && user.role === UserRole.STUDENT) return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition">
              <img src={course.thumbnail} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${course.progress}%`}}></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{course.progress}% Complete</span>
                  <span>{course.lessons} Lessons</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100">Resume</button>
                  <button className="p-2 text-gray-400 hover:text-gray-600"><Download className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Award className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold">Under Construction</h2>
        <p>The "{currentView}" module is coming soon.</p>
      </div>
    );
  };

  return (
    <>
      {isLiveClassActive ? (
        <LiveClass user={user} onEndCall={() => setIsLiveClassActive(false)} />
      ) : (
        <Layout 
          currentUser={user} 
          onLogout={handleLogout}
          currentView={currentView}
          onNavigate={setCurrentView}
        >
          {renderContent()}
          <QuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />
        </Layout>
      )}
    </>
  );
};

// --- Sub-Dashboards ---

const StudentDashboard = ({ onStartQuiz, onJoinClass, courses, assignments }: any) => {
  const data = [
    { name: 'Mon', hours: 2 }, { name: 'Tue', hours: 4 }, { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 5 }, { name: 'Fri', hours: 2 }, { name: 'Sat', hours: 1 }, { name: 'Sun', hours: 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Courses in Progress" value="4" icon={BookOpen} color="bg-blue-500" />
        <StatCard title="Avg. Grade" value="A-" icon={Award} color="bg-green-500" />
        <StatCard title="Assignments Pending" value="2" icon={Clock} color="bg-orange-500" />
        <StatCard title="Attendance" value="95%" icon={CheckCircle} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
             <h2 className="text-2xl font-bold mb-2">Ready to learn, Alex?</h2>
             <p className="opacity-90 mb-6">You have a Physics Live Class starting in 15 minutes.</p>
             <div className="flex flex-wrap gap-3">
               <button onClick={onJoinClass} className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold flex items-center shadow hover:bg-gray-100">
                 <Video className="w-4 h-4 mr-2" /> Join Live Class
               </button>
               <button onClick={onStartQuiz} className="bg-indigo-500/50 text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-indigo-500/70 backdrop-blur-sm">
                 <Award className="w-4 h-4 mr-2" /> Take AI Quiz
               </button>
             </div>
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-lg mb-4">Due Assignments</h3>
            <div className="space-y-3">
              {assignments.map((a: Assignment) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                     <div className={`w-2 h-10 rounded-full ${a.status === 'PENDING' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                     <div>
                       <p className="font-semibold text-gray-800">{a.title}</p>
                       <p className="text-xs text-gray-500">Due: {a.dueDate}</p>
                     </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    a.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Analytics */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-lg mb-4">Study Hours</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Tutor Promo */}
          <div className="bg-indigo-900 rounded-xl p-6 text-white text-center">
            <div className="w-12 h-12 bg-indigo-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm opacity-80 mb-4">Ask the Gemini-powered AI Tutor for instant explanations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = ({ onStartClass, courses }: any) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Teacher Overview</h1>
           <p className="text-gray-500">Manage your courses and students</p>
        </div>
        <button onClick={onStartClass} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 flex items-center shadow-lg hover:shadow-xl transition">
          <Video className="w-5 h-5 mr-2" /> Start Live Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border col-span-2">
          <h3 className="font-bold text-lg mb-4">My Courses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="py-2">Course Name</th>
                  <th className="py-2">Students</th>
                  <th className="py-2">Rating</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 3).map((c: Course) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium">{c.title}</td>
                    <td className="py-3 text-gray-600">{Math.floor(Math.random() * 50) + 20}</td>
                    <td className="py-3 text-yellow-600 font-bold">4.8</td>
                    <td className="py-3">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-lg mb-4">Pending Grading</h3>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                 <div>
                   <p className="font-medium text-sm">Physics Lab Report</p>
                   <p className="text-xs text-gray-500">Submitted by Alex</p>
                 </div>
                 <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Grade</button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ParentDashboard = () => {
  const data = [
    { name: 'Week 1', score: 85 }, { name: 'Week 2', score: 88 }, 
    { name: 'Week 3', score: 92 }, { name: 'Week 4', score: 90 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="https://picsum.photos/200" className="w-16 h-16 rounded-full border-2 border-indigo-100" />
          <div>
            <h2 className="text-xl font-bold">Alex Student's Progress</h2>
            <p className="text-gray-500">Grade 11 • Science Stream</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Overall GPA</p>
          <p className="text-2xl font-bold text-green-600">3.8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-lg mb-4">Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
             <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Submitted "Calculus Homework" (Score: 95/100)</span>
             </div>
             <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>Absent for "History" on Oct 12th</span>
             </div>
             <div className="flex items-center space-x-3 text-sm">
                <Award className="w-5 h-5 text-indigo-500" />
                <span>Earned "Top of Class" badge in Physics</span>
             </div>
          </div>
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-bold text-gray-800 mb-2">Fee Status</h4>
            <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-200">
               <span className="text-green-800 font-medium">Tuition Paid</span>
               <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ courses, setCourses }: any) => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Students" value="1,234" icon={Users} color="bg-indigo-500" />
        <StatCard title="Active Courses" value={courses.length.toString()} icon={BookOpen} color="bg-pink-500" />
        <StatCard title="Revenue (MTD)" value="$45,200" icon={TrendingUp} color="bg-green-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex border-b">
           <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-medium ${activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>User Management</button>
           <button onClick={() => setActiveTab('content')} className={`px-6 py-3 font-medium ${activeTab === 'content' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Content Approval</button>
        </div>
        
        <div className="p-6">
          {activeTab === 'users' && (
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50 text-gray-500 text-sm">
                     <th className="p-3 rounded-l-lg">User</th>
                     <th className="p-3">Role</th>
                     <th className="p-3">Status</th>
                     <th className="p-3 rounded-r-lg">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {MOCK_USERS.map(u => (
                     <tr key={u.id}>
                       <td className="p-3 flex items-center space-x-3">
                         <img src={u.avatar} className="w-8 h-8 rounded-full" />
                         <span>{u.name}</span>
                       </td>
                       <td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase">{u.role}</span></td>
                       <td className="p-3"><span className="text-green-600 text-sm font-medium">Active</span></td>
                       <td className="p-3">
                         <button className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                         <button className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
          
          {activeTab === 'content' && (
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center space-x-4">
                     <div className="bg-yellow-100 p-2 rounded text-yellow-600"><Upload className="w-5 h-5" /></div>
                     <div>
                       <p className="font-semibold text-gray-800">New Course: Introduction to AI</p>
                       <p className="text-sm text-gray-500">Submitted by Sarah Teacher</p>
                     </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Approve</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Reject</button>
                  </div>
               </div>
               <p className="text-center text-gray-500 text-sm py-4">No other pending content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Generic UI ---

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between hover:shadow-md transition">
    <div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

// Used for icon references in AdminDashboard
import { Users } from 'lucide-react';

export default App;
