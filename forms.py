from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import InputRequired, Optional, URL, NumberRange

class AddCupcakeForm(FlaskForm):
    """Form for adding new cupcakes"""

    flavor = StringField('Flavor', validators=[InputRequired()])
    size = StringField('Size', validators=[InputRequired()])
    rating = IntegerField('Rating', validators=[InputRequired(), NumberRange(min=0, max=10, message='Please enter an rating between 0 and 10')])
    image = StringField('Image URL', validators=[Optional(), URL(message='Please enter a valid photo URL')])
