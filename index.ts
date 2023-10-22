import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";

export const EVENT = {
  REFRESH_PAGE: "refresh_page",
};

dotenv.config();

const app: Express = express();
const server = createServer(app);
export const io = new Server(server, {
  transports: ["polling"],
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT;

app.use(cors());
app.use(logger("dev"));
app.use(express.json(), express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express + Socket IO Server");
});

app.get("/refresh-page", async (req, res) => {
  const { pathname } = req.query;
  if (!pathname) {
    res.statusMessage = "pathname query missing";
    res.status(400).send("pathname query missing");
    return;
  }

  io.emit(EVENT.REFRESH_PAGE, { pathname });
  res.status(200).json({ pathname });
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("message", (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
