const axios = require('axios');
const url = 'http://checkip.amazonaws.com/';
let response;
//const { getParameter } = require('../utils/ssm');
const { getGoogleUtils } = require('./utils');
const googleUtils = require(getGoogleUtils());

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
    // retrieve Google Places API key from SSM
    //const googlePlacesAPIKey = await getParameter('GoogleMapsAPIKey', true);
    //console.log('google places api key = ', googlePlacesAPIKey);
    console.log('got google utisl ? ', googleUtils.hehe());
    console.log('process.env.ENV ? ', process.env.ENV);
    console.log('process.env.Env ? ', process.env.Env);
    console.log('process.env.env ? ', process.env.env);
    console.log('process.env.NODE_ENV ? ', process.env.NODE_ENV);

    try {
        //console.log('event  = ', event);
        const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                location: ret.data.trim(),
                //googlePlacesAPIKey,
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
