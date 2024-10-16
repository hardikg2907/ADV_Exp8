import React, { useEffect } from "react";
import * as d3 from "d3";

const BoxPlot = ({ data }) => {
  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#box-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const injuryData = data.map((d) => +d.Injuries).filter((d) => d > 0);
    const fatalitiesData = data.map((d) => +d.Fatalities).filter((d) => d > 0);

    const dataSet = [injuryData, fatalitiesData];

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataSet.flat())])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(["Injuries", "Fatalities"])
      .paddingInner(1)
      .paddingOuter(0.5);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    const summaryStatistics = (data) => {
      const q1 = d3.quantile(data.sort(d3.ascending), 0.25);
      const median = d3.quantile(data, 0.5);
      const q3 = d3.quantile(data, 0.75);
      const min = d3.min(data);
      const max = d3.max(data);
      return { q1, median, q3, min, max };
    };

    dataSet.forEach((group, i) => {
      const stats = summaryStatistics(group);

      svg
        .append("line")
        .attr("x1", x(i === 0 ? "Injuries" : "Fatalities"))
        .attr("x2", x(i === 0 ? "Injuries" : "Fatalities"))
        .attr("y1", y(stats.min))
        .attr("y2", y(stats.max))
        .attr("stroke", "black");

      svg
        .append("rect")
        .attr("x", x(i === 0 ? "Injuries" : "Fatalities") - 30)
        .attr("y", y(stats.q3))
        .attr("height", y(stats.q1) - y(stats.q3))
        .attr("width", 60)
        .attr("stroke", "black")
        .style("fill", "#69b3a2");

      svg
        .append("line")
        .attr("x1", x(i === 0 ? "Injuries" : "Fatalities") - 30)
        .attr("x2", x(i === 0 ? "Injuries" : "Fatalities") + 30)
        .attr("y1", y(stats.median))
        .attr("y2", y(stats.median))
        .attr("stroke", "black");
    });
  }, [data]);

  return <div id="box-plot"></div>;
};

export default BoxPlot;
