import random

def get_weather_data(location):
    return {
        "location": location,
        "rainfall_mm": random.randint(30, 200),
        "temperature": random.randint(20, 40)
    }