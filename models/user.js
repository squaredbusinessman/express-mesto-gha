const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя пользователя должно быть заполнено'],
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Информация о пользователе должна быть заполнена'],
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Ссылка на аватар в формате (https://...) должна быть заполнена'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введите email в правильном формате'
    }
  },
  password: {
    type: String,
    required: [true, 'Необходимо указать пароль'],
    minLength: 6,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error('Введены неправильные почта или пароль'))
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Введены неправильные почта или пароль'));
      }

      return user;
      // если все проверки пройдены - возвращаем пользователя
    })
  })
}

module.exports = mongoose.model('user', userSchema);
