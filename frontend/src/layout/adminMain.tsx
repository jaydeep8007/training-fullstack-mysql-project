import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBriefcase,
  FaUserTie,
  FaClipboardList,
  FaUserAlt,
  FaNewspaper,
  FaChartBar,
  FaExternalLinkAlt,
 
} from "react-icons/fa";

interface AdminMainProps {
  admin: any;
}

const AdminMain = ({ admin }: AdminMainProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full pb-1 h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-slate-950  to-slate-900 text-white text-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full p-3 overflow-hidden">

        {/* Left Section */}
        <div className="h-full  overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-3 space-y-4 lg:col-span-2 xl:col-span-2">
          {/* Welcome */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-md p-4">
            <h2 className="text-base font-semibold text-slate-100 mb-1 flex items-center gap-2">
              👋 Welcome back, {admin?.admin_firstname || "Admin"}
            </h2>
            <p className="text-slate-300">Manage your job portal efficiently with real-time insights and tools.</p>
            <button
              onClick={() => navigate("/admin-profile")}
              className="mt-3 bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded text-xs"
            >
              View Profile
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-3 rounded shadow flex flex-col items-start">
              <FaUsers className="text-white text-base mb-1" />
              <h3 className="font-medium">Total Customers</h3>
              <p className="text-xl font-bold">124</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-3 rounded shadow flex flex-col items-start">
              <FaUserTie className="text-white text-base mb-1" />
              <h3 className="font-medium">Total Employees</h3>
              <p className="text-xl font-bold">58</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-3 rounded shadow flex flex-col items-start">
              <FaBriefcase className="text-white text-base mb-1" />
              <h3 className="font-medium">Active Jobs</h3>
              <p className="text-xl font-bold">35</p>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded shadow">
            <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
              <FaUserAlt /> Top Customers
            </h4>
            <div className="space-y-3">
              {["Alice Ray", "John Carter", "Maya Singh"].map((name, idx) => (
                <div key={idx} className="flex items-center gap-3 border-b border-slate-700 pb-2">
                  <img
                    src={`https://i.pravatar.cc/150?img=${idx + 10}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-xs">{name}</p>
                    <p className="text-[11px] text-slate-400">Verified Customer</p>
                  </div>
                  <button className="text-blue-400 text-xs flex items-center gap-1">
                    <FaExternalLinkAlt /> View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Job Assignment */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded shadow space-y-3">
            <h4 className="font-semibold text-base flex items-center gap-2 text-slate-100">
              <FaClipboardList /> Job Assignment
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Job ID"
                className="w-full border border-slate-600 bg-transparent rounded px-3 py-1.5 text-sm"
              />
              <input
                type="text"
                placeholder="Employee ID"
                className="w-full  border border-slate-600 bg-transparent rounded px-3 py-1.5 text-sm"
              />
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded text-sm">
                Assign Job
              </button>
            </div>
          </div>

          {/* News */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded shadow">
            <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
              <FaNewspaper /> Latest Job Portal News
            </h4>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>New internship programs launched for 2025</li>
              <li>Top 10 tech skills in demand this year</li>
              <li>AI-based screening coming soon to our platform</li>
            </ul>
          </div>
        </div>

        {/* Middle Section */}
        <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-3 space-y-4 xl:col-span-1">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded shadow p-4">
            <h4 className="font-semibold mb-2 text-sm">Notifications</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>New employee joined</li>
              <li>3 jobs assigned today</li>
              <li>Customer profile update pending</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded shadow p-4">
            <h4 className="font-semibold mb-2 text-sm">Quick Actions</h4>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded mb-2 text-sm">
              Create Job
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded text-sm">
              Add Employee
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-3 space-y-4 xl:col-span-1">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded shadow p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <FaChartBar /> Analytics
            </h4>
            <div className="text-xs mb-3">
              Bar & pie chart components can go here for visual analytics.
            </div>
            <div className="text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Company Growth</span>
                <span className="font-bold text-green-400">+18.7%</span>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=15"
                  className="w-7 h-7 rounded-full"
                  alt="avatar"
                />
                <div>
                  <p className="font-semibold text-xs">Amit Verma</p>
                  <p className="text-[11px] text-slate-400">Closed 12 projects in Q2</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=21"
                  className="w-7 h-7 rounded-full"
                  alt="avatar"
                />
                <div>
                  <p className="font-semibold text-xs">Sana Sheikh</p>
                  <p className="text-[11px] text-slate-400">Awarded Employee of the Month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminMain;
