// utils/getSmtpSettings.ts

import globalConfigModel from "../models/globalConfig.model";

export type SmtpConfig = {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
};

export async function getSmtpSettings(): Promise<SmtpConfig | null> {
  try {
    const config = await globalConfigModel.findOne({
      where: { global_config_slug: "smtp_settings" },
    });

    const configJson = config?.get("global_config_json") as Partial<SmtpConfig>;

    if (
      !configJson ||
      !configJson.smtp_host ||
      !configJson.smtp_port ||
      !configJson.smtp_username ||
      !configJson.smtp_password
    ) {
      throw new Error("Missing SMTP config fields");
    }

    const smtpConfig: SmtpConfig = {
      smtp_host: configJson.smtp_host,
      smtp_port: Number(configJson.smtp_port),
      smtp_username: configJson.smtp_username,
      smtp_password: configJson.smtp_password,
    };

    console.log("✅ SMTP config loaded:", smtpConfig);
    return smtpConfig;
  } catch (err) {
    console.error("❌ Failed to load SMTP config:", err);
    return null;
  }
}
