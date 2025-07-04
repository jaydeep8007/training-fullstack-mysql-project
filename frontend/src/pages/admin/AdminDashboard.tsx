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
import { useContext } from "react";
import { AdminDataContext } from "@/context/AdminContext";

const AdminDashboard  = () => {
  const navigate = useNavigate();
 const { admin } = useContext(AdminDataContext)!;

  return (
    <div className="w-full pb-1 h-[calc(100vh-80px)] overflow-hidden bg-background text-foreground text-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 h-full p-2 overflow-hidden">

        {/* Left Section */}
        <div className="h-full overflow-y-auto bg-card rounded-xl p-2 space-y-3 lg:col-span-2 xl:col-span-2 shadow-inner">

          {/* Welcome */}
          <div className="bg-muted rounded-md shadow p-3">
            <h2 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              👋 Welcome back, {admin?.admin_firstname || "Admin"}
            </h2>
            <p className="text-muted-foreground text-[11px]">
              Manage your job portal efficiently with real-time insights and tools.
            </p>
            <button
              onClick={() => navigate("/admin-profile")}
              className="mt-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-1 rounded text-xs"
            >
              View Profile
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              { label: "Total Customers", count: 124, icon: <FaUsers className="text-sm" /> },
              { label: "Total Employees", count: 58, icon: <FaUserTie className="text-sm" /> },
              { label: "Active Jobs", count: 35, icon: <FaBriefcase className="text-sm" /> },
            ].map(({ label, count, icon }, idx) => (
              <div
                key={idx}
                className="bg-popover p-3 rounded shadow hover:shadow-md transition flex flex-col items-start gap-1"
              >
                {icon}
                <h3 className="font-medium">{label}</h3>
                <p className="text-base font-bold">{count}</p>
              </div>
            ))}
          </div>

          {/* Top Customers */}
          <div className="bg-card p-3 rounded shadow">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FaUserAlt /> Top Customers
            </h4>
            <div className="space-y-2">
              {["Alice Ray", "John Carter", "Maya Singh"].map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border-b border-border pb-2"
                >
                  <img
                    src={`https://i.pravatar.cc/150?img=${idx + 10}`}
                    alt="avatar"
                    className="w-7 h-7 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{name}</p>
                    <p className="text-[10px] text-muted-foreground">Verified Customer</p>
                  </div>
                  <button className="text-primary text-[11px] flex items-center gap-1">
                    <FaExternalLinkAlt className="text-[10px]" /> View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Job Assignment */}
          <div className="bg-card p-3 rounded shadow space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <FaClipboardList /> Job Assignment
            </h4>
            <input
              type="text"
              placeholder="Job ID"
              className="w-full border border-border bg-background text-foreground rounded px-2 py-1 text-xs"
            />
            <input
              type="text"
              placeholder="Employee ID"
              className="w-full border border-border bg-background text-foreground rounded px-2 py-1 text-xs"
            />
            <button className="w-full bg-primary text-primary-foreground hover:opacity-90 py-1 rounded text-xs">
              Assign Job
            </button>
          </div>

          {/* News */}
          <div className="bg-popover p-3 rounded shadow">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FaNewspaper /> Latest Job Portal News
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
              <li>New internship programs launched for 2025</li>
              <li>Top 10 tech skills in demand this year</li>
              <li>AI-based screening coming soon to our platform</li>
            </ul>
          </div>
        </div>

        {/* Middle Section */}
        <div className="h-full overflow-y-auto bg-card rounded-xl p-2 space-y-3 xl:col-span-1">
          <div className="bg-popover rounded shadow p-3">
            <h4 className="font-semibold mb-2">Notifications</h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
              <li>New employee joined</li>
              <li>3 jobs assigned today</li>
              <li>Customer profile update pending</li>
            </ul>
          </div>

          <div className="bg-popover rounded shadow p-3">
            <h4 className="font-semibold mb-2">Quick Actions</h4>
            <button className="w-full bg-primary text-primary-foreground hover:opacity-90 py-1 rounded mb-2 text-xs">
              Create Job
            </button>
            <button className="w-full bg-primary text-primary-foreground hover:opacity-90 py-1 rounded text-xs">
              Add Employee
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="h-full overflow-y-auto bg-card rounded-xl p-2 space-y-3 xl:col-span-1">
          <div className="bg-popover rounded shadow p-3">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FaChartBar /> Analytics
            </h4>
            <p className="text-[11px] mb-3 text-muted-foreground">
              Bar & pie chart components can go here for visual analytics.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company Growth</span>
                <span className="font-bold text-green-500">+18.7%</span>
              </div>
              {[
                { name: "Amit Verma", info: "Closed 12 projects in Q2", img: 15 },
                { name: "Sana Sheikh", info: "Awarded Employee of the Month", img: 21 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <img
                    src={`https://i.pravatar.cc/40?img=${item.img}`}
                    className="w-6 h-6 rounded-full"
                    alt="avatar"
                  />
                  <div>
                    <p className="font-semibold text-[11px]">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard ;
