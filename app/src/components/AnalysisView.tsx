import * as React from 'react';
import Analysis, { IAnalysis } from '../models/Analysis';
import CompRepresentations from '../models/CompRepresentations';
import AnalysisTableEditor from './AnalysisTableEditor';
import AnalysisTablePreview from './AnalysisTablePreview';
import { renderMathJax } from '../utils/MathJax';

type ViewMode = 'edit' | 'json';

export interface IProps {
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
    constructor(props: IProps) {
        super(props);
        this.state = {
            analysis: props.analysis.toObject(),
            viewMode: 'edit'
        };
        this.selectView = this.selectView.bind(this);
        this.updateAnalysis = this.updateAnalysis.bind(this);
    }
    componentDidMount() {
        renderMathJax();
    }
    selectView(viewMode: ViewMode) {
        this.setState({viewMode: viewMode});
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
                <nav className="select-view">
                  <button onClick={e => this.selectView('edit')}>
                     Editor
                  </button>
                   <button onClick={e => this.selectView('json')}>
                     JSON
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

