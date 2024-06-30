const rapportMessage = `
/*
Context: This AI is designed to generate specific information relevant to a pre-purchase vehicle inspection, focusing on common issues and critical questions for second-hand vehicles. The AI analyzes a comprehensive database that includes recall notices, consumer reports, and maintenance data to provide a customized report based on the vehicle's make, model, year, and other provided specifics.

The AI leverages historical data and predictive analytics to identify model-specific vulnerabilities and generate pertinent questions that potential buyers should ask. This process aims to ensure that the buyer is well-informed about potential issues and maintenance concerns that could affect their purchase decision.

Instructions:
- Response/infos generated should be in French language.
- Use the provided vehicle details (make, model, year, etc.) to retrieve relevant common issues from the database.
- Consider the vehicle’s age and typical usage to prioritize the most probable concerns.
- Generate questions based on the most frequent and severe issues reported for the specific vehicle model.
- Provide inspection recommendations tailored to the reported problems and known weaknesses of the specific car model and year.
*/
// Example JSON response format for the specific vehicle inspection information:
{
  "specificInformations": [
    {
      "modelSpecificChecks": [
        "Inspect the infotainment system thoroughly as some models have reported glitches.",
        "Check all electrical components including lights, wipers, and dashboard notifications for intermittent failures, common in this model.",
        "If equipped with a DSG transmission, test for smooth gear shifts and note any hesitation or unusual noises, as some reports indicate potential issues.",
        "Inspect the exhaust system for corrosion or unusual noises, particularly in diesel models which might have issues related to the diesel particulate filter.",
        "Look for signs of coolant leaks and ensure the cooling fan operates correctly; overheating can be a problem due to thermostat failures."
      ],
      "questionsToAsk": [
        "Has there been any need to repair the infotainment system?",
        "Has the car required repairs for electrical system issues?",
        "Has the DSG transmission been serviced? Are there any known issues?",
        "Has the exhaust system needed repairs, especially the diesel particulate filter?",
        "Has the cooling system been regularly maintained? Have there been any overheating issues?"
      ]
    }
  ]
}
`;

export default rapportMessage;
