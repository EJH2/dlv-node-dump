import passport from 'passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

export default (prisma) => passport.use(new HeaderAPIKeyStrategy({
    header: 'Authorization',
    prefix: 'Token '
}, false, async (apiToken, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                apiToken: apiToken
            }
        });
        process.nextTick(() => done(null, user));
    } catch (err) {
        return done(err, undefined);
    }
}));