const baseApiUrl = 'http://localhost:3000/api';
const FIFTY_SECONDS_IN_MS = 50000;
const mailosaurApiKey =
  process.env.MAILOSAUR_API_KEY || 'jtiX3i70xhtzq21c5WxQbeMQew6YTOnl';
const mailosaurServerId = 'cgasbvwc';

const mailosaurEmail = 'cgasbvwc@mailosaur.net';
export {
  baseApiUrl,
  FIFTY_SECONDS_IN_MS as FIFTEEN_SECONDS_IN_MS,
  mailosaurApiKey,
  mailosaurServerId,
  mailosaurEmail,
};
