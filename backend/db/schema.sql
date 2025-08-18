-- Criação das tabelas do projeto "meu_album"

-- Tabela de usuários
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,        -- chave primária auto-incremento
  nome VARCHAR(100) NOT NULL,               -- nome do usuário
  email VARCHAR(120) NOT NULL UNIQUE,       -- e-mail único
  senha VARCHAR(255) NOT NULL,              -- hash da senha (bcrypt)
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de fotos
DROP TABLE IF EXISTS fotos;
CREATE TABLE fotos (
  id INT AUTO_INCREMENT PRIMARY KEY,        -- chave primária auto-incremento
  url TEXT NOT NULL,                        -- URL da imagem (simples)
  descricao VARCHAR(255),                   -- descrição opcional
  usuario_id INT NOT NULL,                  -- FK para o autor (usuário logado)
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fotos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Índices úteis (consultas mais rápidas)
CREATE INDEX idx_fotos_usuario_id ON fotos(usuario_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
