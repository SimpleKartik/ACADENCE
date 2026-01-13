export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System administration and institutional management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-background-light p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-primary-900 mb-2">System Overview</h2>
          <p className="text-gray-600">Monitor platform activity and statistics</p>
        </div>
        <div className="bg-background-light p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-primary-900 mb-2">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <div className="bg-background-light p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">⚙️</div>
          <h2 className="text-xl font-semibold text-primary-900 mb-2">System Settings</h2>
          <p className="text-gray-600">Configure platform settings</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p className="text-blue-900">
          <strong>Note:</strong> Admin dashboard features are being developed. This is a minimal scaffold for now.
        </p>
      </div>
    </div>
  );
}
