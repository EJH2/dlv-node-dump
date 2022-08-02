import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import nobi from 'nobi';
import passport from 'passport';
import DiscordStrategy from './strategies/discord.js';
import TokenStrategy from './strategies/token.js';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

// Set up config
import { config } from 'dotenv';
config();

// Set up database client
const prisma = new PrismaClient();

// Set up passport
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                discordUser: true
            }
        });
        return user ? done(null, user) : done(null, null);
    } catch (err) {
        return done(err, null);
    }
});


// Set up discord authentication
DiscordStrategy(prisma);

// Set up API key header authentication
TokenStrategy(prisma);

// Set up express
const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
import authRoutes from './routes/auth.js';
import logsRoutes from './routes/logs.js';
import botRoutes from './routes/bot.js';
import statusRoutes from './routes/status.js';
app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);
app.use('/bot', botRoutes);
app.use('/status', statusRoutes);

// Set up globals
app.locals.signer = nobi(process.env.SECRET_KEY);
app.locals.prisma = prisma;

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';

// Run server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
