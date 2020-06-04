import Resource, { suspender } from '../utils/Resource';
import Analysis, { IAnalysis } from '../models/Analysis';

type WebAPIResource = 'analyses' | 'analysis';
export type WebAPIUrls = {[R in WebAPIResource]: string};

const AnalysesOrderBys = ['timeline', 'identifier'] as const;
export type AnalysesOrderBy = typeof AnalysesOrderBys[number];

const AnalysesDirections = ['desc', 'asc'] as const;
export type AnalysesDirection = typeof AnalysesDirections[number];

/* Validators */
export function isValidOrderBy(x: any): x is AnalysesOrderBy {
    return AnalysesOrderBys.includes(x);
}

export function isValidDirection(x: any): x is AnalysesDirection {
    return AnalysesDirections.includes(x);
}

export interface IAnalysesOptions {
    query?: string;
    page?: number;
    limit?: number;
    orderBy?: AnalysesOrderBy;
    direction?: AnalysesDirection;
}

export interface IAnalysesResponse {
    analyses: Array<Analysis>;
    page: number;
    limit: number;
    total: number;
}

export default class WebAPI {
    urls: WebAPIUrls;

    constructor(options: {urls: WebAPIUrls}) {
        this.urls = options.urls;
    }

    urlAnalyses(options: IAnalysesOptions = {} as any) {
        const query = [
            options.query ? `q=${encodeURIComponent(options.query)}` : null,
            options.page ? `p=${options.page - 1}` : null,
            options.limit ? `l=${options.limit}` : null,
            options.orderBy ? 'o=' + (
                options.orderBy === 'timeline' ? 'l' : 'i'
            ) : null,
            options.direction ? 'd=' + (
                options.direction === 'desc' ? '-1' : '1'
            ) : null
        ].filter(x => !!x).join('&');
        return this.urls['analyses'] + (query ? `?${query}` : '');
    }

    urlAnalysis(id: string) {
        return this.urls['analysis'].replace('{id}', id);
    }

    fetchGetAnalyses(options: IAnalysesOptions = {} as any)
        : Resource<IAnalysesResponse> {
        const url = this.urlAnalyses(options);
        console.log('WebAPI.fetchGetAnalyses, url:', url);
        const promise =
            fetch(url)
                .then(r => r.json())
                .then(obj => {
                    const a =
                        obj.analysis.map((a: IAnalysis) => new Analysis(a));
                    console.log('WebAPI.fetchGetAnalysis done, obj:', obj,
                                'a:', a);
                    return {
                        analyses: a,
                        page: obj.page,
                        limit: obj.limit,
                        total: obj.total
                    };
                });
        return suspender<IAnalysesResponse, string>(promise);
    }

    fetchGetAnalysis(id: string): Resource<Analysis> {
        const url = this.urlAnalysis(id);
        console.log('WebAPI.fetchGetAnalysis, url:', url);
        const promise =
            fetch(url)
                .then(r => r.json())
                .then(obj => {
                    const a = new Analysis(obj);
                    console.log('WebAPI.fetchGetAnalysis done,',
                                'a:', a);
                    return a;
                });
        return suspender<Analysis, string>(promise);
    }

    fetchPutAnalysis(a: Analysis): Promise<Analysis> {
        if (!!a.id)
            throw new TypeError('analysis id should be empty');
        const url = this.urlAnalyses();
        console.log('WebAPI.fetchPutAnalysis, url:', url);
        const promise =
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: a.toJSONString()
            })
                .then(r => r.json())
                .then(obj => {
                    const a = new Analysis(obj);
                    console.log('WebAPI.fetchPutAnalysis done,',
                                'a:', a);
                    return a;
                });
        return promise;
    }

    fetchPostAnalysis(a: Analysis): Promise<Analysis> {
        if (a.id === null)
            throw new TypeError('analysis id cannot be null');
        const url = this.urlAnalysis(a.id);
        console.log('WebAPI.fetchPostAnalysis, url:', url);
        const promise =
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: a.toJSONString()
            })
                .then(r => r.json())
                .then(obj => {
                    const a = new Analysis(obj);
                    console.log('WebAPI.fetchPostAnalysis done,',
                                'a:', a);
                    return a;
                });
        return promise;
    }
}
