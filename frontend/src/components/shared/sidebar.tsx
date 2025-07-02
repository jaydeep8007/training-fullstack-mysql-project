import {
  FiX,
  FiSettings,
  FiBarChart2,
  FiUsers,
  FiBriefcase,
  FiClipboard,
  FiHome,
  FiGrid,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
}: SidebarProps) => {
  const navigate = useNavigate();

  const sectionedNav: {
    title: string;
    items: { label: string; route: string; icon: React.ReactNode }[];
  }[] = [
    {
      title: "Overview",
      items: [{ label: "Dashboard", route: "/admin/dashboard", icon: <FiHome /> }],
    },
    {
      title: "Management",
      items: [
        { label: "Customers", route: "/manage-customers", icon: <FiUsers /> },
        { label: "Employees", route: "/manage-employees", icon: <FiGrid /> },
        { label: "Jobs", route: "/manage-jobs", icon: <FiBriefcase /> },
        { label: "Assignments", route: "/assignments", icon: <FiClipboard /> },
      ],
    },
    {
      title: "Settings",
      items: [{ label: "General", route: "/admin-settings", icon: <FiSettings /> }],
    },
    {
      title: "Reports",
      items: [{ label: "Analytics", route: "/admin-reports", icon: <FiBarChart2 /> }],
    },
  ];

  return (
    <>
      {/* Overlay for small screens */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform transition-all duration-300 ease-in-out shadow-xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${isCollapsed ? "w-20" : "w-[200px]"}
          bg-background text-foreground border-r border-border ring-1 ring-muted/30`}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center gap-2 px-4 py-4 border-b border-border ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <img
            src="/google-logo.png"
            alt="Company Logo"
            className={`transition-all duration-300 ${
              isCollapsed ? "w-8 h-8" : "w-8 h-8"
            } rounded-full`}
          />
          {!isCollapsed && (
            <span className="text-lg font-bold text-primary tracking-wide">
              JobPortal
            </span>
          )}
          <FiX
            className="ml-auto cursor-pointer text-muted-foreground hover:text-red-400 transition lg:hidden"
            size={24}
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-5 p-4 text-sm">
          {sectionedNav.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wide px-1">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.route);
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-left hover:bg-muted text-muted-foreground hover:text-foreground transition"
                >
                  <span className="text-sm scale-125">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="text-xs font-medium">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
