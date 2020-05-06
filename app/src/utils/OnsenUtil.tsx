import { Comp } from '../constants/ChemicalConst';
import Analysis from '../models/Analysis';


/**
 * Reference:
 * https://www.env.go.jp/nature/onsen/pdf/2-5_p_14.pdf
 */
type Category = 'Medical'    // 療養泉
              | 'Simple'     // 単純温泉
              | 'SimpleCold' // 単純冷鉱泉
              | 'Mineral'    // 温泉法上の温泉
;

type AcidityAlkalinity =
    'Acid' | 'WeakAcid' | 'Neutral' | 'WeakAlkaline' | 'Alkaline' | 'Unknown';

type Temperature =
    'Cold' | 'Low' | 'Middle' | 'High' | 'Unknown';

type OsmoticPressure =
    'Hypotonic' | 'Isotonic' | 'Hypertonic' | 'Unknown';

interface ILocalizerOption {
    simple?: boolean,
    mineral?: boolean
}

type Localizer = (comp: Comp, options: ILocalizerOption)
=> string | undefined;

function categorizePh(ph: number): AcidityAlkalinity {
    return ph < 3.0 ? 'Acid' :
           ph < 6.0 ? 'WeakAcid' :
           ph < 7.5 ? 'Neutral' :
           ph < 8.5 ? 'WeakAlkaline' :
           'Alkaline';
}

function categorizeTemperature(t: number): Temperature {
    return t < 25.0 ? 'Cold' :
           t < 34.0 ? 'Low' :
           t < 42.0 ? 'Middle' :
           'High';
}

function categorizeOsmoticPressure(mg: number): OsmoticPressure {
    return mg < 8000.0 ? 'Hypotonic' :
           mg < 10000.0 ? 'Isotonic' :
           'Hypertonic';
}

function mgOfS(hs: number, s2o3: number, h2s: number): number {
    return hs * 32.06 / 33.0679 +
           s2o3 * 32.06 * 2 / 112.1182 +
           h2s * 32.06 / 34.0758;
}

function isMedicalCO2(mg: number): boolean { return mg >= 1000.0 }
function isMedicalFe(mg: number): boolean { return mg >= 20.0 }
function isMedicalH(mg: number): boolean { return mg >= 1.0 }
function isMedicalI(mg: number): boolean { return mg >= 10.0 }
function isMedicalS(mg: number): boolean { return mg >= 2.0 }
function isMedicalNaCl(na: number, cl: number): boolean {
    return na > 5500 && cl > 8500
}
// function isMedicalRn(mg: number): boolean { return mg >= 3e-9 }

function isMineralCO2(mg: number): boolean { return mg >= 250.0 }
function isMineralHSiO3(mg: number): boolean { return mg >= 50.0 }
function isMineralH2SiO3(mg: number): boolean { return mg >= 50.0 }
function isMineralBO2(mg: number): boolean { return mg >= 5.0 }
function isMineralHBO2(mg: number): boolean { return mg >= 5.0 }
function isMineralI(mg: number): boolean { return mg >= 1.0 }
// function isMineralH(mg: number): boolean { return mg >= 1.0 }
// function isMineralLi(mg: number): boolean { return mg => 1.0 }
// function isMineralSr(mg: number): boolean { return mg => 10.0 }
// function isMineralBa(mg: number): boolean { return mg => 5.0 }
// function isMineralFe(mg: number): boolean { return mg >= 10.0 }
// function isMineralMn(mg: number): boolean { return mg >= 10.0 }
// function isMineralBr(mg: number): boolean { return mg >= 5.0 }
function isMineralF(mg: number): boolean { return mg >= 2.0 }
// function isMineralHAsO2(mg: number): boolean { return mg >= 1.3 }
// function isMineralHAsO2(mg: number): boolean { return mg >= 1.0 }
// function isMineralS(mg: number): boolean { return mg >= 1.0 }
// function isNaHCO2(mg: number): boolean { return mg => 340 }

