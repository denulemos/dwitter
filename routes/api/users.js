const express = require("express");
const app = express();
const User = require("../../schemas/UserSchema");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({dest: "uploads/"});
const router = express.Router();

app.use(
  express.urlencoded({
    extended: false,
  })
);

router.get("/", async (req, res, next) => {
  let searchObj = req.query;
  if (req.query.search){
    searchObj = {
      $or: [
        {displayName: { $regex: searchObj.search, $options: "i"}},
        {usuario: { $regex: searchObj.search, $options: "i"}},
      ]
    }
  }

  User.find(searchObj)
  .then(results => {
    res.status(200).send(results);
  })
  .catch(e => {
    console.log(e);
  })
});

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

  const filePath = `/uploads/images/${req.file.filename}.png`;
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `../../${filePath}`); // Path completo al archivo

  //Movemos al archivo
  fs.rename(tempPath, targetPath, async error => {
    if (error){
      console.log(error);
      return res.sendStatus(400);
    }

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, {foto: filePath}, {new: true});
    res.sendStatus(204);
  });
});

router.post("/coverPhoto", upload.single("croppedImage"), async (req, res, next) => {
  if(!req.file){
    console.log('No hay file en la req');
    return res.sendStatus(400);
  }

  const filePath = `/uploads/images/${req.file.filename}.png`;
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `../../${filePath}`); // Path completo al archivo

  //Movemos al archivo
  fs.rename(tempPath, targetPath, async error => {
    if (error){
      console.log(error);
      return res.sendStatus(400);
    }

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, {fotoPortada: filePath}, {new: true});
    res.sendStatus(204);
  });
});

module.exports = router;
