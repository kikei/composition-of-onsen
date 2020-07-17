import React, { Suspense, useState } from 'react';
import {
    BrowserRouter, Switch, Route, Link, useParams,
    RouteComponentProps, withRouter
} from 'react-router-dom';
import './App.scss';

import * as Storage from './Storage';

import AnalysisList from './components/AnalysisList';
import AnalysisView from './components/AnalysisView';
import SearchInput from './components/SearchInput';
import ScrollButton from './components/ScrollButton';
import CompRepresentations from './models/CompRepresentations';
import ChemicalConst from './constants/ChemicalConst';
import { Comp } from './constants/ChemicalConst';
import ConfigContext, { IConfigContext } from './contexts/ConfigContext';
import StorageContext, { DefaultStorageContext } from './contexts/StorageContext';
import WebAPI, { isValidOrderBy, isValidDirection } from './services/WebAPI';
import { enableMathJax } from './utils/MathJax';
import * as SampleAnalysis from './utils/SampleAnalysis';
import { resource } from './utils/Resource';

import titleLogo from './assets/title.png';

const Const = ChemicalConst;

const SidebarAreaList = [
    {
        category: '北海道・東北',
        keywords: ['北海道', '青森', '秋田', '岩手', '宮城', '山形', '福島']
    },
    {
        category: '関東・甲信越',
        keywords: ['茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
                   '山梨', '長野', '新潟']
    },
    {
        category: '北陸・東海',
        keywords: ['富山', '石川', '福井',
                   '静岡', '愛知', '岐阜', '三重',],
    },
    {
        category: '近畿',
        keywords: ['滋賀', '京都', '大阪', '奈良', '和歌山', '兵庫'],
    },
    {
        category: '中国・四国',
        keywords: ['鳥取', '島根', '岡山', '広島', '山口',
                   '香川', '愛媛', '徳島', '高知']
    },
    {
        category: '九州',
        keywords: ['福岡', '佐賀', '長崎', '大分', '熊本',
                   '宮崎', '鹿児島', '沖縄']
    }
];

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
        row('HCO3', '炭酸水素イオン'),
        row('CO3', '炭酸イオン'),
        row('HNO2', '亜硝酸イオン'),
        row('NO3', '硝酸イオン'),
        row('H2PO4', 'リン酸二水素イオン'),
        row('HPO4', 'リン酸水素イオン'),
        row('PO4', 'リン酸イオン'),
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

