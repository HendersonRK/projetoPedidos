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