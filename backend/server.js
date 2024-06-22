import { app } from "./app.js";
import { connectDB } from "./config/database.js";

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(process.env.PORT, () => {
  console.log(
    `Server is working on port:${process.env.PORT} in ${process.env.NODE_ENV} Mode`
  );
});