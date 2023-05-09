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

function getSelectedValue() {
  const selectCliente = document.getElementById("selectcliente");
  const selectProduto = document.getElementById("selectproduto");

  const codcli = document.getElementById("codcli");
  const codpro = document.getElementById("codpro");

  const selectedValueCliente = selectCliente.value;
  const selectedValueProduto = selectProduto.value;

  codcli.value = selectCliente.value;
  codpro.value = selectProduto.value;
 // alert(`Você selecionou: ${selectedValue}`);
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

