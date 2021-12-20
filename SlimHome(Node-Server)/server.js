const port = process.env.port || 80;
let esp32_list = {};

const cors = require("cors");
const app = require("express")();
const socket = require("socket.io");

const server = app.listen(port, (e) => {
  console.log("Server start on " + port);
});

app.use(cors());
app.use(require("express").static("public"));

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  },
});

// when a conenction on socket is made
io.on("connection", (c) => {
  if (c.handshake.query?.device_id) {
    const d_info = {device_id, device_slug, device_password} = c.handshake.query;
    if (device_id == "esp32") {
      esp32_list[device_slug] = { ...c.handshake.query, id: c.id };
    }

    c.join(device_slug);
    console.log(`New connecstion: ${c.id} | device: ${device_id}`);
  }

  //io.to(masterPort).emit('data', masterPort)
  //c.emit("data", c.handshake);
  //c.emit("data", esp32_list)

  //When a react client send data to the server
  c.on("espCommand_receive", (data) => {
    if (esp32_list[data.command_info?.device_slug] == undefined || esp32_list[data.command_info?.device_slug] == null) {
      c.emit("responseToReact", {
        type: "error",
        do: "nothing",
        message: "Looks like esp not connected yet try again later",
      })
      return
    }

    if(esp32_list[data.command_info?.device_slug]['password'] != data.command_info?.device_password){
      c.emit("responseToReact", {
        type: "error",
        do: "opensettings",
        message: "Wrong password please adjust your settings",
        request: data.command_info
      })
      return;
    }

    c.broadcast.to(data.command_info?.device_slug).emit("espCommand_compile", data);
  });
});
