import { Router } from 'express';
import { initProvider } from '../initProvider';
import { PROVIDERS } from 'config/providers';

export default (router: Router): void => {
  const options = PROVIDERS.GOOGLE;

  initProvider({
    router,
    middleware: (req, res, next) => {
      if (!options.clientID || !options.clientSecret) {
        return res
          .status(400)
          .send(`Missing environment variables for Google OAuth.`);
      } else {
        return next();
      }
    },
  });
};
