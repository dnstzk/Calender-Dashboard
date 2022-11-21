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

const calenderURL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
const fetchConfig =
  '?' + 'maxResults=2500' +
  '&' + 'q=Thesis' +
  '&' + 'timeMin=2022-05-01T10:00:00-07:00';


function appendContent(ul, content) {
        var li = document.createElement("li");
        li.append(content);
        ul.appendChild(li);
}

function sumUpInvestedMinutes(data) {
    var investedMinutes = 0;

    data.items.forEach((item, i) => {
      var itemStartTime = item.start.dateTime.substring(0,16).replaceAll('-','/').replace('T', ' ');
      var itemEndTime = item.end.dateTime.substring(0,16).replaceAll('-','/').replace('T', ' ');
      var diff = Math.abs(new Date(itemStartTime) - new Date(itemEndTime));
      var sessionLengthInMinutes = Math.floor((diff/1000)/60);

      investedMinutes = investedMinutes + sessionLengthInMinutes;
    });

    return investedMinutes;
}

fetch(calenderURL + fetchConfig, queryParams)
.then((response) => response.json())
.then(function(data) {
    const ul = document.querySelector("ul");

    var li = document.createElement("li");
    li.append("Sessions: " + data.items.length);
    ul.appendChild(li);

    var totalInvestedMinutes = sumUpInvestedMinutes(data);

    var totalHours = Math.floor(totalInvestedMinutes / 60);
    var totalMinutes = totalInvestedMinutes % 60;

    appendContent(ul, "Invested: " + totalHours + "h " + totalMinutes + "min");

    var perSession = totalInvestedMinutes / data.items.length;
    var totalHoursEachSession = Math.floor(perSession / 60);
    var totalMinutesEachSession = ((perSession % 60) + "").substring(0,2);

    appendContent(ul, "Average: " + totalHoursEachSession + "h " + totalMinutesEachSession + "min");

    appendContent(ul ,"_______________________________________________________________");

    appendContent(ul, "Needed hours: 720 - 900");
    appendContent(ul, "Open Hours: " + (900 - (totalHours + 1)) + "h " + (60 - totalMinutes) + "min");
    appendContent(ul, "Done: " + 100*(totalInvestedMinutes/(900*60)).toFixed(4) + "%");

    appendContent(ul ,"_______________________________________________________________");


    var now = new Date().setHours(9,0,0);
    var end = new Date("March 30, 2023 00:00:00");

    var diff = end - now;
    var days = Math.floor(diff / 1000 / 60 / (60 * 24));

    appendContent(ul, "Open Days Se: " + days);
    appendContent(ul, "Progress: " + 100*((180 - days)/180).toFixed(4) + "%");
  })
})
