import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ConfigField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
}

interface GlobalConfig {
  global_config_slug: string;
  global_config_label: string;
  global_config_json: Record<string, any>;
  global_config_fields: ConfigField[];
}

interface GlobalConfigFormProps {
  config: GlobalConfig;
}

const GlobalConfigForm = ({ config }: GlobalConfigFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(config.global_config_json || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/global-configs/${config.global_config_slug}`, {
        global_config_json: formData,
      });
      toast.success(`${config.global_config_label} updated successfully`);
    } catch (err: any) {
      toast.error("Failed to update config. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border p-6 rounded-xl bg-card shadow-lg ring-1 ring-muted/30">
      <h2 className="text-xl font-semibold mb-4 text-primary tracking-wide">
        {config.global_config_label}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.global_config_fields.map((field) => (
          <div key={field.key} className="flex flex-col">
            <label className="text-sm font-medium text-muted-foreground mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="px-3 py-2 rounded-md border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default GlobalConfigForm;
