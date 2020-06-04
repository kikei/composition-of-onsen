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
    query?: string | null;
    limit?: number;
}

interface IState {
    analyses: Resource<IAnalysesResponse> | null
}

export type IAnalysesPage =
    {[T in keyof IAnalysesOptions]-?: IAnalysesOptions[T]};

const showDate = (date: string) => {
    return date.replace('１', '1')
               .replace('１', '1')
               .replace('２', '2')
               .replace('３', '3').replace('３', '3')
               .replace('４', '4')
               .replace('５', '5')
               .replace('６', '6')
               .replace('７', '7')
               .replace('８', '8')
               .replace('９', '9')
               .replace('０', '0').replace('０', '0').replace('０', '0');
}

const AnalysisItem = (context: IConfigContext, a: Analysis) => {
    const path = new AppPath(context);
    const Title = (
        a.getMetadata('facilityName') || a.getMetadata('roomName') ?
        <React.Fragment>
            {a.getMetadata('facilityName')}
            {' '}{a.getMetadata('roomName')}
        </React.Fragment>
        : null
    );
    const Subtitle = (
        <React.Fragment>
        {a.name}
        {a.getMetadata('investigatedDate') ?
         ' ' + showDate(a.getMetadata('investigatedDate')!) :
         a.getMetadata('testedDate') ?
         ' ' + showDate(a.getMetadata('testedDate')!) : null}
        </React.Fragment>
    );
    const Location = (
        a.getMetadata('location') ?
        <React.Fragment>
            {a.getMetadata('location')}
        </React.Fragment>
        : null
    );
    const Detail = (
        [
            a.pH ? `pH ${a.pH}` : null,
            a.temperature ?
            `泉温 ${a.temperature}${a.getMetadata('temperatureExtra')}`
            : null,
            a.getMetadata('quality') ?
            `泉質 ${a.getMetadata('quality')}` : null,
            `成分総計 ${a.getTotalComponent().mg.toFixed(1)} mg/kg`
        ].filter(i => !!i).join(', ')
    );
    return (
        <Link to={path.analysis(a)}>
            <h3 className="title is-5 search-title">
                {Title}
            </h3>
            <div className="subtitle is-6 search-subtitle">
                {Subtitle}
            </div>
            <div className="search-content">
                <div className="search-location is-size-6">{Location}</div>
                <div className="search-detail is-size-6">{Detail}</div>
            </div>
        </Link>
    );
};

const AnalysisPage: React.FC<{
    context: IConfigContext,
    options: IAnalysesPage,
    current?: boolean,
    className?: string
}> = props => {
    const path = new AppPath(props.context);
    const { page, orderBy, direction, query } = props.options;
    return (
        <Link to={path.analysesPage(`${orderBy}`, `${direction}`, page, {
            query: query
        })}
              className={[
                  props.className,
                  'pagination-link',
                  props.current ? 'is-current' : ''
              ].join(' ')}>
            {props.children}
        </Link>
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
                            {' '}{limit * (page - 1) + 1} 件目 〜
                            {' '}{limit * (page - 1) + analyses.length}
                            件目を表示
                        </p>
                        <ul className="search-list">
                            {
                                analyses.map((a, i) =>
                                    <li key={i} className="search-item">
                                        {AnalysisItem(context, a)}
                                    </li>
                                )
                            }
                        </ul>
                        <div className="pagination is-centered pages">
                            <ul className="pagination-list pages-list">
                            {
                                page !== 1 ?
                                <li>
                                    <AnalysisPage
                                        context={context}
                                        options={{
                                            ...props.options,
                                            page: props.options.page - 1
                                        }}
                                        className="pagination-prev">
                                        &laquo;
                                    </AnalysisPage>
                                </li>
                                : null
                            }
                            {
                                Array.from(Array(finalPage).keys()).map(i =>
                                    <li key={i}>
                                        <AnalysisPage
                                            key={i}
                                            context={context}
                                            options={{
                                                ...props.options, page: i + 1
                                            }}
                                            current={page === i + 1}>
                                            {i + 1}
                                        </AnalysisPage>
                                    </li>
                                )
                            }
                            {
                                finalPage !== page ?
                                    <li>
                                        <AnalysisPage
                                            context={context}
                                            options={{
                                                ...props.options,
                                                page: props.options.page + 1
                                            }}
                                            className="pagination-next">
                                            &raquo;
                                        </AnalysisPage>
                                    </li>
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
        this.onSearch = this.onSearch.bind(this);
    }

    getAnalysesOptions(): IAnalysesPage {
        const options = {
            page: this.props.page,
            limit: this.limit,
            orderBy: this.props.orderBy,
            direction: this.props.direction,
            query: this.props.query
        } as any;
        return options;
    }

    onSearch(query: string) {
        this.props.history.push({
            pathname: '/',
            search: '?query=' + encodeURIComponent(query)
        })
    }

    render() {
        const state = this.state;
        console.log('AnalysisList render, state:', state,
                    'options:', this.options);
        return (
            <div className="container">
                <div className="columns">
                    <div className="column is-1">
                    </div>
                    <div className="column">
                        <div className="content search-container">
                            <SearchInput onSearch={this.onSearch} />
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
                    <div className="column is-1">
                    </div>
                </div>
            </div>
        );
    }
}

