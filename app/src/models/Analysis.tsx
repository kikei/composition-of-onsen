import { sum } from '../utils/MathUtil';
import { qualityName } from '../utils/OnsenUtil';
import { Comp } from '../constants/ChemicalConst';
import Components, {
    MgMvalMmol, IComponents, jsonToComponents
} from './Components';

const keysMetadata = [
    'no', 'applicantAddress', 'applicantName',
    'facilityName', 'roomName',
    'location', 'yieldExtra', 'temperatureExtra', 'quality',
    'investigator', 'investigatedDate', 'perception', 'conductivity',
    'tester', 'testedDate', 'testedPerception', 'testedDencity',
    'testedPH', 'testedER',
    'water', 'heating', 'circulation', 'additive', 'chlorination',
    'header', 'footer'
] as const;

export type KeyMetadata = typeof keysMetadata[number];

export type Metadata = { [K in KeyMetadata]: string };

export interface IAnalysis {
    id: string | null;
    name: string;
    yield: number;
    temperature: number;
    pH: number;
    bq: number;
    ci: number;
    me: number;
    positiveIon: IComponents;
    negativeIon: IComponents;
    undissociated: IComponents;
    gas: IComponents;
    minor: IComponents;
    totalPositiveIon: MgMvalMmol<number>;
    totalNegativeIon: MgMvalMmol<number>;
    totalUndissociated: MgMvalMmol<number>;
    totalGas: MgMvalMmol<number>;
    totalMinor: MgMvalMmol<number>;
    totalMelt: MgMvalMmol<number>;
    total: MgMvalMmol<number>;
    metadata: Metadata;
}

export default class Analysis {
    id: string | null;
    name: string = '';
    yield: number;
    temperature: number;
    pH: number;
    bq: number;
    ci: number;
    me: number;
    positiveIon: Components;
    negativeIon: Components;
    undissociated: Components;
    gas: Components;
    minor: Components;
    metadata: Metadata = Analysis.newMetadata();
    constructor(obj: any) {
        this.id = obj.id;
        this.name = obj.name;
        this.yield = obj.yield;
        this.temperature = obj.temperature;
        this.pH = obj.pH;
        this.bq = obj.bq;
        this.ci = obj.ci;
        this.me = obj.me;
        this.positiveIon = jsonToComponents(obj.positiveIon);
        this.negativeIon = jsonToComponents(obj.negativeIon);
        this.undissociated = jsonToComponents(obj.undissociated);
        this.gas = jsonToComponents(obj.gas);
        this.minor = jsonToComponents(obj.minor);
        if (typeof obj.metadata === 'object') {
            // TODO ugly...
            // obj is IAnalysis when it was updated from UI,
            // in otherhands it is just a object on initialization.
            this.metadata = { ...this.metadata, ...obj.metadata };
        } else {
            for (let key in this.metadata)
                this.metadata[key as KeyMetadata] = obj[key];
        }
    }
    toObject(): IAnalysis {
        let obj = {} as IAnalysis;
        const a = this;
        obj.id = a.id;
        // console.log('positiveIon:', a.positiveIon);
        // console.log('negativeIon:', a.negativeIon);
        obj.positiveIon = a.positiveIon.toObject();
        obj.negativeIon = a.negativeIon.toObject();
        obj.undissociated = a.undissociated.toObject();
        obj.gas = a.gas.toObject();
        obj.minor = a.minor.toObject();
        obj.totalPositiveIon = this.positiveIon.getTotal();
        obj.totalNegativeIon = this.negativeIon.getTotal();
        obj.totalUndissociated = this.undissociated.getTotal();
        obj.totalGas = this.gas.getTotal();
        obj.totalMinor = this.minor.getTotal();
        obj.totalMelt = this.getTotalMelt();
        obj.total = this.getTotalComponent();
        obj.name = a.name;
        obj.yield = a.yield;
        obj.pH = a.pH;
        obj.bq = a.bq;
        obj.ci = a.ci;
        obj.me = a.me;
        obj.temperature = a.temperature;
        obj.metadata = a.metadata;
        return obj;
    }
    toJSONString() {
        const obj = this.toObject();
        console.log('Analysis.toJSONString this:', this, 'obj:', obj);

        // Move metadata to object's root
        const data = { ...obj, ...obj.metadata };
        delete data.metadata;

        const quality = qualityName(this);
        data.quality = quality;

        const replacer = (key: string, value: any) => {
            if (['mg', 'mval', 'mmol', 'mvalPercent'].includes(key)) {
                return typeof value === 'number' ?
                       Number(value.toFixed(4)) : value;
            } else if (['weight', 'valence'].includes(key)) {
                return undefined;
            }
            return value;
        };
        return JSON.stringify(data, replacer, 2);
    }

