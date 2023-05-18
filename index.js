//import express from 'express';
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { Pool } = require('pg');
const notifier = require('node-notifier');//exibir popup na tela

var estoque=0;

//aceitando EJS
app.set('view engine', 'ejs');
app.set('views', './views');


//NECESSARIO PARA PASSAR DADOS DO FORMULARIO PARA OUTRA PAGINA
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//NECESSARIO PARA USAR O ARQUIVOS DE OUTRA PASTA
//REMOVE ERRO DE MIME TYPE CSS
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, '/')));



// Configura��o do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vendas',
    password: 'root',
    port: 5432, // porta padr�o do Postgres
});

// Conex�o com o banco de dados
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados', err.stack);
    }
    console.log('Conex�o estabelecida com sucesso ao banco de dados');
});

//SOBE O SERVIDOR
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


app.get('/', (req, res) => {
        res.render('home', { varTitle: "Sistema de Vendas - HOME"});

    
});

app.get('/teste', (req, res) => {
    res.render('teste');


});

app.get('/relvendas', (req, res) => {
    res.render('relVendas');


});

//SELECT E PREENCHE a variavel 'produtos'' com o resultset
app.get('/produtos', (req, res) => {
    pool.query('SELECT * FROM produto order by codPro', (error, results) => {
        if (error) {
            throw error;
        }

        res.render('produtos', { varTitle: "Sistema de Vendas - Produtos", produtos: results.rows });

    });
});

//SELECT E PREENCHE a variavel 'produtos'' com o resultset Filtrado
app.post('/produtosFiltro', (req, res) => {
    var filtro=req.body.filtro;
    console.log(filtro);
    pool.query("SELECT * FROM produto where nome like '%"+filtro+"%'",(error, results) => {
        if (error) {
            throw error;
        }

        res.render('produtos', { varTitle: "Sistema de Vendas - Produtos", produtos: results.rows });

    });
});

//SELECT E PREENCHE a variavel 'pessoas'' com o resultset
app.get('/clientes', (req, res) => {
    pool.query('SELECT * FROM cliente order by codCli desc', (error, results) => {
        if (error) {
            throw error;
        } 

        res.render('clientes', { varTitle: "Sistema de Vendas - Clientes", pessoas: results.rows });

    });
});


//DELETAR
app.get('/deletar/:codigo', (req, res) => {
    var codigo = req.params.codigo;
    pool.query('delete from cliente where codCli=$1', [codigo],(error, results) => {
        if (error) {
            throw error;
        }

            res.redirect('/clientes');

     

    });
});

//INSERIR
app.post('/inserir', (req, res) => {
    var cols = [req.body.nome, req.body.endereco, req.body.cpf, req.body.cel];
  
    pool.query('insert into cliente (nome,endereco,cpf,cel) values($1,$2,$3,$4)', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/clientes');



    });
});

//DELETAR PRODUTO
app.get('/deletarProduto/:codigo', (req, res) => {
    var codigo = req.params.codigo;
    pool.query('delete from produto where codPro=$1', [codigo],(error, results) => {
        if (error) {
            //throw error;
            res.render('erro', { mensagem: `Este produto não pode ser excluido!
            Ele está relacionado a outras vendas!` });
           
        }

            res.redirect('/produtos');

     

    });
});

//INSERIR PRODUTO
app.post('/inserirProduto', (req, res) => {
    //parseFloat converte para numero
    //var soma=10+parseFloat(req.body.valor);
    var cols = [req.body.nome, req.body.precovenda,req.body.precocusto,req.body.estoque];
    
    pool.query('insert into produto (nome,precovenda,precocusto,estoque) values($1,$2,$3,$4)', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/produtos');



    });
});

//UPDATE
app.post('/alterar/:codigo', (req, res) => {
    var cols = [req.body.nome, req.body.endereco, req.body.cpf, req.body.cel,req.body.codcli]
    pool.query('update cliente set nome=$1,endereco=$2,cpf=$3, cel=$4 where codcli=$5', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/clientes');



    });
});

app.post('/mostrar', (req, res) => {
   console.log(req.body.valor);
});


