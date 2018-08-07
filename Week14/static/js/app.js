// from data.js
var tableData = data;

// Select the date field
var newDateChange = d3.select("#datetime");
var newDateClick = d3.select("#filter-btn");

// Complete the click handler for the form
newDateChange.on("change", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();
  // Select the input element and get the raw HTML node
  let inputElement = d3.select("#datetime");
  // Get the value property of the input element
  let inputValue = inputElement.property("value");
  // Use the form input to filter the data by blood type
  console.log(inputValue);
  console.log(tableData);
  let filteredData = tableData.filter(tableData => tableData.datetime === inputValue);
  console.log(filteredData);
  // BONUS: Calculate summary statistics for the age field of the filtered data

});

newDateClick.on("submit", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();
  // Select the input element and get the raw HTML node
  let inputElement = d3.select("#datetime");
  // Get the value property of the input element
  let inputValue = inputElement.property("value");
  // Use the form input to filter the data by blood type
  console.log(inputValue);
  console.log(tableData);
  let filteredData = tableData.filter(tableData => tableData.datetime === inputValue);
  console.log(filteredData);
  // BONUS: Calculate summary statistics for the age field of the filtered data

});