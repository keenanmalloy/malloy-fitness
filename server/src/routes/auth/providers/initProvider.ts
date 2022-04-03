import { PROVIDERS } from 'config/providers';
import { Request, RequestHandler, Response, Router } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import {
  createAccountProviderMutation,
  createAccountWithProviderMutation,
} from 'queries/createAccountMutation';
import {
  retrievAccountByEmailQuery,
  retrieveAccountByProviderQuery,
} from 'queries/retrieveAccountQuery';
import { setLoginSession } from 'sessions';

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
          callbackURL: `http://localhost:4000/auth/providers/google/callback`,
          passReqToCallback: true,
          scope: PROVIDERS.GOOGLE.scope,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          // what if this is null?
          const json = profile._json;
          const authProviderUniqueId = json.sub;
          const name = json.name as string;
          const avatarUrl = json.picture as string;
          const email = json.email as string;
          const locale = json.locale as string;
          const familyName = json.family_name as string;
          const givenName = json.given_name as string;

          // select account provider by provider: 'google' and profile_id: id.toString(),
          const account = await retrieveAccountByProviderQuery(
            authProviderUniqueId,
            'google'
          );

          // if there is an account, return done(undefined, account);
          if (!!account) {
            return done(undefined, account);
          }

          // See if email already exist.
          // if email exist, merge this provider with the current user.
          try {
            // try fetching the account using email
            const account = await retrievAccountByEmailQuery(email);

            // if we're unable to fetch the account using the email we'll throw out of this try/catch
            if (!account) {
              throw new Error('Account does not exist.');
            }

            // account was successfully fetched so add the new provider:
            await createAccountProviderMutation({
              account_id: account.account_id,
              auth_provider: 'google',
              auth_provider_unique_id: authProviderUniqueId,
            });

            // send account instead of empty object
            return done(undefined, account);
          } catch (error) {
            // We were unable to fetch the account
            console.log('Unable to fetch account', { error });
            // noop continue to register user
          }

          // register account & account_provider
          const newAccount = await createAccountWithProviderMutation({
            provider: 'google',
            authProviderUniqueId,
            avatarUrl,
            email,
            locale,
            name,
            familyName,
            givenName,
          });

          // send account instead of empty object
          return done(undefined, newAccount ?? {});
        }
      )
    );

    next();
  });

  subRouter.get('/', [
    (req: Request, ...rest: any) => {
      return passport.authenticate('google', {
        session: false,
      })(req, ...rest);
    },

    passport.authenticate('google', {
      session: false,
      scope: PROVIDERS.GOOGLE.scope,
    }),
  ]);

  subRouter.get(
    '/callback',
    passport.authenticate('google', {
      failureRedirect: `http://localhost:3000/?error=failed-google-oauth`,
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
      res.redirect(`http://localhost:3000/`);
    }
  );

  router.use(`/google`, subRouter);
};
