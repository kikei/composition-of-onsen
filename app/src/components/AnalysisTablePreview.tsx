import * as React from 'react';
import Analysis from '../models/Analysis';

type ExportFormat = 'json';

interface IProps extends React.Props<any> {
    format: ExportFormat;
    analysis: Analysis;
    visible?: boolean;
}

const JSONExport = (analysis: Analysis) => {
    return (
        <div className="container-export">
            <h1>温泉分析書</h1>
            <pre>
                {analysis.toJSONString()}
            </pre>
        </div>
    );
};

const SwitchExport = (format: ExportFormat, analysis: Analysis) => {
    switch (format ?? 'json') {
        case 'json':
            return JSONExport(analysis);
    }
}

const AnalysisTablePreview: React.FC<IProps> = props => {
    return (
        <div className={
          `container-preview ${props.visible === false ? "hidden" : undefined}`
        }>
          {SwitchExport(props.format, props.analysis)}
        </div>
    );
}

export default AnalysisTablePreview;

