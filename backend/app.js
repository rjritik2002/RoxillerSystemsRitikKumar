
import express from "express";
import productRouter from "./Routes/product.js";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";



export const app = express();

config({
  path: "./config/config.env",
});

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/", productRouter);


app.get("/", (req, res) => {
  res.send("Nice working");
});

app.use(errorMiddleware);
