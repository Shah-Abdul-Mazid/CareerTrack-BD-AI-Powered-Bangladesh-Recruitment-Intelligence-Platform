import React, { useState, useEffect } from 'react';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { ResumePage } from './pages/ResumePage';
import { CompaniesPage } from './pages/CompaniesPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { CalendarPage } from './pages/CalendarPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AdmitCardPage } from './pages/AdmitCardPage';
import { SeatPlanPage } from './pages/SeatPlanPage';
import { AssistantPage } from './pages/AssistantPage';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { ApplicationModal } from './components/applications/ApplicationModal';
import { api } from './services/api';
import { ApplicationCreatePayload, DashboardStats } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavItemKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isGlobalCreateOpen, setIsGlobalCreateOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [pendingSeatPlanCount, setPendingSeatPlanCount] = useState<number>(0);
  const [realAdmitCount, setRealAdmitCount] = useState<number>(0);
  const [realSubmittedCount, setRealSubmittedCount] = useState<number>(0);

  const fetchGlobalStats = async () => {
    try {
      const stats = await api.getDashboardStats();
      setDashboardStats(stats);
      setIsBackendConnected(true);

      const appRes = await api.getApplications({ page_size: 100 });
      const apps = appRes.items || [];
      const pending = apps.filter(
        a => (a.status === 'Admit Available' || a.admit_card_available) && a.seat_plan_status === 'Pending'
      ).length;
      setPendingSeatPlanCount(pending);

      // Count ONLY actual Admit Available applications (strictly excluding Submitted applications)
      const admits = apps.filter(
        a => a.status === 'Admit Available' || a.status === 'Admit Card Available'
      ).length;
      setRealAdmitCount(admits);

      const subs = apps.filter(
        a => a.status === 'Submitted' || a.status === 'Applied' || a.status === 'Draft' || !a.roll_number || a.roll_number === 'Awaiting'
      ).length;
      setRealSubmittedCount(subs);
    } catch {
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
    const interval = setInterval(fetchGlobalStats, 8000);
    window.addEventListener('application-created', fetchGlobalStats);
    window.addEventListener('application-updated', fetchGlobalStats);
    return () => {
      clearInterval(interval);
      window.removeEventListener('application-created', fetchGlobalStats);
      window.removeEventListener('application-updated', fetchGlobalStats);
    };
  }, []);

  const handleGlobalCreate = async (payload: ApplicationCreatePayload) => {
    await api.createApplication(payload);
    setIsGlobalCreateOpen(false);
    setCurrentTab('applications');
    window.dispatchEvent(new CustomEvent('application-created'));
  };

  const pageTitles: Record<NavItemKey, string> = {
    dashboard: 'Dashboard',
    resume: 'Resume Profile',
    applications: 'Applications Board',
    companies: 'Companies & Orgs',
    interviews: 'Interviews & Exams',
    calendar: 'Exam Calendar',
    'app-upload': 'Submit PDF Upload',
    'admit-upload': 'Admit Card Upload',
    'seatplan-upload': 'Seat Plan & Schedule',
    documents: 'Document Intelligence',
    assistant: 'AI Recruitment Coach',
    notifications: 'Notifications',
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar (Desktop permanent + Mobile drawer) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'notifications') {
            setIsNotificationsOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        submittedCount={realSubmittedCount || (dashboardStats?.submitted_count ?? 0)}
        admitCount={realAdmitCount}
        pendingSeatPlanCount={pendingSeatPlanCount}
        totalApplicationsCount={dashboardStats?.total_applications ?? 0}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 min-h-screen w-full transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[240px]'
        }`}
      >
        <Header
          pageTitle={pageTitles[currentTab]}
          onNewApplication={() => setIsGlobalCreateOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isBackendConnected={isBackendConnected}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto page-enter pb-24 md:pb-8" style={{ background: 'var(--bg-base)' }}>
          <div className="p-3.5 sm:p-5 lg:p-6 max-w-screen-2xl mx-auto">
            {currentTab === 'dashboard' && (
              <Dashboard
                onNavigateToApplications={() => setCurrentTab('applications')}
                onOpenNewApplication={() => setIsGlobalCreateOpen(true)}
              />
            )}
            {currentTab === 'resume' && <ResumePage />}
            {currentTab === 'applications' && (
              <Applications
                isCreateModalOpen={isGlobalCreateOpen}
                setIsCreateModalOpen={setIsGlobalCreateOpen}
              />
            )}
            {currentTab === 'companies' && <CompaniesPage />}
            {currentTab === 'interviews' && <InterviewsPage />}
            {currentTab === 'calendar' && <CalendarPage />}
            {currentTab === 'admit-upload' && <AdmitCardPage />}
            {currentTab === 'seatplan-upload' && <SeatPlanPage />}
            {(currentTab === 'app-upload' || currentTab === 'documents') && <DocumentsPage />}
            {currentTab === 'assistant' && <AssistantPage />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< lg only) */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'notifications') {
            setIsNotificationsOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        totalApplicationsCount={dashboardStats?.total_applications ?? 0}
        submittedCount={realSubmittedCount}
        admitCount={realAdmitCount}
        pendingSeatPlanCount={pendingSeatPlanCount}
      />

      {/* Modals */}
      <ApplicationModal
        isOpen={isGlobalCreateOpen}
        onClose={() => setIsGlobalCreateOpen(false)}
        onSubmit={handleGlobalCreate}
        mode="create"
      />
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}

export default App;
