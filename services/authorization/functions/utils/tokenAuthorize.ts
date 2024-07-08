import { getEnvValue } from '../../../../config';

export const tokenAuthorize = (token: string): void => {
  const [, encodedCreds] = token.split(' ');
  const buff = Buffer.from(encodedCreds, 'base64');
  const [username, password] = buff.toString('utf-8').split(':');
  const storedPassword = getEnvValue(username);

  if (!storedPassword || !username || !password || password !== storedPassword) {
    throw new Error('Invalid creds.');
  }
};
