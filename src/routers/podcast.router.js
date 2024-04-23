const { Router } = require("express");
const { addPodcastValidate } = require("../validations/podcast.validation");
const { addPodcastToDb } = require("../controllers/podcast.controller");
const validate = require("../validations/validate");

const router = Router();

router.post("/add", addPodcastValidate(), validate, addPodcastToDb);

module.exports = router;
