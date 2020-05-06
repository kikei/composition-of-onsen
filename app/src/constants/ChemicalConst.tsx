export default class ChemicalConst {
    static compOf(key: string): Comp {
        return key as Comp;
    }
    static weight(key: Comp): number {
        return weightOf(key);
    }
    static valence(key: Comp): number {
        return Valence[key];
    }
    static formula(key: Comp): string {
        return Formula[key];
    }
}

type Atom =
    /* 1 */'H'  |
    /* 2 */'Li' | 'B'  | 'C'  | 'N'  | 'O'  | 'F'  |
    /* 3 */'Na' | 'Cr' | 'Mg' | 'Al' | 'Si' | 'P'  | 'S'  | 'Cl' |
    /* 4 */'K'  | 'Ca' | 'Mn' | 'Fe' | 'Cu' | 'Zn' | 'As' | 'Br' |
    /* 5 */'Sr' | 'Ag' | 'Cd' | 'I'  |
    /* 6 */'Hg' | 'Pb'
;

export type Comp =
    /* 1 -2  */'H'  |
    /* 2 -10 */'Li' | 'B'  | 'C'  | 'N' | 'O'  | 'F'  |
    /* 11-12 */'Na' | 'Cr' | 'Mg' |
    /* 13-18 */'Al' | 'Si' | 'P'  | 'S' | 'Cl' |
    /* 19-25 */'K'  | 'Ca' | 'MnII' |
    /* 26-26 */'FeII' | 'FeIII' |
    /* 29-32 */'Cu' | 'CuII' | 'Zn' | 'ZnII' |
    /* 33-36 */'As' | 'Br' |
    /* 37-54 */'Sr' | 'Ag' | 'Cd' | 'I'  |
    /* 55-86 */'Hg' | 'Pb' |
    /* H */'H2SiO3' | 'H2S' | 'HBO2' | 'HCO3' |
    /* H */'HNO2' | 'HSiO3' |
    /* H */'H3PO4' | 'H2PO4' | 'HPO4' |
    /* H */'H2SO4' | 'HS' | 'HSO4' | 'HS2O3' |
    /* H */'HAsO2' |
    /* B */'BO2' |
    /* C */'CO2' | 'CO3' |
    /* N */'NH4' | 'NO3' |
    /* O */'OH' |
    /* Si */'SiO3' |
    /* P */'PO4' |
    /* S */'SO4' | 'S2O3' |
    /* As */'AsO2' |
    'humus'
;

const compounds: Record<Comp, Array<Atom>> = {
    H: ['H'],
    Li: ['Li'],
    B: ['B'],
    C: ['C'],
    N: ['N'],
    O: ['O'],
    F: ['F'],
    Na: ['Na'],
    Mg: ['Mg'],
    Al: ['Al'],
    Si: ['Si'],
    P: ['P'],
    S: ['S'],
    Cl: ['Cl'],
    K: ['K'],
    Ca: ['Ca'],
    Cr: ['Cr'],
    MnII: ['Mn'],
    FeII: ['Fe'],
    FeIII: ['Fe'],
    Cu: ['Cu'],
    CuII: ['Cu'],
    Zn: ['Zn'],
    ZnII: ['Zn'],
    As: ['As'],
    Br: ['Br'],
    Sr: ['Sr'],
    Ag: ['Ag'],
    Cd: ['Cd'],
    I: ['I'],
    Hg: ['Hg'],
    Pb: ['Pb'],
    H2SiO3: ['H', 'H', 'Si', 'O', 'O', 'O'],
    H2S: ['H', 'H', 'S'],
    HBO2: ['H', 'B', 'O', 'O'],
    HCO3: ['H', 'C', 'O', 'O', 'O'],
    HNO2: ['H', 'N', 'O', 'O'],
    HSiO3: ['H', 'Si', 'O', 'O', 'O'],
    H3PO4: ['H', 'H', 'H', 'P', 'O', 'O', 'O', 'O'],
    H2PO4: ['H', 'H', 'P', 'O', 'O', 'O', 'O'],
    HPO4: ['H', 'P', 'O', 'O', 'O', 'O'],
    H2SO4: ['H', 'H', 'S', 'O', 'O', 'O', 'O'],
    HS: ['H', 'S'],
    HSO4: ['H', 'S', 'O', 'O', 'O', 'O'],
    HS2O3: ['H', 'S', 'S', 'O', 'O', 'O'],
    HAsO2: ['H', 'As', 'O', 'O'],
    BO2: ['B', 'O', 'O'],
    CO2: ['C', 'O', 'O'],
    CO3: ['C', 'O', 'O', 'O'],
    NH4: ['N', 'H', 'H', 'H', 'H'],
    NO3: ['N', 'O', 'O', 'O'],
    OH: ['O', 'H'],
    SiO3: ['Si', 'O', 'O', 'O'],
    PO4: ['P', 'O', 'O', 'O', 'O'],
    SO4: ['S', 'O', 'O', 'O', 'O'],
    S2O3: ['S', 'S', 'O', 'O', 'O'],
    AsO2: ['As', 'O', 'O'],
    humus: []
};

function weightAtomOf(a: Atom): number {
    return weightAtom[a];
}

