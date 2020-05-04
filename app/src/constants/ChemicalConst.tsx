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

enum Atom {
    /* 1 */H,
    /* 2 */Li, B, C, N, O, F,
    /* 3 */Na, Cr, Mg, Al, Si, P, S, Cl,
    /* 4 */K, Ca, Mn, Fe, Cu, Zn, As, Br,
    /* 5 */Sr, Ag, Cd, I,
    /* 6 */Hg, Pb,
}

export enum Comp {
    /* 1 -2  */H = 'H',
    /* 2 -10 */Li = 'Li', B = 'B', C = 'C', N = 'N', O = 'O', F = 'F',
    /* 11-12 */Na = 'Na', Cr = 'Cr', Mg = 'Mg',
    /* 13-18 */Al = 'Al', Si = 'Si', P = 'P', S = 'S', Cl = 'Cl',
    /* 19-25 */K = 'K', Ca = 'Ca', MnII = 'MnII',
    /* 26-26 */FeII = 'FeII', FeIII = 'FeIII',
    /* 29-32 */Cu = 'Cu', CuII = 'CuII', Zn = 'Zn', ZnII = 'ZnII',
    /* 33-36 */As = 'As', Br = 'Br',
    /* 37-54 */Sr = 'Sr', Ag = 'Ag', Cd = 'Cd', I = 'I',
    /* 55-86 */Hg = 'Hg', Pb = 'Pb',
    /* H */H2SiO3 = 'H2SiO3', H2S = 'H2S', HBO2 = 'HBO2', HCO3 = 'HCO3',
    /* H */HNO2 = 'HNO2', HSiO3 = 'HSiO3', H2PO4 = 'H2PO4', HPO4 = 'HPO4',
    /* H */H2SO4 = 'H2SO4', HS = 'HS', HSO4 = 'HSO4',
    /* H */HAsO2 = 'HAsO2',
    /* B */BO2 = 'BO2',
    /* C */CO2 = 'CO2', CO3 = 'CO3',
    /* N */NH4 = 'NH4', NO3 = 'NO3',
    /* O */OH = 'OH',
    /* P */PO4 = 'PO4',
    /* S */SO4 = 'SO4', S2O3 = 'S2O3',
    /* As */AsO2 = 'AsO2'
}

const compounds: Record<Comp, Array<Atom>> = {
    [Comp.H]: [Atom.H],
    [Comp.Li]: [Atom.Li],
    [Comp.B]: [Atom.B],
    [Comp.C]: [Atom.C],
    [Comp.N]: [Atom.N],
    [Comp.O]: [Atom.O],
    [Comp.F]: [Atom.F],
    [Comp.Na]: [Atom.Na],
    [Comp.Mg]: [Atom.Mg],
    [Comp.Al]: [Atom.Al],
    [Comp.Si]: [Atom.Si],
    [Comp.P]: [Atom.P],
    [Comp.S]: [Atom.S],
    [Comp.Cl]: [Atom.Cl],
    [Comp.K]: [Atom.K],
    [Comp.Ca]: [Atom.Ca],
    [Comp.Cr]: [Atom.Cr],
    [Comp.MnII]: [Atom.Mn],
    [Comp.FeII]: [Atom.Fe],
    [Comp.FeIII]: [Atom.Fe],
    [Comp.Cu]: [Atom.Cu],
    [Comp.CuII]: [Atom.Cu],
    [Comp.Zn]: [Atom.Zn],
    [Comp.ZnII]: [Atom.Zn],
    [Comp.As]: [Atom.As],
    [Comp.Br]: [Atom.Br],
    [Comp.Sr]: [Atom.Sr],
    [Comp.Ag]: [Atom.Ag],
    [Comp.Cd]: [Atom.Cd],
    [Comp.I]: [Atom.I],
    [Comp.Hg]: [Atom.Hg],
    [Comp.Pb]: [Atom.Pb],
    [Comp.H2SiO3]: [Atom.H, Atom.H, Atom.Si, Atom.O, Atom.O, Atom.O],
    [Comp.H2S]: [Atom.H, Atom.H, Atom.S],
    [Comp.HBO2]: [Atom.H, Atom.B, Atom.O, Atom.O],
    [Comp.HCO3]: [Atom.H, Atom.C, Atom.O, Atom.O, Atom.O],
    [Comp.HNO2]: [Atom.H, Atom.N, Atom.O, Atom.O],
    [Comp.HSiO3]: [Atom.H, Atom.Si, Atom.O, Atom.O, Atom.O],
    [Comp.H2PO4]: [Atom.H, Atom.H, Atom.P, Atom.O, Atom.O, Atom.O, Atom.O],
    [Comp.HPO4]: [Atom.H, Atom.P, Atom.O, Atom.O, Atom.O, Atom.O],
    [Comp.H2SO4]: [Atom.H, Atom.H, Atom.S, Atom.O, Atom.O, Atom.O, Atom.O],
    [Comp.HS]: [Atom.H, Atom.S],
    [Comp.HSO4]: [Atom.H, Atom.S, Atom.O, Atom.O, Atom.O, Atom.O],
    [Comp.HAsO2]: [Atom.H, Atom.As, Atom.O, Atom.O],
    [Comp.BO2]: [Atom.B, Atom.O, Atom.O],
    [Comp.CO2]: [Atom.C, Atom.O, Atom.O],
    [Comp.CO3]: [Atom.C, Atom.O, Atom.O, Atom.O],
    [Comp.NH4]: [Atom.N, Atom.H, Atom.H, Atom.H, Atom.H],
    [Comp.NO3]: [Atom.N, Atom.O, Atom.O, Atom.O],
    [Comp.OH]: [Atom.O, Atom.H],
    [Comp.PO4]: [Atom.P, Atom.O, Atom.O, Atom.O, Atom.O],
    [Comp.SO4]: [Atom.S, Atom.O, Atom.O, Atom.O, Atom.O],
    [Comp.S2O3]: [Atom.S, Atom.S, Atom.O, Atom.O, Atom.O],
    [Comp.AsO2]: [Atom.As, Atom.O, Atom.O]
};

