import React, { Suspense, useState } from 'react';
import { BrowserRouter, Switch, Route, Link, useParams } from 'react-router-dom';
import './App.css';

import AnalysisList from './components/AnalysisList';
import AnalysisView from './components/AnalysisView';
import SearchInput from './components/SearchInput';
import Analysis from './models/Analysis';
import CompRepresentations from './models/CompRepresentations';
import ChemicalConst from './constants/ChemicalConst';
import { Comp } from './constants/ChemicalConst';
import ConfigContext, { IConfigContext } from './contexts/ConfigContext';
import WebAPI from './services/WebAPI';
import { enableMathJax } from './utils/MathJax';

const Const = ChemicalConst;

function row(key: Comp, name: string): CompRepresentations {
    return {
        key: key,
        formula: Const.formula(key),
        name: name
    }
}

function rowsPositiveIon(): Array<CompRepresentations> {
    return [
        row(Comp.H, '水素イオン'),
        row(Comp.Li, 'リチウムイオン'),
        row(Comp.Na, 'ナトリウムイオン'),
        row(Comp.K, 'カリウムイオン'),
        row(Comp.NH4, 'アンモニウムイオン'),
        row(Comp.Mg, 'マグネシウムイオン'),
        row(Comp.Ca, 'カルシウムイオン'),
        row(Comp.Sr, 'ストロンチウムイオン'),
        row(Comp.Br, 'バリウムイオン'),
        row(Comp.Al, 'アルミニウムイオン'),
        row(Comp.MnII, 'マンガン (II) イオン'),
        row(Comp.FeII, '鉄 (II) イオン'),
        row(Comp.FeIII, '鉄 (III) イオン'),
        row(Comp.CuII, '銅イオン'),
        row(Comp.ZnII, '亜鉛イオン')
    ]
}

function rowsNegativeIon(): Array<CompRepresentations> {
    return [
        row(Comp.F, 'フッ素イオン'),
        row(Comp.Cl, '塩素イオン'),
        row(Comp.Br, '臭化物イオン'),
        row(Comp.I, 'ヨウ化物イオン'),
        row(Comp.OH, '水酸イオン'),
        row(Comp.HS, '硫化水素イオン'),
        row(Comp.S, '硫化物イオン'),
        row(Comp.S2O3, 'チオ硫酸イオン'),
        row(Comp.HSO4, '硫酸水素イオン'),
        row(Comp.SO4, '硫酸イオン'),
        row(Comp.HNO2, '亜硝酸イオン'),
        row(Comp.NO3, '硝酸イオン'),
        row(Comp.HPO4, 'リン酸水素イオン'),
        row(Comp.PO4, 'リン酸イオン'),
        row(Comp.HCO3, '炭酸水素イオン'),
        row(Comp.CO3, '炭酸イオン'),
        row(Comp.AsO2, 'メタ亜砒酸イオン'),
        row(Comp.HSiO3, 'メタケイ酸イオン'),
        row(Comp.BO2, 'メタホウ酸イオン')
    ];
}

function rowsUndissociated(): Array<CompRepresentations> {
    return [
        row(Comp.HAsO2, 'メタ亜砒酸'),
        row(Comp.H2SiO3, 'メタケイ酸'),
        row(Comp.HBO2, 'メタホウ酸'),
        row(Comp.H2SO4, '硫酸')
    ];
}

function rowsGas(): Array<CompRepresentations> {
    return [
        row(Comp.CO2, '遊離二酸化炭素'),
        row(Comp.H2S, '遊離硫化水素')
    ];
}

function rowsMinor(): Array<CompRepresentations> {
    return [
        row(Comp.As, '総砒素'),
        row(Comp.Hg, '総水銀'),
        row(Comp.Cu, '銅イオン'),
        row(Comp.Cr, 'クロム'),
        row(Comp.Pb, '鉛イオン'),
        row(Comp.Cd, 'カドミウムイオン'),
        row(Comp.Zn, '亜鉛イオン'),
        row(Comp.NO3, '硝酸イオン')
    ];
}

function newAnalysis(): Analysis {
    return new Analysis({
        no: '',
        applicantAddress: '',
        applicantName: '',
        name: '',
        location: '',
        yield: 0,
        yieldExtra: ' L/分 (掘削・自然湧出)',
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
            'Hg': {'mg': '0.0005 未満'},
            'Cu': {'mg': '0.05 未満'},
            'Pb': {'mg': '0.05 未満'},
            'As': {'mg': '0.005 未満'},
            'Zn': {'mg': '0.01 未満'},
            'Cd': {'mg': '0.01 未満'}
        },
        header: "",
        footer: ""
    });
}

const AppContent = (props: any): any => {
    const a = props.analysis;
    return <AnalysisView analysis={a.read()} rows={props.rows} />
};

const ListApp = () => {
    return <AnalysisList />
};

const AnalysisApp = () => {
    const {id} = useParams();
    console.log('Analysis id:', id);
    const api = new WebAPI(configContext);
    const [analysis] = useState(api.fetchAnalysis(id));
    const rows = {
        positiveIon: rowsPositiveIon(),
        negativeIon: rowsNegativeIon(),
        undissociated: rowsUndissociated(),
        gas: rowsGas(),
        minor: rowsMinor()
    };
    return <Suspense fallback={<p>Loading...</p>}>
        <div className="App">
            <AppContent analysis={analysis} rows={rows} />
        </div>
    </Suspense>
};

const configContext: IConfigContext = {
    urls: {
        'analyses': process.env.REACT_APP_WEBAPI_RESOURCE_ANALYSES ?? '',
        'analysis': process.env.REACT_APP_WEBAPI_RESOURCE_ANALYSIS ?? ''
    },
    paths: {
        'top': process.env.REACT_APP_PATH_TOP ?? '',
        'analysis': process.env.REACT_APP_PATH_ANALYSIS ?? ''
    }
};

console.log('configContext:', configContext, 'env:', process.env);

export default class App extends React.Component {
    componentDidMount() {
        enableMathJax();
    }
    render() {
        return (
            <ConfigContext.Provider value={configContext}>
                <BrowserRouter>
                    <header className="app-header">
                        <h1><Link to="/">Onsena (仮)</Link></h1>
                        <nav className="app-nav" >
                            <SearchInput />
                        </nav>
                    </header>
                    <div className="app-body">
                        <Switch>
                            <Route path="/analysis/:id"
                                   component={AnalysisApp} />
                            <Route path="/" component={ListApp} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </ConfigContext.Provider>
        );
    }
}

