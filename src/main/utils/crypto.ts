import crypto from 'crypto';
import { SALT } from '../share';

const algorithm = 'aes-256-cbc';

const key = crypto.scryptSync(SALT, 'salt', 32);

const iv = Buffer.alloc(16, 6);

export const encrypt = (data: string): string => {
  // 创建加密对象
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // 对数据进行加密
  let encrypted = cipher.update(data, 'utf8');
  // 加密结束
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // 生成 16 进制密文
  let result = encrypted.toString('hex');
  return result;
};

export const decrypt = (encrypted: string): string => {
  // 创建解密对象
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  // 进行解密
  let decrypted = decipher.update(encrypted, 'hex');
  // 解密结束
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  let result = decrypted.toString();
  return result;
};
