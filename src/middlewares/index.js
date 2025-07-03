import loggerService from "../loggers/discord.log.js"


export const pushToLogDiscord = (req, res, next) => {
    try {
        loggerService.sendToMessage(req.get('host'))
    } catch (error) {
        next(error)
    }
}