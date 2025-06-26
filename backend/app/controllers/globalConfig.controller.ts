import { Request, Response, NextFunction } from 'express';
import globalConfig from '../models/globalConfig.model';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../constants/resCode';
import { msg } from '../constants/language';
import { initLanguage } from '../constants/language';
import commonQuery from '../services/commonQuery.service';

const globalConfigQuery = commonQuery(globalConfig);

// ✅ GET Global Config by Slug
const getConfigBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;

    const config = await globalConfigQuery.getOne({ global_config_slug: slug });

    if (!config) {
      return responseHandler.error(res, msg.globalConfig.notFound, resCode.NOT_FOUND);
    }

    return responseHandler.success(res, msg.globalConfig.fetchSuccess, config, resCode.OK);
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE Language Setting & Refresh In-Memory msg
const updateLanguageSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { language_code } = req.body;

    if (!['en', 'es'].includes(language_code)) {
      return responseHandler.error(res, msg.common.languageInvalid, resCode.BAD_REQUEST);
    }

   await globalConfigQuery.update(
  { global_config_json: { language_code } },
  { global_config_slug: 'language_settings' } // ✅ This goes inside `where`
);

   
  
    // 🔁 Refresh language immediately
    await initLanguage();

    return responseHandler.success(res, msg.common.languageUpdateSuccess);
  } catch (error) {
    next(error);
  }
};

export default {
  getConfigBySlug,
  updateLanguageSetting,
};
