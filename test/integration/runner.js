/**
 * MIT License
 *
 * Copyright (c) 2017 Mike McNeil, Balderdash Design Co., & The Sails Company
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


var Adapter = require('../../');
var package = require('../../package');
var TestRunner = require('waterline-adapter-tests');

var interfaces = package.waterlineAdapter.interfaces;
var log = new (require('captains-log'))();

var firebase = {
  identity: 'default',

  credential: {
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,

    "auth_uri": process.env.FIREBASE_AUTH_URI,

    "client_email": process.env.FIREBASE_CLIENT_EMAIL,

    "client_id": process.env.FIREBASE_CLIENT_ID,

    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,

    "private_key": process.env.FIREBASE_PRIVATE_KEY,

    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_IDPROJECT_ID,

    "project_id": process.env.FIREBASE_PROJECT_ID,

    "token_uri": process.env.FIREBASE_TOKEN_URI,

    "type": process.env.FIREBASE_TYPE,
  },

  databaseURL: process.env.FIREBASE_DATABASE_URL,

  schema: false
};

/**
 * Most databases implement 'semantic' and 'queryable'.
 *
 * As of Waterline v0.12, the 'associations' interface is also available.  If
 * you don't implement 'associations', it will be polyfilled for you by
 * Waterline core.  The core implementation will always be used for
 * cross-adapter / cross-connection joins.
 *
 * In future versions of Sails/Waterline, 'queryable' may be also
 * be polyfilled by core.
 *
 * These polyfilled implementations can usually be further optimized at the
 * adapter level, since most databases provide optimizations for internal
 * operations.
 *
 * @see [Waterline Adapter Specification]{@link https://github.com/balderdashy/sails-docs/blob/master/adapter-specification.md]
 */
var test = {

  /**
   * Print Waterline Adapter name and list which interfaces will be tested
   */
  beforeAll: function beforeAll() {
    var count = 1;

    log.info('Testing `' + package.name + '`, a Waterline adapter.');
    log.info('Running `waterline-adapter-tests` against interfaces:');
    interfaces.forEach(function(interface) {
      log.info(count++ + '.', interface);
    });
    console.log();
  },

  /**
   * Run Integration Test Runner
   *
   * Uses the `waterline-adapter-tests` module to run mocha tests against the
   * specified interfaces of the currently-implemented Waterline adapter API.
   *
   * @see [Waterline Adapter Specification]{@link https://github.com/balderdashy/sails-docs/blob/master/adapter-specification.md]
   */
  main: function main() {
    this.beforeAll();

    var runner = new TestRunner({

      // Load the adapter module.
      adapter: Adapter,

      // Default adapter config to use.
      config: firebase,

      // The set of adapter interfaces to test against.
      // (grabbed these from this adapter's package.json file above)
      interfaces: interfaces,

      mocha: {
        timeout: 7000
      }

    });

    return runner;
  }

};

test.main();
