from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time
import threading
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'smart_chair_secret_123'
socketio = SocketIO(app, cors_allowed_origins="*")

# Live chair data
chairs = {
    'Chair_1': {'occupied': False, 'fsr': 0, 'time': time.time()},
    'Chair_2': {'occupied': False, 'fsr': 0, 'time': time.time()},
    'Chair_3': {'occupied': True, 'fsr': 2500, 'time': time.time()},
    'Chair_4': {'occupied': False, 'fsr': 100, 'time': time.time()},
    'Chair_5': {'occupied': False, 'fsr': 50, 'time': time.time()}
}

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/update', methods=['POST'])
def update_chair():
    data = request.get_json()
    chair_id = data.get('chair_id', 'Chair_1')
    occupied = data.get('occupied', False)
    fsr_value = data.get('fsr_value', 0)
    
    chairs[chair_id]['occupied'] = occupied
    chairs[chair_id]['fsr'] = fsr_value
    chairs[chair_id]['time'] = time.time()
    
    socketio.emit('status_update', {
        'chair_id': chair_id,
        'occupied': occupied,
        'fsr_value': fsr_value
    }, broadcast=True)
    return {'status': 'ok'}

def simulate_updates():
    while True:
        time.sleep(3)
        chair_id = f"Chair_{random.randint(1,5)}"
        chairs[chair_id]['occupied'] = random.choice([True, False])
        chairs[chair_id]['fsr'] = 2500 if chairs[chair_id]['occupied'] else random.randint(0, 500)
        chairs[chair_id]['time'] = time.time()
        
        socketio.emit('status_update', {
            'chair_id': chair_id,
            'occupied': chairs[chair_id]['occupied'],
            'fsr_value': chairs[chair_id]['fsr']
        })

if __name__ == '__main__':
    sim_thread = threading.Thread(target=simulate_updates, daemon=True)
    sim_thread.start()
    print("🚀 Smart Chair Dashboard LIVE at http://localhost:5000")
    socketio.run(app, debug=False, host='0.0.0.0', port=5000)
