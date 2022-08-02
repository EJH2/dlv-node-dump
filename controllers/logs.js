export async function getAllLogsController(req, res) {
    const condition = {
        where: req.query.with_bots === 'true' ? {
            OR: [
                {
                    ownerId: req.user.discordUserId
                },
                {
                    owner: {
                        owners: {
                            some: {
                                userId: req.user.id,
                            }
                        }
                    }
                }
            ]
        } : {
            ownerId: req.user.discordUserId
        },
            select: {
            uuid: true,
            ownerId: true,
            createdAt: true,
            expiresAt: true,
            messageCount: true,
            privacy: true,
            guild: true
        }
    }

    const logs = await req.app.locals.prisma.logs.findMany(condition);

    return res.json(logs);
}

export async function createLogController(req, res) {
    const data = req.body;

    const log = await req.app.locals.prisma.logs.create({
        data: {
            owner: {
                connect: {
                    id: req.user.discordUserId
                }
            },
            expiresAt: data.expiresAt,
            content: JSON.stringify(data.messages, null, 4),
            messageCount: data.messages.length,
            messages: data.messages,
            users: Object.assign({}, ...data.messages.map(({ author }) => ({[author.id]: author}))),
            privacy: data.privacy,
            guild: data.guild
        },
        select: {
            uuid: true,
            ownerId: true,
            createdAt: true,
            expiresAt: true,
            messageCount: true,
            privacy: true,
            guild: true
        }
    });

    return res.json(log);
}

export async function getLogController(req, res) {
    const uuid = req.params.uuid;

    const condition = {
        where: req.query.with_bots === 'true' ? {
            AND: {
                uuid: uuid
            },
            OR: [
                {
                    ownerId: req.user.discordUserId
                },
                {
                    owner: {
                        owners: {
                            some: {
                                userId: req.user.id,
                            }
                        }
                    }
                }
            ]
        } : {
            uuid: uuid,
            ownerId: req.user.discordUserId
        },
            select: {
            uuid: true,
            ownerId: true,
            createdAt: true,
            expiresAt: true,
            messageCount: true,
            privacy: true,
            guild: true
        }
    };

    const log = await req.app.locals.prisma.logs.findFirst(condition);

    return log ? res.json(log) : res.status(404).json({});
}

export async function updateLogController(req, res) {
    const uuid = req.params.uuid;
    const data = req.body;

    const condition = {
        where: req.query.with_bots === 'true' ? {
            AND: {
                uuid: uuid
            },
            OR: [
                {
                    ownerId: req.user.discordUserId
                },
                {
                    owner: {
                        owners: {
                            some: {
                                userId: req.user.id,
                            }
                        }
                    }
                }
            ]
        } : {
            uuid: uuid,
            ownerId: req.user.discordUserId
        },
        select: {
            uuid: true,
            ownerId: true,
            createdAt: true,
            expiresAt: true,
            messageCount: true,
            privacy: true,
            guild: true
        }
    };

    if (!(await req.app.locals.prisma.logs.findFirst(condition))) {
        return res.status(403).json({});
    }
    
    const log = await req.app.locals.prisma.logs.update({
        data: data,
        where: {
            uuid: uuid
        },
        select: {
            uuid: true,
            ownerId: true,
            createdAt: true,
            expiresAt: true,
            messageCount: true,
            privacy: true,
            guild: true
        }
    });

    return res.status(200).json(log);
}

export async function deleteLogController(req, res) {
    const uuid = req.params.uuid;
    const data = req.body;

    const condition = {
        where: req.query.with_bots === 'true' ? {
            AND: {
                uuid: uuid
            },
            OR: [
                {
                    ownerId: req.user.discordUserId
                },
                {
                    owner: {
                        owners: {
                            some: {
                                userId: req.user.id,
                            }
                        }
                    }
                }
            ]
        } : {
            uuid: uuid,
            ownerId: req.user.discordUserId
        },
        select: {
            uuid: true,
            ownerId: true,
            createdAt: true,
            expiresAt: true,
            messageCount: true,
            privacy: true,
            guild: true
        }
    };

    if (!(await req.app.locals.prisma.logs.findFirst(condition))) {
        return res.status(403).json({});
    }
    
    const log = await req.app.locals.prisma.logs.update({
        data: data,
        where: {
            uuid: uuid
        },
        select: {
            uuid: true,
            ownerId: true,
            createdAt: true,
            expiresAt: true,
            messageCount: true,
            privacy: true,
            guild: true
        }
    });

    return res.status(200).json(log);
}