-- Criação das tabelas do projeto "meu_album"

-- Tabela de usuários
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id CHAR(36) PRIMARY KEY,        -- UUID em formato string
  nome VARCHAR(100) NOT NULL,               -- nome do usuário
  email VARCHAR(120) NOT NULL UNIQUE,       -- e-mail único
  senha VARCHAR(255) NOT NULL,              -- hash da senha (bcrypt)
  invited_by CHAR(36) NULL, -- quem convidou
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de fotos
DROP TABLE IF EXISTS fotos;
CREATE TABLE fotos (
  id CHAR(36) PRIMARY KEY,                  -- UUID da foto
  url TEXT NOT NULL,                        -- URL da imagem (simples)
  descricao VARCHAR(255),                   -- descrição opcional
  usuario_id CHAR(36) NOT NULL,  
  invited_by CHAR(36) NULL,                 -- Relaciona ao usuário
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fotos_usuario
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB;


CREATE TABLE photos (
  id CHAR(36) PRIMARY KEY,         -- UUID da foto
  user_id CHAR(36) NOT NULL,       -- Relaciona ao usuário
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Índices úteis (consultas mais rápidas)
CREATE INDEX idx_fotos_usuario_id ON fotos(usuario_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);

