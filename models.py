"""Models for Cupcake app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

class Cupcake(db.Model):
    """Cupcake"""

    __tablename__ = 'Cupcakes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.String(), nullable=False)
    size = db.Column(db.String(), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(), default='https://tinyurl.com/demo-cupcake')

    def __repr__(self):
        """Show info about a cupcake."""
        url = self.image[0:20] + '...'
        return f'<Cupcake id: {self.id}, flavor: {self.flavor}, size: {self.size}, rating: {self.rating}, image: {url}>'

    def serialize(self):
        """Convert into a jsonifiable dictionary"""
        return {
            'id': self.id,
            'flavor': self.flavor,
            'size': self.size,
            'rating': self.rating,
            'image': self.image
        }
