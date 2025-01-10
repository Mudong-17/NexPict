import { app } from 'electron';
import log from 'electron-log';
import path from 'path';

export const createLogger = (filename: string) => {
  const logger = log.create({ logId: filename });

  logger.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs', `${filename}.log`);

  logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
  logger.transports.file.level = 'debug';
  logger.transports.console.level = 'debug';

  return logger;
};
