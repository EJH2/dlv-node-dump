import express from 'express';
import passport from 'passport';
const router = express.Router();
import { config } from 'dotenv';
config();

// Set up routes
router.get('/discord', passport.authenticate('discord', {
    scope: process.env.AUTH_SCOPES,
    prompt: process.env.AUTH_PROMPT
}));

router.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/status/badrequest',
    successRedirect: '/auth/info'
}));

router.get('/logout', (req, res, next) => {req.isAuthenticated() ? next() : res.redirect('/status/unauthorized')}, (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/status/success');
    });
  });

router.get('/info', (req, res) => {
    res.status(200).json(req.user);
});

export default router;