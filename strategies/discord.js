import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
const { randomBytes } = await import('node:crypto');

export default (prisma) => passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: process.env.AUTH_SCOPES
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await prisma.user.upsert({
            where: {
                discordUserId: profile.id
            },
            create: {
                discordUser: {
                    create: {
                        id: profile.id,
                        email: profile.email,
                        username: profile.username,
                        discriminator: profile.discriminator,
                        avatar: profile.avatar,
                        flags: profile.flags,
                        guilds: profile.guilds
                    }
                },
                accessToken: accessToken,
                refreshToken: refreshToken,
                apiToken: randomBytes(20).toString('hex')
            },
            update: {
                discordUser: {
                    update: {
                        email: profile.email,
                        username: profile.username,
                        discriminator: profile.discriminator,
                        avatar: profile.avatar,
                        flags: profile.flags,
                        guilds: profile.guilds
                    }
                },
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        });
        process.nextTick(() => done(null, user));
    } catch (err) {
        return done(err, undefined);
    }
}));