"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lowdb_1 = tslib_1.__importDefault(require("lowdb"));
const FileSync_1 = tslib_1.__importDefault(require("lowdb/adapters/FileSync"));
const adapter = new FileSync_1.default('src/db.json');
const db = lowdb_1.default(adapter);
db.defaults({ users: [] }).write();
exports.default = db;
