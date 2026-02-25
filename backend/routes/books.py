from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.book import Book
from models.category import Category
#from app import db
from utils.decorators import role_required
from extensions import db

books_bp = Blueprint('books', __name__)

@books_bp.route('', methods=['GET'])
def get_books():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    limit = request.args.get('limit', per_page, type=int)  # Aceptar 'limit' también
    search = request.args.get('search', '')
    language = request.args.get('language', '')
    
    query = Book.query
    
    if search:
        query = query.filter(
            (Book.title.ilike(f'%{search}%')) |
            (Book.author.ilike(f'%{search}%')) |
            (Book.isbn.ilike(f'%{search}%'))
        )
    
    if language:
        query = query.filter_by(language=language)
    
    # Paginación
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'books': [book.to_dict() for book in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'totalPages': pagination.pages,  # ← IMPORTANTE: Agregar esto
        'current_page': page,
        'per_page': limit
    }), 200

@books_bp.route('', methods=['GET'])
def get_books():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        limit = request.args.get('limit', per_page, type=int)
        search = request.args.get('search', '', type=str)
        language = request.args.get('language', '', type=str)
        
        # Validar límite máximo
        if limit > 100:
            limit = 100
        
        query = Book.query
        
        # Filtro de búsqueda
        if search:
            search_filter = f'%{search}%'
            query = query.filter(
                db.or_(
                    Book.title.ilike(search_filter),
                    Book.author.ilike(search_filter),
                    Book.isbn.ilike(search_filter)
                )
            )
        
        # Filtro de idioma
        if language:
            query = query.filter(Book.language == language)
        
        # Ejecutar paginación
        pagination = query.paginate(
            page=page,
            per_page=limit,
            error_out=False
        )
        
        return jsonify({
            'books': [book.to_dict() for book in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'totalPages': pagination.pages,  # Para compatibilidad
            'current_page': page,
            'per_page': limit,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }), 200
        
    except Exception as e:
        print(f"Error in get_books: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@books_bp.route('/<int:book_id>', methods=['PUT'])
@jwt_required()
@role_required(['admin', 'librarian'])
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(book, key) and key != 'id':
            setattr(book, key, value)
    
    db.session.commit()
    return jsonify(book.to_dict()), 200

@books_bp.route('/<int:book_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted'}), 200