function weightAtomOf(a: Atom): number {
    return weightAtom[a];
}

const weightAtom: Record<Atom, number> = {
    [Atom.H]: 1.00794,
    [Atom.Li]: 6.941,
    [Atom.B]: 10.811,
    [Atom.C]: 12.0107,
    [Atom.N]: 14.0067,
    [Atom.O]: 15.9994,
    [Atom.F]: 18.9984032,
    [Atom.Na]: 22.98976928,
    [Atom.Mg]: 24.3050,
    [Atom.Al]: 26.9815386,
    [Atom.Si]: 28.0855,
    [Atom.P]: 30.973762,
    [Atom.S]: 32.065,
    [Atom.Cl]: 35.453,
    [Atom.K]: 39.0983,
    [Atom.Ca]: 40.078,
    [Atom.Cr]: 51.9961,
    [Atom.Mn]: 54.938045,
    [Atom.Fe]: 55.845,
    [Atom.Cu]: 63.546,
    [Atom.Zn]: 65.38,
    [Atom.As]: 74.9216,
    [Atom.Br]: 79.904,
    [Atom.Sr]: 87.62,
    [Atom.Ag]: 107.868,
    [Atom.Cd]: 112.414,
    [Atom.I]: 126.90447,
    [Atom.Hg]: 200.592,
    [Atom.Pb]: 207.2
};

function sumOf(x: Array<number>): number {
    return x.reduce((a: number, i:number) => a + i, 0);
}

function weightOf(key: Comp): number {
    const ws = compounds[key].map(a => weightAtomOf(a));
    return sumOf(ws);
}

const Valence: Record<Comp, number> = {
    [Comp.H]: +1,
    [Comp.Li]: +1,
    [Comp.B]: +3,
    [Comp.C]: -4,
    [Comp.N]: -3,
    [Comp.O]: -2,
    [Comp.F]: -1,
    [Comp.Na]: +1,
    [Comp.Mg]: +2,
    [Comp.Al]: +3,
    [Comp.Si]: -4,
    [Comp.P]: -3,
    [Comp.S]: -2,
    [Comp.Cl]: -1,
    [Comp.K]: +1,
    [Comp.Ca]: +2,
    [Comp.Cr]: 0,
    [Comp.MnII]: +2,
    [Comp.FeII]: +2,
    [Comp.FeIII]: +3,
    [Comp.Cu]: 0,
    [Comp.CuII]: +2,
    [Comp.Zn]: 0,
    [Comp.ZnII]: +2,
    [Comp.As]: -3,
    [Comp.Br]: -1,
    [Comp.Sr]: +2,
    [Comp.Cd]: +2,
    [Comp.I]: -1,
    [Comp.Hg]: +2,
    [Comp.Ag]: +2,
    [Comp.Pb]: +4,
    [Comp.H2SiO3]: 0,
    [Comp.H2S]: 0,
    [Comp.HBO2]: 0,
    [Comp.HCO3]: -1,
    [Comp.HNO2]: -1,
    [Comp.HSiO3]: -1,
    [Comp.H2PO4]: -1,
    [Comp.HPO4]: -2,
    [Comp.H2SO4]: 0,
    [Comp.HS]: -1,
    [Comp.HSO4]: -1,
    [Comp.HAsO2]: 0,
    [Comp.BO2]: -1,
    [Comp.CO2]: 0,
    [Comp.CO3]: -2,
    [Comp.NH4]: +1,
    [Comp.NO3]: -1,
    [Comp.OH]: -1,
    [Comp.PO4]: -2,
    [Comp.SO4]: -2,
    [Comp.S2O3]: -2,
    [Comp.AsO2]: -1
}

