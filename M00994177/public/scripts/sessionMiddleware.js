const session = require('express-session');

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key', // Use a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
    },
});

module.exports = sessionMiddleware; 