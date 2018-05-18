'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL ||'mongodb://localhost/event-flow-pro';
exports.TEST_DATABSE_URL = process.env.TEST_DATABSE_URL;
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';