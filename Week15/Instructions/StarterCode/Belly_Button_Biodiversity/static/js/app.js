function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  let url = "/metadata/"+sample;
  console.log(url);
  let metaDataContainer = d3.select("#sample-metadata");
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then((response) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log("response: " + response);
    let data = response;
    // Use `.html("") to clear any existing metadata
    console.log("data: " + data)
    metaDataContainer.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // data.forEach(function(dataRow) {
    //   let row = metaDataContainer.append("h6");

    //   Object.values(dataRow).forEach((val) => {
    //     let line = row.append("h6");
    //     line.text(val);
    //   });
  
    // });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
};

function buildCharts(sample) {
  console.log("buildCharts() started.")
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url = "/samples/"+sample;
  console.log("buildCharts() url: "+ url)

  d3.json(url).then((response) => {

    console.log("buildCharts() response" + response);
    let data = response;

    // @TODO: Build a Bubble Chart using the sample data
    let bubbleContainer = d3.select("#bubble");
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    let pieContainer = d3.select("#pie");
  });
};

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    console.log("init / sampleNames: "+sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
