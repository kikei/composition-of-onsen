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
    labelFor?: string;
};

const Row = (props: RowProps) => (
    <div className="field is-horizontal editor-row">
        <div className="field-label is-normal">
            <label
                className="label"
                htmlFor={props.labelFor}>
                {props.label}
            </label>
        </div>
        <div className="field-body">
            {props.children}
        </div>
    </div>
);

/* Input helpers */
interface InputProps<T> {
    value?: string | number;
    size?: number;
    onChange?: (e: T) => void;
    className?: string;
    id?: string;
}

const InputText = (props: InputProps<string>) => (
    <div className="field">
        <div className="control is-expanded">
            <input
                id={props.id}
                type="text"
                size={props.size}
                defaultValue={props.value}
                onChange={e => {
                    if (typeof props.onChange === 'function')
                        props.onChange(e.target.value)
                }}
                className="input" />
        </div>
    </div>
);

const InputNumber = (props: InputProps<number>) => (
    <div className={`field ${props.className}`}>
        <div className="control">
            <input type="text"
                size={props.size}
                defaultValue={props.value}
                onChange={e => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) &&
                        typeof props.onChange === 'function') {
                        props.onChange(value)
                    }
                }}
                className="input"
                id={props.id} />
        </div>
    </div>
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
        const InputMetadata = (key: KeyMetadata) => (
            <InputText
                id={`${key}`}
                value={a.getMetadata(key) ?? ''}
                onChange={t => this.updateMetadata(key, t)}
            />
        );

        const Header = (
            <div className="editor-rows">
                <Row label="番号" labelFor="no">
                    {InputMetadata('no')}
                </Row>
            </div>
        );

        const Gensen = (
            <div className="editor-rows">
                <Row label="源泉名" labelFor="gensenName">
                    <InputText
                        id="gensenName"
                        value={a.name}
                        onChange={e => this.updateName(e)} />
                </Row>
                <Row label="源泉湧出地" labelFor="location">
                    {InputMetadata('location')}
                </Row>
            </div>
        );

        const Applicant = (
            <div className="editor-rows">
                <Row label="分析申請者 住所" labelFor="applicantAddress">
                    {InputMetadata('applicantAddress')}
                </Row>
                <Row label="分析申請者 氏名" labelFor="applicantName">
                    {InputMetadata('applicantName')}
                </Row>
            </div>
        );

        const Facility = (
            <div className="editor-rows">
                <Row label="施設名" labelFor="facilityName">
                    {InputMetadata('facilityName')}
                </Row>
                <Row label="浴室名/浴槽名" labelFor="roomName">
                    {InputMetadata('roomName')}
                </Row>
            </div>
        );

        const Investigation = (
            <React.Fragment>
                <h3 className="is-size-5">
                    湧出地における調査及び試験成績
                </h3>
                <div className="editor-rows">
                    <Row label="調査及び試験者" labelFor="investigator">
                        {InputMetadata('investigator')}
                    </Row>
                    <Row label="調査及び試験年月日" labelFor="investigatedDate">
                        {InputMetadata('investigatedDate')}
                    </Row>
                    <Row label="泉温" labelFor="temperature">
                        <InputNumber
                            value={a.temperature}
                            onChange={n => {
                                this.setState(update(this.state, {
                                    analysis: {
                                        temperature: { $set: n }
                                    }
                                }));
                                this.onChangeAnalysis();
                            }}
                            className="has-extra"
                            id="temperature" />
                        {InputMetadata('temperatureExtra')}
                    </Row>
                    <Row label="湧出量/利用量" labelFor="yield">
                        <InputNumber
                            value={a.yield}
                            onChange={n => {
                                this.setState(update(this.state, {
                                    analysis: {
                                        yield: { $set: n }
                                    }
                                }));
                                this.onChangeAnalysis();
                            }}
                            className="has-extra"
                            id="yield" />
                        {InputMetadata('yieldExtra')}
                    </Row>
                    <Row label="知覚的試験" labelFor="perception">
                        {InputMetadata('perception')}
                    </Row>
                    <Row label="pH値" labelFor="pH">
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
                            }}
                            className="has-extra"
                            id="pH" />
                        {InputMetadata('pHExtra')}
                    </Row>
                    <Row label="電気伝導率" labelFor="conductivity">
                        {InputMetadata('conductivity')}
                    </Row>
                    {/*
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
                        {' '} ×10<sup>-10</sup> Ci/kg, {' '}
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
                        {' '} M.E.
                        </Row>
                      */}
                </div>
            </React.Fragment>
        );

        const Test = (
            <React.Fragment>
                <h3 className="is-size-5">
                    試験室における試験成績
                </h3>
                <div className="editor-rows">
                    <Row label="試験者" labelFor="tester">
                        {InputMetadata('tester')}
                    </Row>
                    <Row label="分析終了年月日" labelFor="testedDate">
                        {InputMetadata('testedDate')}
                    </Row>
                    <Row label="知覚的試験" labelFor="testedPerception">
                        {InputMetadata('testedPerception')}
                    </Row>
                    <Row label="密度" labelFor="testedDencity">
                        {InputMetadata('testedDencity')}
                    </Row>
                    <Row label="pH値" labelFor="testedPH">
                        {InputMetadata('testedPH')}
                    </Row>
                    <Row label="蒸発残留物" labelFor="testedER">
                        {InputMetadata('testedER')}
                    </Row>
                </div>
            </React.Fragment>
        );

        const PositiveIon = (
            <React.Fragment>
                <h4 className="is-size-6">陽イオン</h4>
                <TableComponentInput
                    labels={{title: '成分', total: '陽イオン計'}}
                    columns={['name', 'mg', 'mval', 'mvalPercent']}
                    rows={rows.positiveIon}
                    components={a.positiveIon}
                    onChangeComponent={this.updatePositiveIon}
                />
            </React.Fragment>
        );

        const NegativeIon = (
            <React.Fragment>
                <h4 className="is-size-6">陰イオン</h4>
                <TableComponentInput
                    labels={{title: '成分', total: '陰イオン計'}}
                    columns={['name', 'mg', 'mval', 'mvalPercent']}
                    rows={rows.negativeIon}
                    components={a.negativeIon}
                    onChangeComponent={this.updateNegativeIon}
                />
            </React.Fragment>
        );

        const Undissociated = (
            <div className="editor-table-container editor-undissociated">
                <h4 className="is-size-6">遊離成分</h4>
                <TableComponentInput
                    labels={{title: '非解離成分', total: '非解離成分計'}}
                    columns={['name', 'mg', 'mmol']}
                    rows={rows.undissociated}
                    components={a.undissociated}
                    onChangeComponent={this.updateUndissociated}
                />
            </div>
        );

        const Gas = (
            <div className="editor-table-container editor-gas">
                <TableComponentInput
                    labels={{title: '溶存ガス成分',
                             total: '溶存ガス成分計'}}
                    columns={['name', 'mg', 'mmol']}
                    rows={rows.gas}
                    components={a.gas}
                    onChangeComponent={this.updateGas}
                />
            </div>
        );

        const Minor = (
            <React.Fragment>
                <h4 className="is-size-6">その他微量成分</h4>
                <TableComponentInput
                    labels={{title: '微量成分', total: '微量成分計'}}
                    columns={['name', 'mg']}
                    rows={rows.minor}
                    sizes={{mg: 18}}
                    components={a.minor}
                    onChangeComponent={this.updateMinor}
                />
            </React.Fragment>
        );

        return (
            <div className={[
                'editor-container',
                props.visible === false && 'hidden'
            ].join(' ')}>
               <header>
                   <h1 className="title is-size-3">温泉分析書</h1>
               </header>
               <div className="columns is-multiline">
                   <fieldset className="column is-half-widescreen
                       editor-group editor-header">
                       {Header}
                   </fieldset>
                   <fieldset className="column is-half-widescreen
                       editor-group editor-gensen">
                       {Gensen}
                   </fieldset>
                   <fieldset className="column is-half-widescreen
                       editor-group editor-facility">
                       {Facility}
                   </fieldset>
                   <fieldset className="column is-half-widescreen
                       editor-group editor-applicant">
                       {Applicant}
                   </fieldset>
               </div>
               <div className="columns is-multiline">
                   <fieldset className="column is-half-widescreen
                       editor-group editor-investigation">
                       {Investigation}
                   </fieldset>
                   <fieldset className="column is-half-widescreen
                       editor-group editor-test">
                       {Test}
                   </fieldset>
               </div>
               <div className="editor-group editor-components">
                   <h3 className="is-size-5">
                       試料1kg中の成分・分量及び組成
                   </h3>
                   <div className="columns is-multiline
                       editor-tables">
                       <fieldset className="column is-half
                           editor-table-container editor-positiveion">
                           {PositiveIon}
                        </fieldset>
                        <fieldset className="column is-half
                            editor-table-container editor-netagitveion">
                            {NegativeIon}
                        </fieldset>
                   </div>
                   <div className="columns is-widescreen is-multiline">
                        <div className="column is-half-widescreen">
                            {Undissociated}
                            {Gas}
                        </div>
                        <div className="column
                            editor-table-container editor-minor">
                            {Minor}
                        </div>
                   </div>
                   <div className="columns is-multiline">
                        <div className="column columns">
                           <div className="column is-full
                               editor-rows editor-total">
                               <div className="editor-row">
                                   <div className="columns is-size-5">
                                       <span className="column is-9
                                           has-text-weight-medium">
                                           溶存物質計(ガス性のものを除く)
                                       </span>
                                       <span className="column">
                                           {(totalMelt.mg / 1000).toFixed(3)}
                                           {' '}g/kg
                                       </span>
                                   </div>
                                    <div className="columns is-size-5">
                                        <span className="column is-9
                                            has-text-weight-medium">
                                            成分総計
                                        </span>
                                        <span className="column">
                                            {(totalComponent.mg / 1000).toFixed(3)}
                                            {' '}g/kg
                                        </span>
                                   </div>
                               </div>
                           </div>
                        </div>
                        <div className="column is-full is-size-5
                            editor-group editor-quality">
                            <h3 className="is-size-5">泉質</h3>
                            <div className="editor-row">{quality}</div>
                        </div>
                   </div>
                   <fieldset className="editor-group editor-usage">
                       <h3 className="is-size-5">浴槽の温泉利用に関する情報</h3>
                       <div className="columns is-widescreen is-multiline
                           editor-rows">
                           <div className="column is-half-widescreen">
                               <Row label="加水" labelFor="water">
                                   {InputMetadata('water')}
                               </Row>
                           </div>
                           <div className="column is-half-widescreen">
                               <Row label="加温" labelFor="heating">
                                   {InputMetadata('heating')}
                               </Row>
                           </div>
                           <div className="column is-half-widescreen">
                               <Row label="循環・ろ過" labelFor="circulation">
                                   {InputMetadata('circulation')}
                               </Row>
                           </div>
                           <div className="column is-half-widescreen">
                               <Row label="消毒" labelFor="chlorination">
                                   {InputMetadata('chlorination')}
                               </Row>
                           </div>
                           <div className="column is-half-widescreen">
                               <Row label="入浴剤" labelFor="additive">
                                   {InputMetadata('additive')}
                               </Row>
                           </div>
                       </div>
                   </fieldset>
                   <fieldset className="editor-group editor-footer">
                       <h3 className="is-size-5">
                           補足 ※特記やメモなどご自由に
                       </h3>
                       <textarea
                           value={a.getMetadata('footer')}
                           onChange={e =>
                               this.updateMetadata('footer', e.target.value)
                           }
                           rows={1 +
                             (a.getMetadata('footer') ?? '').split('\n').length
                           }
                           placeholder='補足'
                           className="textarea">
                       </textarea>
                   </fieldset>
               </div>
            </div>
        )
    }
}
