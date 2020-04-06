import * as React from 'react';
import Analysis from '../models/Analysis';

type ExportFormat = 'json';

interface IProps extends React.Props<any> {
    format: ExportFormat;
    analysis: Analysis;
    visible?: boolean;
}

const JSONExport = (analysis: Analysis) => {
    const obj = analysis.toObject();
    const replacer = (key: string, value: any) => {
        if (['mg', 'mval', 'mmol'].includes(key)) {
            return typeof value === 'number' ?
                   Number(value.toFixed(4)) : value;
        } else if (['weight', 'valence'].includes(key)) {
            return undefined;
        }
        return value;
    };
    return (
        <pre>
            {JSON.stringify(obj, replacer, 2)}
        </pre>
    );
};

const SwitchExport = (format: ExportFormat, analysis: Analysis) => {
    switch (format ?? 'json') {
        case 'json':
            return JSONExport(analysis);
    }
}

const AnalysisTableExport: React.FC<IProps> = props => {
    return (
        <div className={
          `container-export ${props.visible === false && "hidden"}`
        }>
          <h1>温泉分析書</h1>
          {SwitchExport(props.format, props.analysis)}
        </div>
    );
}

export default AnalysisTableExport;

