import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const InteractiveScatterPlot = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (filteredData.length === 0) return;

    // Setup margins and dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove previous SVG if it exists
    d3.select("#scatterplot").selectAll("*").remove();

    // Append new SVG element
    const svg = d3
      .select("#scatterplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create scales
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => +d.AcresBurned)])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => +d.Injuries)])
      .range([height, 0]);

    // Create axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // Create tooltip
    const tooltip = d3
      .select("#scatterplot")
      .append("div")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px")
      .style("pointer-events", "none");

    // Create scatter points
    svg
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(+d.AcresBurned))
      .attr("cy", (d) => y(+d.Injuries))
      .attr("r", 5)
      .attr("fill", "#69b3a2")
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `Incident: ${d.IncidentName}<br>Acres Burned: ${d.AcresBurned}<br>Injuries: ${d.Injuries}`
          )
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [filteredData, data]);

  // Filter data by year
  const handleFilterChange = (event) => {
    const year = event.target.value;
    if (year === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((d) => d.Year === year);
      setFilteredData(filtered);
    }
  };

  // Get unique years for filtering
  const years = [...new Set(data.map((d) => d.Year))];

  return (
    <div>
      <label htmlFor="year-filter">Filter by Year: </label>
      <select id="year-filter" onChange={handleFilterChange}>
        <option value="All">All</option>
        {years.map((idx, year) => (
          <option key={idx} value={year}>
            {year}
          </option>
        ))}
      </select>
      <div id="scatterplot"></div>
    </div>
  );
};

export default InteractiveScatterPlot;
