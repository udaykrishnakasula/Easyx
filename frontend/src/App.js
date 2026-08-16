import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Hero from "@/components/landing/Hero";
import Sections from "@/components/landing/Sections";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import DashboardLayout from "@/features/dashboard/DashboardLayout";
import DashboardHome from "@/features/dashboard/DashboardHome";
import InvestmentsPage from "@/features/investments/InvestmentsPage";
import WalletPage from "@/features/wallet/WalletPage";
import TransactionsPage from "@/features/transactions/TransactionsPage";
import ProfilePage from "@/features/profile/ProfilePage";
import NotificationsPage from "@/features/notifications/NotificationsPage";
import DepositPage from "@/features/deposit/DepositPage";
import ReferralPage from "@/features/referral/ReferralPage";
import KYCPage from "@/features/kyc/KYCPage";
import AdminLayout from "@/features/admin/AdminLayout";
import AdminUsersPage from "@/features/admin/AdminUsersPage";
import AdminMaintenancePage from "@/features/admin/AdminMaintenancePage";
import AdminDepositsPage from "@/features/admin/AdminDepositsPage";
import AdminKycPage from "@/features/admin/AdminKycPage";
import AdminReferralsPage from "@/features/admin/AdminReferralsPage";
import AdminSettingsPage from "@/features/admin/AdminSettingsPage";
import ComingSoon from "@/features/common/ComingSoon";

const Landing = () => (
  <main data-testid="landing-page">
    <Hero />
    <Sections />
  </main>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="investments" element={<InvestmentsPage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="deposit" element={<DepositPage />} />
              <Route path="withdraw" element={<ComingSoon title="Withdraw" note="KYC-gated withdrawals with admin approval are coming soon." />} />
              <Route path="referral" element={<ReferralPage />} />
              <Route path="kyc" element={<KYCPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="security" element={<ComingSoon title="Security" note="Password change and session security controls are coming soon." />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/users" replace />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="deposits" element={<AdminDepositsPage />} />
              <Route path="kyc" element={<AdminKycPage />} />
              <Route path="referrals" element={<AdminReferralsPage />} />
              <Route path="maintenance" element={<AdminMaintenancePage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
