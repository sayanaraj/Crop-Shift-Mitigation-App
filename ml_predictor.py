import joblib

model = joblib.load("model/profit_model.pkl")
encoder = joblib.load("model/label_encoder.pkl")

def predict_profit(crop, rainfall, temperature, cost, market_price, yield_value):

    crop_encoded = encoder.transform([crop])[0]

    features = [[
        crop_encoded,
        rainfall,
        temperature,
        cost,
        market_price,
        yield_value
    ]]

    prediction = model.predict(features)

    return prediction[0]