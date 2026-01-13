import { ReactNode } from 'react';

// This will be expanded with actual authentication and role-based routing
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard layout will be implemented here */}
      {children}
    </div>
  );
}
