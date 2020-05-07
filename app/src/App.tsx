import React, { Suspense, useState } from 'react';
import {
    BrowserRouter, Switch, Route, Link, useParams,
    RouteComponentProps
} from 'react-router-dom';
import './App.scss';

import AnalysisList from './components/AnalysisList';
import AnalysisView from './components/AnalysisView';
import SearchInput from './components/SearchInput';
import ScrollButton from './components/ScrollButton';
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
        row('H', '水素イオン'),
        row('Li', 'リチウムイオン'),
        row('Na', 'ナトリウムイオン'),
        row('K', 'カリウムイオン'),
        row('NH4', 'アンモニウムイオン'),
        row('Mg', 'マグネシウムイオン'),
        row('Ca', 'カルシウムイオン'),
        row('Sr', 'ストロンチウムイオン'),
        row('Br', 'バリウムイオン'),
        row('Al', 'アルミニウムイオン'),
        row('MnII', 'マンガン (II) イオン'),
        row('FeII', '鉄 (II) イオン'),
        row('FeIII', '鉄 (III) イオン'),
        row('Cr', 'クロムイオン'),
        row('CuII', '銅イオン'),
        row('ZnII', '亜鉛イオン'),
        row('Pb', '鉛イオン'),
    ]
}

function rowsNegativeIon(): Array<CompRepresentations> {
    return [
        row('F', 'フッ素イオン'),
        row('Cl', '塩素イオン'),
        row('Br', '臭化物イオン'),
        row('I', 'ヨウ化物イオン'),
        row('OH', '水酸イオン'),
        row('HS', '硫化水素イオン'),
        row('S', '硫化物イオン'),
        row('S2O3', 'チオ硫酸イオン'),
        row('SO4', '硫酸イオン'),
        row('HS2O3', 'チオ硫酸水素イオン'),
        row('HSO4', '硫酸水素イオン'),
        row('HNO2', '亜硝酸イオン'),
        row('NO3', '硝酸イオン'),
        row('H2PO4', 'リン酸二水素イオン'),
        row('HPO4', 'リン酸水素イオン'),
        row('PO4', 'リン酸イオン'),
        row('HCO3', '炭酸水素イオン'),
        row('CO3', '炭酸イオン'),
        row('AsO2', 'メタ亜砒酸イオン'),
        row('HSiO3', 'メタケイ酸水素イオン'),
        row('SiO3', 'メタケイ酸イオン'),
        row('BO2', 'メタホウ酸イオン')
    ];
}

function rowsUndissociated(): Array<CompRepresentations> {
    return [
        row('HAsO2', 'メタ亜砒酸'),
        row('H2SiO3', 'メタケイ酸'),
        row('HBO2', 'メタホウ酸'),
        row('H3PO4', 'リン酸'),
        row('H2SO4', '硫酸'),
        row('humus', '有機質')
    ];
}

function rowsGas(): Array<CompRepresentations> {
    return [
        row('CO2', '遊離二酸化炭素'),
        row('H2S', '遊離硫化水素')
    ];
}

function rowsMinor(): Array<CompRepresentations> {
    return [
        row('As', '総砒素'),
        row('Hg', '総水銀'),
        row('CuII', '銅イオン'),
        row('Cr', '総クロム'),
        row('Pb', '鉛イオン'),
        row('Cd', 'カドミウムイオン'),
        row('MnII', 'マンガンイオン'),
        row('Li', 'リチウムイオン'),
        row('Sr', 'ストロンチウムイオン'),
        row('Al', 'アルミニウムイオン'),
        row('ZnII', '亜鉛イオン'),
        row('NO3', '硝酸イオン')
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
        <AppContent {...props}
                    key={id}
                    analysis={analysis} rows={rows} />
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
                    <header className="navbar is-fixed-top app-header">
                        <h1 className="navbar-brand">
                            <Link to="/" className="navbar-item">
                                温泉分析書庫 (仮)
                            </Link>
                        </h1>
                        <nav className="navbar-menu">
                            <div className="navbar-end app-nav" >
                                <div className="navbar-item">
                                    <SearchInput />
                                </div>
                                <div className="navbar-item">
                                    <Link to={"/analysis/_new"}
                                        className="button">
                                        +
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </header>
                    <div className="section app-body">
                        <Switch>
                            <Route path="/analyses/:orderBy/:direction/:page"
                                   component={ListApp} />
                            <Route path="/analysis/:id"
                                   component={AnalysisApp} />
                            <Route path="/" component={ListApp} />
                        </Switch>
                    </div>
                </BrowserRouter>
                <footer>
                </footer>
                <div className="id-overlay scrollup-button">
                    <ScrollButton />
                </div>
            </ConfigContext.Provider>
        );
    }
}

