const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Укажите страну создания фильма'],
    },
    director: {
      type: String,
      required: [true, 'Укажите режиссера'],
    },
    duration: {
      type: Number,
      required: [true, 'Укажите длительность фильма'],
    },
    year: {
      type: String,
      required: [true, 'Укажите год выпуска фильма'],
    },
    description: {
      type: String,
      required: [true, 'Укажите описание фильма'],
    },
    image: {
      type: String,
      required: [true, 'Укажите ссылку на постер к фильму'],
      validate: {
        validator() {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
        },
      },
    },
    trailerLink: {
      type: String,
      required: [true, 'Укажите ссылку на трейлер фильма'],
      validate: {
        validator() {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
        },
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Укажите ссылку на миниатюрное изображение постера к фильму'],
      validate: {
        validator() {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
        },
      },
    },
    owner: {
      required: [true, 'Поле "owner" должно быть заполнено'],
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: [true, 'Укажите название фильма на русском языке'],
    },
    nameEN: {
      type: String,
      required: [true, 'Укажите название фильма на английском языке'],
    },


  },
  { versionKey: false }
);
// создаём модель и экспортируем её
module.exports = mongoose.model("movie", movieSchema);
