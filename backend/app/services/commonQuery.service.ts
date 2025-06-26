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
        const results = await model.findAll({
          where: filter,
          ...options, // include, limit, offset, order, etc.
        });
        return results;
      } catch (error) {
        throw error;
      }
    },

      async countDocuments(model: any, filter: any = {}) {
    return await model.count({ where: filter });
  },

   // ✅ GET ONE record by filter with optional include/options
async getOne(
  filter: Record<string, any> = {},
  options: Record<string, any> = {}
) {
  try {
    const item = await model.findOne({
      where: filter,
      ...options, // includes things like `include`, `attributes`, `order`, etc.
    });
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
      options: { returnDeleted?: boolean } = {},
    ) {
      try {
        const id = typeof filter === 'object' ? filter : { id: filter };

        // Check if the item exists before deletion
        const existingItem = await model.findOne({ where: id });

        if (!existingItem) {
          return {
            deleted: false,
            deletedCount: 0,
          };
        }

        const deletedItem = options.returnDeleted ? existingItem : null;

        const deletedCount = await model.destroy({ where: id });

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

  async update(data: Record<string, any>, filter: Record<string, any>) {
  try {
    const [updatedCount] = await model.update(data, { where: filter }); // ✅ MUST be under `where`
    return updatedCount;
  } catch (error) {
    throw error;
  }
},


   
    async getAllWithInclude(
      filter: Record<string, any> = {},
      options: {
        page?: number;
        limit?: number;
        include?: any[];
      } = {}
    ) {
      try {
        const page = Number(options.page) > 0 ? Number(options.page) : 1;
        const limit = Number(options.limit) > 0 ? Number(options.limit) : 10;
        const offset = (page - 1) * limit;

        const result = await model.findAndCountAll({
          where: filter,
          include: options.include || [],
          limit,
          offset,
        });

        return {
          data: result.rows,
          pagination: {
            totalRecords: result.count,
            page,
            limit,
            totalPages: Math.ceil(result.count / limit),
          },
        };
      } catch (error) {
        throw error;
      }
    }
  }
}

    


export default commonQuery;
