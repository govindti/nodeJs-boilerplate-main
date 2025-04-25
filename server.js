import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(
    `App is listening on port ${port} in ${process.env.NODE_ENV} mode`
  );
});
