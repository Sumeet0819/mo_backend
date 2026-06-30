import sqlite3 from 'sqlite3';
import { env } from '../config/env';
import fs from 'fs';
import path from 'path';
import pino from 'pino';

const logger = pino();

const dbPath = path.resolve(process.cwd(), 'queue.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error({ err }, 'Failed to connect to SQLite database');
  } else {
    logger.info('Connected to SQLite database');
    db.run(`
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
export const dbRun = (query: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Helper for promise-based get
export const dbGet = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Helper for promise-based all
export const dbAll = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
