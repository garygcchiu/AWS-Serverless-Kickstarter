// Layers must follow this structure, see more info here: https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-manage
const getLayersPath = path => {
    return process.env.Env === 'local' ? `../layers/nodejs/node_modules/${path}` : path;
}

const getGoogleUtils = () => {
    return getLayersPath('google-utils');
};

module.exports = {
    getGoogleUtils,
}