    /**
     * Metadata
     */
    static newMetadata(): Metadata {
        const metadata: { [k: string]: string } = {};
        for (let key of keysMetadata)
            metadata[key as KeyMetadata] = '';
        return { ...metadata } as Metadata;
    }
    getMetadata(key: KeyMetadata): string | undefined {
        return this.metadata[key];
    }
    updateMetadata(key: KeyMetadata, value: string): Analysis {
        this.metadata[key] = value;
        return this;
    }
    copyMetadata(): Metadata {
        return { ...this.metadata };
    }

    /**
     * Returns components those values are converted to number
    */
    positiveIonValue(key: Comp): MgMvalMmol<number> {
        return this.positiveIon.getValues(key);
    }
    negativeIonValue(key: Comp): MgMvalMmol<number> {
        return this.negativeIon.getValues(key);
    }
    undissociatedValue(key: Comp): MgMvalMmol<number> {
        return this.undissociated.getValues(key);
    }
    gasValue(key: Comp): MgMvalMmol<number> {
        return this.gas.getValues(key);
    }
    minorValue(key: Comp): MgMvalMmol<number> {
        return this.minor.getValues(key);
    }

    /**
     * Returns components list sorted.
     */
    static componentList(f: (a: MgMvalMmol<number>,
                             b: MgMvalMmol<number>) => number,
                         components: Components): Array<Comp>
    {
        const keys: Array<Comp> = components.getKeys();
        return keys.sort((a, b) => f(components.getValues(a),
                                     components.getValues(b)));
    }
    positiveIonList(f: (a: MgMvalMmol<number>,
                        b: MgMvalMmol<number>) => number): Array<Comp>
    {
        return Analysis.componentList(f, this.positiveIon);
    }
    negativeIonList(f: (a: MgMvalMmol<number>,
                        b: MgMvalMmol<number>) => number): Array<Comp>
    {
        return Analysis.componentList(f, this.negativeIon);
    }
    undissociatedList(f: (a: MgMvalMmol<number>,
                          b: MgMvalMmol<number>) => number): Array<Comp>
    {
        return Analysis.componentList(f, this.undissociated);
    }
    gasList(f: (a: MgMvalMmol<number>,
                b: MgMvalMmol<number>) => number): Array<Comp>
    {
        return Analysis.componentList(f, this.gas);
    }
    minorList(f: (a: MgMvalMmol<number>,
                  b: MgMvalMmol<number>) => number): Array<Comp>
    {
        return Analysis.componentList(f, this.minor);
    }

    /**
     * Returns total values
     */
    getTotalMelt(): MgMvalMmol<number> {
        const totalPositiveIon = this.positiveIon.getTotal();
        const totalNegativeIon = this.negativeIon.getTotal();
        const totalUndissociated = this.undissociated.getTotal();
        const totalMinor = this.minor.getTotal();
        return {
            mg: sum([
                totalPositiveIon.mg,
                totalNegativeIon.mg,
                totalUndissociated.mg,
                totalMinor.mg
            ]),
            mval: sum([
                totalPositiveIon.mval,
                totalNegativeIon.mval,
                totalUndissociated.mval,
                totalMinor.mg
            ]),
            mmol: sum([
                totalPositiveIon.mmol,
                totalNegativeIon.mmol,
                totalUndissociated.mmol,
                totalMinor.mmol
            ]),
            mvalPercent: 100.0
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
            ]),
            mvalPercent: 100.0
        };
    }
}

