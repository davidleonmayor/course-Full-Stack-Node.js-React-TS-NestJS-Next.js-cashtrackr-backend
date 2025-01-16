import colors from "colors";
import server from "./server";

import { initializeDB } from "./config/db";

const port = process.env.PORT || 4000;

server.listen(port, async () => {
  await initializeDB();
  console.log(colors.cyan.bold(`REST API en el puerto ${port}`));
});
