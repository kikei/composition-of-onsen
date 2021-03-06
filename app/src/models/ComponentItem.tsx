import { OptionalNumber } from './OptionalNumber';
import { mgToMval, mgToMmol } from '../utils/ChemicalCalc';

export interface IComponentItem {
    weight: number;
    valence: number;
    mg: number | string;
    mval: number | string;
    mmol: number | string;
    mvalPercent: number | string;
}

export default class ComponentItem {
    weight: number;
    valence: number;
    mg: OptionalNumber;
    mval!: OptionalNumber;
    mmol!: OptionalNumber;
    mvalPercent!: OptionalNumber;
    // mvalPercent: OptionalNumber;
    constructor(weight: number, valence: number,
                mg: OptionalNumber,
                mval?: OptionalNumber,
                mvalPercent?: OptionalNumber,
                mmol?: OptionalNumber) {
        this.weight = weight;
        this.valence = valence;
        this.mg = mg;
        this.completeAndSet(mval, mvalPercent, mmol);
    }
    completeAndSet(mval?: OptionalNumber,
                   mvalPercent?: OptionalNumber,
                   mmol?: OptionalNumber) {
        const w = this.weight;
        const v = this.valence;
        const mg = this.mg;
        switch (typeof(mg)) {
            case 'number':
                if (w !== 0) {
                    // Support Humus
                    this.mval = mgToMval(mg, w, v);
                    this.mmol = mgToMmol(mg, w);
                    this.mvalPercent = mvalPercent ?? 0;
                } else {
                    this.mval = mval ?? '--';
                    this.mmol = mmol ?? '--';
                    this.mvalPercent = mvalPercent ?? '--';
                }
                break;
            default:
                this.mval = mval ?? '--';
                this.mmol = mmol ?? '--';
                this.mvalPercent = mvalPercent ?? '--';
        }
    }
    toObject(): IComponentItem {
        return {
            weight: this.weight,
            valence: this.valence,
            mg: this.mg,
            mval: this.mval,
            mmol: this.mmol,
            mvalPercent: this.mvalPercent
        }
    }
}
