import {
  FiSettings,
  FiLogOut,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import {
  FaUserCircle,
  FaBell,
  FaUserCog,
  FaChartPie,
  FaUsers,
  FaBriefcase,
  FaGlobe,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  setSidebarOpen: (val: boolean) => void;
  setOpenLogoutDialog: (val: boolean) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Header = ({
  setOpenLogoutDialog,
  isCollapsed,
  toggleCollapse,
}: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);
  const breadcrumb = getBreadcrumbPath(location.pathname);

  function getPageTitle(path: string): string {
    const map: Record<string, string> = {
      "/admin/home": "Dashboard",
      "/admin/profile": "Profile",
      "/admin-account-settings": "Account Settings",
      "/admin-users": "User Management",
      "/manage-jobs": "Job Management",
      "/admin-help": "Help & Support",
      "/admin-notifications": "Notifications",
      "/admin/dashboard": "Dashboard",
      "/admin/global-config": "Global Config",
      "/admin-settings": "Settings",
    };
    return map[path] || "Admin Panel";
  }

  function getBreadcrumbPath(path: string): string {
    const labelMap: Record<string, string> = {
      admin: "Admin",
      dashboard: "Dashboard",
      profile: "Profile",
      "account-settings": "Account Settings",
      "global-config": "Global Config",
      "home": "Dashboard",
      "users": "User Management",
      "notifications": "Notifications",
      "help": "Help & Support",
      "manage-jobs": "Job Management",
    };

    const segments = path.split("/").filter(Boolean);
    const readable = segments.map((seg) =>
      labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ")
    );
    return readable.join(" > ");
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", useDark);
    setIsDark(useDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-background/90 backdrop-blur-md text-foreground px-6 py-1 flex items-center justify-between border border-border shadow-xl rounded-b-xl ring-1 ring-muted/30">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
     <button
  className="p-1 rounded-md bg-muted hover:bg-muted/60 transition text-primary"
  onClick={toggleCollapse}
  title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
>
  {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
</button>
          <h2 className="text-sm text-muted-foreground tracking-wide lowercase">{breadcrumb}</h2>
        </div>
        <h1 className="lg:ml-11  text-lg font-bold tracking-tight text-primary">
          {pageTitle}
        </h1>
      </div>

      <div className="relative">
        <div className="flex items-center gap-5">
          <FiSearch
            className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary transition"
            onClick={() => alert("Search clicked")}
          />
          <FaBell
            className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary transition"
            onClick={() => navigate("/admin-notifications")}
          />
          <button
            className="text-muted-foreground hover:text-yellow-400 transition"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <FaUserCircle
            className="w-7 h-7 cursor-pointer text-foreground hover:text-primary"
            onClick={() => setShowDropdown(!showDropdown)}
          />
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-64 bg-white border border-slate-400 rounded-lg shadow-md text-sm z-50"
          >
            <div className="p-2 divide-y divide-border">
              <div className="py-2">
                <DropdownItem icon={<FaUserCog />} label="Profile" onClick={() => navigate("/admin/profile")} />
                <DropdownItem icon={<FaBell />} label="Notifications" onClick={() => navigate("/admin-notifications")} />
              </div>

              <div className="py-2">
                <SectionTitle title="Settings" />
                <DropdownItem icon={<FiSettings />} label="Account Settings" onClick={() => navigate("/admin-account-settings")} />
              </div>

              <div className="py-2">
                <SectionTitle title="Management" />
                <DropdownItem icon={<FaChartPie />} label="Dashboard" onClick={() => navigate("/admin/dashboard")} />
                <DropdownItem icon={<FaUsers />} label="User Management" onClick={() => navigate("/admin-users")} />
                <DropdownItem icon={<FaBriefcase />} label="Job Management" onClick={() => navigate("/manage-jobs")} />
                <DropdownItem icon={<FaGlobe />} label="Global Config" onClick={() => navigate("/admin/global-config")} />
              </div>

              <div className="py-2">
                <SectionTitle title="Support" />
                <DropdownItem icon={<FiHelpCircle />} label="Help & Support" onClick={() => navigate("/admin-help")} />
                <DropdownItem
                  icon={<FiLogOut />}
                  label="Logout"
                  className="text-destructive hover:bg-destructive/20"
                  onClick={() => {
                    setShowDropdown(false);
                    setOpenLogoutDialog(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const DropdownItem = ({
  icon,
  label,
  onClick,
  className = "",
}: DropdownItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-2 text-left rounded-md transition-colors hover:bg-muted ${className}`}
  >
    <span className="text-base text-muted-foreground">{icon}</span>
    <span className="text-sm text-foreground">{label}</span>
  </button>
);

const SectionTitle = ({ title }: { title: string }) => (
  <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
    {title}
  </p>
);

export default Header;
