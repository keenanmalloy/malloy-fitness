import { app } from "./server";
import { APPLICATION } from "./config";

const start = async (): Promise<void> => {
  app.listen(process.env.PORT, () => {
    if (APPLICATION.HOST) {
      console.log(`Running on http://${APPLICATION.HOST}:${APPLICATION.PORT}`);
    } else {
      console.log(`Running on http://localhost:${APPLICATION.PORT}`);
    }
  });
};

start();
