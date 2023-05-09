//import express from 'express';
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { Pool } = require('pg');


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

//SELECT E PREENCHE a variavel 'pessoas'' com o resultset
app.get('/', (req, res) => {
    pool.query('SELECT * FROM cliente order by codCli', (error, results) => {
        if (error) {
            throw error;
        }

        res.render('index', { varTitle: "Sistema de Vendas - HOME", pessoas: results.rows });

    });
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
            throw error;
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
    const selectCliente = document.getElementById("selectcliente");
    const selectProduto = document.getElementById("selectproduto");

    var cols = [selectCliente, selectProduto,req.body.qtd,req.body.total];
    
  
    pool.query('insert into venda (cliente_codcli,produto_codpro,qtd,total) values($1,$2,$3,$4)', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/produtos');



    });
});