import winston, { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import { v4 as uuidv4 } from 'uuid'

class MyLogger {
    constructor() {
        const formatPrint = format.printf(({ level, message, context, requestId, timestamp, metadata }) => {
            return `${timestamp}::${level}::${requestId}::${context}::${message}::${JSON.stringify(metadata)}`;
        });
        this.logger = createLogger({
            format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), formatPrint),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    level: "info",
                    dirname: "/var/log/shopdev",
                    filename: "application-%DATE%.info.log",
                    datePattern: "YYYY-MM-DD-HH-mm",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                    format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), formatPrint),
                }),
                new transports.DailyRotateFile({
                    level: "error",
                    dirname: "src/logs",
                    filename: "application-%DATE%.error.log",
                    datePattern: "YYYY-MM-DD-HH-mm",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                    format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), formatPrint),
                }),
            ],
        });
    }

    commonParams(params) {
        let context, req, metadata ;
        if (!Array.isArray(params)) {
            context = params;
        } else {
            [context, req, metadata] = params;
        }
        const requestId = req?.requestId || uuidv4();
        return {
            requestId,
            context,
            metadata: metadata || ""
        }
    }

    log(message, params) {
        const paramLogs = this.commonParams(params)
        const logObject = Object.assign({ message }, paramLogs);
        this.logger.info(logObject);
    }

    error(message, params) {
        const paramLogs = this.commonParams(params)
        const logObject = Object.assign({ message }, paramLogs);
        this.logger.error(logObject);
    }
}

export default new MyLogger();
