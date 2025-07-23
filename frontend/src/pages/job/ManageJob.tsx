import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

const ManageJob = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editJobValue, setEditJobValue] = useState<string>("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminAccessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [empRes, jobRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee`, { headers }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/job`, { headers }),
      ]);

      setEmployees(empRes.data?.data?.rows || []);
      setJobs(jobRes.data?.data?.rows || []);
    } catch (error) {
      toast.error("❌ Failed to load employees or jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/employee-job/assign-many`,
          { emp_ids, job_id }
        );
      }

      toast.success("✅ Job assigned successfully");
      setSelectedEmployees([]);
      setSelectedJob("");
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "❌ Failed to assign job");
    } finally {
      setAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading data...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Assign Job</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Select Job
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">-- Select a Job --</option>
              {jobs.map((job) => (
                <option key={job.job_id} value={job.job_id}>
                  {job.job_name} ({job.job_category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Search Employees
            </label>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto border rounded-md px-4 py-3 mt-4 dark:border-gray-700">
          {employees
            .filter((emp) =>
              `${emp.emp_firstname} ${emp.emp_lastname}`
                .toLowerCase()
                .includes(searchTerm)
            )
            .map((emp) => {
              const empIdStr = String(emp.emp_id);
              return (
                <label
                  key={emp.emp_id}
                  className="flex items-center space-x-2 mb-2 text-sm text-gray-800 dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    value={empIdStr}
                    checked={selectedEmployees.includes(empIdStr)}
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
                  <span>
                    {emp.emp_firstname} {emp.emp_lastname} - {emp.emp_email}
                  </span>
                </label>
              );
            })}
        </div>

        <button
          onClick={handleAssign}
          disabled={assigning}
          className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          {assigning ? "Assigning..." : "Assign Job"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
           Employees & Job Status
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Assigned Job</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const job = jobs.find((j) => j.job_id === emp.job_id);
                return (
                  <tr
                    key={emp.emp_id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {emp.emp_firstname} {emp.emp_lastname}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {emp.emp_email}
                    </td>
                    <td className="px-4 py-3">
                      {editRowId === emp.emp_id ? (
                        <select
                          value={editJobValue}
                          onChange={(e) => setEditJobValue(e.target.value)}
                          className="w-full px-2 py-1 border rounded-md text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">-- Not Assigned --</option>
                          {jobs.map((job) => (
                            <option key={job.job_id} value={job.job_id}>
                              {job.job_name} ({job.job_category})
                            </option>
                          ))}
                        </select>
                      ) : job ? (
                        <span className="text-green-600 font-semibold">
                          {job.job_name} ({job.job_category})
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {editRowId === emp.emp_id ? (
                          <>
                            <button
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                              onClick={async () => {
                                try {
                                  await axios.put(
                                    `${import.meta.env.VITE_BASE_URL}/employee-job/${emp.emp_id}`,
                                    { job_id: editJobValue ? Number(editJobValue) : null }
                                  );

                                  setEmployees((prev) =>
                                    prev.map((e) =>
                                      e.emp_id === emp.emp_id
                                        ? { ...e, job_id: editJobValue ? Number(editJobValue) : null }
                                        : e
                                    )
                                  );

                                  toast.success("✅ Job updated");
                                  setEditRowId(null);
                                  setEditJobValue("");
                                } catch (err: any) {
                                  toast.error(
                                    err.response?.data?.message || "❌ Failed to update job"
                                  );
                                }
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                              onClick={() => {
                                setEditRowId(null);
                                setEditJobValue("");
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                            onClick={() => {
                              setEditRowId(emp.emp_id);
                              setEditJobValue(emp.job_id?.toString() || "");
                            }}
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJob;
