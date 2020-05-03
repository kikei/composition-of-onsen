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

const AnalysisListView: React.FC<{analyses: Analysis[]}> = props => {
    const analyses: Analysis[] = props.analyses;
    // const pathAnalysis = (url: string, id: string) => url.replace('{id}', id);
    const AnalysisItem = (a: Analysis) => (
        <ConfigContext.Consumer>
            {
                (context: IConfigContext) => a.id ? (
                    <Link to={new AppPath(context).analysis(a)}>
                        {a.name}
                    </Link>
                ) : (
                    <span>{a.name}</span>
                )
            }
        </ConfigContext.Consumer>
    );
    return (
        <ul>
            {
                analyses.map((a, i) => <li key={i}>{AnalysisItem(a)}</li>)
            }
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

