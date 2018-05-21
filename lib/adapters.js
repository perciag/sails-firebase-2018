
var _ = require('@sailshq/lodash');
var async = require('async');
var firebase = require("firebase-admin");
var Helpers = require('../helpers');

module.exports = (function sailsFirebase2018 () {

    // Keep track of all the datastores used by the app
    var datastores = {};

    // Keep track of all the connection model definitions
    var modelDefinitions = {};

    var adapter = {

        identity: 'sails-firebase-2018',

        // Waterline Adapter API Version
        adapterApiVersion: 1,

        // Default configuration for connections
        defaults: {
            firebasesecret: 'thisissupersuperdupersecret',
            database: 'default',
            url: 'https://mediocreappname.firebaseio.com'
        },

        //  ╔═╗═╗ ╦╔═╗╔═╗╔═╗╔═╗  ┌─┐┬─┐┬┬  ┬┌─┐┌┬┐┌─┐
        //  ║╣ ╔╩╦╝╠═╝║ ║╚═╗║╣   ├─┘├┬┘│└┐┌┘├─┤ │ ├┤
        //  ╚═╝╩ ╚═╩  ╚═╝╚═╝╚═╝  ┴  ┴└─┴ └┘ ┴ ┴ ┴ └─┘
        //  ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐┌─┐┬─┐┌─┐┌─┐
        //   ││├─┤ │ ├─┤└─┐ │ │ │├┬┘├┤ └─┐
        //  ─┴┘┴ ┴ ┴ ┴ ┴└─┘ ┴ └─┘┴└─└─┘└─┘
        // This allows outside access to the connection manager.
        datastores: datastores,

        //  ╦═╗╔═╗╔═╗╦╔═╗╔╦╗╔═╗╦═╗  ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐┌─┐┬─┐┌─┐
        //  ╠╦╝║╣ ║ ╦║╚═╗ ║ ║╣ ╠╦╝   ││├─┤ │ ├─┤└─┐ │ │ │├┬┘├┤
        //  ╩╚═╚═╝╚═╝╩╚═╝ ╩ ╚═╝╩╚═  ─┴┘┴ ┴ ┴ ┴ ┴└─┘ ┴ └─┘┴└─└─┘
        // Register a datastore config and generate a connection manager for it.
        registerDatastore: function registerDatastore (datastoreConfig, models, cb) {
            var identity = datastoreConfig.identity;
            if (!identity) {
                return cb(new Error('Invalid datastore config. A datastore should contain a unique identity property.'));
            }

            try {
                Helpers.registerDataStore({
                    identity: identity,
                    config: datastoreConfig,
                    models: models,
                    datastores: datastores,
                    modelDefinitions: modelDefinitions
                }).execSync();
            } catch (e) {
                setImmediate(function done () {
                    return cb(e);
                });
                return;
            }

            setImmediate(function done () {
                return cb();
            });
        },




        //  ╔╦╗╔═╗╔═╗╦═╗╔╦╗╔═╗╦ ╦╔╗╔  ┌─┐┌─┐┌┐┌┌┐┌┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
        //   ║ ║╣ ╠═╣╠╦╝ ║║║ ║║║║║║║  │  │ │││││││├┤ │   │ ││ ││││
        //   ╩ ╚═╝╩ ╩╩╚══╩╝╚═╝╚╩╝╝╚╝  └─┘└─┘┘└┘┘└┘└─┘└─┘ ┴ ┴└─┘┘└┘
        // Destroy a manager and close any connections in it's pool.
        teardown: function teardown (identity, cb) {
            var datastoreIdentities = [];

            // If no specific identity was sent, teardown all the datastores
            if (!identity || identity === null) {
                datastoreIdentities = datastoreIdentities.concat(_.keys(datastores));
            } else {
                datastoreIdentities.push(identity);
            }

            // Teardown each datastore identity manager
            async.eachSeries(datastoreIdentities, function teardownDatastore (datastoreIdentity, next) {
                Helpers.teardown({
                    identity: datastoreIdentity,
                    datastores: datastores,
                    modelDefinitions: modelDefinitions
                }).switch({
                    error: function error (err) {
                        return next(err);
                    },
                    success: function success () {
                        return next();
                    }
                });
            }, function asyncCb (err) {
                cb(err);
            });
        },

    }

    return adapter;
})();