const weightAtom: Record<Atom, number> = {
    H: 1.00794,
    Li: 6.941,
    B: 10.811,
    C: 12.0107,
    N: 14.0067,
    O: 15.9994,
    F: 18.9984032,
    Na: 22.98976928,
    Mg: 24.3050,
    Al: 26.9815386,
    Si: 28.0855,
    P: 30.973762,
    S: 32.065,
    Cl: 35.453,
    K: 39.0983,
    Ca: 40.078,
    Cr: 51.9961,
    Mn: 54.938045,
    Fe: 55.845,
    Cu: 63.546,
    Zn: 65.38,
    As: 74.9216,
    Br: 79.904,
    Sr: 87.62,
    Ag: 107.868,
    Cd: 112.414,
    I: 126.90447,
    Hg: 200.592,
    Pb: 207.2
};

function sumOf(x: Array<number>): number {
    return x.reduce((a: number, i:number) => a + i, 0);
}

function weightOf(key: Comp): number {
    const ws = compounds[key].map(a => weightAtomOf(a));
    return sumOf(ws);
}

const Valence: Record<Comp, number> = {
    H: +1,
    Li: +1,
    B: +3,
    C: -4,
    N: -3,
    O: -2,
    F: -1,
    Na: +1,
    Mg: +2,
    Al: +3,
    Si: -4,
    P: -3,
    S: -2,
    Cl: -1,
    K: +1,
    Ca: +2,
    Cr: +3,
    MnII: +2,
    FeII: +2,
    FeIII: +3,
    Cu: 0,
    CuII: +2,
    Zn: 0,
    ZnII: +2,
    As: -3,
    Br: +1,
    Sr: +2,
    Cd: +2,
    I: -1,
    Hg: +2,
    Ag: +2,
    Pb: +4,
    H2SiO3: 0,
    H2S: 0,
    HBO2: 0,
    HCO3: -1,
    HNO2: -1,
    HSiO3: -1,
    H3PO4: 0,
    H2PO4: -1,
    HPO4: -2,
    H2SO4: 0,
    HS: -1,
    HSO4: -1,
    HS2O3: -1,
    HAsO2: 0,
    BO2: -1,
    CO2: 0,
    CO3: -2,
    NH4: +1,
    NO3: -1,
    OH: -1,
    SiO3: -2,
    PO4: -2,
    SO4: -2,
    S2O3: -2,
    AsO2: -1,
    humus: 0
};

const Formula: Record<Comp, string> = {
    H: '$\\ce{H+}$',
    Li: '$\\ce{Li+}$',
    B: '$\\ce{B^3+}$',
    C: '$\\ce{C^4+}$',
    N: '$\\ce{N^3-}$',
    O: '$\\ce{O^2-}$',
    F: '$\\ce{F-}$',
    Na: '$\\ce{Na+}$',
    Mg: '$\\ce{Mg^2+}$',
    Al: '$\\ce{Al^3+}$',
    Si: '$\\ce{Si^4-}$',
    P: '$\\ce{P^3-}$',
    S: '$\\ce{S^2-}$',
    Cl: '$\\ce{Cl-}$',
    K: '$\\ce{K+}$',
    Ca: '$\\ce{Ca^2+}$',
    Cr: '$\\ce{Cr^3+}$',
    MnII: '$\\ce{Mn^2+}$',
    FeII: '$\\ce{Fe^2+}$',
    FeIII: '$\\ce{Fe^3+}$',
    Cu: '$\\ce{Cu}$',
    CuII: '$\\ce{Cu^2+}$',
    Zn: '$\\ce{Zn}$',
    ZnII: '$\\ce{Zn^2+}$',
    As: '$\\ce{As}$',
    Br: '$\\ce{Br+}$',
    Sr: '$\\ce{Sr^+2}$',
    Ag: '$\\ce{Ag}$',
    Cd: '$\\ce{Cd^2+}$',
    I: '$\\ce{I-}$',
    Hg: '$\\ce{Hg}$',
    Pb: '$\\ce{Pb^+4}$',
    H2SiO3: '$\\ce{H2SiO3}$',
    H2S: '$\\ce{H2S}$',
    HBO2: '$\\ce{HBO2}$',
    HCO3: '$\\ce{HCO3^-}$',
    HNO2: '$\\ce{HNO2^-}$',
    HSiO3: '$\\ce{HSiO3^-}$',
    H3PO4: '$\\ce{H3PO4}$',
    H2PO4: '$\\ce{H2PO4^-}$',
    HPO4: '$\\ce{HPO4^2-}$',
    H2SO4: '$\\ce{H2SO4}$',
    HS: '$\\ce{HS^-}$',
    HSO4: '$\\ce{HSO4^-}$',
    HS2O3: '$\\ce{HS2O3-}$',
    HAsO2: '$\\ce{HAsO2}$',
    BO2: '$\\ce{BO2}$',
    CO2: '$\\ce{CO2}$',
    CO3: '$\\ce{CO3^2-}$',
    NH4: '$\\ce{NH4+}$',
    NO3: '$\\ce{NO3^-}$',
    OH: '$\\ce{OH^-}$',
    SiO3: '$\\ce{SiO3^2-}$',
    PO4: '$\\ce{PO4^2-}$',
    SO4: '$\\ce{SO4^2-}$',
    S2O3: '$\\ce{S2O3^2-}$',
    AsO2: '$\\ce{AsO2-}$',
    humus: ''
};
