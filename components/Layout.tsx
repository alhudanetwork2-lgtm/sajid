import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, BookOpen, GraduationCap, Users, 
  Settings, LogOut, MessageSquare, Bell, Menu, X,
  Video, FileText, Activity, DollarSign
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, currentUser, onLogout, currentView, onNavigate 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = (role: UserRole) => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'messages', label: 'Chat & AI', icon: MessageSquare },
      { id: 'profile', label: 'Profile', icon: Settings },
    ];

    switch (role) {
      case UserRole.STUDENT:
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'live-class', label: 'Live Class', icon: Video },
          { id: 'results', label: 'Results', icon: Activity },
          ...common.slice(1)
        ];
      case UserRole.TEACHER:
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'courses', label: 'Manage Courses', icon: BookOpen },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'grading', label: 'Grading', icon: FileText },
          { id: 'live-class', label: 'Start Class', icon: Video },
          ...common.slice(1)
        ];
      case UserRole.PARENT:
        return [
          { id: 'dashboard', label: 'Child Progress', icon: Activity },
          { id: 'attendance', label: 'Attendance', icon: Users },
          { id: 'fees', label: 'Fees', icon: DollarSign },
          ...common.slice(1)
        ];
      case UserRole.ADMIN:
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'users', label: 'Manage Users', icon: Users },
          { id: 'courses', label: 'All Courses', icon: BookOpen },
          { id: 'reports', label: 'Reports', icon: Activity },
          { id: 'fees', label: 'Fee System', icon: DollarSign },
          ...common.slice(1)
        ];
      default:
        return common;
    }
  };

  const navItems = getNavItems(currentUser.role);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">Lumina LMS</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <img src={currentUser.avatar} alt="Profile" className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <span className="ml-3 font-bold text-gray-800">Lumina</span>
          </div>
          
          <div className="hidden md:block font-semibold text-lg text-gray-800 capitalize">
            {navItems.find(i => i.id === currentView)?.label || 'Dashboard'}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-in slide-in-from-left duration-200">
              <div className="p-4 flex items-center justify-between border-b">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      currentView === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="h-px bg-gray-100 my-4"></div>
                <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-8 no-scrollbar relative">
          {children}
        </main>
      </div>
    </div>
  );
};
