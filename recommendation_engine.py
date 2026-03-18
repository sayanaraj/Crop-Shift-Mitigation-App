from data_integration.weather_api import get_weather_data
from data_integration.market_price_api import get_market_price
from data_integration.scheme_matcher import check_scheme_eligibility
from data_integration.ml_predictor import predict_profit


def generate_recommendation(location, land_type, irrigation):

    crops = ["oilseed", "paddy", "maize"]
    weather = get_weather_data(location)

    results = []

    for crop in crops:

        market = get_market_price(crop)
        scheme = check_scheme_eligibility(crop, land_type, irrigation)

        if crop == "oilseed":
            cost = 20000
            yield_value = 1.2
        elif crop == "paddy":
            cost = 25000
            yield_value = 2.5
        else:
            cost = 18000
            yield_value = 2.0

        predicted_profit = predict_profit(
            crop,
            weather["rainfall_mm"],
            weather["temperature"],
            cost,
            market["price"],
            yield_value
        )

        final_profit = predicted_profit + scheme["bonus"]

        results.append({
            "crop": crop,
            "predicted_profit": round(predicted_profit, 2),
            "final_profit": round(final_profit, 2),
            "schemes": scheme["schemes"]
        })

    results.sort(key=lambda x: x["final_profit"], reverse=True)

    return {
        "weather": weather,
        "best_crop": results[0],
        "all_options": results
    }