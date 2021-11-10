const express = require("express");
const app = express();
const controller = require('../../controllers/postController');
const router = express.Router();

app.use(
  express.urlencoded({
    extended: false,
  })
);

router.get("/", controller.getPosts);

router.get("/:id", controller.getPostById);

router.post("/", controller.createPost);

router.put("/:id/like", controller.likePost);

router.post("/:id/redweet", controller.redweet);

router.delete("/:id", controller.deletePost);

router.put("/:id", controller.pinPost);

module.exports = router;
