function cancelar() {

    window.location.href = "/clientes";
}

function cancelarProdutos() {

    window.location.href = "/produtos";
}

function busca()
{
    window.location.href = "/produtos";
}

//essa função armazena os codigos do produto e do cliente 
// e preenche o value do input 
//o preço venda tambem é passado ao selecionar o produto
function getSelectedValue() {
  const selectCliente = document.getElementById("selectcliente");
  const selectProduto = document.getElementById("selectproduto");

  var precovenda = document.getElementById("precovenda");

  const codcli = document.getElementById("codcli");
  const codpro = document.getElementById("codpro");

  const selectedValueCliente = selectCliente.value;
  const selectedValueProduto = selectProduto.value;

  codcli.value = selectCliente.value;
  
 
//PEGA OS VALORES SEPARADOS POR VIGULA
  var selectElement = document.getElementById('selectproduto');
  var selectedOption = selectElement.options[selectElement.selectedIndex];

  //essa variavel armazena os dois campos passados ao selecionar o select, separados por virgula
  var values = selectedOption.value.split(',');

  codpro.value = values[0];

  /*console.log(values[0]); // valor1
  console.log(values[1]); // valor2  
  console.log(selectProduto.value); */

  //values[1] é o segundo valor passado  depois da virgula,ao selecionar o select
  precovenda.value=values[1];
}


//FORMATA CELULAR
function formatarTelefone(telefone) {
    // Remove tudo que não for dígito do número de telefone
    let numeros = telefone.replace(/\D/g, '');
    
    // Adiciona os parênteses e o traço no número formatado
    numeros = numeros.replace(/^(\d{2})(\d)/g, '($1)$2');
    numeros = numeros.replace(/(\d{5})(\d)/, '$1-$2');
    
    // Retorna o número formatado
    return numeros;
  }

  //atualiza o campo total automatico, multiplicando qtd por precovenda
  function totalVenda()
  {
    var qtd = document.getElementById('qtd');
    var precovenda = document.getElementById('precovenda');
    var total = document.getElementById('total');
    total.value = (parseFloat(qtd.value)*parseFloat(precovenda.value));
    console.log(qtd.value);


  }


  //CAPTURA OS VALUES DA PAGINA E COLOCA EM UMA URL PASSANDO PARA A ROTA /addCarrinho
  function redirecionarParaCarrinho() {
    var codpro = document.getElementById('codpro').value; // Obter o valor do campo de entrada 'codpro'
    var codcli = document.getElementById('codcli').value; // Obter o valor do campo de entrada 'codcli'
    var qtd = document.getElementById('qtd').value; // Obter o valor do campo de entrada 'qtd'
    var subtotal = document.getElementById('total').value; // Obter o valor do campo de entrada 'qtd'
  

    // Construir a URL com base nos valores dos campos de entrada
    var url = '/addCarrinho?codpro=' + encodeURIComponent(codpro) + '&codcli=' + encodeURIComponent(codcli) + '&qtd=' + encodeURIComponent(qtd) + '&subtotal=' + encodeURIComponent(subtotal);
  
    // Redirecionar para a URL
    window.location.href = url;
    
  }


