function addScript(src: string, isAsync: boolean = false) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = isAsync;
  script.src = src;
  document.body.appendChild(script);
};

const enableMhchem = () => {
  const script = document.createElement('script');
  script.type = 'text/x-mathjax-config';
  script.innerHTML = `MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [ ['$','$'] ],
    processEscapes: true
  },
  TeX: {
    extensions: ["mhchem.js"]
  },
  CommonHTML: {
    matchFontHeight: false
  }
})`;
  document.body.appendChild(script);
};

export const enableMathJax = () => {
  addScript('https://polyfill.io/v3/polyfill.min.js?features=es6');
  addScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML', true);
  enableMhchem();
}

export const renderMathJax = () => {
    const MathJax = (window as any).MathJax;
    MathJax?.Hub.Queue(['Typeset', MathJax.Hub]);
}
