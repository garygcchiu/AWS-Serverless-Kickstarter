
const getLayersPath = path => {
    return process.env.Env === 'local' ? `../layers/nodejs/node_modules/${path}` : path;
}

const getGoogleUtils = () => {
    return getLayersPath('google-utils');
};

module.exports = {
    getGoogleUtils,
}