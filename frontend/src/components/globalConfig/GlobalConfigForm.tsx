import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface SelectOption {
  label: string;
  value: string;
}

interface ConfigField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: SelectOption[];
}

interface GlobalConfig {
  global_config_slug: string;
  global_config_label: string;
  global_config_json_value: Record<string, any>;
  global_config_fields: Record<string, any>[] | null | undefined;
}

interface GlobalConfigFormProps {
  config: GlobalConfig;
}

const GlobalConfigForm = ({ config }: GlobalConfigFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(
    config.global_config_json_value || {}
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields: ConfigField[] = Array.isArray(config.global_config_fields)
    ? config.global_config_fields.map((fieldObj) => {
        const key = Object.keys(fieldObj)[0];
        return {
          key,
          ...fieldObj[key],
        };
      })
    : [];

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
   await axios.put(
  `${import.meta.env.VITE_BASE_URL}/global-config/${config.global_config_slug}`,
  {
    global_config_json_value: formData,
  }
);
      toast.success(`${config.global_config_label} updated successfully`);
      setIsEditing(false); // switch back to view mode
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

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No fields available for this configuration.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col">
              <label className="text-sm font-medium text-muted-foreground mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "select" ? (
                <select
                  disabled={!isEditing}
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  className={`px-3 py-2 rounded-md border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 ${
                    isEditing
                      ? "focus:ring-primary/40"
                      : "bg-muted cursor-not-allowed text-muted-foreground"
                  }`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder || ""}
                  required={field.required}
                  disabled={!isEditing}
                  value={formData[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={`px-3 py-2 rounded-md border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 ${
                    isEditing
                      ? "focus:ring-primary/40"
                      : "bg-muted cursor-not-allowed text-muted-foreground"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 text-sm font-medium rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2 text-sm font-medium rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default GlobalConfigForm;
