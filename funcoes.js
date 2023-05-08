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

