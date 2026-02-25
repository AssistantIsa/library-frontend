-- Índices para mejorar performance con 100K libros

-- Índice en columna language (para filtros)
CREATE INDEX IF NOT EXISTS idx_books_language ON books(language);

-- Índice en columnas de búsqueda
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);

-- Índice en available_copies (para filtrar disponibles)
CREATE INDEX IF NOT EXISTS idx_books_available ON books(available_copies);

-- Índice compuesto para paginación eficiente
CREATE INDEX IF NOT EXISTS idx_books_id_created ON books(id, created_at);

-- Ver índices creados
\di

-- Analizar tablas para optimizar queries
ANALYZE books;
ANALYZE users;
ANALYZE loans;
