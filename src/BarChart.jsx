import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 90 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const aggregatedData = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => +d.AcresBurned),
      (d) => d.Counties
    );

    const formattedData = Array.from(
      aggregatedData,
      ([county, acresBurned]) => ({ county, acresBurned })
    );

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(formattedData.map((d) => d.county))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, (d) => d.acresBurned)])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("bars")
      .data(formattedData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.county))
      .attr("y", (d) => y(d.acresBurned))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.acresBurned))
      .attr("fill", "#69b3a2");
  }, [data]);

  return <div id="bar-chart"></div>;
};

export default BarChart;
