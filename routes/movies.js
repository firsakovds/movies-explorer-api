const router = require("express").Router();

const { validateCreateMovies, validateDeleteMovies } = require("../middlewares/validate")
const {
  getMovies,
  createMovies,
  deleteMovies,

} = require("../controllers/movies");
router.get("/movies", getMovies);

router.post("/movies", validateCreateMovies, createMovies);

router.delete("/movies/:_id", validateDeleteMovies, deleteMovies);

module.exports = router;