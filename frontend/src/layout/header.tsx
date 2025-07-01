import { FiSettings, FiLogOut, FiHelpCircle, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import {
  FaUserCircle,
  FaBell,
  FaUserCog,
  FaChartPie,
  FaUsers,
  FaBriefcase,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  setSidebarOpen: (val: boolean) => void;
  setOpenLogoutDialog: (val: boolean) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Header = ({  setOpenLogoutDialog, isCollapsed, toggleCollapse }: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
   <header className="bg-gradient-to-r from-gray-950  to-gray-950 text-white px-6 py-3 flex items-center justify-between border-b border-slate-700 shadow-sm relative">
      <div className="flex items-center gap-4">
        <button
          className="text-white hover:text-slate-300 focus:outline-none"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
        </button>
        <h1 className="text-lg font-bold tracking-tight text-blue-400">
          Admin Dashboard
        </h1>
      </div>

        <div className="relative">
        <div className="flex items-center gap-5">
          {/* 🔍 Search icon */}
          <FiSearch
            className="w-5 h-5 cursor-pointer text-slate-300 hover:text-blue-400 transition"
            onClick={() => alert("Search clicked")}
          />

          {/* 🔔 Notification icon */}
          <FaBell
            className="w-5 h-5 cursor-pointer text-slate-300 hover:text-blue-400 transition"
            onClick={() => navigate("/admin-notifications")}
          />

          {/* 👤 User icon */}
          <FaUserCircle
            className="w-7 h-7 cursor-pointer text-white hover:text-blue-400"
            onClick={() => setShowDropdown(!showDropdown)}
          />
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg text-sm z-50"
          >
            <div className="p-2 divide-y divide-slate-700">
              <div className="py-2">
                <DropdownItem icon={<FaUserCog />} label="Profile" onClick={() => navigate("/admin-profile")} />
                <DropdownItem icon={<FaBell />} label="Notifications" onClick={() => navigate("/admin-notifications")} />
              </div>

              <div className="py-2">
                <SectionTitle title="Settings" />
                <DropdownItem icon={<FiSettings />} label="Account Settings" onClick={() => navigate("/admin-account-settings")} />
              </div>

              <div className="py-2">
                <SectionTitle title="Management" />
                <DropdownItem icon={<FaChartPie />} label="Dashboard" onClick={() => navigate("/admin-dashboard")} />
                <DropdownItem icon={<FaUsers />} label="User Management" onClick={() => navigate("/admin-users")} />
                <DropdownItem icon={<FaBriefcase />} label="Job Management" onClick={() => navigate("/manage-jobs")} />
              </div>

              <div className="py-2">
                <SectionTitle title="Support" />
                <DropdownItem icon={<FiHelpCircle />} label="Help & Support" onClick={() => navigate("/admin-help")} />
                <DropdownItem
                  icon={<FiLogOut />}
                  label="Logout"
                  className="text-red-400 hover:bg-red-900"
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

const DropdownItem = ({ icon, label, onClick, className = "" }: DropdownItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-2 text-left rounded-md transition-colors hover:bg-slate-700 ${className}`}
  >
    <span className="text-base text-slate-200">{icon}</span>
    <span className="text-sm text-slate-100">{label}</span>
  </button>
);

const SectionTitle = ({ title }: { title: string }) => (
  <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
    {title}
  </p>
);

export default Header;
