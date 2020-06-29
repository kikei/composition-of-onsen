import Analysis from './models/Analysis';

const KEY_INPUT_ANALYSIS = 'editor.input.analysis';

export function getInputAnalysis(): Analysis | null {
    const item = localStorage.getItem(KEY_INPUT_ANALYSIS);
    return item === null ? null :
        new Analysis(JSON.parse(item));
}

export function setInputAnalysis(a: Analysis | null) {
    if (a === null)
        localStorage.removeItem(KEY_INPUT_ANALYSIS);
    else
        localStorage.setItem(KEY_INPUT_ANALYSIS,
                             JSON.stringify(a.toObject()));
}

