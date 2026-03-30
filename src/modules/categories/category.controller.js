import { categoryService } from "./category.service.js";

export const categoryController = {
  create: async (req, res, next) => {
    try {
      const category = await categoryService.createCategory(req.user.tenantId, req.body);
      console.log("Created Category: ", category);
      res.status(201).json(category);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const category = await categoryService.listCategory(req.user.tenantId);
      console.log("Category: ", category);
      res.json(category);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const category = await categoryService.getCategoryById(req.user.tenantId, req.params.id);
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const category = await categoryService.updateCategory(
        req.user.tenantId,
        req.params.id,
        req.body
      );
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const result = await categoryService.deleteCategory(req.user.tenantId, req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

//   addPoints: async (req, res, next) => {
//     try {
//       const { points } = req.body;
//       const updated = await customerService.addLoyaltyPoints(
//         req.user.tenantId,
//         req.params.id,
//         Number(points)
//       );
//       res.json(updated);
//     } catch (err) {
//       next(err);
//     }
//   },
};
