from flask import Blueprint, request, jsonify
from backend.models import db, User
from backend.utils.auth import generate_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username, password=password).first()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_token(user)

    return jsonify({"token": token})