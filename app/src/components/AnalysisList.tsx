import React, { Suspense } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import SearchInput from './SearchInput';
import ConfigContext, { IConfigContext } from '../contexts/ConfigContext';
import WebAPI, {
    AnalysesOrderBy, AnalysesDirection, IAnalysesOptions, IAnalysesResponse
} from '../services/WebAPI';
import AppPath from '../services/AppPath';
import Analysis from '../models/Analysis';
import Resource from '../utils/Resource';

export interface IProps extends RouteComponentProps {
    orderBy: AnalysesOrderBy;
    direction: AnalysesDirection;
    page: number;
    limit?: number;
}

interface IState {
    analyses: Resource<IAnalysesResponse> | null
}

export type IAnalysesPage =
    {[T in keyof IAnalysesOptions]-?: IAnalysesOptions[T]};

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

const AnalysisPage: React.FC<{
    context: IConfigContext,
    options: IAnalysesPage,
    current?: boolean
}> = props => {
    const path = new AppPath(props.context);
    const { page, orderBy, direction } = props.options;
    return (
        <li key={page} className={props.current ? 'current' : 'nocurrent'}>
            <Link to={path.analysesPage(`${orderBy}`, `${direction}`, page)}>
                {props.children}
            </Link>
        </li>
    )
};

const AnalysisListView: React.FC<{
    options: IAnalysesPage,
    analyses: IAnalysesResponse
}> = props => {
    const { analyses, limit, total } = props.analyses;
    const { page } = props.options;
    const finalPage = Math.floor(total / limit) + 1;
    return (
        <ConfigContext.Consumer>{
            context => {
                return (
                    <div>
                        <p>
                            全 {total} 件中
                            {' '}{limit * page + 1} 件目 〜
                            {' '}{limit * page + analyses.length} 件目を表示
                        </p>
                        <ul>
                            {
                                analyses.map((a, i) =>
                                    <li key={i} className="search-item">
                                        {AnalysisItem(context, a)}
                                    </li>
                                )
                            }
                        </ul>
                        <div className="pages">
                            <ul className="pages-list">
                            {
                                Array.from(Array(finalPage).keys()).map(i =>
                                    <AnalysisPage
                                        key={i}
                                        context={context}
                                        options={{
                                            ...props.options, page: i + 1
                                        }}
                                        current={page === i + 1}>
                                        {i + 1}
                                    </AnalysisPage>
                                )
                            }
                            </ul>
                            <ul className="pages-next">
                            {
                                finalPage !== page ?
                                    <AnalysisPage context={context}
                                                  options={{
                                                      ...props.options,
                                                      page: props.options.page + 1
                                                  }}>
                                       »
                                    </AnalysisPage>
                                    : null
                            }
                            </ul>
                        </div>
                    </div>
                )
            }
        }
        </ConfigContext.Consumer>
    );
}

const SuspensedAnalysisList: React.FC<{
    options: IAnalysesPage,
    analyses: Resource<IAnalysesResponse>
}> =
    props =>
        <AnalysisListView
            options={props.options}
            analyses={props.analyses.read()} />;


export default class AnalysisList extends React.Component<IProps, IState> {
    static contextType = ConfigContext;

    limit: number;
    options: IAnalysesPage;

    constructor(props: IProps) {
        super(props);
        this.limit = props.limit ?? 10;
        this.state = {
            analyses: null
        };
        this.options = this.getAnalysesOptions();
        console.log('options', this.options);
    }

    componentDidMount() {
        console.log('componentWllMount context:', this.context);
        const api = new WebAPI(this.context);
        this.setState({ analyses: api.fetchGetAnalyses(this.options) });
    }

    getAnalysesOptions(): IAnalysesPage {
        return {
            page: this.props.page,
            limit: this.limit,
            orderBy: this.props.orderBy,
            direction: this.props.direction
        }
    }

    render() {
        const state = this.state;
        console.log('AnalysisList render, state:', state,
                    'options:', this.options);
        return (
            <div>
                <div className="search-list">
                    <SearchInput />
                    {
                        state.analyses ? (
                            <Suspense fallback={<p>Loading...</p>}>
                                <SuspensedAnalysisList
                                    options={this.options}
                                    analyses={state.analyses} />
                            </Suspense>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

