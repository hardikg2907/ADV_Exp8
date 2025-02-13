import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const InteractiveBarChart = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState("Injuries");
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    if (data.length === 0) return;

    // Group data by Incident Type and calculate total Injuries or Fatalities
    const groupedData = d3
      .nest()
      .key((d) => d.IncidentType)
      .rollup((v) => d3.sum(v, (d) => +d[selectedMetric]))
      .entries(data);

    setBarData(groupedData);
  }, [data, selectedMetric]);

  useEffect(() => {
    // Setup margins and dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove previous SVG if it exists
    d3.select("#barchart").selectAll("*").remove();

    // Append new SVG element
    const svg = d3
      .select("#barchart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(barData.map((d) => d.key))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(barData, (d) => d.value)])
      .nice()
      .range([height, 0]);

    // Create axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // Create tooltip
    const tooltip = d3
      .select("#barchart")
      .append("div")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px")
      .style("pointer-events", "none");

    // Create bars
    svg
      .selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", "#69b3a2")
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(`${d.key}: ${d.value}`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [barData]);

  // Filter data by metric
  const handleMetricChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  return (
    <div>
      <label htmlFor="metric-filter">Select Metric: </label>
      <select id="metric-filter" onChange={handleMetricChange}>
        <option value="Injuries">Injuries</option>
        <option value="Fatalities">Fatalities</option>
      </select>
      <div id="barchart"></div>
    </div>
  );
};

export default InteractiveBarChart;
