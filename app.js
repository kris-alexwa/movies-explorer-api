const express = require('express');
const helmet = require('helmet');
const limiter = require('./limiter');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { NotFoundError, ErrorWithStatusCode } = require('./errors/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL } = require('./config');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(express.json());

app.options('*', cors());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
}));

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use((req, res, next) => {
  return next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  if (err instanceof ErrorWithStatusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err.name === 'SyntaxError') {
    return res.status(400).send({ message: `Переданы некорректные данные ${err.message}` });
  }
  console.log(err);
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
