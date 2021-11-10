const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const Message = require('../../schemas/MessageSchema');
const Chat = require('../../schemas/ChatSchema');
const User = require('../../schemas/UserSchema');
const Notification = require('../../schemas/NotificationSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
  Notification.find({receptor: req.session.user._id, tipoNotificacion: {$ne: "newMessage"}, emisor: {$ne: req.session.user._id}})
  .populate("receptor")
  .populate("emisor")
  .sort({createdAt: -1})
  .then(results => res.status(200).send(results))
  .catch(e => {
      console.log(e);
      res.sendStatus(400);
  })
})

router.put("/markAsOpened", async (req, res, next) => {
    Notification.updateMany({receptor: req.session.user._id}, {visto: true})
    .then(() => res.status(204))
    .catch(e => {
        console.log(e);
        res.sendStatus(400);
    })
  })

router.put("/:id/markAsOpened", async (req, res, next) => {
    Notification.findByIdAndUpdate(req.params.id, {visto: true})
    .then(() => res.status(204))
    .catch(e => {
        console.log(e);
        res.sendStatus(400);
    })
  })

module.exports = router;