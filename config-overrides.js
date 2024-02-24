module.exports = function override(config, env) {
    config.resolve.fallback = {
        'fs': false,
        'tls': false,
        'net': false,
        'http': false,
        'https': false,
        'child_process': false,
        'http2': false,
        'process': require.resolve('process'),
        'stream': require.resolve('stream-browserify'),
        'crypto': require.resolve('crypto-browserify'),
        'path': require.resolve('path-browserify'),
        'url': require.resolve('url'),
        'assert': require.resolve('assert'),
        'zlib': require.resolve('browserify-zlib'),
        'querystring': require.resolve('querystring-es3'),
        'os': require.resolve('os-browserify/browser') 
    }

    return config
}
