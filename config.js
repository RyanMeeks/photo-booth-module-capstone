'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://heroku_7qn2gxzk:kcv2h487ipgeui3ahk2ua4o4vi@ds239940.mlab.com:39940/heroku_7qn2gxzk';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-event-flow-pro';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';