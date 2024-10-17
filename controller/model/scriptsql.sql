CREATE TABLE grupoproduto (
    id_grupoproduto serial,
    descricaogrupoproduto character varying(50),
    PRIMARY KEY (id_grupoproduto)
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

INSERT INTO configuracoes (hostname, emailretorno, porta, emailusername, emailpassword)
VALUES ('smtp.mailersend.net', 'email@trial-3z0vklo2vj747qrx.mlsender.net', 587, 'MS_9TWvnC@trial-3z0vklo2vj747qrx.mlsender.net', 'v0PEwbfIWreXxG6V')
RETURNING id_configuracao;


