import cors from "cors";
import express from "express";
import helmet from "helmet";
import { json } from "body-parser";
import { limiter } from "./limiter";
import router from "./routes";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  app.use(limiter);
}

app.use(helmet());
app.use(json());

app.use(cors({ credentials: true, origin: true }));
app.use(router);

export { app };
