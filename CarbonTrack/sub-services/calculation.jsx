
export const calculateCarbonFootprint = (
    {householdOccupants,
    transportUsed,
    kilometersTraveled,
    watts,
    energyType,
    dietPreferences,
    recycle}
  ) => {
    // Carbon footprint factors (these are approximate and should be adjusted for your needs)
  
    // Emission factor per person
    const householdEmission = householdOccupants * 0.91;
  
    // Emission from transportation
    const transportEmission = (kilometersTraveled * transportUsed)/1000000;
  
    // Emission from energy usage
    const energyEmission = watts * energyType;
  
    // Emission factor for diet
    const dietEmission = dietPreferences * 1; 

    // Recycling reduces emissions by 5% if "Yes"
    const recycleEmission = recycle === "Yes" ? -0.05 : 0;
  
    // Total carbon footprint in tonnes/year
    // const totalEmission = transportEmission;
    const totalEmission = parseFloat(
      (householdEmission + transportEmission + energyEmission + dietEmission + recycleEmission).toFixed(2)
    );
  
    return {totalEmission, householdEmission, transportEmission, energyEmission, dietEmission};
};
