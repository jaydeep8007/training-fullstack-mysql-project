import { msg as enMsg } from './en.constant';
import { msg as esMsg } from './es.constant';
import globalConfigModel from '../../models/globalConfig.model';

type SupportedLangCode = 'en' | 'es';

export let msg = enMsg;
export let currentLang: SupportedLangCode = 'en';

/**
 * Initializes language messages from DB.
 */
export async function initLanguage() {
  try {
    const config = await globalConfigModel.findOne({
      where: { global_config_slug: 'language_settings' },
    });

    if (!config) {
      console.warn('⚠️ No language setting found in DB. Defaulting to English.');
      msg = enMsg;
      currentLang = 'en';
      return;
    }

    const jsonValue = config.get('global_config_json_value') as {
      default_language?: string;
      available_languages?: { code: string; label: string }[];
    };

    const defaultLabel = jsonValue?.default_language?.toLowerCase();

    // Try to find the matching language code by label
    const matchedLang = jsonValue?.available_languages?.find((lang) =>
      lang.label.toLowerCase() === defaultLabel
    );

    const langCode: SupportedLangCode = matchedLang?.code === 'es' ? 'es' : 'en';

    currentLang = langCode;
    msg = langCode === 'es' ? esMsg : enMsg;

    console.log(`✅ Language set to '${langCode}' from DB`);
    console.log(`✔️ Sample message after setting: ${msg.common.requiredAllFields}`);
  } catch (error) {
    console.error('❌ Failed to load language from DB:', error);
    msg = enMsg;
    currentLang = 'en';
    console.warn('⚠️ Falling back to English.');
  }
}

export function getCurrentLanguage(): SupportedLangCode {
  return currentLang;
}
