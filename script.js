const inputAmount = document.querySelector('#amount');
const form = document.querySelector('form')
const select = document.querySelector('select');
const button = document.querySelector('button');
const resultContainer = document.querySelector('.result-container')
const resultQuote = document.querySelector('.result-quote');
const resultValue = document.querySelector('.result-value');
const DEFAULT_FONT_SIZE = getComputedStyle(resultValue).fontSize.replace('px', '');

// ajuste do valor no input
inputAmount.addEventListener('input', (event) => {
  let valor = event.target.value.replace(/\D/g, "");
  valor = Number(valor) / 100
  valor = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  event.target.value = valor
})

// comportamento da setinha do select
let focusSelect = false;
select.onclick = () => {
  focusSelect = !focusSelect;
  if (focusSelect) {
    select.style.backgroundImage = 'url(assets/setinha-focus-down.svg)'
  } else {
    select.style.backgroundImage = 'url(assets/setinha-focus-up.svg)'
  }
}
select.onblur = () => {
  select.style.backgroundImage = 'url(assets/setinha.svg)'
  focusSelect = false;
};

// --------------------------- evento submit -------------------------------
addEventListener('submit', (event) => {
  event.preventDefault();

  if (inputAmount.value == '') {
    alert('Digite um valor');
    return
  }
  if (select.value == '') {
    alert('Selecione a moeda')
    return
  }

  // ajuste para gerar o valor do input
  const valor = Number(inputAmount.value.replace(/\./g, '').replace(',', '.'));
  // moeda selecionada no select
  const quote = select.value;

  // resultado da quantia convertida para a moeda seleciona
  const result = convertedResult(valor, quote);
  
  // insersão de dados no contain-Result
  let symbQuote;
  switch (quote) {
    case 'USD':
      symbQuote = 'US$1';
      break;
    case 'EUR':
      symbQuote = '1 €';
      break;
    case 'JPY':
      symbQuote = '¥1';
      break;
    case 'ARS':
      symbQuote = '$1';
      break;
    case 'CNY':
      symbQuote = '¥1';
      break;
  }
  resultQuote.innerText = `${symbQuote} = R$ ${result['quoteFactor'].toFixed(6)}`;
  resultValue.innerText = `R$ ${result['amountResult'].toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  // ajuste da fonte do value-result
  adjustFontSize()

  // surgimento do result-container
  resultContainer.classList.remove('display-none');
  form.classList.add('border-form');
})

// função que retona a quantia convertida
function convertedResult(amount, quote) {
  let quoteFactor = 1 / coinsQuotes[quote];
  let amountResult = amount / coinsQuotes[quote].toFixed(6);
  return {
    'quoteFactor': +quoteFactor,
    'amountResult': +amountResult
  };
}
// ------------------------------- fim envento submit ------------------------------

let coinsQuotes;
let api = 'https://api.fxratesapi.com/latest?base=BRL';
// api = 'not-api';
fetch(api)
  .then(resposta => resposta.json())
  .then(dados => {
    coinsQuotes = dados.rates;
    button.removeAttribute('disabled');
  }).catch( (error) => {
    alert ("Erro na conexão com as cotas das moedas");
    console.log(error);
  })
;

// função para o ajuste tamanho do texto result-value
function adjustFontSize() {
  resultValue.style.fontSize = DEFAULT_FONT_SIZE + 'px';

  const containerWidth = resultContainer.clientWidth;
  const textWidth = resultValue.clientWidth;

  if (textWidth > containerWidth) {
    if (textWidth / containerWidth > 2) {
      alert("Me diz aqui.. qual o motivo desse exagero???")
      console.log('Filha da puta quer quebrar o layout mesmo ne????')
    }
    const factor = (containerWidth*0.9) / (textWidth);
    const newFontSize = DEFAULT_FONT_SIZE * factor;
    resultValue.style.fontSize = newFontSize + 'px';
  }
}