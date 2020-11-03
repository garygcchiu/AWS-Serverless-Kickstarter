const axios = require('axios');
const { getGoogleUtilsPath, getConfigUtilsPath } = require('./utils');

const { getGoogleApiStuff } = require(getGoogleUtilsPath());
const { getSSMParameter } = require(getConfigUtilsPath());

const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    try {
        const gapiRes = getGoogleApiStuff();
        // const secretEnvVar = await getSSMParameter('SuperSecretKey', true);
        const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                location: ret.data.trim(),
                gapiRes,
                // secret: secretEnvVar,
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
