const express = require("express");
const app = express();
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");
const router = express.Router();

app.use(
  express.urlencoded({
    extended: false,
  })
);

// Obtener posts
router.get("/", async (req, res, next) => {
    const results = await getPosts({});
    res.status(200).send(results);
});

// Obtener un post en especifico por ID
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const results = await getPosts({_id: id});
  res.status(200).send(results[0]); // Devuelve un array de elementos donde solo habrá siempre 1
});

router.post("/", async (req, res, next) => {
  // Esta la request vacia?
  if (!req.body.data.contenido) {
    console.log(req.body.data.contenido);
    return res.sendStatus(400);
  }

  const data = {
    contenido: req.body.data.contenido,
    autor: req.session.user,
  };

  console.log(req.body);

  if (req.body.data.respondeA){
    data.respondeA = req.body.data.respondeA;
  }

  Post.create(data)
    .then(async (post) => {
      // Popular el campo Autor con los datos del usuario cuya sesion esta activa
      post = await User.populate(post, {
        path: "autor",
      });

      // 201 Created
      res.status(201).send(post);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(400);
    });
});

router.put("/:id/like", async (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.user._id;
  var postId = req.params.id;

  // El usuario esta likeando o deslikeando?
  const liked = req.session.user.likes && req.session.user.likes.includes(id);

  const option = liked ? "$pull" : "$addToSet";

  // Insertar Like en la base, con [] inyectamos la variable, y actualizamos la sesion del usuario
  req.session.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: id } },
    { new: true } // devuelve el objeto actualizado
  ) 
    .catch((e) => {
      console.log(e);
      res.sendStatus(400);
    });

  // Insertar like en el post
  const post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  ) 
    .catch((e) => {
      console.log(e);
      res.sendStatus(400);
    });

  res.status(200).send(post);
});

// Manejo de los redweets
router.post("/:id/redweet", async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.session.user._id;

    // Intentamos eliminar el reweet, si podemos, era porque existia un redweet
    const deletedPost = await Post.findOneAndDelete({autor: userId, redweetData: postId})
    .catch(error => {console.log(error);  res.status(400);})

    const option = deletedPost != null ? '$pull' : "$addToSet";
    let redweet = deletedPost;

    if (redweet == null){
      redweet = await Post.create({ autor: userId, redweetData: postId})
      .catch(error => {console.log(error);  res.status(400);})
    }

    // Actualizamos sesion del usuario
    req.session.user = await User.findByIdAndUpdate(
      userId,
      { [option]: { redweets: redweet._id } },
      { new: true } // devuelve el objeto actualizado
    ) 
      .catch((e) => {
        console.log(e);
        res.sendStatus(400);
      });
  
    const post = await Post.findByIdAndUpdate(
      postId,
      { [option]: { redweetsUsers: userId } },
      { new: true }
    ) 
      .catch((e) => {
        console.log(e);
        res.sendStatus(400);
      });

    res.status(200).send(post);
  });

  const getPosts = async (filter) => {
    const results = await Post.find(filter)
    .populate("autor") // Obtener el objeto entero del autor
    .populate("redweetData")
    .sort({ createdAt: -1 }) // Ordenar los dwits
    .catch((e) => console.log(e));

    return await User.populate(results, {path: "redweetData.autor"});
  }

module.exports = router;
