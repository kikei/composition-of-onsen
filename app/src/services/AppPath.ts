import Analysis from '../models/Analysis';

type AppResource = 'top' | 'analysis';
export type AppPaths = {[P in AppResource]: string};

export default class AppPath {
    paths: AppPaths;

    constructor(options: {paths: AppPaths}) {
        this.paths = options.paths;
    }

    analysis(a: Analysis): string {
        return a.id ?
            this.paths['analysis'].replace('{id}', a.id!) :
            this.paths['top'];
    }
}
