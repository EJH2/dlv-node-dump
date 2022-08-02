import passport from "passport";

export const isTokenAuthenticated = passport.authenticate('headerapikey', { session: false, failureRedirect: '/status/unauthorized' });