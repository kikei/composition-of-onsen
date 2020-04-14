import ChemicalConst, { Comp } from '../constants/ChemicalConst';
import { OptionalNumber, mapNumber, mapNumberOr } from './OptionalNumber';
import ComponentItem, { IComponentItem } from './ComponentItem';
import ValuesObject from './ValuesObject';
import ChemicalCalc from '../utils/ChemicalCalc';
import { roundFixed } from '../utils/MathUtil';

export interface MgMvalMmol<T> {
    mg: T;
    mval: T;
    mmol: T;
    mvalPercent: T;
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
        this.recalculate();
    }
    getContent(key: Comp): MgMvalMmol<OptionalNumber> {
        return this.components[key] ?? {
            mg: '--',
            mval: '--',
            mmol: '--',
            mvalPercent: '--'
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
        const vs = this.components[key];
        return {
            mg: mapNumberOr(vs?.mg, x => x, 0),
            mval: mapNumberOr(vs?.mval, x => x, 0),
            mmol: mapNumberOr(vs?.mmol, x => x, 0),
            mvalPercent: mapNumberOr(vs?.mvalPercent, x => x, 0)
        };
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
            mmol: totalMmol,
            mvalPercent: 100.0
        };
    }
    toObject(): IComponents {
        return {
            ...this.components
        };
    }
    copy(): Components {
        return new Components({ ...this.components });
    }

    /**
     * Update value
     */
    updateValue(key: Comp, values: ComponentItem) {
        this.components[key] = values;
        this.recalculate();
        return this;
    }
    recalculate() {
        const totalMval = this.getTotal().mval;
        for (let key in this.components) {
            const k = ChemicalConst.compOf(key);
            if (this.components[k] &&
                typeof this.components[k]!.mval === 'number') {
                this.components[k]!.mvalPercent =
                    mapNumber(this.components[k]!.mval,
                              v => 100 * ChemicalCalc.mvalRate(v, totalMval))
                    ?? 0;
            }
        }
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
