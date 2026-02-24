# 📚 Database Population Scripts

Scripts para poblar la base de datos con libros reales desde Open Library API.

## 🚀 Scripts Disponibles

### 1. `populate_books.py` (Versión Básica)
Script inicial para cargar libros.

**Características:**
- 5 idiomas
- 16 temas
- ~50K libros
- Reintentos básicos

**Uso:**
```bash
DATABASE_URL="postgresql://..." python populate_books.py
```

### 2. `populate_books_v2.py` (Versión Mejorada) ⭐ RECOMENDADA
Script optimizado con mejor manejo de errores.

**Características:**
- ✅ 10 idiomas (en, es, fr, de, it, pt, tr, ar, ja, ru)
- ✅ 30 temas diversos
- ✅ ~100K libros objetivo
- ✅ 10 reintentos con backoff exponencial
- ✅ Paginación mejorada
- ✅ Validación de ISBN-13
- ✅ URLs de portadas
- ✅ Progreso en tiempo real

**Uso:**
```bash
cd backend
source venv/bin/activate
pip install psycopg2-binary requests

# Ejecutar
DATABASE_URL="postgresql://user:pass@host/db" python scripts/populate_books_v2.py
```

**Con Docker:**
```bash
docker-compose exec backend python scripts/populate_books_v2.py
```

## ⚙️ Configuración

Edita las variables al inicio del script:
```python
TARGET_BOOKS = 100000    # Número objetivo
BATCH_SIZE = 500         # Tamaño de lote
LANGUAGES = ['eng', 'spa', ...]  # Idiomas
TOPICS = ['fiction', ...]        # Temas
```

## 📊 Monitorear Progreso
```bash
# Ver conteo actual
psql $DATABASE_URL -c "SELECT COUNT(*) FROM books;"

# Por idioma
psql $DATABASE_URL -c "SELECT language, COUNT(*) FROM books GROUP BY language;"

# Con watch (actualización automática)
watch -n 30 'psql $DATABASE_URL -c "SELECT COUNT(*) FROM books;"'
```

## 🔧 Solución de Problemas

### Error: "externally-managed-environment"
Usar virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install psycopg2-binary requests
```

### Error 500 de Open Library
El script ya maneja esto con reintentos automáticos. Solo espera.

### Muy lento
Normal. Open Library tiene rate limiting. Espera 2-4 horas para 100K libros.

### Pocos resultados
- Aumenta `TARGET_BOOKS`
- Añade más `LANGUAGES`
- Añade más `TOPICS`

## 📈 Resultados Esperados
```
Idioma    | Libros Aprox.
----------|---------------
English   | 40,000-50,000
Español   | 10,000-15,000
Français  | 8,000-12,000
Deutsch   | 5,000-8,000
Italiano  | 3,000-5,000
Outros    | 2,000-10,000
```

## 🎯 Siguiente Paso

Una vez poblada la BD, actualiza el frontend para mostrar el filtro de idiomas correctamente.
