import { userShopService } from "./userShop.service.js";

export const userShopController = {

  assign: async (req, res, next) => {
    try {
      const result = await userShopService.assignUsersToShop(
        req.user.tenantId,
        req.params.id,
        req.body.userIds
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await userShopService.getShopUsers(
        req.user.tenantId,
        req.params.id
      );

      res.json(users);
    } catch (err) {
      next(err);
    }
  }

};