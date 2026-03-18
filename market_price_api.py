def get_market_price(crop):

    price_ranges = {
        "oilseed": (55000, 65000),
        "paddy": (20000, 25000),
        "maize": (17000, 21000)
    }

    low, high = price_ranges[crop]

    return {
        "price": (low + high) // 2  # average price
    }