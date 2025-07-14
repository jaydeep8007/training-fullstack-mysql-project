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

  const sectionedNav = [
    {
      title: "Overview",
      items: [{ label: "Dashboard", route: "/admin/dashboard", icon: <FiHome /> }],
    },
    {
      title: "Management",
      items: [
        { label: "Customers", route: "/admin/customers", icon: <FiUsers /> },
        { label: "Employees", route: "/admin/employees", icon: <FiGrid /> },
        { label: "Create Job", route: "/admin/create-job", icon: <FiBriefcase /> },
        { label: "Assign Job", route: "/admin/assign-job", icon: <FiClipboard /> },
        { label: "Manage Jobs", route: "/admin/manage-job", icon: <FiClipboard /> },
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
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transform transition-all duration-300 ease-in-out shadow-xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${isCollapsed ? "w-20" : "w-[180px]"}
          bg-white dark:bg-[#1c1f2b] text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700`}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-gray-700 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src="/company-logo.png"
              alt="Company Logo"
              className="w-8 h-8 rounded-full"
            />
            {!isCollapsed && (
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                JobPortal
              </span>
            )}
          </div>
          <FiX
            className="ml-auto cursor-pointer text-gray-400 hover:text-red-500 transition lg:hidden"
            size={24}
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-5 p-4 text-sm">
          {sectionedNav.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2 tracking-wider px-1">
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
                  className="group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-all 
                             hover:bg-gray-100 dark:hover:bg-gray-800
                             hover:text-blue-600 dark:hover:text-blue-400 
                             text-gray-600 dark:text-gray-300"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.label}
                    </span>
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
