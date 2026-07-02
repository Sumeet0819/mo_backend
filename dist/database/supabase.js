"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../config/env");
// Export a dummy client if keys are not provided so the app doesn't crash immediately
exports.supabase = (env_1.env.SUPABASE_URL && env_1.env.SUPABASE_KEY)
    ? (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_KEY)
    : null;
