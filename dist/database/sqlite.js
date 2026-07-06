"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbAll = exports.dbGet = exports.dbRun = exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const logger_1 = require("../utils/logger");
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(process.cwd(), 'queue.sqlite');
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        logger_1.logger.error({ err }, 'Failed to connect to SQLite database');
    }
    else {
        logger_1.logger.info('Connected to SQLite database');
        exports.db.run(`
      CREATE TABLE IF NOT EXISTS download_queue (
        job_id TEXT PRIMARY KEY,
        video_id TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
});
// Helper for promise-based run
const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.run(query, params, function (err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};
exports.dbRun = dbRun;
// Helper for promise-based get
const dbGet = (query, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.get(query, params, (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
exports.dbGet = dbGet;
// Helper for promise-based all
const dbAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.all(query, params, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
exports.dbAll = dbAll;
