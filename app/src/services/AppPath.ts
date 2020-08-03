import Analysis from '../models/Analysis';

type AppResource = 'top' | 'analysis' | 'analysisEditor' | 'analysesPage';
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

    analysisEditor(id: string): string {
        return this.paths['analysisEditor'].replace('{id}', id);
    }

    analysesPage(orderBy: string, direction: string, page: number, params: {
        query: string
    }): string {
        return this.paths['analysesPage']
            .replace('{orderBy}', orderBy)
            .replace('{direction}', direction)
            .replace('{page}', `${page}`) +
            (!!params.query ? `?query=${encodeURIComponent(params.query)}` : '');
    }
}
