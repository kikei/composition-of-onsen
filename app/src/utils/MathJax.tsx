function addScript(src: string, isAsync: boolean = false) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = isAsync;
  script.src = src;
  document.body.appendChild(script);
};

export const enableMathJax = () => {
  const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `window.MathJax = {
    loader: {
      load: ['[tex]/mhchem']
    },
    tex: {
      packages: {'[+]': ['mhchem']},
      inlineMath: [['$', '$']],
    },
    chtml: {
      matchFontHeight: false
    },
    options: {
      renderActions: {
        addMenu: [0, '', '']
      }
    }
  }`;
  document.body.appendChild(script);
  addScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js');
}

export const renderMathJax = () => {
  const MathJax = (window as any).MathJax;
  if (MathJax && MathJax.typeset)
    MathJax.typeset();
}
