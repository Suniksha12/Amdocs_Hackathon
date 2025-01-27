from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import logging
from functools import wraps
import jwt
import datetime

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    filename='system.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Initialize Redis for caching
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Secret key for JWT
SECRET_KEY = 'your-secret-key'

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        auth = request.json
        if auth and auth['username'] == 'admin' and auth['password'] == 'password':
            token = jwt.encode({
                'user': auth['username'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY)
            return jsonify({'token': token})
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'message': 'Error during login'}), 500

# Protected data endpoint
@app.route('/api/data', methods=['GET'])
@token_required
def get_data():
    try:
        # Check cache first
        cached_data = redis_client.get('api_data')
        if cached_data:
            return jsonify({'data': cached_data.decode('utf-8'), 'source': 'cache'})
        
        # If not in cache, get from "database" and cache it
        data = {'message': 'This is protected data', 'timestamp': str(datetime.datetime.now())}
        redis_client.setex('api_data', 300, str(data))  # Cache for 5 minutes
        return jsonify({'data': data, 'source': 'database'})
    except Exception as e:
        logging.error(f"Data retrieval error: {str(e)}")
        return jsonify({'message': 'Error retrieving data'}), 500

if __name__ == '__main__':
    app.run(debug=True)