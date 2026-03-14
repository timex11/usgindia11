import { Home, Users, FileText, Cpu, Layout, Wrench, MessageCircle, Shield, Terminal, Building, BookOpen, GraduationCap, Globe, MessageSquare, Briefcase, ShieldCheck } from 'lucide-react'

// We need a function because we use translations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNavigation = (t: any) => [
    { name: t.nav.dashboard, href: '/dashboard', icon: Home },
    { name: "My Applications", href: '/dashboard/applications', icon: Briefcase },
    { name: "Social Feed", href: '/social', icon: Globe },
    { name: "Workspaces", href: '/chat', icon: MessageSquare },
    { name: t.nav.institutions, href: '/universities', icon: Building },
    { name: t.nav.alumni, href: '/dashboard/alumni', icon: GraduationCap },
    { name: t.nav.resources, href: '/resources', icon: BookOpen },
    { name: t.nav.community, href: '/dashboard/community', icon: MessageCircle },
    { name: t.nav.tools, href: '/tools', icon: Wrench },
    { name: "Jobs", href: '/jobs', icon: Users },
    { name: t.nav.exams, href: '/dashboard/exams', icon: FileText },
    { name: t.nav.aiChat, href: '/ai/ask', icon: Cpu },
    { name: t.nav.aiRoadmaps, href: '/ai/recommend', icon: Layout },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAdminNavigation = (t: any) => [
    { name: t.nav.adminCms, href: '/admin/cms', icon: Shield },
    { name: "Scholarships", href: '/admin/scholarships', icon: GraduationCap },
    { name: "Jobs", href: '/admin/jobs', icon: Users },
    { name: "Student Verification", href: '/admin/verification', icon: ShieldCheck },
    { name: "Admin Console", href: '/admin/ai-console', icon: Terminal },
]
