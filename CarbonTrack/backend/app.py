from flask import Flask, request, jsonify
from calculation import calculate_carbon_footprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():

    print('loading...')
    data = request.get_json()
    householdOccupants = data['householdOccupants']
    transportUsed = data['transportUsed']
    kilometersTraveled = data['kilometersTraveled']
    watts = data['watts']
    energyType = data['energyType']
    dietPreferences = data['dietPreferences']
    recycle = data['recycle']

    # Call the calculation function
    result = calculate_carbon_footprint(
        householdOccupants, transportUsed, kilometersTraveled, watts, energyType, dietPreferences, recycle
    )
    
    # Return the result as JSON
    result = {"carbonFootprint": "calculated_value"}
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
