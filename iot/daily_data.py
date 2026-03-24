import time
import pandas as pd
import numpy as np
from paho.mqtt import client as mqtt_client
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

broker = os.getenv("MQTT_BROKER", "localhost")
port = int(os.getenv("MQTT_PORT", 1883))
topic = os.getenv("MQTT_TOPIC", "python/mqtt")
client_id = f'python-mqtt-{np.random.randint(0, 1000)}'
username = os.getenv("MQTT_USERNAME", "")
password = os.getenv("MQTT_PASSWORD", "")

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print(f"Failed to connect, return code {rc}\n")

    client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, client_id="Simulated_Sensors")
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def publish(client, msg):
    msg_count = 0
    while True:
        time.sleep(1)
        result = client.publish(topic, msg)
        status = result[0]
        if status == 0:
            print(f"Send `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")
        msg_count += 1
        if msg_count > 5:
            break

def generate_industrial_fleet_data(num_rows=100000, num_motors=25, seed=42):
    """
    Generates telemetry for an array of industrial motors with clustered, realistic data corruption.
    Generates (num_motors * 6) + 2 columns.
    """
    np.random.seed(seed)
    print(f"Initializing synthetic factory floor... ({num_rows} rows, {num_motors} units)")
    
    t = np.linspace(0, 100, num_rows)
    
    uptime_hours = (t * 50) % 2000  
    
    ambient_temp_c = np.sin(t / 2) * 10 + 25 + np.random.normal(0, 1, num_rows)
    ambient_humidity_pct = np.cos(t / 2) * 20 + 60 + np.random.normal(0, 2, num_rows)
    
    data = {
        'timestamp_ms': pd.date_range(start='2026-01-01', periods=num_rows, freq='15s'),
        'factory_ambient_temp_c': ambient_temp_c,
        'factory_humidity_pct': np.clip(ambient_humidity_pct, 0, 100)
    }
    
    for m in range(1, num_motors + 1):
        wear_factor = np.linspace(0, np.random.uniform(2, 8), num_rows) 
        unit_load = np.sin(t * np.random.uniform(0.8, 1.2)) * 40 + 60
        
        current_a = (unit_load * np.random.uniform(1.5, 2.0)) + np.random.normal(0, 2, num_rows)
        
        stator_temp = ambient_temp_c + (current_a * 0.4) + (wear_factor * 5) + np.random.normal(0, 1.5, num_rows)
        
        vibr_axial = np.random.uniform(0.5, 1.5) + (wear_factor * np.random.uniform(1.2, 2.5)) + np.random.normal(0, 0.2, num_rows)
        
        rpm = 3600 - (unit_load * 0.2) - (wear_factor * 1.5) + np.random.normal(0, 5, num_rows)
        
        data[f'm{m:02d}_uptime_hrs'] = uptime_hours + np.random.normal(0, 0.1, num_rows)
        data[f'm{m:02d}_current_draw_a'] = current_a
        data[f'm{m:02d}_stator_temp_c'] = stator_temp
        data[f'm{m:02d}_vibration_axial_mms'] = np.clip(vibr_axial, 0, None)
        data[f'm{m:02d}_rotor_rpm'] = rpm

    df = pd.DataFrame(data)

    df['system_failure_flag'] = 0
    for m in range(1, num_motors + 1):
        critical_condition = (df[f'm{m:02d}_stator_temp_c'] > 180) & (df[f'm{m:02d}_vibration_axial_mms'] > 12)
        df.loc[critical_condition, 'system_failure_flag'] = 1

    print(f"Injecting clustered hardware faults and telemetry drops...")

    sensor_cols = [c for c in df.columns if c not in ['timestamp_ms', 'system_failure_flag']]

    for m in range(1, num_motors + 1):
        num_dropouts = np.random.randint(1, 5)
        for _ in range(num_dropouts):
            start_idx = np.random.randint(0, num_rows - 500)
            duration = np.random.randint(50, 400)
            
            motor_cols = [c for c in df.columns if c.startswith(f'm{m:02d}_')]
            df.loc[start_idx:start_idx+duration, motor_cols] = np.nan

    polluted_cols = np.random.choice(sensor_cols, size=max(1, len(sensor_cols)//10), replace=False)
    for col in polluted_cols:
        df[col] = df[col].astype(object)
        
        num_errors = np.random.randint(2, 8)
        for _ in range(num_errors):
            start_idx = np.random.randint(0, num_rows - 50)
            duration = np.random.randint(10, 50)
            error_code = np.random.choice(["ERR_TIMEOUT", "COMM_FAULT", "BAD_CHECKSUM"])
            df.loc[start_idx:start_idx+duration, col] = error_code

    for col in np.random.choice(sensor_cols, size=10, replace=False):
        start_idx = np.random.randint(0, num_rows - 1000)
        duration = np.random.randint(200, 1000)
        df.loc[start_idx:start_idx+duration, col] = df.loc[start_idx, col]

    return df


df_industrial = generate_industrial_fleet_data(num_rows=2000, num_motors=25)

print(f"\nFinal Dataset Shape: {df_industrial.shape[0]} rows × {df_industrial.shape[1]} columns")

m3_nulls = df_industrial[df_industrial['m03_current_draw_a'].isna()]
if not m3_nulls.empty:
    sample_idx = m3_nulls.index[0]
    print(df_industrial.loc[sample_idx-2:sample_idx+2, ['timestamp_ms', 'm03_current_draw_a', 'm03_stator_temp_c', 'm04_stator_temp_c']])

df_industrial.to_csv("synthetic_industrial_fleet_data.csv", index=False)

client = connect_mqtt()
client.loop_start()

for line in df_industrial:
    publish(client, line)
    time.sleep(0.6) # Simulate delay between messages

if client.is_connected():
    client.loop_stop()
    client.disconnect()

print("Data published to MQTT broker and connection closed.")