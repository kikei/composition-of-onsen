import * as React from 'react';
import Analysis from '../models/Analysis';
import { qualityName } from '../utils/OnsenUtil';

type ExportFormat = 'json';

interface IProps extends React.Props<any> {
    format: ExportFormat;
    analysis: Analysis;
    visible?: boolean;
}

const JSONExport = (analysis: Analysis) => {
    const obj = analysis.toObject();
    console.log('JSONExport analysis:', analysis, 'obj:', obj);

    // Move metadata to object's root
    const data = { ...obj, ...obj.metadata };
    delete data.metadata;

    const quality = qualityName(analysis);
    data.quality = quality;

    const replacer = (key: string, value: any) => {
        if (['mg', 'mval', 'mmol', 'mvalPercent'].includes(key)) {
            return typeof value === 'number' ?
                   Number(value.toFixed(4)) : value;
        } else if (['weight', 'valence'].includes(key)) {
            return undefined;
        }
        return value;
    };
    return (
        <pre>
            {JSON.stringify(data, replacer, 2)}
        </pre>
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
          `container-export ${props.visible === false && "hidden"}`
        }>
          <h1>温泉分析書</h1>
          {SwitchExport(props.format, props.analysis)}
        </div>
    );
}

export default AnalysisTablePreview;