// 硫化水素型
function isTypeHS(mmolHS: number, mmolS2O3: number, mmolH2S: number): boolean {
    return mmolH2S > mmolHS + mmolS2O3;
}

// 単純温泉
function isSimple(a: Analysis): boolean {
    return a.getTotalMelt().mg < 1000 &&
           a.temperature >= 25;
}

// 単純冷鉱泉
function isSimpleCold(a: Analysis): boolean {
    return a.getTotalMelt().mg < 1000 &&
           a.temperature < 25;
}

class OnsenQualityNameBuilder {
    special: Array<Comp>;
    mineral: Array<Comp>;
    positiveIon: Array<Comp>;
    negativeIon: Array<Comp>;
    acidAlka: AcidityAlkalinity;
    osmoticPressure: OsmoticPressure;
    temperature: Temperature;
    typeHS: boolean;
    isMineral: boolean;
    isStrongSalt: boolean;
    constructor() {
        this.special = [];
        this.mineral = [];
        this.positiveIon = [];
        this.negativeIon = [];
        this.acidAlka = 'Unknown';
        this.osmoticPressure = 'Unknown';
        this.temperature = 'Unknown';
        this.isMineral = false;
        this.isStrongSalt = false;
        this.typeHS = false;
    }
    getSpecial(): Array<Comp> {
        return this.special;
    }
    addSpecial(key: Comp): void {
        if (!this.special.includes(key))
            this.special.push(key);
    }
    addMineral(key: Comp): void {
        if (!this.mineral.includes(key))
            this.mineral.push(key);
    }
    addPositiveIon(key: Comp): void {
        if (!this.positiveIon.includes(key))
            this.positiveIon.push(key);
    }
    addNegativeIon(key: Comp): void {
        if (!this.negativeIon.includes(key))
            this.negativeIon.push(key);
    }
    setAcidAlka(acidAlka: AcidityAlkalinity): void {
        this.acidAlka = acidAlka;
    }
    setOsmoticPressure(osmo: OsmoticPressure): void {
        this.osmoticPressure = osmo;
    }
    setTemperature(temperature: Temperature): void {
        this.temperature = temperature;
    }
    setTypeHS(typeHS: boolean): void {
        this.typeHS = typeHS;
    }
    setStrongSalt(isStrongSalt: boolean): void {
        this.isStrongSalt = isStrongSalt;
    }
    buildForMineral(dict: Localizer): string {
        const p0 = applyDict(this.mineral, dict, { mineral: true });
        return '温泉法第二条の別表中に示された' +
               p0.join('及び') +
               'の項で温泉法の温泉に適合する';
    }
    build(category: Category, dict: Localizer) : string {
        console.log('OnsenUtil.build, category:', category,
                    'mineral:', this.isMineral,
                    'special:', this.special,
                    'acidAlka:', this.acidAlka);
        let p0 = [] as Array<string>;
        let p1 = [] as Array<string>;
        let p2 = [] as Array<string>;
        const p3 = [] as Array<string>;
        switch (category) {
            case 'Simple':
                if (this.acidAlka === 'Alkaline') {
                    p0 = applyDict(this.special, dict);
                    p2 = ['アルカリ性単純']
                } else {
                    const ih = this.special.findIndex(a => a === 'H');
                    if (ih > -1) {
                        // examples:
                        // - 大釜温泉: 含鉄－単純酸性温泉 
                        this.special.splice(ih, 1);
                        p0 = applyDict(this.special, dict);
                        p2.push('単純酸性');
                    } else {
                        // examples:
                        // - 霧島温泉 湯之谷山荘: 単純硫黄温泉 (硫化水素型)
                        p2 = applyDict(this.special, dict, { simple: true });
                        p2 = ['単純' + p2.join('')];
                    }
                }
                break;
            case 'SimpleCold':
                if (this.special.length === 1) {
                    // examples:
                    // - 三条の湯: 単純硫黄冷鉱泉 
                    p2 = applyDict(this.special, dict, { simple: true });
                    p2 = ['単純' + p2.join('')];
                } else {
                    p2 = ['単純']
                }
                break;
            case 'Mineral':
                // examples:
                // - 麻葉の湯:
                //   温泉法第二条の別表中に示されたふっ素イオン及び
                //   メタほう酸の項で温泉法の温泉に適合する
                return this.buildForMineral(dict);
            default:
                p0 = applyDict(this.special, dict);
                p1 = applyDict(this.positiveIon, dict);
                p2 = applyDict(this.negativeIon, dict);
                break;
        }
        // 浸透圧
        switch (this.osmoticPressure) {
            case 'Hypotonic':
                p3.push('低張性');
                break;
            case 'Isotonic':
                p3.push('等張性');
                break;
            case 'Hypertonic':
                p3.push('高張性');
                break;
            default:
                break;
        }
        // 液性
        switch (this.acidAlka) {
            case 'Acid':
                p3.push('酸性');
                break;
            case 'WeakAcid':
                p3.push('弱酸性');
                break;
            case 'Neutral':
                p3.push('中性');
                break;
            case 'WeakAlkaline':
                p3.push('弱アルカリ性');
                break;
            case 'Alkaline':
                p3.push('アルカリ性');
                break;
            default:
                break;
        }
        // 泉温
        switch (this.temperature) {
            case 'Cold':
                p3.push('冷鉱泉');
                break;
            case 'Low':
                p3.push('低温泉');
                break;
            case 'Middle':
                p3.push('温泉');
                break;
            case 'High':
                p3.push('高温泉');
                break;
            default:
                break;
        }
        console.log('Quality, p0:', p0, 'p1:', p1, 'p2:', p2, 'p3:', p3);
        return [
            [
                p0.join('・'), p1.join('・'), p2.join('・')
            ].filter(t => t !== '').join('－'),
            p2.length > 0 ?
                (this.isStrongSalt ? '強塩' : '') +
                (this.temperature === 'Cold' ? '冷鉱泉' : '温泉') :
                '',
            this.typeHS ? ' (硫化水素型)' : '',
            ' (' + p3.join('・') + ')'
        ].join('');
    }
};

