import ChemicalConst, { Comp } from '../constants/ChemicalConst';
import { OptionalNumber, mapNumberOr } from './OptionalNumber';
import ComponentItem, { IComponentItem } from './ComponentItem';
import ValuesObject from './ValuesObject';
import ChemicalCalc from '../utils/ChemicalCalc';
import { roundFixed } from '../utils/MathUtil';

export interface MgMvalMmol<T> {
    mg: T;
    mval: T;
    mmol: T;
}

// interface IComponents {
//    { [key in Comp]?: IComponentItem };
// }
// TODO Make IComponents interface.
export type IComponents = { [key in Comp]?: IComponentItem };

type PartialComponents = { [key in Comp]?: ComponentItem };

export default class Components { //implements IComponents {
    components: { [key in Comp]?: ComponentItem };
    constructor(obj: PartialComponents) {
        this.components = {};
        for (let k in obj) {
            this.components[ChemicalConst.compOf(k)] =
                obj[k as keyof typeof obj];
        }
    }
    getContent(key: Comp): MgMvalMmol<OptionalNumber> {
        return this.components[key] ?? {
            mg: '--',
            mval: '--',
            mmol: '--'
        };
    }
    getKeys(): Array<Comp> {
        return Object.keys(this.components).map(k => ChemicalConst.compOf(k));
            /*
        let keys = [] as Array<Comp>;
        for (let k in this.components) keys.push(k);
        return keys;
        // return Object.keys(this.components);
            */
    }
    getValues(key: Comp): MgMvalMmol<number> {
        const mg = mapNumberOr(this.components[key]?.mg, x => x, null);
        if (typeof mg === 'number') {
            return {
                mg: mg,
                mval: ChemicalCalc.mgToMval(key, mg),
                mmol: ChemicalCalc.mgToMmol(key, mg)
            }
        } else {
            return {
                mg: 0,
                mval: 0,
                mmol: 0
            }
        }
    }
    updateValue(key: Comp, values: ComponentItem) {
        this.components[key] = values;
        return this;
    }
    getTotal(): MgMvalMmol<number> {
        let totalMg = 0.;
        let totalMval = 0.;
        let totalMmol = 0.;
        for (let key in this.components) {
            const comp = this.components[ChemicalConst.compOf(key)];
            totalMg += mapNumberOr(comp?.mg, v => roundFixed(v, 2), 0);
            totalMval += mapNumberOr(comp?.mval, v => roundFixed(v, 2), 0);
            totalMmol += mapNumberOr(comp?.mmol, v => roundFixed(v, 2), 0);
        }
        return {
            mg: totalMg,
            mval: totalMval,
            mmol: totalMmol
        };
    }
    toObject(): IComponents {
        return {
            ...this.components
        };
    }
}

export function jsonToComponents(obj: {[k in Comp]: ValuesObject}): Components {
    console.log('jsonToComponents, obj:', obj);
    const comps: {[key in Comp]?: ComponentItem} = {};
    for (let k in obj) {
        const v = obj[k as keyof typeof obj];
        const comp = ChemicalConst.compOf(k);
        const weight = ChemicalConst.weight(comp);
        const valence = ChemicalConst.valence(comp);
        const mv = new ComponentItem(weight, valence,
                                     v.mg,
                                     v?.mval,
                                     v?.mvalPercent,
                                     v?.mmol);
        comps[comp] = mv;
    }
    return new Components(comps);
}
