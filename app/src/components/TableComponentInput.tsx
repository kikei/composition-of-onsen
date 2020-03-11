import React from 'react';
import ChemicalConst, { Comp } from '../constants/ChemicalConst';
import {
    OptionalNumber, mapNumber, mapNumberToText
} from '../models/OptionalNumber';
import ComponentItem from '../models/ComponentItem';
import Components, { IComponents } from '../models/Components';
import CompRepresentations from '../models/CompRepresentations';
import ChemicalCalc from '../utils/ChemicalCalc';

type Column = 'name' | 'mg' | 'mval' | 'mmol' | 'mvalPercent'

interface Labels {
    title?: string,
    total?: string;
    mg?: string;
    mval?: string;
    mvalPercent?: string;
    mmol?: string;
}

interface IProps {
    labels?: Labels;
    rows: Array<CompRepresentations>;
    columns?: Array<Column>;
    components: Components;
    onChangeComponent?: (key: Comp, value: Components) => void;
    onChangeTotal?: () => void;
}

interface IState {
    components: IComponents;
}

function createLabels(given: Labels = {}): Labels {
    return {
        title: given.title ?? '成分',
        total: given.total ?? '計',
        mg: given.mg ?? 'mg',
        mval: given.mval ?? 'mval',
        mmol: given.mmol ?? 'mmol',
        mvalPercent: given.mvalPercent ?? 'mval%'
    };
}

function showMg(mg: OptionalNumber, def: string = ''): string {
    return mapNumberToText(mg, v => v.toFixed(1)) ?? def;
}

function showMval(mval: OptionalNumber, def: string = ''): string {
    return mapNumberToText(mval, v => v.toFixed(2)) ?? def;
}

function showMvalPercent(per: OptionalNumber | undefined,
                         def: string = ''): string {
    return mapNumberToText(per, v => (v * 100).toFixed(2)) ?? def;
}

function showMmol(mmol: OptionalNumber, def: string = ''): string {
    return mapNumberToText(mmol, v => v.toFixed(2)) ?? def;
}

function showTotalMg(mg: number): string {
    return mg.toFixed(2);
}

function showTotalMval(mval: number): string {
    return mval.toFixed(2);
}

function showTotalMmol(mmol: number): string {
    return mmol.toFixed(2);
}

export default class TableComponentInput
extends React.Component<IProps, IState> {
    labels: Labels;
    constructor(props: IProps) {
        super(props);
        this.labels = createLabels(props.labels);
        this.state = {
            components: props.components?.toObject() ?? new Components({})
        };
        this.updateMgValue = this.updateMgValue.bind(this);
    }
    updateMgValue(key: Comp, val: string) {
        const w = ChemicalConst.weight(key);
        const v = ChemicalConst.valence(key);
        const r = parseFloat(val);
        const mg = isNaN(r) ? val : r;
        const mv = new ComponentItem(w, v, mg);
        this.setState({
            components: {
                ...this.state.components,
                [key]: mv
            }
        });
        this.props.components.updateValue(key, mv);
        // console.log('updateMgValue, key:', key, 'val:', val);
        if (typeof this.props.onChangeComponent === 'function')
            this.props.onChangeComponent(key, this.props.components);
    }
    render() {
        const labels = this.labels;
        const columns = this.props.columns ?? ['name', 'mg'];
        const rows = this.props.rows;
        // const components = this.state.components;
        const total = this.props.components.getTotal();
        const HeaderCell = (col: Column) => {
            switch (col) {
                case 'name':
                    return <th key={col} className="column-name">
                        {labels.title}
                    </th>;
                case 'mg':
                    return <th key={col} className="column-mg">
                        {labels.mg}
                    </th>;
                case 'mval':
                    return <th key={col} className="column-mval">
                        {labels.mval}
                    </th>;
                case 'mmol':
                    return <th key={col} className="mmol">
                        {labels.mmol}
                    </th>;
                case 'mvalPercent':
                    return <th key={col} className="mvalPercent">
                        {labels.mvalPercent}
                    </th>;
            }
        };
        const BodyRow = (row: CompRepresentations) => {
            // const {mg, mval, mmol} = components.getValues(row.key);
            const {mg, mval, mmol} = this.props.components.getContent(row.key);
            const mvalRate =
                mapNumber(mval, v => ChemicalCalc.mvalRate(v, total.mval));
            return (
                <tr key={row.key}>
                {columns.map(col => {
                    switch (col) {
                        case 'name':
                            return <td key={col} className="column-name">
                                {row.name} ({row.formula})
                            </td>;
                        case 'mg':
                            return <td key={col} className="column-mg">
                                <input type="text" size={6}
                                       defaultValue={showMg(mg, '--')}
                                       onChange={e => {
                                           const v = e.target.value;
                                           this.updateMgValue(row.key, v);
                                       }}
                                />
                            </td>;
                        case 'mval':
                            return <td key={col} className="column-mval">
                                {showMval(mval, '--')}
                            </td>;
                        case 'mvalPercent':
                            return <td key={col} className="column-mvalPercent">
                                {showMvalPercent(mvalRate, '--')}
                            </td>;
                        case 'mmol':
                            return <td key={col} className="column-mmol">
                                {showMmol(mmol, '--')}
                            </td>;
                        default:
                            return null;
                    }
                })}
                </tr>
            );
        };
        const TotalCell = (col: Column) => {
            switch (col) {
                case 'name':
                    return <td key={col} className="column-name">
                        {labels.total}
                    </td>;
                case 'mg':
                    return <td key={col} className="column-mg">
                        {showTotalMg(total.mg)}
                    </td>;
                case 'mval':
                    return <td key={col} className="column-mval">
                        {showTotalMval(total.mval)}
                    </td>;
                case 'mvalPercent':
                    return <td key={col} className="column-mvalPercent">
                        100
                    </td>;
                case 'mmol':
                    return <td key={col} className="column-mmol">
                        {showTotalMmol(total.mmol)}
                    </td>;
            }
        };
        const TotalRow = <tr>{columns.map(TotalCell)}</tr>;
        return (
            <table>
                <thead>
                    <tr>{columns.map(HeaderCell)}</tr>
                </thead>
                <tbody>
                    {rows.map(BodyRow)}
                    {TotalRow}
                </tbody>
            </table>
        );
    }
}
