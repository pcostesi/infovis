import React, { useEffect } from "react";
import "./Plot.css";
import * as Plottable from "plottable";

function draw(data: Array<any>) {
  var xScale = new Plottable.Scales.Linear();
  var yScale = new Plottable.Scales.Linear();
  var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
  var yAxis = new Plottable.Axes.Numeric(yScale, "left");
  var plot = new Plottable.Plots.Line();
  plot.x(function(d: any) {
    return d.x;
  }, xScale);
  plot.y(function(d: any) {
    return d.y;
  }, yScale);
  const dataset = new Plottable.Dataset(data);
  plot.addDataset(dataset);
  var chart = new Plottable.Components.Table([[yAxis, plot], [null, xAxis]]);
  chart.renderTo("div.canvas");
}

const Plot = (props: any) => {
  useEffect(() => draw(props.data), [props.data]);
  return <div className="canvas"></div>;
};
export default Plot;
