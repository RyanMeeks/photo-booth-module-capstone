'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://ryanm613:kgb00312@ds149279.mlab.com:49279/record-crate';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://ryanm614:kgb00312@ds149279.mlab.com:49279/record-crate';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';