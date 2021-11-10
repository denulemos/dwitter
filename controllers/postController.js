const User = require('../schemas/UserSchema');
const Post = require('../schemas/PostSchema');

const getPosts = async (req, res, next) => {
    const searchObj = req.query;

    if (searchObj.isReply) {
      const isReply = searchObj.isReply == "true";
      searchObj.respondeA = {$exists: isReply};
      delete searchObj.isReply;
    }

    if (searchObj.search){
      searchObj.contenido = { $regex: searchObj.search, $options: "i"} // i ignora el upper o lower case
      delete searchObj.search;
    }

    if(searchObj.followingOnly){
      const followingOnly = searchObj.followingOnly == "true";

      if (followingOnly){
        const objectIds = [];

        if (!req.session.user.siguiendo){
          req.session.user.siguiendo = [];
        }

        req.session.user.siguiendo.forEach(user => {
          objectIds.push(user);
        });

        objectIds.push(req.session.user._id);
  
        searchObj.autor = {$in: objectIds};
      }
    
      delete searchObj.followingOnly;
    }

    const results = await getPostsByFilter(searchObj);
    res.status(200).send(results);
}

const getPostById = async (req, res, next) => {
  const id = req.params.id;
  var postData = await getPostsByFilter({_id: id});
  postData = postData[0];
  var results = {
    postData: postData
  }

  if (postData.respondeA) {
    results.respondeA = postData.respondeA;
  }

  results.respuestas = await getPostsByFilter({respondeA: id});

  res.status(200).send(results); // Devuelve un array de elementos donde solo habrá siempre 1
};

const createPost = async (req, res, next) => {
  // Esta la request vacia?
  if (!req.body.data.contenido) {
    console.log(req.body.data.contenido);
    return res.sendStatus(400);
  }

  const data = {
    contenido: req.body.data.contenido,
    autor: req.session.user,
  };

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
};

const likePost = async (req, res, next) => {
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
};

const redweet = async (req, res, next) => {
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
};

const deletePost = async (req,res,next) => {
  Post.findByIdAndDelete(req.params.id)
  .then(() => {
    res.sendStatus(200)
  })
  .catch((e) => {
    console.log(e);
    res.sendStatus(400);
  })
};

const pinPost = async (req,res,next) => {

  if (req.body.pinned){
    await Post.updateMany({autor: req.session.user}, {pinned: false})
    .catch((e) => {
      console.log(e);
      res.sendStatus(400);
    })
  }
  Post.findByIdAndUpdate(req.params.id, req.body)
  .then(() => {
    res.sendStatus(204)
  })
  .catch((e) => {
    console.log(e);
    res.sendStatus(400);
  })
};

const getPostsByFilter = async (filter) => {
  var results = await Post.find(filter)
  .populate("autor") // Obtener el objeto entero del autor
  .populate("redweetData")
  .populate("respondeA")
  .sort({ createdAt: -1 }) // Ordenar los dwits
  .catch((e) => console.log(e));

  results = await User.populate(results, {path: "respondeA.autor"});
  return await User.populate(results, {path: "redweetData.autor"});
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  likePost,
  redweet,
  deletePost,
  pinPost
}