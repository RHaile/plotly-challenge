function buildMetadata(sample) {

  var url = "/metadata/" + sample;

  var output = d3.select("#sample-metadata");
  output.html("")

  d3.json(url).then(data => {
    Object.entries(data).forEach(([key, value]) => {
      var li = output.append("div").text(`${key}: ${value}`);
    });
  })
}

function buildCharts(sample) {

  var url = "/samples/" + sample;

  d3.json(url).then(data => {
    let layout = {
      title: 'Pie Chart'
    }

    trace = {
      labels: data["otu_ids"].slice(0, 10),
      values: data["sample_values"].slice(0, 10),
      type: "pie"
    }

    Plotly.newPlot('pie', [trace], layout)

    var trace1 = {
      x: data["otu_ids"],
      y: data["sample_values"],
      mode: 'markers',
      text: data["otu_labels"],

      marker: {
        size: data["sample_values"],
        color: data["otu_ids"],
        colorscale: 'Rainbow'

      }
    };

    var data1 = [trace1];

    var layout1 = {
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', data1, layout1)

  })


  var url1 = "/metadata/" + sample;

  d3.json(url1).then(metadata => {

    var data = [{
        domain: {
          x: [0, 1],
          y: [0, 1]
        },
        value: metadata["WFREQ"],
        title: {
          text: "Scrubs Per Week"
        },
        type: "indicator",
        mode: "gauge+number",  
        gauge: {
          axis: {
            range: [0, 10]
          },
          bar: {
            color: "darkblue"
          },
          steps: [{
              range: [0, 1],
              color: "coral"
            },
            {
              range: [1, 2],
              color: "lightblue"
            },
            {
              range: [2, 3],
              color: "lightgreen"
            },
            {
              range: [3, 4],
              color: "pink"
            },
            {
              range: [4, 5],
              color: "orange"
            },
            {
              range: [5, 6],
              color: "lightblue"
            },
            {
              range: [6, 7],
              color: "yellow"
            },
            {
              range: [7, 8],
              color: "royalblue"
            },
            {
              range: [8, 9],
              color: "grey"
            },
          ],
        }
      }

    ];

    var layout = {
      title: 'Belly Button Washing Frequency',
      width: 500, height: 500, 
      margin: {t: 25, r: 25, l: 25, b: 25},
        shapes: [{type: "rect", x0: -0.03, x1: 0.56, y0: 0.55, y1: 1,
        line: {color: "gray", width: 1}}]
    };


    Plotly.newPlot('gauge', data, layout);

  })

}

function init() {

  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {

  buildCharts(newSample);
  buildMetadata(newSample);
}

init();