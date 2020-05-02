import React from 'react';
import { WebAPIUrls } from '../services/WebAPI';
import { AppPaths } from '../services/AppPath';

export interface IConfigContext {
    urls: WebAPIUrls;
    paths: AppPaths;
};

const ConfigContext = React.createContext({} as IConfigContext);

export default ConfigContext;
