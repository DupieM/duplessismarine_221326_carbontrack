# getting all the data from the tracker screen
def calculate_carbon_footprint(household_occupants, transport_used, kilometers_traveled, watts, energy_type, diet_preferences, recycle):
    # Carbon footprint factors (these are approximate and should be adjusted for your needs)

    # Emission factor per person
    household_emission = household_occupants * 1.5

    # Emission from transportation
    transport_emission = kilometers_traveled * transport_used

    # Emission from energy usage
    energy_emission = watts * energy_type

    # Emission factor for diet
    diet_emission = diet_preferences * 365

    # Recycling reduces emissions by 5% if "Yes"
    recycle_emission = -0.05 if recycle == "Yes" else 0

    # Total carbon footprint in tonnes/year
    total_emission = household_emission + transport_emission + energy_emission + diet_emission + recycle_emission

    return total_emission
