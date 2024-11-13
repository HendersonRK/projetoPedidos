CREATE TABLE grupoproduto (
    id_grupoproduto serial,
    descricaogrupoproduto character varying(50),
    PRIMARY KEY (id_grupoproduto)
);

CREATE TABLE marca (
    id_marca serial, 
    descricaomarca character varying(50), 
    PRIMARY KEY (id_marca)
);

CREATE TABLE unidadeproduto (
    id_unidadeproduto serial,
    descricaouniproduto character varying(50),
    PRIMARY KEY (id_unidadeproduto)
);

CREATE TABLE produto (
    id_produto serial,
    nomeproduto character varying(150),
    nomeprodutoresumido character varying(80),
    codigobarra character varying(20),
    id_unidade integer,
    id_grupo integer,
    PRIMARY KEY (id_produto),
    FOREIGN KEY (id_unidade) REFERENCES unidadeproduto(id_unidadeproduto),
    FOREIGN KEY (id_grupo) REFERENCES grupoproduto(id_grupoproduto)
);

CREATE TABLE formapagamento (
    id_frmpagamento serial,
    descricaofrmpagamento character varying(50),
    PRIMARY KEY (id_frmpagamento)
);

CREATE TABLE usuario (
    id_usuario serial,
    usuario character varying(50),
    senha character varying(8),
    PRIMARY KEY (id_usuario)
);

CREATE TABLE configuracoes (
    id_configuracao serial,
    hostname character varying(255),
    emailretorno character varying(255),
    porta integer,
    emailusername character varying(255),
    emailpassword character varying(100),
    PRIMARY KEY (id_configuracao)
);

CREATE TABLE cliente (
    id_cliente serial,
    nome varchar(250) NOT NULL, 
    cpf varchar(14) NOT NULL,
    siglauf varchar(2) NOT NULL,
    cidade varchar(50) NOT NULL, 
    telefone varchar(20),
    email varchar(200),
    PRIMARY KEY (id_cliente)
);

CREATE TABLE tipofrete (
    id_tipofrete serial,
    tipofrete varchar(75),
    PRIMARY KEY (id_tipofrete)
);

CREATE TABLE prazopagamento(
    id_prazopagamento serial,
    prazopagamento varchar(50),
    PRIMARY KEY (id_prazopagamento)
);

CREATE TABLE pedido (
    id_pedido serial, 
    data_pedido date,
    situacao int, 
    observacoes TEXT,
    id_formapagamento int, 
    id_prazopagamento int, 
    id_cliente int,
    id_tipofrete int, 
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_formapagamento) REFERENCES formapagamento (id_frmpagamento),
    FOREIGN KEY (id_prazopagamento) REFERENCES prazopagamento (id_prazopagamento),
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente),
    FOREIGN KEY (id_tipofrete) REFERENCES tipofrete (id_tipofrete)
);

CREATE TABLE pedidoitem (
    id_pedidoitem serial, 
    id_pedido int, 
    id_produto int,
    quantidade int NOT NULL,
    valorunitario decimal(10,2) NOT NULL, 
    valortotal decimal(10,2) NOT NULL, 
    PRIMARY KEY (id_pedidoitem),
    FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
    FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
);

ALTER TABLE produto ADD COLUMN marca int;

ALTER TABLE produto RENAME marca TO id_marca;


INSERT INTO configuracoes (hostname, emailretorno, porta, emailusername, emailpassword)
VALUES ('smtp.mailersend.net', 'email@trial-3z0vklo2vj747qrx.mlsender.net', 587, 'MS_9TWvnC@trial-3z0vklo2vj747qrx.mlsender.net', 'v0PEwbfIWreXxG6V')
RETURNING id_configuracao;

INSERT INTO usuario (usuario, senha)
VALUES ('admin', 'admin')
RETURNING id_usuario;

