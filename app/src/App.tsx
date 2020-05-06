import React, { Suspense, useState } from 'react';
import {
    BrowserRouter, Switch, Route, Link, useParams,
    RouteComponentProps
} from 'react-router-dom';
import './App.css';

import AnalysisList from './components/AnalysisList';
import AnalysisView from './components/AnalysisView';
import SearchInput from './components/SearchInput';
import CompRepresentations from './models/CompRepresentations';
import ChemicalConst from './constants/ChemicalConst';
import { Comp } from './constants/ChemicalConst';
import ConfigContext, { IConfigContext } from './contexts/ConfigContext';
import WebAPI, { isValidOrderBy, isValidDirection } from './services/WebAPI';
import { enableMathJax } from './utils/MathJax';
import { getSampleAnalysisResource } from './utils/SampleAnalysis';

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
        row(Comp.H2PO4, 'リン酸二水素イオン'),
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
        row(Comp.H3PO4, 'リン酸'),
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
        row(Comp.CuII, '銅イオン'),
        row(Comp.Cr, '総クロム'),
        row(Comp.Pb, '鉛イオン'),
        row(Comp.Cd, 'カドミウムイオン'),
        row(Comp.MnII, 'マンガンイオン'),
        row(Comp.Li, 'リチウムイオン'),
        row(Comp.Sr, 'ストロンチウムイオン'),
        row(Comp.Al, 'アルミニウムイオン'),
        row(Comp.ZnII, '亜鉛イオン'),
        row(Comp.NO3, '硝酸イオン')
    ];
}

const AppContent = (props: any): any => {
    const a = props.analysis;
    return <AnalysisView {...props}
                         analysis={a.read()} rows={props.rows} />
};

const ListApp = (props: RouteComponentProps) => {
    let { orderBy, direction, page } = useParams();
    console.log('ListApp params:', orderBy, direction, page);

    // Default values
    orderBy = orderBy ?? 'timeline';
    direction = direction ?? 'desc';
    page = page ?? '1';

    let pageNumber = Number(page);
    if (isNaN(pageNumber)) {
        console.info('Invalid page:', page);
        return <div>error (APP_LISTAPP_PAGE_IS_NAN)</div>
    }
    if (!isValidOrderBy(orderBy)) {
        console.info('Invalid orderBy:', orderBy);
        return <div>error (APP_LISTAPP_INVALID_ORDER_BY)</div>
    }
    if (!isValidDirection(direction)) {
        console.info('Invalid direction:', direction);
        return <div>error (APP_LISTAPP_INVALID_DIRECTION)</div>
    }
    return <AnalysisList key={window.location.pathname}
                         {...props}
                         orderBy={orderBy}
                         direction={direction}
                         page={pageNumber}
    />
};


const AnalysisApp = (props: RouteComponentProps) => {
    const { id } = useParams();
    const getAnalysis = (id: string) => {
        const api = new WebAPI(configContext);
        return id === '_new' ?
               getSampleAnalysisResource() :
               api.fetchGetAnalysis(id);
    }
    const [analysis, setAnalysis] = useState(getAnalysis(id));
    const [lastId, setLastId] = useState(id);
    console.log('Analysis id:', id, 'lastId:', lastId);
    // Fetch analysis data again after id in the url was changed.
    if (lastId !== id) {
        setLastId(id);
        setAnalysis(getAnalysis(id));
    }

    const rows = {
        positiveIon: rowsPositiveIon(),
        negativeIon: rowsNegativeIon(),
        undissociated: rowsUndissociated(),
        gas: rowsGas(),
        minor: rowsMinor()
    };
    return <Suspense fallback={<p>Loading...</p>}>
        <div className="App">
            <AppContent {...props}
                        key={id}
                        analysis={analysis} rows={rows} />
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
        'analysis': process.env.REACT_APP_PATH_ANALYSIS ?? '',
        'analysesPage': process.env.REACT_APP_PATH_ANALYSES_PAGE ?? ''
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
                            <ul>
                                <li>
                                    <SearchInput />
                                </li>
                                <li>
                                    <Link to={"/analysis/_new"}>
                                        +
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </header>
                    <div className="app-body">
                        <Switch>
                            <Route path="/analyses/:orderBy/:direction/:page"
                                   component={ListApp} />
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

