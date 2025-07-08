import {
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
  FaGlobe,
  FaHome,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { appBreadcrumbs } from "@/routes"; // 👈 Make sure to export this from routes/index.ts

interface HeaderProps {
  setSidebarOpen?: (val: boolean) => void;
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

  // Get breadcrumb trail from central route config
  const breadcrumb = getBreadcrumbPath(location.pathname);

  // Get page title from last breadcrumb
  const pageTitle = breadcrumb[breadcrumb.length - 1]?.label || "Admin Panel";

  // Match route segments with breadcrumb labels
  function getBreadcrumbPath(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    let cumulativePath = "";
    return segments.map((segment) => {
      cumulativePath += `/${segment}`;
      const match = appBreadcrumbs.find(
        (b) => b.path === cumulativePath || (b.path.includes(":") && cumulativePath.startsWith(b.path.split("/:")[0]))
      );
      return {
        label: match?.breadcrumb || segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        path: cumulativePath,
      };
    });
  }

  // Theme logic
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved === "dark" || (!saved && prefersDark);
    document.documentElement.classList.toggle("dark", useDark);
    setIsDark(useDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md text-foreground px-6 py-1 flex items-center justify-between border-b border-border shadow-xl rounded-b-xl ring-1 ring-muted/30">
      {/* Left Section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          <button
            className="p-1 rounded-md bg-muted hover:bg-muted/60 transition text-primary"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>

   <div className="text-sm text-muted-foreground tracking-wide flex items-center gap-2 flex-wrap">
  {breadcrumb.map((crumb, idx) => (
    <div key={crumb.path} className="flex items-center gap-2">
      {idx !== 0 && <span>/</span>}
      {idx !== breadcrumb.length - 1 ? (
        <button
          onClick={() => navigate(crumb.path)}
          className="text-primary hover:underline flex items-center gap-1"
        >
          {idx === 0 ? <FaHome className="w-4 h-4" /> : crumb.label}
        </button>
      ) : (
        <span className="font-medium text-foreground">
          {idx === 0 ? <FaHome className="w-4 h-4" /> : crumb.label}
        </span>
      )}
    </div>
  ))}
</div>
        </div>

        <h1 className="text-base font-bold tracking-tight text-primary lg:ml-11">{pageTitle}</h1>
      </div>

      {/* Right Section */}
      <div className="relative">
        <div className="flex items-center gap-5">
          <FiSearch
            className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary transition"
            onClick={() => alert("Search clicked")}
          />
          <FaBell
            className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary transition"
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
            className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f1f2f] shadow-xl text-sm z-50 animate-fadeIn"
          >
            <div className="p-2 divide-y divide-border">
              <div className="py-2">
                <DropdownItem icon={<FaUserCog />} label="Profile" onClick={() => navigate("/admin/profile")} />
                <DropdownItem icon={<FaBell />} label="Notifications" onClick={() => navigate("/admin-notifications")} />
              </div>
             
              <div className="py-2">
                <SectionTitle title="Management" />
                
                <DropdownItem icon={<FaGlobe />} label="Global Config" onClick={() => navigate("/admin/global-config")} />
              </div>
              <div className="py-2">
                <SectionTitle title="Support" />
                <DropdownItem icon={<FiHelpCircle />} label="Help & Support" onClick={() => navigate("/admin-help")} />
                <DropdownItem
                  icon={<FiLogOut />}
                  label="Logout"
                  className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
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

const DropdownItem = ({
  icon,
  label,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) => (
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
