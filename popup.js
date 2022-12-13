// Pass manifest oauth2 token to chrome and execute myCallBack
chrome.identity.getAuthToken({ 'interactive': true }, myCallBack)

function myCallBack(token) {

    const calenderURL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    const headers = new Headers({
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
    });

    const fetchConfig =
        '?' + 'maxResults=2500' +
        '&' + 'q=Thesis' +
        '&' + 'timeMax=2023-04-01T10:00:00-00:00' + // Semester end
        '&' + 'timeMin=2022-05-01T10:00:00-00:00';  // First topic contact

    fetch(calenderURL + fetchConfig, { headers })
        .then((data) => data.json())
        .then((data) => process(data));
};

function process(data) {

    const doneID = document.getElementById('done');
    var itemsUntilNow = extractItemsUntilNow(data.items);

    var totalInvestedMinutes = sumUpInvestedMinutes(itemsUntilNow);
    var totalHours = Math.floor(totalInvestedMinutes / 60);
    var totalMinutes = totalInvestedMinutes % 60;

    var perSession = totalInvestedMinutes / itemsUntilNow.length;
    var totalHoursEachSession = Math.floor(perSession / 60);
    var totalMinutesEachSession = ((perSession % 60) + "").substring(0,2);

    appendTableLine(doneID, "Sessions: ",
                              "Invested: ",
                              "Average: ");
    appendTableLine(doneID, itemsUntilNow.length,
                              totalHours + "h " + totalMinutes + "min",
                              totalHoursEachSession + "h " + totalMinutesEachSession + "min");

//  --------------------------------------------------------------------------------------------------------------------
    const requiredID = document.getElementById('required');

    appendTableLine(requiredID, "Needed",
                                "Open",
                                "Done");
    appendTableLine(requiredID,
                    "720 - 900 h", (900 - (totalHours + 1)) + "h " + (60 - totalMinutes) + "min",
                    parseFloat(100*(totalInvestedMinutes/(900*60))).toFixed(2) + "%");


//  --------------------------------------------------------------------------------------------------------------------
    const timeID = document.getElementById('time');

    var now = new Date().setHours(9,0,0);
    var end = new Date("March 30, 2023 00:00:00");

    var diff = end - now;
    var days = Math.floor(diff / 1000 / 60 / (60 * 24));

    appendTableLine(timeID, "Total",
                            "Open",
                            "Passed");
    appendTableLine(timeID, "180",
                            days,
                            parseFloat(100*((180 - days)/180)).toFixed(2) + "%");

//  --------------------------------------------------------------------------------------------------------------------

    const planedID = document.getElementById('planed');

    var totalInvestedMinutes = sumUpInvestedMinutes(data.items);
    var totalHours = Math.floor(totalInvestedMinutes / 60);
    var totalMinutes = totalInvestedMinutes % 60;

    var perSession = totalInvestedMinutes / data.items.length;
    var totalHoursEachSession = Math.floor(perSession / 60);
    var totalMinutesEachSession = ((perSession % 60) + "").substring(0,2);

    appendTableLine(planedID, "Sessions: ",
                              "Invested: ",
                              "Average: ");
    appendTableLine(planedID, data.items.length,
                              totalHours + "h " + totalMinutes + "min",
                              totalHoursEachSession + "h " + totalMinutesEachSession + "min");
};

function appendTableLine(tag, title1, titel2, titel3) {
        var li = document.createElement("li");

        var d1 = document.createElement("div");
        d1.append(title1);
        li.append(d1);

        var d2 = document.createElement("div");
        d2.append(titel2);
        li.append(d2);

        var d3 = document.createElement("div");
        d3.append(titel3);
        li.append(d3);

        tag.appendChild(li);
};

function sumUpInvestedMinutes(items) {
    var investedMinutes = 0;

    for (let item of items) {
        var itemStartTime = item.start.dateTime.substring(0,16).replaceAll('-','/').replace('T', ' ');
        var itemEndTime = item.end.dateTime.substring(0,16).replaceAll('-','/').replace('T', ' ');
        var diff = Math.abs(new Date(itemStartTime) - new Date(itemEndTime));
        var sessionLengthInMinutes = Math.floor((diff/1000)/60);

        investedMinutes = investedMinutes + sessionLengthInMinutes;
    }

    return investedMinutes;
};

function extractItemsUntilNow(items) {
    var result = [];

    var now = new Date();
    for (let item of items) {
        var itemDate = new Date(item.start.dateTime);
        if (itemDate < now) {
            result.push(item);
        }
    }

    return result;
};