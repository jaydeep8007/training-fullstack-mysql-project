import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil, Trash } from "lucide-react";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, jobRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/employee`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/job`),
        ]);

        setEmployees(
          Array.isArray(empRes.data?.data?.rows) ? empRes.data.data.rows : []
        );
        setJobs(
          Array.isArray(jobRes.data?.data?.rows) ? jobRes.data.data.rows : []
        );
      } catch (error) {
        toast.error("❌ Failed to load employees or jobs");
      } finally {
        setIsLoading(false);
      }
    };

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
          {
            emp_ids,
            job_id,
          }
        );
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

  const handleUnassign = async (emp_id: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/employee-job/${emp_id}`
      );
      toast.success("❎ Job unassigned successfully");
      setEmployees((prev) =>
        prev.map((e) => (e.emp_id === emp_id ? { ...e, job_id: null } : e))
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "❌ Failed to unassign job");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading data...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Jobs</h1>

      {/* Job Assignment Section */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Assign Job</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Select Job
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">-- Select a Job --</option>
            {jobs.map((job) => (
              <option key={job.job_id} value={job.job_id}>
                {job.job_name} ({job.job_category})
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="w-full px-3 py-2 border rounded-md mb-4"
        />

        <div className="max-h-48 overflow-y-auto border rounded-md px-4 py-2 mb-4">
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
                  className="flex items-center space-x-2 mb-2"
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
                  <span className="text-sm">
                    {emp.emp_firstname} {emp.emp_lastname} - {emp.emp_email}
                  </span>
                </label>
              );
            })}
        </div>

        <button
          onClick={handleAssign}
          disabled={assigning}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {assigning ? "Assigning..." : "Assign Job"}
        </button>
      </div>

      {/* Employee-Job List Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          All Employees & Job Status
        </h2>

        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Assigned Job</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const job = jobs.find((j) => j.job_id === emp.job_id);
              return (
                <tr
                  key={emp.emp_id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 font-medium">
                    {emp.emp_firstname} {emp.emp_lastname}
                  </td>
                  <td className="px-4 py-2">{emp.emp_email}</td>
                  {/* Job Assignment Cell */}
                  <td className="px-4 py-2 text-gray-800">
                    {editRowId === emp.emp_id ? (
                      <select
                        value={editJobValue}
                        onChange={(e) => setEditJobValue(e.target.value)}
                        className="px-2 py-1 border rounded text-sm w-full"
                      >
                        <option value="">-- Not Assigned --</option>
                        {jobs.slice(0, 5).map((job) => (
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

                  {/* Action Cell */}
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      {editRowId === emp.emp_id ? (
  <>
    <button
      className="text-green-600 hover:text-green-800 text-sm font-medium"
      onClick={async () => {
        try {
          // Call PUT route with :id
          await axios.put(`${import.meta.env.VITE_BASE_URL}/employee-job/${emp.emp_id}`, {
            job_id: editJobValue ? Number(editJobValue) : null,
          });

          // Update local UI
          const updatedEmp = {
            ...emp,
            job_id: editJobValue ? Number(editJobValue) : null,
          };

          setEmployees((prev) =>
            prev.map((e) => (e.emp_id === emp.emp_id ? updatedEmp : e))
          );

          toast.success("✅ Job updated");
          setEditRowId(null);
          setEditJobValue("");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "❌ Failed to update job");
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
  );
};

export default ManageJob;
