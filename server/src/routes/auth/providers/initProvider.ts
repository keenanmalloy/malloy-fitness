import { PROVIDERS } from "config/providers";
import { Request, RequestHandler, Response, Router } from "express";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { setLoginSession } from "sessions";

interface Props {
  router: Router;
  middleware?: RequestHandler;
}

export const initProvider = ({ router, middleware }: Props): void => {
  const subRouter = Router();
  if (middleware) {
    subRouter.use(middleware);
  }

  subRouter.use((req, res, next) => {
    passport.use(
      new Strategy(
        {
          clientID: PROVIDERS.GOOGLE.clientID,
          clientSecret: PROVIDERS.GOOGLE.clientSecret,
          callbackURL: `/auth/providers/google/callback`,
          passReqToCallback: true,
          scope: PROVIDERS.GOOGLE.scope,
        },
        (req, accessToken, refreshToken, profile, done) => {
          // find or create the user
          // check if user exists, using profile.id
          console.log({ profile });

          // select account provider by provider: 'google' and profile_id: id.toString(),
          // if there is an account, return done(null, account);

          // See if email already exist.
          // if email exist, merge this provider with the current user.
          try {
            // try fetching the account using email
            // if we're unable to fetch the account using the email we'll throw out of this try/catch
            //
            // account was successfully fetched so add the new provider:
            // {
            //     account_provider: {
            //       account_id: account.id,
            //       auth_provider: provider,
            //       auth_provider_unique_id: id.toString(),
            //     },
            //     account_id: account.id,
            // }

            // send account instead of empty object
            return done(undefined, {});
          } catch (error) {
            // We were unable to fetch the account
            console.log("Unable to fetch account", { error });
            // noop continue to register user
          }

          // register account & account_provider
          // const account_data = {
          //   email,
          //   active: true,
          //   display_name,
          //   avatar_url,
          // };

          // const account_provider = {
          //   auth_provider: provider,
          //   auth_provider_unique_id: id.toString(),
          // };

          // send account instead of empty object
          return done(undefined, {});
        }
      )
    );

    next();
  });

  subRouter.get("/", [
    (req: any, ...rest: any) => {
      return passport.authenticate("google", {
        session: false,
      })(req, ...rest);
    },

    passport.authenticate("google", {
      session: false,
      scope: PROVIDERS.GOOGLE.scope,
    }),
  ]);

  subRouter.get(
    "/callback",
    passport.authenticate("google", {
      failureRedirect: `http://localhost:3000/auth/failed`,
      session: false,
    }),

    async (req: Request, res: Response): Promise<void> => {
      // Successful authentication, redirect home.
      // generate tokens and redirect back home

      // passport js defaults data to req.user.
      // However, we send account data.
      const account = req.user;
      const session = { account };

      await setLoginSession(res, session);

      // redirect back user to app url, need to change URL to env variable
      res.redirect(`http://localhost:3000/auth/success`);
    }
  );

  router.use(`/google`, subRouter);
};
