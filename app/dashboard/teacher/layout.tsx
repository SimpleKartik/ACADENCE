import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout requiredRole="teacher">{children}</DashboardLayout>;
}
