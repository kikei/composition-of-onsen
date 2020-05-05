import Resource, { suspender } from './Resource';
import Analysis from '../models/Analysis';

export function getSampleAnalysisResource(): Resource<Analysis> {
    const promise = new Promise<Analysis>((resolve, reject) =>
        setTimeout(() => resolve(newAnalysis()), 100));
    return suspender<Analysis, string>(promise);
};

function newAnalysis(): Analysis {
    return new Analysis({
        no: '',
        applicantAddress: '',
        applicantName: '',
        name: '',
        location: '',
        yield: 0,
        yieldExtra: ' L/分 (掘削・自然湧出)',
        pH: 7.0,
        temperature: 25.0,
        temperatureExtra: '℃ (調査時における気温31℃)',
        investigator: '',
        investigatedDate: '',
        investigatedPerception: '',
        investigatedConductivity: 0,
        investigatedConductivityExtra: ' mS/m (25℃)',
        investigatedPh: 7.0,
        investigatedBq: '--',
        investigatedCi: '--',
        investigatedME: '--',
        tester: '',
        testedDate: '',
        testedPerception: '--',
        testedDencity: '--',
        testedDencityUnit: ' g/cm2 (20℃/4℃)',
        testedPh: '--',
        testedER: '--',
        testedERUnit: ' g/kg (110℃)',
        quality: '',
        contraindication: '',
        positiveIon: {
            'Na': {'mg': 87.8},
            'K': {'mg': 18.8},
            'Mg': {'mg': 16.7},
            'Ca': {'mg': 281.1},
            'Sr': {'mg': 0.9},
            'MnII': {'mg': 1.6}
        },
        negativeIon: {
            'F': {'mg': 0.6},
            'Cl': {'mg': 83.4},
            'HS': {'mg': 17.1},
            'SO4': {mg: 656.4},
            'HCO3': {mg: 186.1}
        },
        undissociated: {
            'H2SiO3': {'mg': 63.8},
            'HBO2': {'mg': 0.8},
            // 'humus': {'mg': 14.0}
        },
        gas: {
            'CO2': {'mg': 1.3},
            'H2S': {'mg': '<0.1'}
        },
        minor: {
            'Hg': {'mg': '0.0005未満'},
            'Cu': {'mg': '0.05未満'},
            'Pb': {'mg': '0.05未満'},
            'As': {'mg': '0.005未満'},
            'Zn': {'mg': '0.01未満'},
            'Cd': {'mg': '0.01未満'}
        },
        header: "",
        footer: ""
    });
}
