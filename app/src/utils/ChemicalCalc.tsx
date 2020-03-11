import ChemicalConst from '../constants/ChemicalConst';
import { Comp } from '../constants/ChemicalConst';

const Const = ChemicalConst;

export default class ChemicalCalc {
    static mgToMval(key: Comp, mg: number): number {
        if (mg == null)
            return 0;
        const weight = Const.weight(key);
        const valence = Math.abs(Const.valence(key));
        return mg / weight * valence;
    }
    static mgToMmol(key: Comp, mg: number): number {
        if (mg == null)
            return 0;
        const weight = Const.weight(key);
        return mg / weight;
    }
    static mvalRate(mval: number, total: number): number {
        console.log(mval, total, Number(mval.toFixed(2)) / total);
        if (isNaN(mval) || total === 0)
            return 0;
        return Number(mval.toFixed(2)) / total;
    }
}
