const url = `https://docs.google.com/spreadsheets/d/1BqUn76g0e0AN6wTngUB6ASjh6jHqQBbulRPXo4geyiM/gviz/tq?sheet=Sheet`;

const url2 = `https://docs.google.com/spreadsheets/d/1BqUn76g0e0AN6wTngUB6ASjh6jHqQBbulRPXo4geyiM/gviz/tq?sheet=Dates`;

let today;
let firsthalf;
let secondhalf; 
let target;
let weeklies_asterites;
let dailies_asterites;
let total_events;
let tides;
let asterites;

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

   // const base64String = "LypPX28qLwpnb29nbGUudmlzdWFsaXphdGlvbi5RdWVyeS5zZXRSZXNwb25zZSh7InZlcnNpb24iOiIwLjYiLCJyZXFJZCI6IjAiLCJzdGF0dXMiOiJvayIsInNpZyI6IjIyMzM0OTI2OSIsInRhYmxlIjp7ImNvbHMiOlt7ImlkIjoiQSIsImxhYmVsIjoiIiwidHlwZSI6ImRhdGUiLCJwYXR0ZXJuIjoiZGQubW0ueXl5eSJ9LHsiaWQiOiJCIiwibGFiZWwiOiIiLCJ0eXBlIjoic3RyaW5nIn0seyJpZCI6IkMiLCJsYWJlbCI6IiIsInR5cGUiOiJzdHJpbmcifV0sInJvd3MiOlt7ImMiOlt7InYiOiJEYXRlKDIwMjYsMTAsMTMpIiwiZiI6IjEzLjExLjIwMjYifSx7InYiOiJMaWx5IC8gU2lncmlrYSAvIFFpdXl1YW4ifSx7InYiOiJGaXJzdCBoYWxmIGVuZCJ9XX0seyJjIjpbeyJ2IjoiRGF0ZSgyMDI2LDExLDIpIiwiZiI6IjAyLjEyLjIwMjYifSx7InYiOiJZYW5neWFuZyBYTCAvIFN1aXN1aSAvIEhpeXVraSJ9LHsidiI6IlNlY29uZCBoYWxmIGVuZCJ9XX0seyJjIjpbeyJ2IjoiRGF0ZSgyMDI2LDEwLDIpIiwiZiI6IjAyLjExLjIwMjYifSx7InYiOiJUb2RheSJ9LHsidiI6bnVsbH1dfV0sInBhcnNlZE51bUhlYWRlcnMiOjB9fSk7";

 const binaryString = atob(base64String);
 const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
       bytes[i] = binaryString.charCodeAt(i);
    }
  
    text = new TextDecoder().decode(bytes);

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

async function getSheetData() {
  try {
    const response = await fetch(url);
    const text = await response.text();

   // const base64String = "LypPX28qLwpnb29nbGUudmlzdWFsaXphdGlvbi5RdWVyeS5zZXRSZXNwb25zZSh7InZlcnNpb24iOiIwLjYiLCJyZXFJZCI6IjAiLCJzdGF0dXMiOiJvayIsInNpZyI6IjEwNTE2OTk4MTEiLCJ0YWJsZSI6eyJjb2xzIjpbeyJpZCI6IkEiLCJsYWJlbCI6IiIsInR5cGUiOiJzdHJpbmcifSx7ImlkIjoiQiIsImxhYmVsIjoiIiwidHlwZSI6Im51bWJlciIsInBhdHRlcm4iOiJHZW5lcmFsIn0seyJpZCI6IkMiLCJsYWJlbCI6IiIsInR5cGUiOiJkYXRlIiwicGF0dGVybiI6ImRkLm1tLnl5eXkifV0sInJvd3MiOlt7ImMiOlt7InYiOiJFeHBsb3JhdGlvbiJ9LHsidiI6MTIwLjAsImYiOiIxMjAifSx7InYiOiJEYXRlKDIwMjYsMTAsMTApIiwiZiI6IjEwLjExLjIwMjYifV19LHsiYyI6W3sidiI6IkV2ZW50IDEifSx7InYiOjMwMC4wLCJmIjoiMzAwIn0seyJ2IjoiRGF0ZSgyMDI2LDEwLDEwKSIsImYiOiIxMC4xMS4yMDI2In1dfSx7ImMiOlt7InYiOiJFdmVudCAyIn0seyJ2Ijo1MC4wLCJmIjoiNTAifSx7InYiOiJEYXRlKDIwMjYsMTAsMTMpIiwiZiI6IjEzLjExLjIwMjYifV19LHsiYyI6W3sidiI6IlRvQSAxIn0seyJ2IjoyMDAuMCwiZiI6IjIwMCJ9LHsidiI6IkRhdGUoMjAyNiwxMCwyMykiLCJmIjoiMjMuMTEuMjAyNiJ9XX0seyJjIjpbeyJ2IjoiV2hpd2EifSx7InYiOjEwMC4wLCJmIjoiMTAwIn0seyJ2IjoiRGF0ZSgyMDI2LDExLDEpIiwiZiI6IjAxLjEyLjIwMjYifV19XSwicGFyc2VkTnVtSGVhZGVycyI6MH19KTs=";

 const binaryString = atob(base64String);
 const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
    text = new TextDecoder().decode(bytes);

    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonString);
    
    const rows = data.table.rows;
    
    const cleanData = rows.map(row => {
      return row.c.map(cell => cell ? cell.v : null);
    });

    console.log(cleanData); 
    document.getElementById("events-list").innerHTML = generateTable(cleanData);
    return cleanData;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
  }
}


function calculateThing() {
  tides_s = document.getElementById("tides").value;
  tides = parseInt(tides_s, 10);

  asterites_s = document.getElementById("asterites").value;

  asterites = parseInt(asterites_s, 10);

  total_pulls = (tides + asterites / 160).toFixed(2);

  document.getElementById(
    "total-pulls"
  ).innerHTML = `Total pulls available: ${total_pulls}`;

  target = document.getElementById("targetchar").value;

  let number_of_days = 0;
   
  if (target == 0) 
     number_of_days = getDaysBetween(today, firsthalf);
  else if (target == 1) 
     number_of_days = getDaysBetween(today, secondhalf);
  else number_of_days = 0;

  dailies_asterites = 60 * number_of_days;
  weeklies_asterites = Math.ceil(number_of_days / 7) * 160;

  if (target == 0 || target == 1)
     getSheetData();

  document.getElementById(
    "dailies-asterites"
  ).innerHTML = `Dailies asterites: ${dailies_asterites}`;
  document.getElementById(
    "weeklies-asterites"
  ).innerHTML = `Weeklies asterites: ${weeklies_asterites}`;

  if (target == 0 || target == 1)
     calculateEvents();
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
   console.log(total);
   total_pulls = (total / 160).toFixed(2);
    document.getElementById(
    "total-asterites"
   ).innerHTML = `Total asterites available: ${total}`;
   document.getElementById(
    "total-pulls"
   ).innerHTML = `Total pulls available: ${total_pulls}`;
}
