import * as React from 'react';
import update from 'react-addons-update';
import { Comp } from '../constants/ChemicalConst';
import Analysis, { IAnalysis, KeyMetadata } from '../models/Analysis';
import CompRepresentations from '../models/CompRepresentations';
import Components from '../models/Components';
import TableComponentInput from './TableComponentInput';
import { qualityName } from '../utils/OnsenUtil';

export interface IProps extends React.Props<any> {
    analysis: Analysis;
    rows: {
        positiveIon: Array<CompRepresentations>,
        negativeIon: Array<CompRepresentations>,
        undissociated: Array<CompRepresentations>,
        gas: Array<CompRepresentations>,
        minor: Array<CompRepresentations>
    };
    visible?: boolean;
    onChangeAnalysis?: (analysis: IAnalysis) => void;
}

interface IState {
    analysis: IAnalysis;
}

/* Row */
interface RowProps {
    label: string;
    children: React.ReactNode;
};

const Row = (props: RowProps) => (
    <p>
        <label>
            <span>{props.label}</span>
            {props.children}
        </label>
    </p>
);

/* InputText */
interface InputTextProps {
    value: string | number;
    size?: number;
    onChange?: (e: any) => void;
};

const InputText = (props: InputTextProps) => (
    <input type="text"
           size={props.size}
           defaultValue={props.value}
           onChange={props.onChange} />
);

interface InputNumberProps {
    value: string | number;
    size?: number;
    onChange?: (e: number) => void;
};

const InputNumber = (props: InputNumberProps) => (
    <input type="text"
           size={props.size}
           defaultValue={props.value}
           onChange={e => {
               const value = Number(e.target.value);
               if (!isNaN(value) && typeof props.onChange === 'function') {
                   props.onChange(value)
               }
           }} />
);

