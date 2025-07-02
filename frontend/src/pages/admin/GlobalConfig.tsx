import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GlobalConfigForm from "@/components/globalConfig/GlobalConfigForm";

interface ConfigItem {
  global_config_slug: string;
  global_config_key: string;
  global_config_value: string;
  global_config_label: string;
  global_config_json: any;
  global_config_fields: any;
  // Add other relevant fields
}

const GlobalConfigPage = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  const fetchConfigs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/global-config`);
      const data = res.data?.data || [];
      setConfigs(data);
      if (data.length > 0) {
        setSelectedSlug(data[0].global_config_slug);
      }
    } catch (error) {
      toast.error("Failed to load global configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const uniqueSlugs = Array.from(new Set(configs.map((c) => c.global_config_slug)));

  const filteredConfigs = configs.filter((c) => c.global_config_slug === selectedSlug);

  return (
    <div className="flex h-full border rounded-lg shadow bg-background overflow-hidden">
      {/* Left panel: Slug list */}
      <div className="w-64 border-r bg-muted p-4 space-y-3">
        <h2 className="text-lg font-semibold text-primary mb-3">Config Sections</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : uniqueSlugs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No config sections found.</p>
        ) : (
          uniqueSlugs.map((slug) => (
            <button
              key={slug}
              onClick={() => setSelectedSlug(slug)}
              className={`w-full text-left px-3 py-2 rounded-md transition font-medium
                ${selectedSlug === slug
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted/60"
                }`}
            >
              {slug.replace(/-/g, " ").toUpperCase()}
            </button>
          ))
        )}
      </div>

      {/* Right panel: Form display */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <h1 className="text-xl font-bold tracking-tight text-primary">
          {selectedSlug.replace(/-/g, " ").toUpperCase()}
        </h1>

        {loading ? (
          <p className="text-muted-foreground">Loading configuration...</p>
        ) : filteredConfigs.length === 0 ? (
          <p className="text-muted-foreground">No configs found for this section.</p>
        ) : (
          filteredConfigs.map((config) => (
            <GlobalConfigForm key={config.global_config_key} config={config} />
          ))
        )}
      </div>
    </div>
  );
};

export default GlobalConfigPage;
