// Esta Ok

import * as url from 'url';

const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    MONGODB_URI: 'mongodb+srv://franciscoSCluster:Abc12345@franciscos-cluster-oct2.7gnai.mongodb.net/eCommerce'
};

export default config;
