import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    job_name: "",
    job_sku: "",
    job_category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!jobData.job_name || !jobData.job_sku || !jobData.job_category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/job`,
        jobData
      );

      toast.success("Job created successfully");
      setJobData({ job_name: "", job_sku: "", job_category: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Create New Job</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Job Name</label>
        <input
          type="text"
          name="job_name"
          value={jobData.job_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="e.g., Frontend Developer"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Job SKU</label>
        <input
          type="text"
          name="job_sku"
          value={jobData.job_sku}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="e.g., JB001"
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Job Category</label>
        <input
          type="text"
          name="job_category"
          value={jobData.job_category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="e.g., IT Department"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Job"}
      </button>
    </div>
  );
};

export default CreateJob;
