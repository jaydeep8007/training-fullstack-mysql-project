const commonQuery = (model: any) => {
  return {
    // ✅ CREATE new record
    async create(data: Record<string, any>) {
      try {
        const createdItem = await model.create(data);
        return createdItem;
      } catch (error) {
        throw error;
      }
    },
    
// ✅ GET ALL records with pagination and optional associations
async getAll(
  filter: Record<string, any> = {},
  options: Record<string, any> = {}
) {
  try {
    const page = Number(options.page) > 0 ? Number(options.page) : 1;
    const limit = Number(options.limit) > 0 ? Number(options.limit) : 10;
    const offset = (page - 1) * limit;

    const queryOptions: any = {
      where: filter,
      limit,
      offset,
    };

    // ✅ Optional include associations
    if (options.include) {
      queryOptions.include = options.include;
    }

    // ✅ Optional ordering
    if (options.order) {
      queryOptions.order = options.order;
    }

    const [data, totalDataCount] = await Promise.all([
      model.findAll(queryOptions),
      model.count({ where: filter }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        totalDataCount,
        totalPages: Math.ceil(totalDataCount / limit),
      },
    };
  } catch (error) {
    throw error;
  }
},

    // ✅ GET ONE record by filter
    async getOne(filter: Record<string, any> = {}) {
      try {
        const item = await model.findOne({ where: filter });
        return item;
      } catch (error) {
        throw error;
      }
    },

    // ✅ GET BY PRIMARY KEY with options
    async getById(id: number | string, options: Record<string, any> = {}) {
      try {
        const item = await model.findByPk(id, options);
        return item;
      } catch (error) {
        throw error;
      }
    },

    // ✅ DELETE by filter or primary key (no hardcoded messages)
async deleteById(
  filter: Record<string, any> | number | string,
  options: { returnDeleted?: boolean } = {}
) {
  try {
    const whereClause =
      typeof filter === "object" ? filter : { id: filter };

    // Check if the item exists before deletion
    const existingItem = await model.findOne({ where: whereClause });

    if (!existingItem) {
      return {
        deleted: false,
        deletedCount: 0,
      };
    }

    const deletedItem = options.returnDeleted ? existingItem : null;

    const deletedCount = await model.destroy({ where: whereClause });

    return {
      deleted: deletedCount > 0,
      deletedCount,
      deletedItem,
    };
  } catch (error) {
    throw error;
  }
},

    // ✅ UPDATE by filter (MySQL-compatible)
    async update(filter: Record<string, any>, data: Record<string, any>) {
      try {
        const [affectedCount] = await model.update(data, {
          where: filter,
        });

        // ✅ Fetch updated rows manually (optional)
        const updatedRows = await model.findAll({ where: filter });

        return { affectedCount, updatedRows };
      } catch (error) {
        throw error;
      }
    },
  };
};

export default commonQuery;