const Sidebar = (props: RouteComponentProps): any => {
    const params = new URLSearchParams(props.location.search);
    const query = params.get('query');

    const onSearch = (query: string) => {
        props.history.push({
            pathname: '/analyses',
            search: '?query=' + encodeURIComponent(query)
        })
    };

    return (
        <div className="sidebar">
            <h3 className="title is-6">地域ごとの温泉</h3>
                {
                    SidebarAreaList.map((a, i) => (
                        <div>
                            <span className="title is-7">{a.category}</span>
                            <div className="tags">
                                {
                                    a.keywords.map((e, j) => (
                                        <React.Fragment>
                                            { j !== 0 ? ' ' : ''}
                                            <a key={j}
                                               className="tag is-light"
                                               href={`/analyses/timeline/desc?query=${e}`}>
                                                {e}
                                            </a>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            <h3 className="title is-6">検索</h3>
            <SearchInput value={query ?? ''} onSearch={onSearch} />
        </div>
    );
}

const AppContent = (props: any): any => {
    const a = props.analysis;
    return <AnalysisView {...props}
                         analysis={a.read()} rows={props.rows} />
};

const DocumentApp = (props: RouteComponentProps): any => {
    let { key } = useParams();

    let Body = ((_key) => {
        switch (_key) {
            case 'what-is-analysis':
                return <WhatIsAnalysisView />;
            case 'about':
                return <AboutView />;
            default:
                return (
                    <div className="content">
                        ページが見つかりませんでした。
                    </div>
                );
        }
    })(key);

    const Content = (
        <div className="content">
            {Body}
        </div>
    );
    return (
        <div className="container">
            <div className="columns">
                <div className="column top-container">
                    {Content}
                </div>
                <div className="column is-2 content sidebar-container">
                    <Sidebar {...props} />
                </div>
            </div>
        </div>
    );
};

const TopApp = (props: RouteComponentProps): any => {
    const Welcome = (
        <div className="content">
            <h2 className="title is-4">当サイトについて</h2>
            <div>
        <p>
                「温泉草子」では温泉分析書のデータや写真を集めています。<br />
                どうぞ写真だけでもアップロードしていってください。
        </p>
                <ul>
                    <li>
                        <Link to="/document/what-is-analysis">
                            <i className="fas fa-file-alt fa-fw"></i>
                            {' '}温泉分析書について
                        </Link>
                    </li>
                    <li>
                        <Link to="/document/about">
                            <i className="fas fa-question-circle fa-fw"></i>
                            {' '}温泉草子について
                        </Link>
                    </li>
                    <li>
                        <Link to="/analysis/_new">
                            <i className="fas fa-plus-circle fa-fw"></i>
                            {' '}温泉分析書を登録する
                        </Link>
                    </li>
                </ul>
                <div className="box">
                    試験公開中です。以下の機能が使えます。
                    <ul>
                        <li>温泉分析書を見る・編集する</li>
                        <li>温泉分析書を一覧表示する・検索する</li>
                        <li>温泉分析書にコメントする</li>
                    </ul>
                </div>
                {/*
                    <h2 className="title is-4">初めての方へ</h2>
                    <div>
                    </div>
                  */}
            </div>
        </div>
    );
    const LatestList = (
        <div className="content">
            <AnalysisList
                key={window.location.pathname + window.location.search}
                orderBy="timeline"
                direction="desc"
                page={1}
                {...props}
            />
        </div>
    );
    return (
        <div className="container">
            <div className="columns">
                <div className="column top-container">
                    {Welcome}
                    {LatestList}
                </div>
                <div className="column is-2 content sidebar-container">
                    <Sidebar {...props} />
                </div>
            </div>
        </div>
    );
};

const ListApp = (props: RouteComponentProps) => {
    let { orderBy, direction, page } = useParams();
    const params = new URLSearchParams(props.location.search);
    const query = params.get('query');
    console.log('ListApp params:', orderBy, direction, page, query);

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
    return <AnalysisList key={window.location.pathname + window.location.search}
                         {...props}
                         orderBy={orderBy}
                         direction={direction}
                         page={pageNumber}
                         query={query}
    />
};


const AnalysisApp = (props: RouteComponentProps) => {
    const { id } = useParams();
    const getAnalysis = (id: string) => {
        const api = new WebAPI(configContext);
        const saved = Storage.getInputAnalysis();
        return id === '_new' ? (
            saved === null ?
            resource(SampleAnalysis.newAnalysis()) : resource(saved)
        ) : api.fetchGetAnalysis(id);
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
        'analysis': process.env.REACT_APP_WEBAPI_RESOURCE_ANALYSIS ?? '',
        'comments': process.env.REACT_APP_WEBAPI_RESOURCE_COMMENTS ?? '',
        'comment_image': process.env.REACT_APP_WEBAPI_RESOURCE_COMMENT_IMAGE ?? '',
        'comment_images': process.env.REACT_APP_WEBAPI_RESOURCE_COMMENT_IMAGES ?? ''
    },
    paths: {
        'top': process.env.REACT_APP_PATH_TOP ?? '',
        'analysis': process.env.REACT_APP_PATH_ANALYSIS ?? '',
        'analysesPage': process.env.REACT_APP_PATH_ANALYSES_PAGE ?? ''
    }
};

console.log('configContext:', configContext, 'env:', process.env);

const TopSearchInput = withRouter(props => {

    const onSearch = (query: string) => {
        props.history.push({
           pathname: '/',
           search: '?query=' + encodeURIComponent(query)
        })
    }

    return (
        <SearchInput onSearch={onSearch} />
    );
});

export default class App extends React.Component {
    componentDidMount() {
        enableMathJax();
    }
    render() {
        return (
            <ConfigContext.Provider value={configContext}>
                <StorageContext.Provider value={new DefaultStorageContext()}>
                    <BrowserRouter>
                        <header className="navbar is-fixed-top app-header">
                            <h1 className="navbar-brand">
                                <Link to="/" className="navbar-item">
                                    温泉草子
                                </Link>
                            </h1>
                            <nav className="navbar-menu">
                                <div className="navbar-end app-nav" >
                                    <div className="navbar-item">
                                        <TopSearchInput />
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
                </StorageContext.Provider>
            </ConfigContext.Provider>
        );
    }
}

