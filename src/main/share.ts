import { nanoid } from 'nanoid';
import { join } from 'path';

process.env.APP_ROOT = join(__dirname, '..');

export const DEV_USER_DATA = join(process.env.APP_ROOT, '..', 'userData');
export const MACHINE_ID = nanoid();
export const SALT = `com.future-element.nexpict-${MACHINE_ID}`;
