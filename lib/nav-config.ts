import {
  LayoutDashboard, History, MessageSquare, BarChart3, Settings, LogOut,
  Bot, PlayCircle
} from "lucide-react"

export const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview", label: "Start Interview", icon: PlayCircle },
  { href: "/history", label: "History", icon: History },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/resume-upload", label: "Resume Upload", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/login", label: "Logout", icon: LogOut },
]

export const PUBLIC_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview", label: "Interview" },
  { href: "/history", label: "History" },
  { href: "/feedback", label: "Feedback" },
]
