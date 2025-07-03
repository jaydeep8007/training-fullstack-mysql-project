import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GlobalConfigForm from "@/components/globalConfig/GlobalConfigForm";

interface ConfigSection {
  global_config_slug: string;
  global_config_label: string;
  global_config_sequence: number;
}

interface FullConfig {
  global_config_slug: string;
  global_config_label: string;
  global_config_json_value: any;
  global_config_fields: any;
}

const GlobalConfigPage = () => {
  const [sections, setSections] = useState<ConfigSection[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedConfig, setSelectedConfig] = useState<FullConfig | null>(null);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Fetch section list on mount
  const fetchSections = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/global-config`);
      const data = res.data?.data || [];
      setSections(data);
      if (data.length > 0) {
        setSelectedSlug(data[0].global_config_slug);
      }
    } catch (error) {
      toast.error("Failed to load configuration sections");
    } finally {
      setLoadingSections(false);
    }
  };

  // Fetch full config when slug changes
  const fetchConfigBySlug = async (slug: string) => {
    try {
      setLoadingConfig(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/global-config/${slug}`);
      const data = res.data?.data;
      setSelectedConfig(data || null);
    } catch (error) {
      toast.error("Failed to load config details");
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      fetchConfigBySlug(selectedSlug);
    }
  }, [selectedSlug]);

  return (
    <div className="flex h-full border rounded-lg shadow bg-background overflow-hidden">
      {/* Left panel: Section list */}
      <div className="w-64 border-r bg-muted p-4 space-y-3">
        <h2 className="text-lg font-semibold text-primary mb-3">Config Sections</h2>
        {loadingSections ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No config sections found.</p>
        ) : (
          sections.map(({ global_config_slug, global_config_label }) => (
            <button
              key={global_config_slug}
              onClick={() => setSelectedSlug(global_config_slug)}
              className={`w-full text-left px-3 py-2 rounded-md transition font-medium
                ${selectedSlug === global_config_slug
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted/60"
                }`}
            >
              {global_config_label}
            </button>
          ))
        )}
      </div>

      {/* Right panel: Config Form */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* <h1 className="text-xl font-bold tracking-tight text-primary">
          {
            sections.find((s) => s.global_config_slug === selectedSlug)
              ?.global_config_label || selectedSlug.replace(/-/g, " ").toUpperCase()
          }
        </h1> */}

        {loadingConfig ? (
          <p className="text-muted-foreground">Loading configuration...</p>
        ) : !selectedConfig ? (
          <p className="text-muted-foreground">No configuration found.</p>
        ) : (
          <GlobalConfigForm config={selectedConfig} />
        )}
      </div>
    </div>
  );
};

export default GlobalConfigPage;
