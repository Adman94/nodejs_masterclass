/*
 *  Create and export configuration variables
 *
 */

//  Container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};

// Production environment
environments.production = {
    'httpPort': 9000,
    'httpsPort': 9001,
    'envName': 'production'
};

// Determine which environment was passed as a command-line argument
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//  Check that the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

//  Export the module
module.exports = environmentToExport;