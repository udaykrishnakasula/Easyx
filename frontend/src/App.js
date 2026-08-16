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
              <Route path="deposit" element={<ComingSoon title="Deposit" note="Manual USDT deposit (TRC20/BEP20) with admin verification is coming soon." />} />
              <Route path="withdraw" element={<ComingSoon title="Withdraw" note="KYC-gated withdrawals with admin approval are coming soon." />} />
              <Route path="referral" element={<ComingSoon title="Referral" note="One-level referral rewards are coming soon." />} />
              <Route path="kyc" element={<ComingSoon title="KYC" note="Identity verification (ID + selfie) is coming soon." />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="security" element={<ComingSoon title="Security" note="Password change and session security controls are coming soon." />} />
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
