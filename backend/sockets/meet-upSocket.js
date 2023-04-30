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
    io.of("/meet-up").on("connection", async (socket) => {
      console.log("connected")
      /*
      let chatId = socket.handshake.query.chatId;
      console.log("Received new client for chat: " + chatId);
      socket.join(chatId);
      */
*
      socket.on("join room", (room) => {
        console.log("Received new client for: " + room);
        socket.join(room);
      });


      
      
      socket.on("add-marker", (room,marker,dic) => {
        // emit a "new-marker" event to all connected clients

        console.log(room)
        console.log("room recieved")
        const filter = { id: room };
        const update = {
          $set: { meetspot: { type: "Point", coordinates: [marker.lng, marker.lat] } },
        };
        Chatroom.updateOne(filter, update, function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
      
          console.log("Updated the location");
          console.log(result);
        });
      
        console.log(`Message received from user ${socket.id}: ${marker}`);
        
        socket.broadcast.to(room).emit("newmarker", marker,room,dic);
      });
    });
  };