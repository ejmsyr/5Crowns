fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/las%20vegas%2C%20nevada?unitGroup=metric&key=YOUR_API_KEY&contentType=json", {
    "method": "GET",
    "headers": {
    }
    })
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
  