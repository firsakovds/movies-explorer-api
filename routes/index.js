const router = require("express").Router();
const userRouter = require("./users");
const movieRouter = require("./movies");
const UserNotFound = require("../errors/UserNotFound");
const { login, createUsers } = require("../controllers/users");
const auth = require('../middlewares/auth');
const {validateLogin, validateCreateUsers} = require("../middlewares/validate")

router.post('/signin', validateLogin, login);

router.post('/signup', validateCreateUsers, createUsers);

router.use(auth);
router.use("/", userRouter);
router.use("/", movieRouter);
router.use("*", (req, res, next) => {
   next(new UserNotFound('Такого роута нет'));
   return
});
module.exports = router;