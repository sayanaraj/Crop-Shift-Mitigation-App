def check_scheme_eligibility(crop, land_type, irrigation):

    schemes = []
    bonus = 0

    if crop == "oilseed":
        schemes.append("NMEO-OS Scheme")
        bonus += 3000

        if land_type == "rainfed":
            schemes.append("Rainfed Subsidy")
            bonus += 2000

        if irrigation == "low":
            schemes.append("Irrigation Support")
            bonus += 1000

    return {
        "schemes": schemes,
        "bonus": bonus
    }