import Resource, { suspender } from '../utils/Resource';
import Analysis, { IAnalysis } from '../models/Analysis';

type WebAPIResource = 'analyses' | 'analysis';
export type WebAPIUrls = {[R in WebAPIResource]: string};

export default class WebAPI {
    urls: WebAPIUrls;

    constructor(options: {urls: WebAPIUrls}) {
        this.urls = options.urls;
    }

    urlAnalyses() {
        return this.urls['analyses'];
    }

    urlAnalysis(id: string) {
        return this.urls['analysis'].replace('{id}', id);
    }

    fetchGetAnalyses(): Resource<Analysis[]> {
        const url = this.urlAnalyses();
        console.log('WebAPI.fetchGetAnalyses, url:', url);
        const promise =
            fetch(url)
                .then(r => r.json())
                .then(obj => {
                    const a =
                        obj.analysis.map((a: IAnalysis) => new Analysis(a));
                    console.log('WebAPI.fetchGetAnalysis done,',
                                'a:', a);
                    return a;
                });
        return suspender<Analysis[], string>(promise);
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
