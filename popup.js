await chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  var init = {
    'method' : 'GET',
    'async'  : true,
    'headers': {
      'Authorization' : 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    'contentType': 'json'
  };

const headers = new Headers({
    'Authorization' : 'Bearer ' + token,
    'Content-Type': 'application/json'
})

const queryParams = { headers };

const primaryCalender = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
const querryFor = '?';
const AND = '&'
const maxResults = 'maxResults=2500';
const name = 'q=Thesis';
const timeMin = 'timeMin=2022-05-01T10:00:00-07:00';
const fetchConfig = querryFor + maxResults + AND + name + AND + timeMin;


fetch(primaryCalender + fetchConfig, queryParams)
.then((response) => response.json()) // Transform the data into json
.then(function(data) {
    const ul = document.querySelector("ul");

    var li = document.createElement("li");
    li.append("Searched for:" + "'Thesis' and fround: " +data.items.length + " entries");
    ul.appendChild(li);

    var li = document.createElement("li");
    li.append(" ");
    ul.appendChild(li);

    var totalMinutes = 0;

    data.items.forEach((item, i) => {
      var date = item.start.dateTime.substring(0,10);
      var name = item.summary;

      var startTime = item.start.dateTime.substring(11,16);
      var endTime = item.end.dateTime.substring(11,16);


      var dateSomeStart = item.start.dateTime.substring(0,16).replaceAll('-','/').replace('T', ' ');
      var dateSomeEnd = item.end.dateTime.substring(0,16).replaceAll('-','/').replace('T', ' ');



      var diff = Math.abs(new Date(dateSomeEnd) - new Date(dateSomeStart));

      var minutes = Math.floor((diff/1000)/60);

      var li = document.createElement("li");
      li.append(date + "  " + name + " " + startTime + "  " + endTime + " " + minutes);
      ul.appendChild(li);

      totalMinutes = totalMinutes + minutes;
    });

    var restMinuten = totalMinutes % 60;
    var anteilStunden = Math.floor(totalMinutes / 60);

    var li = document.createElement("li");
    li.append("Bisher gelernte Zeit: " + anteilStunden + "h " + restMinuten + "min" );
    ul.appendChild(li);
  })
})
