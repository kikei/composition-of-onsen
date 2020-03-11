import * as React from 'react';
import update from 'react-addons-update';
import { Comp } from '../constants/ChemicalConst';
import Analysis, { IAnalysis } from '../models/Analysis';
import CompRepresentations from '../models/CompRepresentations';
import Components from '../models/Components';
import TableComponentInput from './TableComponentInput';
import { qualityName } from '../utils/OnsenUtil';
import { enableMathJax } from '../utils/MathJax';

export interface IProps {
    analysis: Analysis;
    rows: {
        positiveIon: Array<CompRepresentations>,
        negativeIon: Array<CompRepresentations>,
        undissociated: Array<CompRepresentations>,
        gas: Array<CompRepresentations>,
        others: Array<CompRepresentations>
    }
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

export default class AnalysisTable
extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        console.log('AnalysisTable, props:', props);
        this.state = {
            analysis: props.analysis.toObject()
        };
        this.updatePositiveIon = this.updatePositiveIon.bind(this);
        this.updateNegativeIon = this.updateNegativeIon.bind(this);
        this.updateUndissociated = this.updateUndissociated.bind(this);
        this.updateGas = this.updateGas.bind(this);
        this.updateOthers = this.updateOthers.bind(this);
    }
    componentDidMount() {
        enableMathJax();
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
    }
    updateOthers(key: Comp, value: Components) {
        this.props.analysis.others = value;
        this.setState(update(this.state, {
            analysis: {
                others: {
                    $set: value.toObject()
                }
            }
        }));
    };
    render() {
        const a = new Analysis(this.state.analysis);
        console.log('render, a:', a);
        // const a = this.props.analysis;
        const rows = this.props.rows;
        const state = this.state;
        const totalMelt = a.getTotalMelt();
        const totalComponent = a.getTotalComponent();
        const quality = qualityName(a);
        return (
            <div className="table-analysis">
               <h1>温泉分析書</h1>
               <fieldset className="form-header">
                   <Row label="番号"><InputText value={a.no} /></Row>
               </fieldset>
               <fieldset className="form-applicant">
                   <Row label="分析申請者 住所">
                       <InputText value={a.applicantAddress}
                                  onChange={e => {
                                      this.setState({
                                          analysis: {
                                              ...state.analysis,
                                              applicantAddress: e.target.value
                                          }
                                      })
                                  }} />
                   </Row>
                   <Row label="分析申請者 氏名">
                       <InputText value={a.applicantName}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          applicantName: e.target.value
                                      }
                                  })} />
                   </Row>
               </fieldset>
               <fieldset className="form-gensen">
                   <Row label="源泉名">
                       <InputText value={a.gensenName}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          gensenName: e.target.value
                                      }
                                  })} />
                   </Row>
                   <Row label="源泉湧出地">
                       <InputText value={a.gensenLocation}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          gensenLocation: e.target.value
                                      }
                                  })} />
                   </Row>
               </fieldset>
               <fieldset className="form-investigation">
                   <h3>湧出地における調査及び試験成績</h3>
                   <Row label="調査及び試験者">
                       <InputText value={a.investigater}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          investigater: e.target.value
                                      }
                                  })} />
                   </Row>
                   <Row label="調査及び試験年月日">
                       <InputText value={a.investigatedDate}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          investigatedDate: e.target.value
                                      }
                                  })} />
                   </Row>
                   <Row label="泉温">
                       <InputNumber value={a.temperature}
                                  size={5}
                                  onChange={n => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          temperature: n
                                      }
                                  })} />
                       <InputText value={a.temperatureExtra}
                                  size={20}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          temperatureExtra: e.target.number
                                      }
                                  })} />
                   </Row>
                   <Row label="湧出量/利用量">
                       <InputText value={a.gensenAmount}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          gensenAmount: e.target.value
                                      }
                                  })} />
                   </Row>
                   <Row label="知覚的試験">
                       <InputText value={a.investigatedPerception}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          investigatedPerception: e.target.value
                                      }
                                  })}/>
                   </Row>
                   <Row label="pH値">
                       <InputNumber value={a.investigatedPh}
                                    onChange={n => this.setState({
                                        analysis: {
                                            ...state.analysis,
                                            investigatedPh: n
                                        }
                                    })} />
                   </Row>
                   <Row label="電気伝導率">
                       <InputText value={a.investigatedConductivity}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          investigatedConductivity: e.target.value
                                      }
                                  })}/>
                   </Row>
                   <Row label="ラドン">
                       <InputNumber value={a.investigatedBq}
                                  size={2}
                                  onChange={n => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          investigatedBq: n
                                      }
                                  })}/>
                       {' '} Bq/kg,{' '}
                       <InputNumber value={a.investigatedCi}
                                  size={2}
                                  onChange={n => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          investigatedCi: n
                                      }
                                  })}/>
                       {' '} Ci/kg, {' '}
                       <InputNumber value={a.investigatedME}
                                  size={2}
                                  onChange={n => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          investigatedME: n
                                      }
                                  })}/>
                       {' '} ME
                   </Row>
               </fieldset>
               <fieldset className="form-test">
                   <h3>試験室における試験成績</h3>
                   <Row label="試験者">
                       <InputText value={a.tester}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          tester: e.target.value
                                      }
                                  })}/>
                   </Row>
                   <Row label="分析終了年月日">
                       <InputText value={a.testedDate}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          testedDate: e.target.value
                                      }
                                  })}/>
                   </Row>
                   <Row label="知覚的試験">
                       <InputText value={a.testedPerception}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          testedPerception: e.target.value
                                      }
                                  })}/>
                   </Row>
                   <Row label="密度">
                       <InputText value={a.testedDencity}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          testedDencity: e.target.value
                                      }
                                  })}/>
                   </Row>
                   <Row label="pH値">
                       <InputNumber value={a.testedPh}
                                  onChange={n => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          testedPh: n
                                      }
                                  })}/>
                   </Row>
                   <Row label="蒸発残留物">
                       <InputText value={a.testedER}
                                  onChange={e => this.setState({
                                      analysis: {
                                          ...state.analysis,
                                          testedER: e.target.value
                                      }
                                  })}/>
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
                   <fieldset className="form-others">
                       <h4>その他微量成分</h4>
                       <TableComponentInput
                           labels={{title: '微量成分', total: '微量成分計'}}
                           columns={['name', 'mg']}
                           rows={rows.others}
                           components={a.others}
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
               <div>
                   <h4>禁忌症等</h4>
                   {/*data.contraindication*/}
               </div>
               <div className="footer">
                   <ul>
                       {a.footer.map((line, i) => <li key={i}>{line}</li>)}
                   </ul>
               </div>
            </div>
        )
    }
}

