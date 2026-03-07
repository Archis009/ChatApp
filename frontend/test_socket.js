import { io } from "socket.io-client";
import axios from "axios";

async function test() {
  // Login as Darshan to get the cookie
  // But wait, there is no darshan account hardcoded. Let's create one.
  const darshanEmail = "darshan@gmail.com";
  let cookieStr = "";
  try {
    const res = await axios.post("http://localhost:3000/api/auth/signup", {
      fullName: "Darshan",
      email: darshanEmail,
      password: "password123",
    });
    cookieStr = res.headers["set-cookie"][0];
  } catch (err) {
    if (err.response && err.response.status === 400) {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email: darshanEmail,
        password: "password123",
      });
      cookieStr = res.headers["set-cookie"][0];
    }
  }

  const jwtPrefix = "jwt=";
  const token = cookieStr.split(";").find(c => c.trim().startsWith(jwtPrefix)).trim().substring(jwtPrefix.length);

  const socket = io("http://localhost:3000", {
    extraHeaders: {
      Cookie: `jwt=${token}`,
    },
  });

  socket.on("connect", async () => {
    console.log("Connected as Darshan! Socket ID:", socket.id);

    // Login as Mahi and send a message
    const mahiEmail = "mahi@gmail.com";
    let mahiCookie = "";
    const loginRes = await axios.post("http://localhost:3000/api/auth/login", {
      email: mahiEmail,
      password: "password123",
    });
    mahiCookie = loginRes.headers["set-cookie"][0];

    console.log("Sending message from Mahi...");
    // Need Darshan's ID
    const loginDarshan = await axios.post("http://localhost:3000/api/auth/login", {
      email: darshanEmail,
      password: "password123",
    });
    const darshanId = loginDarshan.data._id;

    try {
      await axios.post(`http://localhost:3000/api/messages/send/${darshanId}`, {
        text: "Real time test!",
      }, {
        headers: { Cookie: mahiCookie }
      });
      console.log("Message sent to the backend!");
    } catch (e) {
      console.error("Error sending message:", e.response ? e.response.data : e.message);
    }
  });

  socket.on("newMessage", (msg) => {
    console.log("New message received by Darshan!", msg);
    process.exit(0);
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });
}

test();
