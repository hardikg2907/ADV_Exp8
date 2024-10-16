import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordChart = ({ data }) => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Calculate frequency of counties
    const countyFrequency = d3
      .rollups(
        data,
        (v) => v.length,
        (d) => d.Counties
      )
      .map(([county, frequency]) => ({ text: county, size: frequency * 10 })); // Scale size for better visuals

    setWords(countyFrequency);

    const width = 500;
    const height = 300;

    // Use d3-cloud to generate word cloud
    cloud()
      .size([width, height])
      .words(countyFrequency)
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 90 : 0))
      .fontSize((d) => d.size)
      .on("end", draw)
      .start();

    function draw(words) {
      d3.select("#wordcloud")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style(
          "fill",
          () => d3.schemeCategory10[Math.floor(Math.random() * 10)]
        )
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  }, [data]);

  return <div id="wordcloud"></div>;
};

export default WordChart;
