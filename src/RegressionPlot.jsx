import React, { useEffect } from "react";
import * as d3 from "d3";

// Function to calculate linear regression
const linearRegression = (xData, yData) => {
  const n = xData.length;
  const xMean = d3.mean(xData);
  const yMean = d3.mean(yData);
  const numerator = d3.sum(
    xData,
    (d, i) => (xData[i] - xMean) * (yData[i] - yMean)
  );
  const denominator = d3.sum(xData, (d) => (d - xMean) ** 2);

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  return { slope, intercept };
};

const RegressionPlot = ({ data }) => {
  useEffect(() => {
    if (data.length === 0) return;

    // Filter out missing data
    const filteredData = data.filter(
      (d) => d.AcresBurned && d.PersonnelInvolved
    );

    const xData = filteredData.map((d) => +d.PersonnelInvolved);
    const yData = filteredData.map((d) => +d.AcresBurned);

    const width = 500,
      height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };

    const svg = d3
      .select("#regression-plot")
      .html("") // Clear any previous chart
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(xData)])
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(yData)])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // Scatter plot points
    svg
      .append("g")
      .selectAll("dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(+d.PersonnelInvolved))
      .attr("cy", (d) => y(+d.AcresBurned))
      .attr("r", 4)
      .style("fill", "#69b3a2");

    // Calculate linear regression
    const { slope, intercept } = linearRegression(xData, yData);

    // Generate the regression line points
    const xMin = d3.min(xData);
    const xMax = d3.max(xData);
    const regressionLine = [
      { x: xMin, y: slope * xMin + intercept },
      { x: xMax, y: slope * xMax + intercept },
    ];

    // Draw the regression line
    svg
      .append("line")
      .attr("x1", x(regressionLine[0].x))
      .attr("y1", y(regressionLine[0].y))
      .attr("x2", x(regressionLine[1].x))
      .attr("y2", y(regressionLine[1].y))
      .attr("stroke", "red")
      .attr("stroke-width", 2);
  }, [data]);

  return <div id="regression-plot"></div>;
};

export default RegressionPlot;
