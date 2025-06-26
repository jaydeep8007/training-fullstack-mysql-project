// import { msg as enMsg } from './en.constant';
// import { msg as esMsg } from './es.constant';
// import globalConfigModel from '../../models/globalConfig.model';

// type SupportedLang = 'en' | 'es';

// let cachedMsg = enMsg; // ✅ Default to Spanish
// let currentLang: SupportedLang = 'en'; // ✅ Default to Spanish

// export async function initLanguage() {
//   try {
//     const config = await globalConfigModel.findOne({
//       where: { global_config_slug: 'language_settings' },
//     });

//     if (!config) {
//       console.warn('⚠️ No language setting found in DB. Using default language: es');
//       cachedMsg = esMsg;
//       return;
//     }

//     const globalConfigJson = config.get('global_config_json') as { language_code?: string } | undefined;
//     console.log('🌍 Language config loaded from DB:', globalConfigJson);

//     const lang: SupportedLang = globalConfigJson?.language_code === 'en' ? 'en' : 'es'; // ✅ Flip default

//     currentLang = lang;
//     cachedMsg = lang === 'en' ? enMsg : esMsg;

//     console.log(`✅ Language set to '${lang}' from DB global_config`);
//   } catch (error) {
//     console.error('❌ Error loading language config from DB:', error);
//     console.warn('⚠️ Falling back to default language: es');
//     cachedMsg = esMsg;
//   }
// }

// export function getMsg() {
//   return cachedMsg;
// }

// // Optional direct export for convenience
// export const msg = cachedMsg;


// import { msg as enMsg } from './en.constant';
// import { msg as esMsg } from './es.constant';
// import globalConfigModel from '../../models/globalConfig.model';

// type SupportedLang = 'en' | 'es';

// let cachedMsg = enMsg;
// let currentLang: SupportedLang = 'en';

// export async function initLanguage() {
//   try {
//     const config = await globalConfigModel.findOne({
//       where: { global_config_slug: 'language_settings' },
//     });

//     if (!config) {
//       console.warn('⚠️ No language setting found in DB. Using default language: es');
//       currentLang = 'es';
//       cachedMsg = esMsg;
//       return;
//     }

//     const globalConfigJson = config.get('global_config_json') as { language_code?: string } | undefined;
//     console.log('🌍 Language config loaded from DB:', globalConfigJson);

//     const lang: SupportedLang = globalConfigJson?.language_code === 'en' ? 'en' : 'es';
//     currentLang = lang;
//     cachedMsg = lang === 'en' ? enMsg : esMsg;

//     console.log(`✅ Language set to '${lang}' from DB global_config`);
//   } catch (error) {
//     console.error('❌ Error loading language config from DB:', error);
//     console.warn('⚠️ Falling back to default language: es');
//     currentLang = 'es';
//     cachedMsg = esMsg;
//   }
// }

// // ✅ Direct export of `msg` for clean imports
// export const msg = new Proxy({}, {
//   get(_, key: string) {
//     return cachedMsg[key as keyof typeof cachedMsg];
//   }
// }) as typeof enMsg;

// // Optional: if you ever need current language code
// export function getCurrentLanguage() {
//   return currentLang;
// }


// app/language/index.ts


import { msg as enMsg } from './en.constant';
import { msg as esMsg } from './es.constant';
import globalConfigModel from '../../models/globalConfig.model';

export let msg = enMsg; // This will be updated dynamically
export let currentLang = 'en';

export async function initLanguage() {
  try {
    const config = await globalConfigModel.findOne({
      where: { global_config_slug: 'language_settings' },
    });

    const globalConfigJson = config?.get('global_config_json') as { language_code?: string };
    const lang = globalConfigJson?.language_code === 'es' ? 'es' : 'en';

    currentLang = lang;
    msg = lang === 'es' ? esMsg : enMsg;

    console.log(`✅ Language set to '${lang}'`);
  } catch (err) {
    msg = enMsg;
    currentLang = 'en';
    console.warn('⚠️ Failed to load language. Defaulting to English.');
  }
}
