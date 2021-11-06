const express = require("express");
const app = express();
const User = require("../../schemas/UserSchema");
const multer = require('multer');
const upload = multer({dest: "uploads/"});
const router = express.Router();

app.use(
  express.urlencoded({
    extended: false,
  })
);

// Obtener posts
router.put("/:userId/follow", async (req, res, next) => {
  const userId = req.params.userId;

  // Si el usuario no existe, será null
  const user = await User.findById(userId);

  if (!user) return res.sendStatus(404);

  // Ya lo sigue?
  const isFollowing =
    user.seguidores && user.seguidores.includes(req.session.user._id);
  const option = isFollowing ? "$pull" : "$addToSet";

  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    { [option]: { siguiendo: userId } },
    { new: true }
  ).catch((e) => {
    console.log(e);
    res.sendStatus(400);
  });

  User.findByIdAndUpdate(
    userId,
    { [option]: { seguidores: req.session.user._id } },
    { new: true }
  ).catch((e) => {
    console.log(e);
    res.sendStatus(400);
  });

  res.status(200).send(req.session.user);
});

router.get("/:userId/siguiendo", async (req, res, next) => {
  User.findById(req.params.userId)
  .populate("siguiendo")
  .then(results => {
    res.status(200).send(results);
  })
  .catch(error => console.log(error))
});

router.get("/:userId/seguidores", async (req, res, next) => {
  User.findById(req.params.userId)
  .populate("seguidores")
  .then(results => {
    res.status(200).send(results);
  })
  .catch(error => console.log(error))
});

router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
  if(!req.file){
    console.log('No hay file en la req');
    return res.sendStatus(400);
  }

  res.sendStatus(200);
});

module.exports = router;
