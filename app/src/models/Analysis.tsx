import { sum } from '../utils/MathUtil';
import { Comp } from '../constants/ChemicalConst';
import { OptionalNumber } from './OptionalNumber';
import Components, {
    MgMvalMmol, IComponents, jsonToComponents
} from './Components';

export interface IAnalysis {
    no: string;
    applicantAddress: string;
    applicantName: string;
    gensenName: string;
    gensenLocation: string;
    gensenAmount: number;
    gensenAmountExtra: string;
    temperature: number;
    temperatureExtra: string;
    investigater: string;
    investigatedDate: string;
    investigatedPerception: string;
    investigatedConductivity: number;
    investigatedConductivityExtra: string;
    investigatedPh: number;
    investigatedBq: number;
    investigatedCi: number;
    investigatedME: number;
    tester: string;
    testedDate: string;
    testedPerception: string;
    testedDencity: number;
    testedDencityExtra: string;
    testedPh: number;
    testedER: number;
    testedERUnit: string;
    quality: string;
    contraindication: string;
    positiveIon: IComponents;
    negativeIon: IComponents;
    undissociated: IComponents;
    gas: IComponents;
    others: IComponents;
    header: Array<string>;
    footer: Array<string>;
}

export default class Analysis {
    no: string;
    applicantAddress: string;
    applicantName: string;
    gensenName: string;
    gensenLocation: string;
    gensenAmount: number;
    gensenAmountExtra: string;
    temperature: number;
    temperatureExtra: string;
    investigater: string;
    investigatedDate: string;
    investigatedPerception: string;
    investigatedConductivity: number;
    investigatedConductivityExtra: string;
    investigatedPh: number;
    investigatedBq: number;
    investigatedCi: number;
    investigatedME: number;
    tester: string;
    testedDate: string;
    testedPerception: string;
    testedDencity: number;
    testedDencityExtra: string;
    testedPh: number;
    testedER: number;
    testedERUnit: string;
    quality: string;
    contraindication: string;
    positiveIon: Components;
    negativeIon: Components;
    undissociated: Components;
    gas: Components;
    others: Components;
    header: Array<string>;
    footer: Array<string>;
    constructor(obj: any) {
        this.no = obj.no;
        this.applicantAddress = obj.applicantAddress;
        this.applicantName = obj.applicantName;
        this.gensenName = obj.gensenName;
        this.gensenLocation = obj.gensenLocation;
        this.gensenAmount = obj.gensenAmount;
        this.gensenAmountExtra = obj.gensenAmountExtra;
        this.temperature = obj.temperature;
        this.temperatureExtra = obj.temperatureExtra;
        this.investigater = obj.investigater;
        this.investigatedDate = obj.investigatedDate;
        this.investigatedPerception = obj.investigatedPerception;
        this.investigatedConductivity = obj.investigatedConductivity;
        this.investigatedConductivityExtra = obj.investigatedConductivityExtra;
        this.investigatedPh = obj.investigatedPh;
        this.investigatedBq = obj.investigatedBq;
        this.investigatedCi = obj.investigatedCi;
        this.investigatedME = obj.investigatedME;
        this.tester = obj.tester;
        this.testedDate = obj.testedDate;
        this.testedPerception = obj.testedPerception;
        this.testedDencity = obj.testedDencity;
        this.testedDencityExtra = obj.testedDencityExtra;
        this.testedPh = obj.testPh;
        this.testedER = obj.testER;
        this.testedERUnit = obj.testERUnit;
        this.quality = obj.quality;
        this.contraindication = obj.contraindication;
        this.positiveIon = jsonToComponents(obj.positiveIon);
        this.negativeIon = jsonToComponents(obj.negativeIon);
        this.undissociated = jsonToComponents(obj.undissociated);
        this.gas = jsonToComponents(obj.gas);
        this.others = jsonToComponents(obj.others);
        this.header = obj.header;
        this.footer = obj.footer;
    }
    toObject(): IAnalysis {
        const a = this;
        let obj = {} as IAnalysis;
        console.log('positiveIon:', a.positiveIon);
        console.log('negativeIon:', a.negativeIon);
        obj.positiveIon = a.positiveIon.toObject();
        obj.negativeIon = a.negativeIon.toObject();
        obj.undissociated = a.undissociated.toObject();
        obj.gas = a.gas.toObject();
        obj.no = a.no;
        obj.applicantAddress = a.applicantAddress;
        obj.applicantName = a.applicantName;
        obj.gensenName = a.gensenName;
        obj.gensenLocation = a.gensenLocation;
        obj.gensenAmount = a.gensenAmount;
        obj.gensenAmountExtra = a.gensenAmountExtra;
        obj.temperature = a.temperature;
        obj.temperatureExtra = a.temperatureExtra;
        obj.investigater = a.investigater;
        obj.investigatedDate = a.investigatedDate;
        obj.investigatedPerception = a.investigatedPerception;
        obj.investigatedConductivity = a.investigatedConductivity;
        obj.investigatedConductivityExtra = a.investigatedConductivityExtra;
        obj.investigatedPh = a.investigatedPh;
        obj.investigatedBq = a.investigatedBq;
        obj.investigatedCi = a.investigatedCi;
        obj.investigatedME = a.investigatedME;
        obj.tester = a.tester;
        obj.testedDate = a.testedDate;
        obj.testedPerception = a.testedPerception;
        obj.testedDencity = a.testedDencity;
        obj.testedDencityExtra = a.testedDencityExtra;
        obj.testedPh = a.testedPh;
        obj.testedER = a.testedER;
        obj.testedERUnit = a.testedERUnit;
        obj.quality = a.quality;
        obj.contraindication = a.contraindication;
        obj.header = a.header;
        obj.footer = a.footer;
        return obj;
    }
    positiveIonValue(key: Comp): MgMvalMmol<number> {
        return this.positiveIon.getValues(key);
    }
    negativeIonValue(key: Comp): MgMvalMmol<number> {
        return this.negativeIon.getValues(key);
    }
    undissociatedValue(key: Comp): MgMvalMmol<number> {
        return this.undissociated.getValues(key);
    }
    positiveIonList(f: (a: MgMvalMmol<number>, b: MgMvalMmol<number>) => number): Array<Comp> {
        const ion = this.positiveIon;
        const keys: Array<Comp> = ion.getKeys();
        return keys.sort((a, b) => f(ion.getValues(b), ion.getValues(b)));
    }
    negativeIonList(f: (a: MgMvalMmol<number>, b: MgMvalMmol<number>) => number): Array<Comp> {
        const ion = this.negativeIon;
        const keys: Array<Comp> = ion.getKeys();
        return keys.sort((a, b) => f(ion.getValues(b), ion.getValues(b)));
    }
    gasValue(key: Comp): MgMvalMmol<number> {
        return this.gas.getValues(key);
    }
    othersValue(key: Comp): MgMvalMmol<number> {
        return this.others.getValues(key);
    }
    getTotalMelt(): MgMvalMmol<number> {
        const totalPositiveIon = this.positiveIon.getTotal();
        const totalNegativeIon = this.negativeIon.getTotal();
        const totalUndissociated = this.undissociated.getTotal();
        return {
            mg: sum([
                totalPositiveIon.mg,
                totalNegativeIon.mg,
                totalUndissociated.mg
            ]),
            mval: sum([
                totalPositiveIon.mval,
                totalNegativeIon.mval,
                totalUndissociated.mval
            ]),
            mmol: sum([
                totalPositiveIon.mmol,
                totalNegativeIon.mmol,
                totalUndissociated.mmol
            ])
        };
    }
    getTotalComponent(): MgMvalMmol<number> {
        const totalMelt = this.getTotalMelt();
        const totalGas = this.gas.getTotal();
        return {
            mg: sum([
                totalMelt.mg,
                totalGas.mg
            ]),
            mval: sum([
                totalMelt.mval,
                totalGas.mval
            ]),
            mmol: sum([
                totalMelt.mmol,
                totalGas.mmol,
            ])
        };
    }
}

