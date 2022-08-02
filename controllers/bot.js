import fetch from 'node-fetch';

export async function getBotAuthorizationController(req, res) {
    const botId = req.query.id;
    if (!botId) {
        return res.status(400).json({msg: 'id is a required parameter!'});
    };

    console.log(req.user.accessToken)
    try {
        let resp = await fetch(`https://discord.com/api/v9/applications/${botId}/branches`, {
            headers: {
                authorization: `Bearer ${req.user.accessToken}`
            }
        });

        if (!resp.ok) {
            if ([403, 404].includes(resp.status)) {
                return res.status(403).json({msg: 'you do not own this application!'})
            }

            return res.status(400).json({msg: 'could not fetch user applications!'})
        };

        resp = await fetch(`https://discord.com/api/v9/oauth2/authorize?client_id=${botId}&scope=bot`, {
            headers: {
                authorization: process.env.USER_TOKEN
            }
        });

        if (!resp.ok) {
            return res.status(400).json({msg: 'could not fetch bot information!'});
        }

        const botInfo = (await resp.json()).bot;
        return res.json({key: req.app.locals.signer.sign(JSON.stringify(botInfo)), ...botInfo});
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

export async function postConnectBotToUserController(req, res) {
    const key = req.body.key;
    if (!key) {
        return res.status(400).json({msg: 'key is required in body!'})
    }

    try {
        const botData = JSON.parse(req.app.locals.signer.unsign(key))
        const bot = await req.app.locals.prisma.discordUser.upsert({
            where: {
                id: botData.id
            },
            create: {
                id: botData.id,
                username: botData.username,
                discriminator: botData.discriminator,
                avatar: botData.avatar,
                flags: botData.public_flags,
                bot: true,
                owners: {
                    create: [
                        {
                            user: {
                                connect: {
                                    id: req.user.id
                                }
                            }
                        }
                    ]
                }
            },
            update: {
                username: botData.username,
                discriminator: botData.discriminator,
                avatar: botData.avatar,
                flags: botData.public_flags
            }
        })
        return res.json({msg: 'bot has been sucessfully added'})
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
}