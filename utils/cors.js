const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://frontend.antropov.mesto.nomoredomains.sbs',
    'http://backend.antropov.mesto.nomoredomains.sbs',
    'https://frontend.antropov.mesto.nomoredomains.sbs',
    'https://backend.antropov.mesto.nomoredomains.sbs',

  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = corsOptions;
