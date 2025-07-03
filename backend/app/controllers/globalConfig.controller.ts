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



const getAllConfigs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await globalConfigQuery.getAll(
      { global_config_view: true },
      {
        order: [['global_config_sequence', 'ASC']],
        attributes: [
          'global_config_id',
          'global_config_label',
          'global_config_slug',
          'global_config_sequence',
        ],
      }
    );

    return responseHandler.success(
      res,
      msg.globalConfig.fetchAllSuccess,
      configs,
      resCode.OK
    );
  } catch (error) {
    next(error);
  }
};

const updateGlobalConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { global_config_json_value } = req.body;

    if (!slug || !global_config_json_value) {
      return responseHandler.error(res, "Missing configuration slug or values", resCode.BAD_REQUEST);
    }

    const config = await globalConfigQuery.getOne({ global_config_slug: slug } );

    if (!config) {
      return responseHandler.error(res, "Configuration not found", resCode.NOT_FOUND);
    }

    config.set('global_config_json_value', global_config_json_value);
    await config.save();

        // ✅ If updating language_settings, re-run initLanguage
    if (slug === 'language_settings') {
      await initLanguage(); // Re-initialize language immediately
      console.log("✅ Language refreshed after update");
      console.log("✔️ Sample message after setting:", msg.common.requiredAllFields);
    }
    return responseHandler.success(res, "Configuration updated successfully", config, resCode.OK);
  } catch (error) {
    console.error("Update config error:", error);
    return responseHandler.error(res, "Failed to update configuration", resCode.SERVER_ERROR);
  }
};


export default {
  getConfigBySlug,
  getAllConfigs,
  updateGlobalConfig
};