//UPDATE PRODUTO
app.post('/alterarProduto/:codigo', (req, res) => {
    var cols = [req.body.nome, req.body.valor, req.body.codigo]
    pool.query('update produto set nome=$1, valor=$2 where codPro=$3', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/produtos');



    });
});


//CHAMA O FORM EDITAR
app.get('/editar/:codigo', (req, res) => {
    var cod = req.params.codigo;
    pool.query('SELECT * FROM cliente where codCli=$1 ',[cod], (error, results) => {
        if (error) {
            throw error;
        }

        res.render('edit', { varTitle: "Sistema de Vendas - Editar", pessoas: results.rows });

    });
});

//CHAMA O FORM EDITAR PRODUTO
app.get('/editarProduto/:codigo', (req, res) => {
    var cod = req.params.codigo;
    pool.query('SELECT * FROM produto where codPro=$1 ',[cod], (error, results) => {
        if (error) {
            throw error;
        }

        res.render('editProduto', { varTitle: "Sistema de Vendas - Editar Produto", produto: results.rows });

    });
});


//SELECT E PREENCHE a variavel 'pessoas'' com o resultset
app.get('/add', (req, res) => {

        res.render('add', { varTitle: "Sistema de Vendas - Cadastro" });

});

//SELECT E PREENCHE a variavel 'pessoas'' com o resultset
app.get('/addProdutos', (req, res) => {

    res.render('addProdutos', { varTitle: "Sistema de Vendas - Cadastro Produtos" });

});

//SELECT E PREENCHE a variavel 'clientes' e 'produtos' com o resultset para prenncher os selects

app.get('/venda', async (req, res) => {
  try {
    const clientes = await pool.query('SELECT * FROM cliente');
    const produtos = await pool.query('SELECT * FROM produto');
    res.render('venda', { varTitle: "Sistema de Vendas - Venda",clientes: clientes.rows, produtos: produtos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

//INSERIR VENDA
app.post('/inserirvenda', (req, res) => {
    //parseFloat converte para numero
    //var soma=10+parseFloat(req.body.valor);
    
    //teste pegando value do select
    const selectCliente = req.body.selectcliente;
    const selectProduto = req.body.selectproduto;
    console.log('codido do cleinte selecionado:'+parseInt(selectCliente,10));
    console.log('codido do produto selecionado:'+parseInt(selectProduto,10));
    //-----------------------------------------//

    var cols = [req.body.codcli, req.body.codpro ,req.body.qtd,req.body.total];
    
    
    //VERIFICA ESTOQUE ANTES
    pool.query('SELECT estoque FROM produto where codpro='+req.body.codpro, (error, results) => {
        if (error) {
            throw error;
        }
        //pega o valor do resultado do select
        estoque = results.rows[0].estoque;


       if(Number(estoque) < Number(cols[2]))
       {
           
               // Renderizar a página HTML com o novo valor do campo 'estoque'
               res.send(`
               <!DOCTYPE html>
               <html>
               <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    <title>Erro: Quantidade maior do que estoque disponivel</title>
                  
               </head>
               <body>
               <h1 style="position: relative; margin: 0; text-align: center;">
               Quantidade selecionada é maior do que disponivel em estoque!
               </h1>
               <br><br>
                   Quantidade selecionada: ${cols[2]} <br>
                   Estoque disponivel: ${estoque}
             
               </body>
               </html>
               `);
               
       }else
       {
           pool.query('insert into venda (cliente_codcli,produto_codpro,qtd,total) values($1,$2,$3,$4)', cols, (error, results) => {
               if (error) {
                   throw error;
               }
   
               res.redirect('/historico_vendas');
   
           });
       }
       
    });
    
  

 
      
    
});


//HISTORICO VENDAS

app.get('/historico_vendas', (req, res) => {
    pool.query('SELECT *, cliente.nome as nome_cliente,'+
    'produto.nome as nome_produto FROM venda inner join cliente on '+
    'venda.cliente_codcli = cliente.codcli '+
    'inner join produto on produto.codpro = venda.produto_codpro '+
    'order by data_venda', (error, results) => {
        if (error) {
            throw error;
        } 

        res.render('historico_vendas',{resultado : results.rows});

    });
});