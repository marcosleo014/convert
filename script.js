const inputAmount = document.querySelector('#amount');
const form = document.querySelector('form')
const select = document.querySelector('select');
const button = document.querySelector('button');
const resultContainer = document.querySelector('.result-container')
const resultQuote = document.querySelector('.result-quote');
const resultValue = document.querySelector('.result-value');

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
    select.style.backgroundImage = 'url(../assets/setinha-focus-down.svg)'
  } else {
    select.style.backgroundImage = 'url(../assets/setinha-focus-up.svg)'
  }
}
select.onblur = () => {
  select.style.backgroundImage = 'url(../assets/setinha.svg)'
  focusSelect = false;
};

// evento submit
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
  const valor = Number(inputAmount.value.replace('.', '').replace(',', '.'));
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
  resultQuote.innerText = `${symbQuote} = R$ ${result['quoteFactor'].toFixed(2)}`;
  resultValue.innerText = `R$ ${result['amountResult'].toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  // surgimento do result-container
  resultContainer.classList.remove('display-none');
  form.classList.add('border-form');
})

// função que retona a quantia convertida
function convertedResult(amount, quote) {
  let quoteFactor =
    quote === 'USD'
      ? coinsQuotes['BRL']
      : coinsQuotes['BRL'] / coinsQuotes[quote];
  let amountResult =quoteFactor * amount;
  return {
    'quoteFactor': +quoteFactor,
    'amountResult': +amountResult
  };
}




let coinsQuotes;
let api = 'https://api.fxratesapi.com/latest/'
// api = 'não'
fetch(api)
  .then(resposta => resposta.json())
  .then(dados => {
    coinsQuotes = dados.rates;
    button.removeAttribute('disabled');
  }).catch( (error) => {
    alert ("Erro na conexão com as cotas das moedas");
    console.log(error);
  });