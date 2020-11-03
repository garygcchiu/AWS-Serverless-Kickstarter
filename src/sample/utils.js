// Layers must follow this structure, see more info here: https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-manage
const getLayersPath = path => {
    return process.env.Env === 'local' || !process.env.Env ? `../layers/nodejs/node_modules/${path}` : path;
}

const getGoogleUtilsPath = () => {
    return getLayersPath('google-utils');
};

const getConfigUtilsPath = () => {
    return getLayersPath('config-utils');
};

module.exports = {
    getGoogleUtilsPath,
    getConfigUtilsPath,
}