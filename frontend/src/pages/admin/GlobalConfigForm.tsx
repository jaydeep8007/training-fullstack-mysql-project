import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { buildZodSchemaFromFields } from "@/helper/globalConfigZodSchemaFromFields";
import BigCenterLoader from "../../layout/admin/loader";
import SkeletonGlobalConfigForm from "../../components/skeletons/globalConfigForm.skeleton";
import { AdminDataContext } from "@/context/AdminContext";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  //  const { admin } = useContext(AdminDataContext);




  const fields: ConfigField[] = Array.isArray(config.global_config_fields)
    ? config.global_config_fields.map((fieldObj) => {
        const key = Object.keys(fieldObj)[0];
        return {
          key,
          ...fieldObj[key],
        };
      })
    : [];

  useEffect(() => {
    setFormData(config.global_config_json_value || {});
    if (config.global_config_json_value) {
      setInitialLoading(false);
    }
  }, [config]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async () => {
    try {
      const schema = buildZodSchemaFromFields(
        config.global_config_fields || []
      );
      const result = schema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const field = err.path?.[0] as string;
          if (field) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({});
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/global-config/${
          config.global_config_slug
        }`,
        { global_config_json_value: formData }
      );

      toast.success(`${config.global_config_label} updated successfully`);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update configuration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <SkeletonGlobalConfigForm />;

  return (
    <div className="relative border border-border p-6 rounded-xl bg-card shadow-lg ring-1 ring-muted/30 overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-primary tracking-wide">
        {config.global_config_label}
      </h2>

      <div
        className={`relative ${
          loading ? "pointer-events-none opacity-50" : ""
        }`}
      >
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
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
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

                {errors[field.key] && (
                  <span className="text-sm text-red-500 mt-1">
                    {errors[field.key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {/* Top-right Edit button */}
      
      {/* {!isEditing && admin?.role === "admin" && ( */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1.5 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90"
          >
            Edit
          </button>
        </div>
      {/* )} */}

      {/* Bottom Save/Cancel Buttons */}
      {isEditing && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setErrors({});
              setFormData(config.global_config_json_value || {});
            }}
            className="px-5 py-2 text-sm font-medium rounded bg-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Loader overlay while saving */}
      {loading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
          <BigCenterLoader message="Saving configuration..." />
        </div>
      )}
    </div>
  );
};

export default GlobalConfigForm;
