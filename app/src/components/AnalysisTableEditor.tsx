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

/* Input helpers */
interface InputProps<T> {
    value?: string | number;
    size?: number;
    onChange?: (e: T) => void;
}

const InputText = (props: InputProps<string>) => (
    <input type="text"
           size={props.size}
           defaultValue={props.value}
           onChange={e => {
               if (typeof props.onChange === 'function')
                   props.onChange(e.target.value)
           }} />
);

const InputNumber = (props: InputProps<number>) => (
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

    shouldComponentUpdate(props: IProps,
                          current_state: IState) {
        console.log('AnalysisTableEditor.shouldComponentUpdate',
                    'props:', props, 'current:', current_state);
        if (props.analysis.id !== current_state.analysis.id) {
            this.setState({
                analysis: props.analysis.toObject()
            });
        }
        return true;
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
        this.setState(update(this.state, {
            analysis: {
                name: { $set: value }
            }
        }));
        this.onChangeAnalysis();
    }
    updatePositiveIon(key: Comp, value: Components) {
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
        this.setState(update(this.state, {
            analysis: {
                metadata: {
                    [key]: {
                        $set: value
                    }
                }
            }
        }));
        this.onChangeAnalysis();
    }
    render() {
        const props = this.props;
        const a = new Analysis(this.state.analysis);
        const rows = this.props.rows;
        const totalMelt = a.getTotalMelt();
        const totalComponent = a.getTotalComponent();
        const quality = qualityName(a);
        console.log('AnalysisTableEditor rendering, a:', a,
                    'totalMelt:', totalMelt,
                    'totalComponent:', totalComponent,
                    'quality:', quality,
                    'props:', props);

        // Helper component to input metadata
        const InputMetadata = (key: KeyMetadata, size: number = 20) => (
            <InputText
                value={a.getMetadata(key) ?? ''}
                onChange={t => this.updateMetadata(key, t)}
                size={size}
            />
        );

        return (
            <div className={
              `table-analysis ${props.visible === false && "hidden"}`
            }>
               <h1>温泉分析書</h1>
               <fieldset className="form-header">
                   <div className="form-list">
                       <Row label="番号">
                           {InputMetadata('no')}
                       </Row>
                   </div>
               </fieldset>
               <fieldset className="form-gensen">
                   <div className="form-list">
                       <Row label="源泉名">
                           <InputText
                               value={a.name}
                               onChange={e => this.updateName(e)} />
                       </Row>
                       <Row label="源泉湧出地">
                           {InputMetadata('location')}
                       </Row>
                   </div>
               </fieldset>
               <fieldset className="form-applicant">
                   <div className="form-list">
                       <Row label="分析申請者 住所">
                           {InputMetadata('applicantAddress')}
                       </Row>
                       <Row label="分析申請者 氏名">
                           {InputMetadata('applicantName')}
                       </Row>
                   </div>
               </fieldset>
               <fieldset className="form-facility">
                   <div className="form-list">
                       <Row label="施設名">
                           {InputMetadata('facilityName')}
                       </Row>
                       <Row label="浴室名/浴槽名">
                           {InputMetadata('roomName')}
                       </Row>
                   </div>
               </fieldset>
               <fieldset className="form-investigation">
                   <h3>湧出地における調査及び試験成績</h3>
                   <div className="form-list">
                       <Row label="調査及び試験者">
                           {InputMetadata('investigator')}
                       </Row>
                       <Row label="調査及び試験年月日">
                           {InputMetadata('investigatedDate')}
                       </Row>
                       <Row label="泉温">
                           <InputNumber
                               value={a.temperature}
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
                           <InputNumber
                               value={a.yield}
                               size={5}
                               onChange={n => {
                                   this.setState(update(this.state, {
                                       analysis: {
                                           yield: { $set: n }
                                       }
                                   }));
                                   this.onChangeAnalysis();
                               }} />
                           {InputMetadata('yieldExtra')}
                       </Row>
                       <Row label="知覚的試験">
                           {InputMetadata('perception', 20)}
                       </Row>
                       <Row label="pH値">
                           <InputNumber
                               value={a.pH}
                               size={4}
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
                           <InputNumber
                               value={a.bq}
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
                           <InputNumber
                               value={a.ci}
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
                           <InputNumber
                               value={a.me}
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
                   </div>
               </fieldset>
               <fieldset className="form-test">
                   <h3>試験室における試験成績</h3>
                   <div className="form-list">
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
                   </div>
               </fieldset>
               <div className="form-component">
                   <h3>試料1kg中の成分・分量及び組成</h3>
                   <div className="form-list">
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
                               sizes={{mg: 18}}
                               components={a.minor}
                               onChangeComponent={this.updateMinor}
                           />
                       </fieldset>
                       <div className="form-total">
                           <p>
                               <span>
                                   溶存物質計(ガス性のものを除く)
                               </span>
                               <span>
                                   {(totalMelt.mg / 1000).toFixed(3)}
                                   g/kg
                               </span>
                           </p>
                           <p>
                               <span>
                                   成分総計
                               </span>
                               <span>
                                   {(totalComponent.mg / 1000).toFixed(3)}
                                   g/kg
                               </span>
                           </p>
                       </div>
                   </div>
               </div>
               <div className="form-quality">
                   <h3>泉質</h3>
                   <span>{quality}</span>
               </div>
               <fieldset className="form-usage">
                   <h3>浴槽の温泉利用に関する情報</h3>
                   <div className="form-list">
                       <Row label="加水">
                           {InputMetadata('water')}
                       </Row>
                       <Row label="加温">
                           {InputMetadata('heating')}
                       </Row>
                       <Row label="循環・ろ過">
                           {InputMetadata('circulation')}
                       </Row>
                       <Row label="消毒">
                           {InputMetadata('additive')}
                       </Row>
                       <Row label="入浴剤">
                           {InputMetadata('chlorination')}
                       </Row>
                   </div>
               </fieldset>
               <div className="form-footer">
                   <textarea
                       value={a.getMetadata('footer')}
                       onChange={e =>
                           this.updateMetadata('footer', e.target.value)
                       }
                       rows={1 +
                            (a.getMetadata('footer') ?? '').split('\n').length
                       }
                       placeholder='補足'>
                   </textarea>
               </div>
            </div>
        )
    }
}
