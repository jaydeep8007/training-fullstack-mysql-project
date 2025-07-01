import { MdDashboard, MdPeople, MdWork, MdReport } from "react-icons/md";

export const navbarLinks = [
  {
    title: "Main",
    links: [
      { label: "Dashboard", path: "/admin-home", icon: MdDashboard },
    ],
  },
  {
    title: "Management",
    links: [
      { label: "Customers", path: "/manage-customers", icon: MdPeople },
      { label: "Employees", path: "/manage-employees", icon: MdPeople },
      { label: "Jobs", path: "/manage-jobs", icon: MdWork },
      { label: "Assignments", path: "/assignments", icon: MdWork },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "Reports", path: "/admin-reports", icon: MdReport },
    ],
  },
];
