/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as alerts from "../alerts.js";
import type * as auth from "../auth.js";
import type * as billing from "../billing.js";
import type * as billingDb from "../billingDb.js";
import type * as cards from "../cards.js";
import type * as crons from "../crons.js";
import type * as demo from "../demo.js";
import type * as demoCatalog from "../demoCatalog.js";
import type * as demoPurge from "../demoPurge.js";
import type * as emails from "../emails.js";
import type * as holdings from "../holdings.js";
import type * as http from "../http.js";
import type * as lib_access from "../lib/access.js";
import type * as lib_budget from "../lib/budget.js";
import type * as lib_justtcg from "../lib/justtcg.js";
import type * as lib_normalize from "../lib/normalize.js";
import type * as lib_resend from "../lib/resend.js";
import type * as migrations from "../migrations.js";
import type * as notifications from "../notifications.js";
import type * as portfolio from "../portfolio.js";
import type * as prices from "../prices.js";
import type * as seed from "../seed.js";
import type * as status from "../status.js";
import type * as sync from "../sync.js";
import type * as syncDb from "../syncDb.js";
import type * as users from "../users.js";
import type * as watchlist from "../watchlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  auth: typeof auth;
  billing: typeof billing;
  billingDb: typeof billingDb;
  cards: typeof cards;
  crons: typeof crons;
  demo: typeof demo;
  demoCatalog: typeof demoCatalog;
  demoPurge: typeof demoPurge;
  emails: typeof emails;
  holdings: typeof holdings;
  http: typeof http;
  "lib/access": typeof lib_access;
  "lib/budget": typeof lib_budget;
  "lib/justtcg": typeof lib_justtcg;
  "lib/normalize": typeof lib_normalize;
  "lib/resend": typeof lib_resend;
  migrations: typeof migrations;
  notifications: typeof notifications;
  portfolio: typeof portfolio;
  prices: typeof prices;
  seed: typeof seed;
  status: typeof status;
  sync: typeof sync;
  syncDb: typeof syncDb;
  users: typeof users;
  watchlist: typeof watchlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
