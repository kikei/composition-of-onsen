import Resource, { suspender } from '../utils/Resource';
import Analysis, { IAnalysis } from '../models/Analysis';

type WebAPIResource = 'analyses' | 'analysis';
export type WebAPIUrls = {[R in WebAPIResource]: string};

export default class WebAPI {
    urls: WebAPIUrls;

    constructor(options: {urls: WebAPIUrls}) {
        this.urls = options.urls;
    }

    urlAnalysis(id: string) {
        return this.urls['analysis'].replace('{id}', id);
    }

    fetchAnalyses(): Resource<Analysis[]> {
        const url = this.urls['analyses'];
        console.log('WebAPI.fetchAnalyses, url:', url);
        const promise =
            fetch(url)
                .then(r => r.json())
                .then(obj => {
                    const a =
                        obj.analysis.map((a: IAnalysis) => new Analysis(a));
                    console.log('WebAPI.fetchAnalysis done, a:', a);
                    return a;
                });
        return suspender<Analysis[], string>(promise);
    }

    fetchAnalysis(id: string): Resource<Analysis> {
        const url = this.urlAnalysis(id);
        console.log('WebAPI.fetchAnalysis, url:', url);
        const promise =
            fetch(url)
                .then(r => r.json())
                .then(obj => {
                    const a = new Analysis(obj);
                    console.log('WebAPI.fetchAnalysis done, a:', a);
                    return a;
                });
        return suspender<Analysis, string>(promise);
    }
}
