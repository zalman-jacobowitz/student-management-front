// src/mocks/handlers.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';

import {
  info_columns,
  info_students,
  select_options,
  supabase_users,
} from 'src/actions/moks/mokes';

/**
 * Mock session returned from Supabase auth endpoints
 */
const fakeSession = {
  access_token: 'fake-jwt',
  user: supabase_users[0],
  expires_in: 3600,
  token_type: 'Bearer',
  refresh_token: 'fake-refresh-token',
  user_metadata: {
    name:
      `${supabase_users[0].raw_user_meta_data.user.firstName 
      } ${ 
      supabase_users[0].raw_user_meta_data.user.lastName}`,
    email: supabase_users[0].raw_user_meta_data.user.email,
  },
  session_id: 'fake-session-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * In-memory datasets so that "update" calls mutate the same data we return in
 * subsequent "select" calls – just like a real server.
 */
const datasets = {
  info_students,
  info_columns,
  select_options,
  users: supabase_users,
};

/**
 * @typedef {keyof typeof datasets} TableName
 * @typedef {'select' | 'update'} Mode
 *
 * @interface AllRequestBody
 * @property {TableName} table_name
 * @property {Mode} mode
 * @property {any[]} [data]
 */

/**
 * Merge incoming records into an existing array, matching by the configured
 * unique key for the table. If no existing record is found, append it.
 * @template T
 * @param {T[]} target
 * @param {T[]} updates
 * @param {keyof T} key
 */
const mergeBy = (target, updates, key) => {
  updates.forEach((rec) => {
    const idx = target.findIndex((r) => r[key] === rec[key]);
    if (idx >= 0) {
      target[idx] = { ...target[idx], ...rec };
    } else {
      target.push(rec);
    }
  });
};

/**
 * The field that uniquely identifies a record in each table
 * @type {Record<TableName, string>}
 */
const UNIQUE_KEYS = {
  info_students: 'student_id',
  info_columns: 'id',
  select_options: 'id',
  users: 'id',
};

export const handlers = [
  /**
   * Single endpoint that supports both "select" (read) and "update" (write)
   * operations for the tables listed above. Other modes will return 400.
   */
  http.post('http://localhost:8080/all', async ({ request }) => {
    /** @type {AllRequestBody} */
    const body = (await request.json());
    const { table_name, mode, data = [] } = body;

    // Unknown table – return 404 so tests fail loudly
    if (!datasets[table_name]) {
      return HttpResponse.json(
        { error: `Unknown table: ${table_name}` },
        { status: 404 },
      );
    }

    // READ – return current snapshot
    if (mode === 'select') {
      return HttpResponse.json(datasets[table_name]);
    }

    // WRITE – mutate in-memory store then echo back success + new snapshot
    if (mode === 'update') {
      const key = /** @type {keyof typeof data[number]} */ (UNIQUE_KEYS[table_name]);
      mergeBy(/** @type {any[]} */ (datasets[table_name]), /** @type {any[]} */ (data), key);
      return HttpResponse.json({ success: true, data: datasets[table_name] });
    }

    // Any other mode is unsupported in mock
    return HttpResponse.json(
      { error: `Unsupported mode: ${mode}` },
      { status: 400 },
    );
  }),

  // ---- Auth mocks (unchanged) ----
  http.get('*://*/auth/v1/session', () => HttpResponse.json({ data: fakeSession })),
  http.get('*://*/auth/v1/user', () => HttpResponse.json(supabase_users[0])),
];