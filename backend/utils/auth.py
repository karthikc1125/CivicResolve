# Authentication and authorization utilities
from functools import wraps
from flask import request, jsonify

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user_role = request.headers.get("X-Role")

            if not user_role:
                return jsonify({"message": "Role header missing"}), 401

            if user_role.lower() != required_role.lower():
                return jsonify({"message": "Access forbidden"}), 403

            return f(*args, **kwargs)
        return wrapper
    return decorator
