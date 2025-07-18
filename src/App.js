import React, { useContext } from 'react';
import { AppContext } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import NotificationHandler from './components/common/NotificationHandler';

// Page Components
import Dashboard from './pages/Dashboard';
import TimesheetPage from './pages/TimesheetPage';
import ExpensePage from './pages/ExpensePage';
import JSAPage from './pages/JSAPage';
import ApprovalsPage from './pages/ApprovalsPage';
import ProjectControlPage from './pages/ProjectControlPage';
import SchedulePage from './pages/SchedulePage';
import SettingsPage from './pages/SettingsPage';
import JobDetailPage from './pages/JobDetailPage';
import InvoicingPage from './pages/InvoicingPage';
import MapPage from './pages/MapPage';
import DVIRPage from './pages/DVIRPage';
import UserManagementPage from './pages/UserManagementPage';
import FieldTicketPage from './pages/FieldTicketPage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import IncidentReportPage from './pages/IncidentReportPage';
import AssetRegistryPage from './pages/AssetRegistryPage';
import InventoryManagementPage from './pages/InventoryManagementPage';
import ReportingPage from './pages/ReportingPage';
import CrewManagementPage from './pages/CrewManagementPage';
import DailyDrillingReportPage from './pages/DailyDrillingReportPage';
import EquipmentInspectionPage from './pages/EquipmentInspectionPage';


const PageRouter = () => {
  const { page, pageData } = useContext(AppContext);
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'timesheet': return <TimesheetPage pageData={pageData} />;
    case 'expense': return <ExpensePage pageData={pageData} />;
    case 'jsa': return <JSAPage />;
    case 'dvir': return <DVIRPage />;
    case 'incident_report': return <IncidentReportPage />;
    case 'drilling_report': return <DailyDrillingReportPage />;
    case 'equipment_inspection': return <EquipmentInspectionPage />;
    case 'submissions': return <MySubmissionsPage />;
    case 'approvals': return <ApprovalsPage />;
    case 'projects': return <ProjectControlPage />;
    case 'job_detail': return <JobDetailPage jobId={pageData?.jobId} />;
    case 'map': return <MapPage />;
    case 'schedule': return <SchedulePage />;
    case 'crews': return <CrewManagementPage />;
    case 'field_tickets': return <FieldTicketPage />;
    case 'invoicing': return <InvoicingPage />;
    case 'users': return <UserManagementPage pageData={pageData} />;
    case 'assets': return <AssetRegistryPage />;
    case 'inventory': return <InventoryManagementPage />;
    case 'reporting': return <ReportingPage />;
    case 'settings': return <SettingsPage />;
    default: return <Dashboard />;
  }
};

export default function App() {
  const { user } = useContext(AppContext);

  return (
    <div className="bg-background text-text-primary font-sans transition-colors duration-300">
      {!user ? (
        <LoginPage />
      ) : (
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
              <PageRouter />
            </main>
          </div>
        </div>
      )}
      <NotificationHandler />
    </div>
  );
}
