// utils/getSmtpSettings.ts

import globalConfigModel from "../models/globalConfig.model";

export type SmtpConfig = {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_email: string;
  smtp_password: string;
};

export async function getSmtpSettings(): Promise<SmtpConfig | null> {
  try {
    const config = await globalConfigModel.findOne({
      where: { global_config_slug: "smtp_settings" },
    });

    if (!config) {
      console.warn("⚠️ SMTP settings not found in DB.");
      return null;
    }

    const configJson = config.get("global_config_json_value") as Partial<SmtpConfig> | undefined;

    if (
  !configJson?.smtp_host ||
  !configJson?.smtp_port ||
  !configJson?.smtp_user ||
  !configJson?.smtp_email ||
  !configJson?.smtp_password
) {
  console.warn("⚠️ Incomplete SMTP settings found in DB.");
  return null;
}

    const smtpConfig: SmtpConfig = {
      smtp_host: configJson.smtp_host,
      smtp_port: Number(configJson.smtp_port),
      smtp_user: configJson.smtp_user,
      smtp_email: configJson.smtp_email,
      smtp_password: configJson.smtp_password,
    };

    console.log("✅ SMTP config loaded:", smtpConfig);
    return smtpConfig;
  } catch (err) {
    console.error("❌ Failed to load SMTP config:", err);
    return null;
  }
}
