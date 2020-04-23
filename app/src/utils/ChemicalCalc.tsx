export function mgToMval(mg: number, weight: number, valence: number): number {
    if (weight === 0)
        return 0;
    return mg / weight * Math.abs(valence);
}

export function mgToMmol(mg: number, weight: number): number {
    if (mg === null)
        return 0;
    return mg / weight;
}

export default class ChemicalCalc {
    static mvalRate(mval: number, total: number): number {
        if (isNaN(mval) || total === 0)
            return 0;
        return Number(mval.toFixed(2)) / total;
    }
}