export function qualityName(a: Analysis): string {
    const q = new OnsenQualityNameBuilder();

    // Acidiity Alkalinity
    const acidAlka = typeof a.pH === 'string' ? 'Unknown' : categorizePh(a.pH);
    q.setAcidAlka(acidAlka);

    // Osmotic Pressure
    const osmoticPressure = categorizeOsmoticPressure(a.getTotalComponent().mg);
    q.setOsmoticPressure(osmoticPressure);

    // Temperature
    const temperature =
        typeof a.temperature === 'string' ? 'Unknown' :
        categorizeTemperature(a.temperature);
    q.setTemperature(temperature);

    // Special
    if (isMedicalCO2(a.gasValue('CO2')?.mg))
        q.addSpecial('CO2');
    if (isMedicalFe((a.positiveIonValue('FeII')?.mg ?? 0) +
                    a.positiveIonValue('FeIII')?.mg ?? 0))
        q.addSpecial('FeII');
    if (isMedicalI(a.negativeIonValue('I')?.mg))
        q.addSpecial('I');
    if (isMedicalH(a.positiveIonValue('H')?.mg))
        q.addSpecial('H');
    // S
    const hs = a.negativeIonValue('HS');
    const s2o3 = a.negativeIonValue('S2O3');
    const h2s = a.gasValue('H2S');
    if (isMedicalS(mgOfS(hs?.mg ?? 0,
                         s2o3?.mg ?? 0,
                         h2s?.mg ?? 0))) {
        q.addSpecial('S');
        q.setTypeHS(isTypeHS(hs?.mmol ?? 0, s2o3?.mmol ?? 0, h2s?.mmol ?? 0));
    }
    // if (isMedicalRn(a))
    //     q.addSpecial('Rn');
    if (isMedicalNaCl(a.positiveIonValue('Na')?.mg,
                      a.negativeIonValue('Cl')?.mg)) {
        q.setStrongSalt(true);
    }
    // if (isMedicalHCO3(a)){}
    // if (isMedicalSO4(a)){}

    // Mineral
    if (isMineralCO2(a.gasValue('CO2')?.mg))
        q.addMineral('CO2');
    if (isMineralI(a.negativeIonValue('I')?.mg))
        q.addMineral('I');
    if (isMineralF(a.negativeIonValue('F')?.mg))
        q.addMineral('F');
    if (isMineralBO2(a.negativeIonValue('BO2')?.mg) ||
        isMineralHBO2(a.undissociatedValue('HBO2')?.mg))
        q.addMineral('HBO2');
    if (isMineralHSiO3(a.negativeIonValue('HSiO3')?.mg) ||
        isMineralH2SiO3(a.undissociatedValue('H2SiO3')?.mg))
        q.addMineral('H2SiO3');

    const category =
        isSimple(a) ? 'Simple' :
        (isSimpleCold(a) && q.special.length >= 1) ? 'SimpleCold' :
        isSimpleCold(a) ? 'Mineral' :
        'Medical';

    if (category === 'Medical') {
        let totalPositiveIonMval: number = a.positiveIon.getTotal().mval;
        a.positiveIonList((a, b) => b.mvalPercent - a.mvalPercent)
         .forEach((comp: Comp) => {
            if (a.positiveIonValue(comp).mval / totalPositiveIonMval >= 0.2)
                q.addPositiveIon(comp);
        });
        let totalNegativeIonMval: number = a.negativeIon.getTotal().mval;
        a.negativeIonList((a, b) => b.mvalPercent - a.mvalPercent)
         .forEach((comp: Comp) => {
            if (a.negativeIonValue(comp).mval / totalNegativeIonMval >= 0.2)
                q.addNegativeIon(comp);
        });
    }
    return q.build(category, qualityJPName);
};


