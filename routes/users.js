const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {validateUpdateUser} = require("../middlewares/validate")
const {
  updateUser,
  getCurrentUser,
} = require("../controllers/users");

router.get('/users/me', getCurrentUser);

router.patch(
  "/users/me",
  validateUpdateUser,
  updateUser
);

module.exports = router;
