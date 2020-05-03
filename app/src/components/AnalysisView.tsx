import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Analysis, { IAnalysis } from '../models/Analysis';
import CompRepresentations from '../models/CompRepresentations';
import AnalysisTableEditor from './AnalysisTableEditor';
import AnalysisTablePreview from './AnalysisTablePreview';
import { renderMathJax } from '../utils/MathJax';
import ConfigContext from '../contexts/ConfigContext';
import WebAPI from '../services/WebAPI';
import AppPath from '../services/AppPath';

type ViewMode = 'edit' | 'json';

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
}

export default class AnalysisView
extends React.Component<IProps, IState> {
    static contextType = ConfigContext;

    constructor(props: IProps) {
        super(props);
        this.state = {
            analysis: props.analysis.toObject(),
            viewMode: 'edit'
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
    saveAnalysis() {
        const context = this.context;
        const a = new Analysis(this.state.analysis);
        const api = new WebAPI(context);
        console.log('saveAnalysis, a:', a);
        if (!a.id) {
            // Create new analysis
            api.fetchPutAnalysis(a).then(a => {
                const path = new AppPath(context);
                console.log('saveAnalysis pushes history:',
                            path.analysis(a));
                this.props.history.push(path.analysis(a));
            });
        } else {
            // Update existing analysis
            api.fetchPostAnalysis(a).then(a => {
                this.setState({
                    analysis: a.toObject()
                });
            });
        }
    }
    updateAnalysis(value: IAnalysis) {
        this.setState({
            analysis: JSON.parse(JSON.stringify(value)) // deep copy
        });
    }
    render() {
        const state = this.state;
        const a = new Analysis(state.analysis);
        const viewMode = state.viewMode;
        return (
            <div>
                <nav className="select_view-nav">
                  <button onClick={e => this.selectView('edit')}>
                     Editor
                  </button>
                   <button onClick={e => this.selectView('json')}>
                     JSON
                   </button>
                   <button onClick={e => this.saveAnalysis()}>
                     Save
                   </button>
                </nav>
                <div className="container-analysis">
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
        )
    }
}