const qualityJPName: Localizer = (comp: Comp, options: ILocalizerOption) => {
    const { simple, mineral } = options;
    if (mineral) {
        switch (comp) {
            case 'I':
                return 'ヨウ素イオン';
            case 'F':
                return 'ふっ素イオン';
            case 'H2SiO3':
                return 'メタケイ酸';
            case 'HBO2':
                return 'メタほう酸';
        }
    }
    if (simple) {
        switch (comp) {
            case 'CO2':
                return '二酸化炭素';
            case 'FeII':
                return '鉄';
            case 'S':
                return '硫黄';
        }
    }
    switch (comp) {
        // Special
        case 'H':
            return '酸性';
        case 'CO2':
            return '含二酸化炭素';
        case 'FeII':
            return '含鉄';
        case 'S':
            return '含硫黄';
        case 'I':
            return '含ヨウ素';
        // Positive ion
        case 'Na':
            return 'ナトリウム';
        case 'Al':
            return 'アルミニウム';
        case 'K':
            return 'カリウム';
        case 'NH4':
            return 'アンモニウム';
        case 'Mg':
            return 'マグネシウム';
        case 'Ca':
            return 'カルシウム';
        case 'Sr':
            return 'ストロンチウム';
        // Negative ion
        case 'Cl':
            return '塩化物';
        case 'HCO3':
            return '炭酸水素塩';
        case 'CO3':
            return '炭酸水素塩';
        case 'SO4':
            return '硫酸塩';
    }
}

function applyDict(comps: Array<Comp>, dict: Localizer,
                   options?: ILocalizerOption | undefined) {
    const opts = {
        simple: false,
        mineral: false,
        ...options
    };
    return comps.map(c => dict(c, opts))
                .filter(x => !!x)
                .map((x: string | undefined) => !!x ? x : '');
}
