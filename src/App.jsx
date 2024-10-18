import * as d3 from "d3"; // Alternatively, you can use papaparse for CSV parsing.
import React, { useEffect, useState } from "react";
import InteractiveBarChart from "./BarChart";
import BoxPlot from "./BoxPlot";
import RegressionPlot from "./RegressionPlot";
import WordCloudChart from "./WordCloudChart"; // Assuming you're creating a word cloud chart.

const App = () => {
  const [csvData, setCsvData] = useState([]);

  // Function to load the CSV file
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use D3 to load the CSV
        const data = await d3.csv("../California_Fire_Incidents.csv");
        console.log("CSV Data:", data); // Check the format of the CSV data here.
        setCsvData(data); // Store the parsed data in state
      } catch (error) {
        console.error("Error loading CSV file:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Advanced D3 Charts in React</h1>
      {/* Pass the parsed CSV data to the WordCloudChart component */}
      <WordCloudChart data={csvData} />
      {/* <InteractiveBarChart data={csvData} /> */}
      <BoxPlot data={csvData} />
      <RegressionPlot data={csvData} />
      {/* <InteractiveScatterPlot data={csvData} /> */}
    </div>
  );
};

export default App;
