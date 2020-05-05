import React, { Suspense } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import SearchInput from './SearchInput';
import ConfigContext, { IConfigContext } from '../contexts/ConfigContext';
import WebAPI from '../services/WebAPI';
import AppPath from '../services/AppPath';
import Analysis from '../models/Analysis';
import Resource from '../utils/Resource';

export interface IProps extends RouteComponentProps {
}

interface IState {
    analyses: Resource<Analysis[]> | null
}

const AnalysisItem = (context: IConfigContext, a: Analysis) => {
    const path = new AppPath(context);
    return (
        <Link to={path.analysis(a)}>
            <div className="search-item__title">
                {a.name}
            </div>
            <div className="search-item__detail">{
                a.getMetadata('facilityName') || a.getMetadata('roomName') ?
                <React.Fragment>
                    {a.getMetadata('facilityName')}
                    {' '}{a.getMetadata('roomName')}<br />
                </React.Fragment>
                : null
            }{
                a.getMetadata('location') ?
                <React.Fragment>
                    {a.getMetadata('location')}<br />
                </React.Fragment>
                : null
            }{
                [
                    a.yield ?
                    `湧出量 ${a.yield}${a.getMetadata('yieldExtra')}`
                    : null,
                    a.pH ? `pH ${a.pH}` : null,
                    a.temperature ?
                    `泉温 ${a.temperature}${a.getMetadata('temperatureExtra')}`
                    : null,
                    a.getMetadata('quality') ?
                    `泉質 ${a.getMetadata('quality')}` : null,
                    `成分総計 ${a.getTotalComponent().mg.toFixed(1)} mg/kg`
                ].filter(i => !!i).join(', ')
            }
            </div>
        </Link>
    );
};

const AnalysisListView: React.FC<{analyses: Analysis[]}> = props => {
    const analyses: Analysis[] = props.analyses;
    // const pathAnalysis = (url: string, id: string) => url.replace('{id}', id);
    return (
        <ul>
            <ConfigContext.Consumer>
                {
                    (context: IConfigContext) =>
                        analyses.map((a, i) =>
                            <li key={i} className="search-item">
                                {AnalysisItem(context, a)}
                            </li>
                        )
                }
            </ConfigContext.Consumer>
        </ul>
    );
}

const SuspensedAnalysisList: React.FC<{analyses: Resource<Analysis[]>}> =
    props =>
        <AnalysisListView analyses={props.analyses.read()} />;


export default class AnalysisList extends React.Component<IProps, IState> {
    static contextType = ConfigContext;

    constructor(props: IProps) {
        super(props);
        this.state = {
            analyses: null
        };
    }

    componentDidMount() {
        console.log('componentWllMount context:', this.context);
        const api = new WebAPI(this.context);
        this.setState({ analyses: api.fetchGetAnalyses() });
    }

    render() {
        const state = this.state;
        console.log('AnalysisList render, state:', state);
        return (
            <div>
                <div className="search-list">
                    <SearchInput />
                    {
                        state.analyses ? (
                            <Suspense fallback={<p>Loading...</p>}>
                                <SuspensedAnalysisList
                                    analyses={state.analyses} />
                            </Suspense>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

