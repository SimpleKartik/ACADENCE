import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout requiredRole="admin">{children}</DashboardLayout>;
}
