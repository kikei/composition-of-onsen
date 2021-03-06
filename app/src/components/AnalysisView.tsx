import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import * as Storage from '../Storage';

import Analysis, { IAnalysis } from '../models/Analysis';
import CompRepresentations from '../models/CompRepresentations';
import AnalysisTableEditor from './AnalysisTableEditor';
import AnalysisTablePreview from './AnalysisTablePreview';
import { renderMathJax } from '../utils/MathJax';
import ConfigContext from '../contexts/ConfigContext';
import WebAPI from '../services/WebAPI';
import AppPath from '../services/AppPath';

type ViewMode = 'edit' | 'json';
type SaveResult = 'none' | 'progress' | 'success' | 'failed';

export interface IProps extends RouteComponentProps<any> {
    analysis: Analysis;
    rows: {
        positiveIon: Array<CompRepresentations>,
        negativeIon: Array<CompRepresentations>,
        undissociated: Array<CompRepresentations>,
        gas: Array<CompRepresentations>,
        minor: Array<CompRepresentations>
    }
}

interface IState {
    analysis: IAnalysis;
    viewMode: ViewMode;
    saveResult: SaveResult;
}

export default class AnalysisView
extends React.Component<IProps, IState> {
    static contextType = ConfigContext;

    constructor(props: IProps) {
        super(props);
        this.state = {
            analysis: props.analysis.toObject(),
            viewMode: 'edit',
            saveResult: 'none'
        };
        this.selectView = this.selectView.bind(this);
        this.saveAnalysis = this.saveAnalysis.bind(this);
        this.updateAnalysis = this.updateAnalysis.bind(this);
    }
    componentDidMount() {
        renderMathJax();
    }
    shouldComponentUpdate(props: IProps,
                                    current_state: IState) {
        console.log('AnalysisView.shouldComponentUpdate,',
                    'props:', props, 'current:', current_state);
        if (props.analysis.id !== current_state.analysis.id) {
            this.setState({
                analysis: props.analysis.toObject()
            });
        }
        return true;
    }
    selectView(viewMode: ViewMode) {
        this.setState({viewMode: viewMode});
    }
    async saveAnalysis() {
        console.log('AnalysisView.saveAnalysis,', 'props:', this.props);
        renderMathJax();
        const context = this.context;
        let a = new Analysis(this.state.analysis);
        const api = new WebAPI(context);

        // Ignore operation when the last request is on progress.
        if (this.state.saveResult !== 'none')
            return;
        this.setState({
            saveResult: 'progress'
        });

        console.log('saveAnalysis, a:', a);
        try {
            if (!a.id) {
                // Create new analysis
                a = await api.fetchPutAnalysis(a);
                const path = new AppPath(context);
                console.log('saveAnalysis pushes history:',
                            path.analysis(a));
                this.props.history.push(path.analysis(a));
            } else {
                // Update existing analysis
                a = await api.fetchPostAnalysis(a);
                this.setState({
                    analysis: a.toObject()
                });
            }
            this.setState({
                saveResult: 'success'
            });
            Storage.setInputAnalysis(null);
        } catch (e) {
            console.warn('Failed to save Analysis, e:', e);
            this.setState({
                saveResult: 'failed'
            });
        }
    }
    updateAnalysis(value: IAnalysis) {
        this.setState({
            analysis: JSON.parse(JSON.stringify(value)), // deep copy
            saveResult: 'none'
        });
        Storage.setInputAnalysis(new Analysis(value));
    }
    render() {
        const state = this.state;
        const a = new Analysis(state.analysis);
        const viewMode = state.viewMode;
        const paths = new AppPath(this.context);
        return (
            <React.Fragment>
                <nav className="navbar has-background-transparent">
                    <div className="container is-fullhd has-background-color-0">
                        <div className="navbar-menu">
                            <div className="navbar-start">
                                <div className="navbar-item">
                                    <div className="buttons">
                                        <Link className="button is-primary"
                                              to={paths.analysis(a)}>
                                            <i className="fas fa-arrow-left fa-fw"></i>
                                            {' '}戻る
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="navbar-end">
                                <div className="navbar-item">
                                    <a onClick={e => this.selectView('edit')}>
                                        Editor
                                    </a>
                                </div>
                                <div className="navbar-item">
                                    <a onClick={e => this.selectView('json')}>
                                        JSON
                                    </a>
                                </div>
                                <div className="navbar-item">
                                    {
                                        state.saveResult === 'none' ? (
                                            <button onClick={e => this.saveAnalysis()}
                                                    className="button is-primary">
                                                送信
                                            </button>
                                        ) : state.saveResult === 'progress' ? (
                                            <button className="button is-primary is-loading">
                                                送信中です...
                                            </button>
                                        ) : state.saveResult === 'success' ? (
                                            <button className="button is-success">
                                                完了!
                                            </button>
                                        ) : (
                                            <button className="button is-danger">
                                                失敗しました
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="navbar-item">
                                    {/* For layout */}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="container is-fullhd analysis-container">
                    <div className="content">
                        <AnalysisTableEditor
                            analysis={a}
                            visible={viewMode === 'edit'}
                            onChangeAnalysis={this.updateAnalysis}
                            {...this.props}
                        />
                        <AnalysisTablePreview
                            format='json'
                            analysis={a}
                            visible={viewMode === 'json'}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