const Formula: Record<Comp, string> = {
    [Comp.H]: '$\\ce{H+}$',
    [Comp.Li]: '$\\ce{Li+}$',
    [Comp.B]: '$\\ce{B^3+}$',
    [Comp.C]: '$\\ce{C^4+}$',
    [Comp.N]: '$\\ce{N^3-}$',
    [Comp.O]: '$\\ce{O^2-}$',
    [Comp.F]: '$\\ce{F-}$',
    [Comp.Na]: '$\\ce{Na+}$',
    [Comp.Mg]: '$\\ce{Mg^2+}$',
    [Comp.Al]: '$\\ce{Al^3+}$',
    [Comp.Si]: '$\\ce{Si^4-}$',
    [Comp.P]: '$\\ce{P^3-}$',
    [Comp.S]: '$\\ce{S^2-}$',
    [Comp.Cl]: '$\\ce{Cl-}$',
    [Comp.K]: '$\\ce{K+}$',
    [Comp.Ca]: '$\\ce{Ca^2+}$',
    [Comp.Cr]: '$\\ce{Cr}$',
    [Comp.MnII]: '$\\ce{Mn^2+}$',
    [Comp.FeII]: '$\\ce{Fe^2+}$',
    [Comp.FeIII]: '$\\ce{Fe^3+}$',
    [Comp.Cu]: '$\\ce{Cu}$',
    [Comp.CuII]: '$\\ce{Cu^2+}$',
    [Comp.Zn]: '$\\ce{Zn}$',
    [Comp.ZnII]: '$\\ce{Zn^2+}$',
    [Comp.As]: '$\\ce{As}$',
    [Comp.Br]: '$\\ce{Br-}$',
    [Comp.Sr]: '$\\ce{Sr^+2}$',
    [Comp.Ag]: '$\\ce{Ag}$',
    [Comp.Cd]: '$\\ce{Cd^+2}$',
    [Comp.I]: '$\\ce{I-}$',
    [Comp.Hg]: '$\\ce{Hg}$',
    [Comp.Pb]: '$\\ce{Pb^+4}$',
    [Comp.H2SiO3]: '$\\ce{H2SiO3}$',
    [Comp.H2S]: '$\\ce{H2S}$',
    [Comp.HBO2]: '$\\ce{HBO2}$',
    [Comp.HCO3]: '$\\ce{HCO3^-}$',
    [Comp.HNO2]: '$\\ce{HNO2^-}$',
    [Comp.HSiO3]: '$\\ce{HSiO3^-}$',
    [Comp.H2PO4]: '$\\ce{H2PO4^-}$',
    [Comp.HPO4]: '$\\ce{HPO4^2-}$',
    [Comp.H2SO4]: '$\\ce{H2SO4}$',
    [Comp.HS]: '$\\ce{HS^-}$',
    [Comp.HSO4]: '$\\ce{HSO4^-}$',
    [Comp.HAsO2]: '$\\ce{HAsO2}$',
    [Comp.BO2]: '$\\ce{BO2}$',
    [Comp.CO2]: '$\\ce{CO2}$',
    [Comp.CO3]: '$\\ce{CO3^2-}$',
    [Comp.NH4]: '$\\ce{NH4+}$',
    [Comp.NO3]: '$\\ce{NO3^-}$',
    [Comp.OH]: '$\\ce{OH^-}$',
    [Comp.PO4]: '$\\ce{PO4^2-}$',
    [Comp.SO4]: '$\\ce{SO4^2-}$',
    [Comp.S2O3]: '$\\ce{S2O3^2-}$',
    [Comp.AsO2]: '$\\ce{AsO2-}$'
};
