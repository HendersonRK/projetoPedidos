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

