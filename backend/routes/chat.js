const express = require("express");
const router = express.Router();
const User = require("../user.model");
const Match = require("../match.model");
const Chatroom = require("../chatroom.model");
const Message = require("../message.model");
const uuid = require("uuid");

// Retrieve all current user's chatrooms
router.get("/", async (req, res, next) => {
  if (!req.session.user) {
    // not logged in
    res.sendStatus(401);
    return;
  }

  // Get all chatrooms associated with the current user
  const chatrooms = await Chatroom.find({ users: req.session.user.username });

  res.json(chatrooms);
});

router.post("/time-update", (req, res)=>{
  const {time, id} = req.body;
  const filter = { id: id};
  console.log(id)
  const update = {
    $set: { meetTime: time },
  };
  Chatroom.updateOne(filter, update, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Updated time");
    console.log(result);
  });

  res.sendStatus(200);
})

// Create a new group chatroom (should be linked to a form)
router.post("/new-group", async (req, res, next) => {
  if (!req.session.user) {
    // not logged in
    res.sendStatus(401);
    return;
  }

  const currUsername = req.session.user.username;
  const chatTitle = req.body.title;
  const chatBuddies = req.body.users; // will be an array consisting of all people to put in the chat
  const chatId = uuid.v4();

  // Check if current user is included in the list of users
  if (!chatBuddies.includes(currUsername)) {
    chatBuddies.unshift(currUsername); // add to beginning as the creator
  }

  // Create chatroom in database
  let chatroom = new Chatroom({
    id: chatId,
    title: chatTitle,
    type: "group",
    users: chatBuddies,
  });

  try {
    await chatroom.save();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500); // server error
    return;
  }

  res.json(chatId); // return the chatid for the frontend to redirect to
});

// Retrieve all messages from a given chatroom
router.get("/:id", async (req, res, next) => {
  if (!req.session.user) {
    // not logged in
    res.sendStatus(401);
    return;
  }

  const currUsername = req.session.user.username;
  const chatId = req.params.id;

  // Check requested chatroom
  const chatrooms = await Chatroom.find({ users: currUsername, id: chatId });
  if (chatrooms.length <= 0) {
    // no chats found
    res.sendStatus(403);
    return;
  }

  // Return all messages for requested chatroom
  const messages = await Message.find({
    chatId: chatId,
  });

  res.json(messages); // client will sort out returned messages
});

// Add a user to a group chat
router.post("/add-user/:id", async (req, res, next) => {
  if (!req.session.user) {
    // not logged in
    res.sendStatus(401);
    return;
  }

  const currUsername = req.session.user.username;
  const chatId = req.params.id;
  const addUsername = req.body.userToAdd;

  // Check if the user already exists in the current chatroom
  const chatrooms = await Chatroom.find({ users: currUsername, id: chatId });
  if (chatrooms.length <= 0) {
    // no chats found
    res.sendStatus(401);
    return;
  }

  // Check if the user is actually buddies with the current user
  const userQuery = await User.find({
    username: currUsername,
    buddies: addUsername,
  });
  if (userQuery.length <= 0) {
    // user is NOT in current user's buddies
    res.sendStatus(401);
    return;
  }

  // Add requested user to the group chat
  await Chatroom.updateOne(
    { id: chatId },
    { $push: { users: addUsername } }
  ).catch((e) => {
    console.log(e);
    res.sendStatus(500);
    return;
  });

  res.sendStatus(200);
});

// Leave a group chat
router.delete("/leave/:id", async (req, res, next) => {
  if (!req.session.user) {
    // not logged in
    res.sendStatus(401);
    return;
  }

  const currUsername = req.session.user.username;
  const chatId = req.params.id;

  // Check if the user already exists in the current chatroom
  const chatrooms = await Chatroom.find({ users: currUsername, id: chatId });
  if (chatrooms.length <= 0) {
    // no chats found
    res.sendStatus(401);
    return;
  }

  // Remove the current user from that group chat
  await Chatroom.updateOne(
    { id: chatId },
    { $pull: { users: currUsername } }
  ).catch((e) => {
    console.log(e);
    res.sendStatus(500);
    return;
  });

  res.sendStatus(200);
});

// Retrieve all users for a chatroom
router.get("/:id/users", async (req, res, next) => {
  if (!req.session.user) {
    // not logged in
    res.sendStatus(401);
    return;
  }

  const currUsername = req.session.user.username;
  const chatId = req.params.id;

  // Check requested chatroom
  const chatrooms = await Chatroom.find({ users: currUsername, id: chatId });
  if (chatrooms.length <= 0) {
    // no chats found
    res.sendStatus(403);
    return;
  }

  // Return all users for requested chatroom
  const chatroom = await Chatroom.findOne({ id: chatId });
  if (!chatroom) {
    res.sendStatus(404);
    return;
  }

  const users = await User.find({ username: { $in: chatroom.users } });

  res.json(users);
});

// New messages will be handled using socket.io

module.exports = router;
