const url = `https://docs.google.com/spreadsheets/d/1BqUn76g0e0AN6wTngUB6ASjh6jHqQBbulRPXo4geyiM/gviz/tq?sheet=Sheet`;

const url2 = `https://docs.google.com/spreadsheets/d/1BqUn76g0e0AN6wTngUB6ASjh6jHqQBbulRPXo4geyiM/gviz/tq?sheet=Dates`;

let today;
let firsthalf;
let secondhalf; 
let target = 99;
let weeklies_asterites = 0;
let dailies_asterites = 0;
let total_events = 0;
let tides = 0;
let asterites = 0;
let previous_target = 99;
let cleanDataEvents;

function convertDate(date) {
   dateStr = date.slice(5, date.length-1);
   [year, month, day] = dateStr.split(",");
   return new Date(year, month, day);
}

function getDaysBetween(startDate, endDate) { // buh
    diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
}

function generateTable(dataArray) {
   if (dataArray.length === 0) return "<p>No data available</p>";

   let tableHTML = "<table id=\"events-table\"><thead><tr>";

   const headers = Object.keys(dataArray[0]);
   tableHTML += "</tr></thead><tbody>";
   
   i = 1;
   dataArray.forEach(item => {
      if (target == 0) {
         eventdate = convertDate(item[2]);
         if (eventdate >= firsthalf) return;
      } 
      
      console.log(item[2]);

      tableHTML += "<tr>";
      tableHTML += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"chb" + i + "\" value=\"1\" checked onchange=\"calculateEvents()\"></td>";
      headers.slice(0, -1).forEach(header => {
         tableHTML += `<td>${item[header]}</td>`;
      });
      tableHTML += "</tr>";
      i += 1;
   });

   tableHTML += "</tbody></table>";
   return tableHTML;
}

async function getSheetData_charas() {
  try {
    const response = await fetch(url2);
    const text = await response.text();

    jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    data = JSON.parse(jsonString);
    
    rows = data.table.rows;
    
    cleanData = rows.map(row => {
      return row.c.map(cell => cell ? cell.v : null);
    });

    console.log(cleanData); 
        
    document.getElementById("banner0").innerHTML = cleanData[0][1];
    document.getElementById("banner1").innerHTML = cleanData[1][1];

    today = convertDate(cleanData[2][0]);
    firsthalf = convertDate(cleanData[0][0]);
    secondhalf = convertDate(cleanData[1][0]);

    options = { month: 'long', day: 'numeric' };

    document.getElementById("today-date").innerHTML = `Current Date: ${today.toLocaleDateString('en-GB', options)}`;
    document.getElementById("first-date").innerHTML = `First half end: ${firsthalf.toLocaleDateString('en-GB', options)}`;
    document.getElementById("second-date").innerHTML = `Second half end: ${secondhalf.toLocaleDateString('en-GB', options)}`;
    return cleanData;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
  }
}

function displayEventData() {
    document.getElementById("events-list").innerHTML = generateTable(cleanDataEvents);
}

async function getSheetData() {
  try {
    const response = await fetch(url);
    const text = await response.text();

    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonString);
    
    const rows = data.table.rows;
    
    cleanDataEvents = rows.map(row => {
      return row.c.map(cell => cell ? cell.v : null);
    });
    displayEventData();
    calculateEvents();
    return 0;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
  }
}

function calculateCurrent() {
  tides_s = document.getElementById("tides").value;
  tides = parseInt(tides_s, 10);

  asterites_s = document.getElementById("asterites").value;
  asterites = parseInt(asterites_s, 10);
  calculateTotal();
}

function calculateDailies() {

  previous_target = target;
  target = document.getElementById("targetchar").value;

  let number_of_days = 0;
   
  if (target == 0) 
     number_of_days = getDaysBetween(today, firsthalf);
  else if (target == 1) 
     number_of_days = getDaysBetween(today, secondhalf);
  else number_of_days = 0;

  dailies_asterites = 60 * number_of_days;
  weeklies_asterites = Math.ceil(number_of_days / 7) * 160;

  if (previous_target == 99)
     getSheetData();
  else if ( (target == 0 || target == 1) 
     && (target != previous_target) ) {
     displayEventData();
     calculateEvents();
  }

  document.getElementById(
    "dailies-asterites"
  ).innerHTML = `Dailies asterites: ${dailies_asterites}`;
  document.getElementById(
    "weeklies-asterites"
  ).innerHTML = `Weeklies asterites: ${weeklies_asterites}`;

  calculateTotal();
}

function calculateEvents() {
   const table = document.getElementById("events-table"); 
   const tableData = [];
   total_events = 0;
   for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const rowData = [];
      const cbchecked = document.querySelector("#chb" + i); 
      if (cbchecked.checked) {
         rowData.push(row.cells[2].innerText);
         total_events += parseInt(row.cells[2].innerText, 10);
      }
    tableData.push(rowData);
    }

   console.log(tableData);
   document.getElementById(
    "events-pulls"
   ).innerHTML = `Asterites obtained from events: ${total_events}`;

   calculateTotal();
}

function calculateTotal() {
   total = weeklies_asterites + dailies_asterites + total_events + asterites + (tides * 160);
   total_pulls = (total / 160).toFixed(2);
    document.getElementById(
    "current-asterites"
   ).innerHTML = `Currently available asterites: ${asterites + (tides * 160)}`;
    document.getElementById(
    "total-asterites"
   ).innerHTML = `Total asterites til end of patch: ${total}`;
   document.getElementById(
    "total-pulls"
   ).innerHTML = `Total pulls til end of patch: ${total_pulls}`;
}
