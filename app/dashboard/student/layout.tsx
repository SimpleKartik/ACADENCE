import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout requiredRole="student">{children}</DashboardLayout>;
}