export default class AnalysisTableEditor
extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            analysis: props.analysis.toObject()
        };
        this.updateName = this.updateName.bind(this);
        this.updatePositiveIon = this.updatePositiveIon.bind(this);
        this.updateNegativeIon = this.updateNegativeIon.bind(this);
        this.updateUndissociated = this.updateUndissociated.bind(this);
        this.updateGas = this.updateGas.bind(this);
        this.updateMinor = this.updateMinor.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
    }

    /**
     * Call event handler from a parent component
     */
    onChangeAnalysis() {
        if (typeof this.props.onChangeAnalysis === 'function')
            setTimeout(() => {
                this.props.onChangeAnalysis!(this.state.analysis)
            }, 0);
    }

    /**
     * Process input
     */
    updateName(value: string) {
        this.props.analysis.name = value;
        this.setState(update(this.state, {
            analysis: {
                name: { $set: value }
            }
        }));
        this.onChangeAnalysis();
    }
    updatePositiveIon(key: Comp, value: Components) {
        this.props.analysis.positiveIon = value;
        this.setState(update(this.state, {
            analysis: {
                positiveIon: {
                    $set: value.toObject()
                }
            }
        }));
        this.onChangeAnalysis();
    }
    updateNegativeIon(key: Comp, value: Components) {
        this.props.analysis.negativeIon = value;
        this.setState(update(this.state, {
            analysis: {
                negativeIon: {
                    $set: value.toObject()
                }
            }
        }));
        this.onChangeAnalysis();
    }
    updateUndissociated(key: Comp, value: Components) {
        this.props.analysis.undissociated = value;
        this.setState(update(this.state, {
            analysis: {
                undissociated: {
                    $set: value.toObject()
                }
            }
        }));
        this.onChangeAnalysis();
    }
    updateGas(key: Comp, value: Components) {
        this.props.analysis.gas = value;
        this.setState(update(this.state, {
            analysis: {
                gas: {
                    $set: value.toObject()
                }
            }
        }));
        this.onChangeAnalysis();
    }
    updateMinor(key: Comp, value: Components) {
        this.props.analysis.minor = value;
        this.setState(update(this.state, {
            analysis: {
                minor: {
                    $set: value.toObject()
                }
            }
        }));
        this.onChangeAnalysis();
    }
    updateMetadata(key: KeyMetadata, value: string) {
        this.props.analysis.updateMetadata(key, value);
        this.setState(update(this.state, {
            analysis: {
                metadata: {
                    $set: this.props.analysis.copyMetadata()
                }
            }
        }));
        this.onChangeAnalysis();
    }
    render() {
        const props = this.props;
        // const a = this.props.analysis;
        const rows = this.props.rows;
        const state = this.state;
        const a = new Analysis(state.analysis);
        console.log('render, a:', a, 'state.analysis:', state.analysis);
        const totalMelt = a.getTotalMelt();
        const totalComponent = a.getTotalComponent();
        const quality = qualityName(a);

        // Helper component to input metadata
        const InputMetadata = (key: KeyMetadata, size: number = 20) => (
            <InputText
                value={a.getMetadata(key) ?? ''}
                onChange={e => this.updateMetadata(key, e.target.value)}
                size={size}
            />
        );

        return (
            <div className={
              `table-analysis ${props.visible === false && "hidden"}`
            }>
               <h1>温泉分析書</h1>
               <fieldset className="form-header">
                   <Row label="番号">
                       {InputMetadata('no')}
                   </Row>
               </fieldset>
               <fieldset className="form-applicant">
                   <Row label="分析申請者 住所">
                       {InputMetadata('applicantAddress')}
                   </Row>
                   <Row label="分析申請者 氏名">
                       {InputMetadata('applicantName')}
                   </Row>
               </fieldset>
               <fieldset className="form-gensen">
                   <Row label="源泉名">
                       <InputText
                           value={a.name}
                           onChange={e => this.updateName(e.target.value)} />
                   </Row>
                   <Row label="源泉湧出地">
                       {InputMetadata('location')}
                   </Row>
               </fieldset>
               <fieldset className="form-investigation">
                   <h3>湧出地における調査及び試験成績</h3>
                   <Row label="調査及び試験者">
                       {InputMetadata('investigator')}
                   </Row>
                   <Row label="調査及び試験年月日">
                       {InputMetadata('investigatedDate')}
                   </Row>
                   <Row label="泉温">
                       <InputNumber value={a.temperature}
                                    size={5}
                                    onChange={n => {
                                        this.setState(update(this.state, {
                                            analysis: {
                                                temperature: { $set: n }
                                            }
                                        }));
                                        this.onChangeAnalysis();
                                    }} />
                       {InputMetadata('temperatureExtra', 20)}
                   </Row>
                   <Row label="湧出量/利用量">
                       <InputNumber value={a.yield}
                                    onChange={n => {
                                        this.setState(update(this.state, {
                                            analysis: {
                                                yield: { $set: n }
                                            }
                                        }));
                                        console.log('yield, n:', n, 'state:', this.state);
                                        this.onChangeAnalysis();
                                    }} />
                   </Row>
                   <Row label="知覚的試験">
                       {InputMetadata('perception', 20)}
                   </Row>
                   <Row label="pH値">
                       <InputNumber value={a.pH}
                                    onChange={n => {
                                        this.setState(update(this.state, {
                                            analysis: {
                                                pH: { $set: n }
                                            }
                                        }));
                                        this.onChangeAnalysis();
                                    }} />
                   </Row>
                   <Row label="電気伝導率">
                       {InputMetadata('conductivity')}
                   </Row>
                   <Row label="ラドン">
                       <InputNumber value={a.bq}
                                    size={2}
                                    onChange={n => {
                                        this.setState(update(this.state, {
                                            analysis: {
                                                bq: { $set: n }
                                            }
                                        }));
                                        this.onChangeAnalysis();
                                    }} />
                       {' '} Bq/kg,{' '}
                       <InputNumber value={a.ci}
                                    size={2}
                                    onChange={n => {
                                        this.setState(update(this.state, {
                                            analysis: {
                                                ci: { $set: n }
                                            }
                                        }));
                                        this.onChangeAnalysis();
                                    }} />
                       {' '} Ci/kg, {' '}
                       <InputNumber value={a.me}
                                  size={2}
                                    onChange={n => {
                                        this.setState(update(this.state, {
                                            analysis: {
                                                me: { $set: n }
                                            }
                                        }));
                                        this.onChangeAnalysis();
                                    }} />
                       {' '} ME
                   </Row>
               </fieldset>
               <fieldset className="form-test">
                   <h3>試験室における試験成績</h3>
                   <Row label="試験者">
                       {InputMetadata('tester', 20)}
                   </Row>
                   <Row label="分析終了年月日">
                       {InputMetadata('testedDate', 20)}
                   </Row>
                   <Row label="知覚的試験">
                       {InputMetadata('testedPerception', 20)}
                   </Row>
                   <Row label="密度">
                       {InputMetadata('testedDencity', 20)}
                   </Row>
                   <Row label="pH値">
                       {InputMetadata('testedPH', 20)}
                   </Row>
                   <Row label="蒸発残留物">
                       {InputMetadata('testedER', 20)}
                   </Row>
               </fieldset>
               <div>
                   <h3>試料1kg中の成分・分量及び組成</h3>
                   <fieldset className="form-positiveion">
                       <h4>陽イオン</h4>
                       <TableComponentInput
                           labels={{title: '成分', total: '陽イオン計'}}
                           columns={['name', 'mg', 'mval', 'mvalPercent']}
                           rows={rows.positiveIon}
                           components={a.positiveIon}
                           onChangeComponent={this.updatePositiveIon}
                       />
                   </fieldset>
                   <fieldset className="form-negativeion">
                       <h4>陰イオン</h4>
                       <TableComponentInput
                           labels={{title: '成分', total: '陰イオン計'}}
                           columns={['name', 'mg', 'mval', 'mvalPercent']}
                           rows={rows.negativeIon}
                           components={a.negativeIon}
                           onChangeComponent={this.updateNegativeIon}
                       />
                   </fieldset>
                   <fieldset className="form-dissolved">
                       <h4>遊離成分</h4>
                       <TableComponentInput
                           labels={{title: '非解離成分', total: '非解離成分計'}}
                           columns={['name', 'mg', 'mmol']}
                           rows={rows.undissociated}
                           components={a.undissociated}
                           onChangeComponent={this.updateUndissociated}
                       />
                       <TableComponentInput
                           labels={{title: '溶存ガス成分',
                                    total: '溶存ガス成分計'}}
                           columns={['name', 'mg', 'mmol']}
                           rows={rows.gas}
                           components={a.gas}
                           onChangeComponent={this.updateGas}
                       />
                   </fieldset>
                   <fieldset className="form-minor">
                       <h4>その他微量成分</h4>
                       <TableComponentInput
                           labels={{title: '微量成分', total: '微量成分計'}}
                           columns={['name', 'mg']}
                           rows={rows.minor}
                           components={a.minor}
                       />
                   </fieldset>
                   <p>
                       溶存物質計(ガス性のものを除く)
                       <span>{(totalMelt.mg / 1000).toFixed(3)} g/kg</span>
                   </p>
                   <p>
                       成分総計
                       <span>
                           {(totalComponent.mg / 1000).toFixed(3)} g/kg
                       </span>
                   </p>
               </div>
               <div>
                   <h3>判定</h3>
                   {quality}
               </div>
               <div className="footer">
                   {a.getMetadata('footer')}
               </div>
            </div>
        )
    }
}