import { createFileRoute, Link } from '@tanstack/react-router'
import { Authenticated, Unauthenticated, useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useUserRole } from '../lib/useUserRole'
import { CompanyOnly, CreatorOnly } from '../components/RoleGuard'
import { Briefcase, TrendingUp, Users, FileText } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
      <Authenticated>
        <RoleBasedDashboard />
      </Authenticated>
    </>
  )
}

function RoleBasedDashboard() {
  const { user, isLoading } = useUserRole()
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || user?.email || 'User'}!
          </p>
        </div>

        <CompanyOnly>
          <CompanyDashboard />
        </CompanyOnly>

        <CreatorOnly>
          <CreatorDashboard />
        </CreatorOnly>
      </div>
    </div>
  )
}

function CompanyDashboard() {
  const campaigns = useQuery(api.campaigns.list)
  const activeCampaigns = campaigns?.filter((c) => c.status === "active") || []
  const draftCampaigns = campaigns?.filter((c) => c.status === "draft") || []
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<Briefcase className="text-indigo-600" size={24} />}
          title="Total Campaigns"
          value={campaigns?.length || 0}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<TrendingUp className="text-green-600" size={24} />}
          title="Active Campaigns"
          value={activeCampaigns.length}
          color="bg-green-50"
        />
        <StatCard
          icon={<FileText className="text-orange-600" size={24} />}
          title="Draft Campaigns"
          value={draftCampaigns.length}
          color="bg-orange-50"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/campaigns/new"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center"
          >
            <Briefcase className="mx-auto mb-2 text-indigo-600" size={32} />
            <h3 className="font-semibold text-gray-800">Create Campaign</h3>
            <p className="text-sm text-gray-600">Start a new creator campaign</p>
          </Link>
          <Link
            to="/campaigns"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center"
          >
            <FileText className="mx-auto mb-2 text-indigo-600" size={32} />
            <h3 className="font-semibold text-gray-800">View All Campaigns</h3>
            <p className="text-sm text-gray-600">Manage your campaigns</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function CreatorDashboard() {
  const applications = useQuery(api.applications.getByCreator)
  const pendingApps = applications?.filter((a) => a.status === "pending") || []
  const selectedApps = applications?.filter((a) => a.status === "selected") || []
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<FileText className="text-purple-600" size={24} />}
          title="Total Applications"
          value={applications?.length || 0}
          color="bg-purple-50"
        />
        <StatCard
          icon={<TrendingUp className="text-blue-600" size={24} />}
          title="Pending Review"
          value={pendingApps.length}
          color="bg-blue-50"
        />
        <StatCard
          icon={<Users className="text-green-600" size={24} />}
          title="Selected"
          value={selectedApps.length}
          color="bg-green-50"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/browse"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <Briefcase className="mx-auto mb-2 text-purple-600" size={32} />
            <h3 className="font-semibold text-gray-800">Browse Campaigns</h3>
            <p className="text-sm text-gray-600">Find new opportunities</p>
          </Link>
          <Link
            to="/my-applications"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <FileText className="mx-auto mb-2 text-purple-600" size={32} />
            <h3 className="font-semibold text-gray-800">My Applications</h3>
            <p className="text-sm text-gray-600">Track your applications</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-xl p-6 shadow-md`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  )
}

function RedirectToSignIn() {
  // Use window.location for immediate redirect
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
  return null
}
