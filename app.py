"""Flask app for Cupcakes"""

from flask import Flask, request, render_template, redirect, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config['SECRET_KEY'] = 'yeet'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

debug = DebugToolbarExtension(app)
connect_db(app)
db.create_all()

@app.route('/api/cupcakes')
def all_cupcakes():
    """Return a list of all cupcakes"""
    cupcakes = Cupcake.query.all()
    serialized_cupcakes = {'cupcakes': [cupcake.serialize() for cupcake in cupcakes]}
    return jsonify(serialized_cupcakes)

@app.route('/api/cupcakes/<int:cupcake_id>')
def single_cupcake(cupcake_id):
    """Return a single cupcake by id"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized_cupcake = {'cupcake': cupcake.serialize()}
    return jsonify(serialized_cupcake)

@app.route('/api/cupcakes', methods=['POST'])
def new_cupcake():
    """Add a new cupcake to the database"""
    cupcake = request.json
    flavor = cupcake['flavor']
    size = cupcake['size']
    rating = cupcake['rating']
    try:
        image = cupcake['image']
        new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)
    except:
        new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating)
    # print(new_cupcake, flush=True)
    db.session.add(new_cupcake)
    db.session.commit()
    serialized_cupcake = {'cupcake': new_cupcake.serialize()}
    return (jsonify(serialized_cupcake), 201)

@app.route('/api/cupcakes/<int:cupcake_id>', methods=['PATCH'])
def edit_cupcake(cupcake_id):
    """Edit cupcake by id"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    cupcake.flavor = request.json['flavor']
    cupcake.size = request.json['size']
    cupcake.rating = request.json['rating']
    cupcake.image = request.json['image']
    db.session.commit()
    serialized_cupcake = {'cupcake': cupcake.serialize()}
    return jsonify(serialized_cupcake)

@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):
    """Delete cupcake by id"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()
    message = {'message': 'Deleted'}
    return jsonify(message)
