const { Server } = require("socket.io");
const User = require("../user.model");
const Match = require("../match.model");
const Chatroom = require("../chatroom.model");
const Message = require("../message.model");

module.exports =
  /**
   * @param {Server} io
   */
  function (io) {
    io.of("/chat").on("connection", async (socket) => {
      let chatId = socket.handshake.query.chatId;
      console.log("Received new client for chat: " + chatId);
      socket.join(chatId);

      socket.on("message", async (msg) => {
        const message = new Message({
          chatId: msg.chatroom,
          fromUser: msg.fromUser,
          body: msg.body,
          sent: msg.sent,
        });
        try {
          await message.save();
        } catch (e) {
          console.log(e.message);
          socket.emit("error", { message: e.message });
          return;
        }
        socket.broadcast.to(chatId).emit("response", msg);
      });

      socket.on("leave", async ({ chatroom, user }) => {
        try {
          const chat = await Chatroom.findOne({ id: chatroom });
          chat.users = chat.users.filter((u) => u !== user);
          await chat.save();
          socket.broadcast.to(chatroom).emit("update-users");
        } catch (e) {
          console.log(e.message);
          socket.emit("error", { message: e.message });
        }
      });
      socket.on("leave", async ({ chatroom, users }) => {
        try {
          const chat = await Chatroom.findOne({ id: chatroom });
          chat.users = chat.users.filter((u) => u !== user);
          await chat.save();
          socket.broadcast.to(chatroom).emit("update-users");
        } catch (e) {
          console.log(e.message);
          socket.emit("error", { message: e.message });
        }
      });
      socket.on("add-users", async ({ chatroom, users }) => {
        try {
          const chat = await Chatroom.findOne({ id: chatroom });
          chat.users = [...chat.users, ...users];
          await chat.save();
          socket.broadcast.to(chatroom).emit("update-users");
        } catch (e) {
          console.log(e.message);
          socket.emit("error", { message: e.message });
        }
      });
    });
  };
