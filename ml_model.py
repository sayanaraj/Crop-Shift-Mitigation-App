import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

def train_model():
    data = pd.read_csv("data/crop_dataset_1200_rows.csv")

    le = LabelEncoder()
    data["crop_encoded"] = le.fit_transform(data["crop"])

    X = data[[
        "crop_encoded",
        "rainfall",
        "temperature",
        "cost",
        "market_price",
        "yield"
    ]]

    y = data["profit"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(n_estimators=100)
    model.fit(X_train, y_train)

    joblib.dump(model, "model/profit_model.pkl")
    joblib.dump(le, "model/label_encoder.pkl")

    print("Model trained successfully")

if __name__ == "__main__":
    train_model()