import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AssignJob = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch employees and jobs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, jobRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/employee`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/job`),
        ]);

        const employeeList = Array.isArray(empRes.data?.data?.rows)
          ? empRes.data.data.rows
          : [];

        const jobList = Array.isArray(jobRes.data?.data?.rows)
          ? jobRes.data.data.rows
          : [];

        setEmployees(employeeList);
        setJobs(jobList);
      } catch (error) {
        toast.error("❌ Failed to load employees or jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle job assignment
  const handleAssign = async () => {
    if (!selectedJob || selectedEmployees.length === 0) {
      return toast.error("⚠️ Please select a job and employee(s)");
    }

    setAssigning(true);
    try {
      const job_id = Number(selectedJob);

      if (selectedEmployees.length === 1) {
        const emp_id = Number(selectedEmployees[0]);
        await axios.post(`${import.meta.env.VITE_BASE_URL}/employee-job`, {
          emp_id,
          job_id,
        });
      } else {
        const emp_ids = selectedEmployees.map((id) => Number(id));
        await axios.post(`${import.meta.env.VITE_BASE_URL}/employee-job/assign-many`, {
          emp_ids,
          job_id,
        });
      }

      toast.success("✅ Job assigned successfully");
      setSelectedEmployees([]);
      setSelectedJob("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "❌ Failed to assign job");
    } finally {
      setAssigning(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10 text-gray-500">Loading employee & job data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Assign Job to Employee(s)</h1>

      {/* Job Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Select Job</label>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select a Job --</option>
          {jobs.length > 0 ? (
            jobs.map((job: any) => (
              <option key={job.job_id} value={job.job_id}>
                {job.job_name} ({job.job_category})
              </option>
            ))
          ) : (
            <option disabled>No jobs available</option>
          )}
        </select>
      </div>

      {/* Search Input */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Employee Checkbox List */}
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md px-4 py-2 mb-6">
        {employees
          .filter((emp: any) =>
            `${emp.emp_firstname} ${emp.emp_lastname}`.toLowerCase().includes(searchTerm)
          )
          .map((emp: any) => {
            const empIdStr = String(emp.emp_id);
            const isChecked = selectedEmployees.includes(empIdStr);

            return (
              <label key={emp.emp_id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  value={empIdStr}
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEmployees((prev) => [...prev, empIdStr]);
                    } else {
                      setSelectedEmployees((prev) =>
                        prev.filter((id) => id !== empIdStr)
                      );
                    }
                  }}
                />
                <span className="text-sm text-gray-700">
                  {emp.emp_firstname} {emp.emp_lastname} - {emp.emp_email}
                </span>
              </label>
            );
          })}
        {employees.length === 0 && (
          <p className="text-sm text-gray-500">No employees available</p>
        )}
      </div>

      {/* Assign Button */}
      <button
        onClick={handleAssign}
        disabled={assigning}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
      >
        {assigning ? "Assigning..." : "Assign Job"}
      </button>
    </div>
  );
};

export default AssignJob;
