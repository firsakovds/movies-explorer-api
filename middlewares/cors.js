const allowedCors = [
  'http://movies.firsakovds.nomoreparties.co',
  'https://movies.firsakovds.nomoreparties.co',
];
const cors = ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  // разрешаем кросс-доменные запросы с этими заголовками
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});
module.exports = cors;
