import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils" // optional

const data = {
  user: {
    name: "Shadcn",
    email: "shadcn@example.com",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Sample_User_Icon.png/480px-Sample_User_Icon.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      icon: SquareTerminal,
      items: ["History", "Starred", "Settings"],
    },
    {
      title: "Models",
      icon: Bot,
      items: ["Genesis", "Explorer", "Quantum"],
    },
    {
      title: "Documentation",
      icon: BookOpen,
      items: ["Introduction", "Get Started", "Tutorials", "Changelog"],
    },
    {
      title: "Settings",
      icon: Settings2,
      items: ["General", "Team", "Billing", "Limits"],
    },
  ],
  projects: [
    { name: "Design Engineering", icon: Frame },
    { name: "Sales & Marketing", icon: PieChart },
    { name: "Travel", icon: Map },
  ],
}

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r shadow-md flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Team Selector */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed ? (
          <select className="w-full text-sm bg-gray-100 rounded px-2 py-1">
            {data.teams.map((team) => (
              <option key={team.name}>{team.name}</option>
            ))}
          </select>
        ) : (
          <img
            src={data.teams[0].logo}
            alt="logo"
            className="w-6 h-6 rounded-full"
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-2 text-gray-500 hover:text-blue-600 text-xl"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {data.navMain.map((nav, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <nav.icon className="w-5 h-5" />
              {!collapsed && <span>{nav.title}</span>}
            </div>
            {!collapsed && (
              <ul className="ml-6 space-y-1 text-sm text-gray-600">
                {nav.items.map((item) => (
                  <li
                    key={item}
                    className="hover:text-blue-600 cursor-pointer transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Projects */}
      <div className="border-t px-4 py-3">
        {!collapsed && (
          <div className="text-xs text-gray-500 font-semibold mb-2">
            Projects
          </div>
        )}
        <ul className="space-y-2">
          {data.projects.map((project) => (
            <li
              key={project.name}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 cursor-pointer transition"
            >
              <project.icon className="w-4 h-4" />
              {!collapsed && <span>{project.name}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t p-4 mt-auto">
        <div className="flex items-center gap-3">
          <img
            src={data.user.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          {!collapsed && (
            <div>
              <div className="text-sm font-medium">{data.user.name}</div>
              <div className="text-xs text-gray-500">{data.user.email}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default AppSidebar
