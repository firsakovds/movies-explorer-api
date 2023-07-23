require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const helmet = require("helmet");
const { login, createUsers } = require("./controllers/users");
const auth = require('./middlewares/auth');
const { celebrate, Joi, errors } = require('celebrate');
const UserNotFound = require("./errors/UserNotFound");
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// Слушаем 3000 порт
const { PORT = 3000,
MONGO_URL = 'mongodb://localhost:27017'
} = process.env;
mongoose
  //использовал .connect("mongodb://0.0.0.0:27017/mestodb", с loсalhost не было ответа от сервера
  .connect(`${MONGO_URL}/mestodb`, {
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

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
//4. Создайте роут для логина и регистрации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/)
  }),
}), createUsers);
app.use(auth);
app.use("/", userRouter);
app.use("/", cardRouter);
app.use("*", (req, res, next) => {
   next(new UserNotFound('Такого роута нет'));
   return
});

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
