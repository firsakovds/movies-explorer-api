require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const helmet = require("helmet");
const routes = require("./routes/index");

const { errors } = require('celebrate');

const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimit = require('express-rate-limit')
// Слушаем 3000 порт
const { PORT = 3000,
MONGO_URL = 'mongodb://localhost:27017'
} = process.env;
mongoose
  .connect(`${MONGO_URL}/bitfilmsdb`, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Хьюстон! Мы на связи!");
  });
const app = express();
app.use(cors());
const allowedCors = [
  'http://mesto.firsakovds.nomoredomains.xyz',
  'https://mesto.firsakovds.nomoredomains.xyz',
];
app.use((req, res, next) => {
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
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // поставил 1000 для тестов Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
  next();
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
