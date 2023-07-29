require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler")
const helmet = require("helmet");
const routes = require("./routes/index");
const { errors } = require('celebrate');
const cors = require("./middlewares/cors");
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require("./middlewares/rateLimit")
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
app.use(cors);
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
app.use(routes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
