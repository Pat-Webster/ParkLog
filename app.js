console.log("THIS IS THE PARKLOG APP.JS");
const entryDate = document.getElementById("entryDate");
const entryTime = document.getElementById("entryTime");

const overallSymptoms =
    document.getElementById("overallSymptoms");

const overallSymptomsValue =
    document.getElementById("overallSymptomsValue");

const dbsProgram =
    document.getElementById("dbsProgram");


const dbsLevel =
    document.getElementById("dbsLevel");

const dbsFrequency =
    document.getElementById("dbsFrequency");
    
const dbsPulseWidth=
    document.getElementById("dbsPulseWidth");

const notes =
    document.getElementById("notes");

const saveButton =
    document.getElementById("saveButton");

const voiceNotesButton =
    document.getElementById("voiceNotesButton");

const entryList =
    document.getElementById("entryList");

const resetButton =
    document.getElementById("resetButton");

const carbidopaDose =
    document.getElementById("carbidopaDose");

const RopaDose =
    document.getElementById("RopaDose");

function setCurrentDateTime() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    entryDate.value =
        `${year}-${month}-${day}`;

    entryTime.value =
        `${hours}:${minutes}`;
}

saveButton.disabled = true;

const symptomSliders = [
    "overallSymptoms",
    "tremor",
    "stiffness",
    "dystonia",
    "balance",
    "dyskinesia",
    "depression",
    "anxiety",
    "sleep",
    "energy",
 ];


const ratedSymptoms = new Set();

symptomSliders.forEach(
    function (id) {

        const slider =
            document.getElementById(id);

        console.log(id, slider);

        const valueDisplay =
            document.getElementById(
                id + "Value"
            );

        valueDisplay.textContent = "—";

        slider.addEventListener(
            "input",
            function () {

                ratedSymptoms.add(id);

                slider.classList.remove(
                    "unratedSlider"
                );

                valueDisplay.textContent =
                    slider.value;
                saveButton.disabled = false;
           }
        );
    }
);


function getRating(id) {

    if (!ratedSymptoms.has(id)) {
        return -1;
    }

    return Number(
        document.getElementById(id).value
    );
}
function getEntries() {

    const savedEntries =
        localStorage.getItem(
            "parkinsonsLogEntries"
        );

    if (!savedEntries) {
        return [];
    }

    return JSON.parse(savedEntries);
}


function saveEntries(entries) {

    localStorage.setItem(
        "parkinsonsLogEntries",
        JSON.stringify(entries)
    );
}

function resetSymptomSliders() {

    ratedSymptoms.clear();

    symptomSliders.forEach(
        function (id) {

            const slider =
                document.getElementById(id);

            const valueDisplay =
                document.getElementById(
                    id + "Value"
                );

            slider.value = -1;

            slider.classList.add(
                "unratedSlider"
            );

            valueDisplay.textContent = "—";
        }
    );
}
function displayEntries() {

    const entries = getEntries();

    if (entries.length === 0) {
        entryList.innerHTML = "No entries yet.";
        return;
    }

    entryList.innerHTML = "";

    const newestFirst =
        [...entries].reverse();

    newestFirst.forEach(
        function (entry) {

            const div =
                document.createElement("div");

            div.className = "entry";


            let symptoms = [];


            function addRating(
                label,
                value
            ) {

                if (
                    value !== undefined &&
                    value !== null &&
                    value >= 0
                ) {
                    symptoms.push(
                        `${label}: ${value}`
                    );
                }
            }


            addRating(
                "Overall",
                entry.overallSymptoms
            );

            addRating(
                "Tremor",
                entry.tremor
            );

            addRating(
                "Rigidity",
                entry.stiffness
            );

            addRating(
                "balance",
                entry.balance
            );

            addRating(
                "Dyskinesia",
                entry.dyskinesia
            );

            addRating(
                "Dystonia / Cramping",
                entry.dystonia
            );

            addRating(
                "Depression",
                entry.depression
            );

            addRating(
                "Anxiety",
                entry.anxiety
            );
            addRating(
                "Sleep",
                entry.sleep
            );

            addRating(
                "Energy",
                entry.energy
            );


            let symptomText =
                symptoms.length > 0
                    ? symptoms.join("<br>")
                    : "No symptom ratings entered";

        let weatherText = "";

        if (entry.weather) {

            weatherText = `
                <br><br>

                Weather:<br>

                Temperature:
                ${entry.weather.temperatureF} °F<br>

                Humidity:
                ${entry.weather.humidity}%<br>

                Dew Point:
                ${entry.weather.dewPointF} °F<br>

                Surface Pressure:
                ${entry.weather.pressureHpa} hPa
            `;
        }
    div.innerHTML = `

    <strong>
        ${entry.date}
        ${entry.time}
    </strong>

    <br><br>

    ${symptomText}

    <br><br>

    DBS Program:
    ${entry.dbsProgram || "Not entered"}

    DBS Level:
    ${entry.dbsLevel || "Not entered"}

    <br>


    DBS Frequency:
    ${entry.dbsFrequency || "Not entered"}

   DBS dbsPulseWidth:
    ${entry.dbsPulseWidth || "Not entered"}

    Carbidopa Dose:
    ${entry.carbidopaDose  || "Not entered"}

    Ropa Dose:
    ${entry.RopaDose || "Not entered"}  

   DBS dbsPulseWidth:
    ${entry.dbsPulseWidth || "Not entered"}

    ${weatherText}

    ${
        entry.notes
            ? `<br><br>Notes: ${entry.notes}`
            : ""
    }
`;

            entryList.appendChild(div);
        }
        
    );
}


async function saveEntry() {
    alert("Saving Entry");
    let weather = null;

    try {

        const location =
            await getCurrentPosition();


        weather =
            await getWeatherForObservation(
                location.latitude,
                location.longitude,
                entryDate.value,
                entryTime.value
            );

    }
    catch (error) {

        console.log(
            "Weather unavailable:",
            error
        );
    }
    const entry = {

        date:
            entryDate.value,

        time:
            entryTime.value,

        enteredAt:
            new Date().toISOString(),

        overallSymptoms:
            getRating("overallSymptoms"),

        tremor:
            getRating("tremor"),

        stiffness:
            getRating("stiffness"),

        dystonia:
            getRating("dystonia"),

        balance:
            getRating("balance"),

        dyskinesia:
            getRating("dyskinesia"),

        depression:
            getRating("depression"),


        anxiety:
            getRating("anxiety"),

        sleep:
            getRating("sleep"),

        energy:
            getRating("energy"),

        dbsProgram:
            dbsProgram.value,

        dbsLevel:
            dbsLevel.value,

        dbsPulseWidth:
            dbsPulseWidth.value,

        dbsFrequency:
            dbsFrequency.value,

        carbidopaDose:
            carbidopaDose.value,
        RopaDose:
            RopaDose.value,

        notes:
            notes.value.trim(),

        weather:
            weather
    };


    const entries =
        getEntries();


    entries.push(entry);


    saveEntries(entries);


    displayEntries();

    drawSymptomGraph();

    resetSymptomSliders();

    notes.value = "";
    saveButton.disabled = true;

    setCurrentDateTime();
}

entryDate.addEventListener(
    "change",
    function () {
        saveButton.disabled = false;
    }
);

entryTime.addEventListener(
    "change",
    function () {
        saveButton.disabled = false;
    }
);

saveButton.addEventListener(
    "click",
    saveEntry
);

voiceNotesButton.addEventListener(
    "click",
    notesListener
);

function notesListener() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert(
            "Speech recognition is not supported by this browser."
        );
        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang =
        "en-US";

    recognition.interimResults =
        false;

    recognition.continuous =
        false;

    recognition.onresult =
        function (event) {

            const spokenText =
                event.results[0][0].transcript;

            if (notes.value.trim() !== "") {
                notes.value += " ";
            }

            notes.value +=
                spokenText;

            saveButton.disabled =
                false;
        };

    recognition.onerror =
        function (event) {

            console.log(
                "Speech recognition error:",
                event.error
            );
        };

    recognition.start();
}


function getMedicationEvents() {

    const saved =
         localStorage.getItem(
            "parkinsonsMedicationEvents"
        );

    if (!saved) {
        return [];
    }

    return JSON.parse(saved);
}


function saveMedicationEvent(
    medication,
    dose
) {

    const now =
        new Date();

    const event = {
        medication:
            medication,

        dose:
            dose,

        timestamp:
            now.toISOString(),

        date:
            now.toLocaleDateString(),

        time:
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
    };


    const events =
        getMedicationEvents();


    events.push(event);


    localStorage.setItem(
        "parkinsonsMedicationEvents",
        JSON.stringify(events)
    );


    alert(
        `${medication} recorded at ${event.time}`
    );
}


document
    .querySelectorAll(".medButton")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const medication =
                        button.dataset.medication;
                        dose = carbidopaDose.value;
                    saveMedicationEvent(
                        medication,
                        dose
                    );
                }
            );
        }
    );

setCurrentDateTime();

displayEntries();



downloadCSVButton.addEventListener(
    "click",
    downloadCSV
);


const timeline =
    document.getElementById("timeline");

const refreshTimelineButton =
    document.getElementById(
        "refreshTimelineButton"
    );


function buildTimeline() {

    let events = [];


    // --------------------------------
    // Symptom / DBS observations
    // --------------------------------

    const entries =
        getEntries();

    entries.forEach(
        function (entry) {

            const timestamp =
                new Date(
                    `${entry.date}T${entry.time}`
                );

            events.push({

                timestamp:
                    timestamp,

                type:
                    "SYMPTOMS / DBS",

                details:
                    `DBS A Program: ${entry.dbsProgram || "-"}
                     — Level: ${entry.dbsLevel || "-"}`
            });
        }
    );

    // --------------------------------
    // Medication
    // --------------------------------

    const medications =
        getMedicationEvents();

    medications.forEach(
        function (med) {

            events.push({

                timestamp:
                    new Date(
                        med.timestamp
                    ),

                type:
                    "MEDICATION",

                details:
                    `${med.medication} — ${med.dose} mg`
            });
        }
    );


 

    // Newest event first

    events.sort(
        function (a, b) {

            return (
                b.timestamp -
                a.timestamp
            );
        }
    );


    displayTimeline(events);
}
        
    dbsProgram.addEventListener(
        "change",
        function () {
            saveButton.disabled = false;
        }
    );

    notes.addEventListener(
        "input",
        function () {
            saveButton.disabled = false;
        }
    );

    dbsLevel.addEventListener(
        "input",
        function () {
            saveButton.disabled = false;
        }
    );
    
    dbsFrequency.addEventListener(
        "input",
        function () {
            saveButton.disabled = false;
        }
    );

    dbsPulseWidth.addEventListener(
        "input",
        function () {
            saveButton.disabled = false;
        }
    );



function displayTimeline(events) {

    timeline.innerHTML = "";


    if (events.length === 0) {

        timeline.textContent =
            "No events recorded yet.";

        return;
    }


    events.forEach(
        function (event) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "timelineEntry";


            const date =
                event.timestamp;


            div.innerHTML = `

                <div class="timelineTime">

                    ${date.toLocaleDateString()}

                    ${date.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )}

                </div>

                <div class="timelineType">
                    ${event.type}
                </div>

                <div class="timelineDetails">
                    ${event.details}
                </div>
            `;


            timeline.appendChild(
                div
            );
        }
    );
}


refreshTimelineButton.addEventListener(
    "click",
    buildTimeline
);

resetButton.addEventListener(
    "click",
    resetCurrentEntry
);


function resetCurrentEntry() {

    resetSymptomSliders();

    notes.value = "";

    saveButton.disabled = true;

    setCurrentDateTime();
}


const symptomGraph =
    document.getElementById(
        "symptomGraph"
    );

const graphMetric =
    document.getElementById(
        "graphMetric"
    );


function drawSymptomGraph() {

    const ctx =
        symptomGraph.getContext("2d");

    const width =
        symptomGraph.width;

    const height =
        symptomGraph.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const metric =
        graphMetric.value;


    const entries =
        getEntries()
            .filter(
                function (entry) {

                    return (
                        entry[metric] !== undefined &&
                        entry[metric] >= 0
                    );
                }
            );


    if (entries.length === 0) {

        ctx.font =
            "18px Arial";

        ctx.fillText(
            "No data for this measurement",
            100,
            170
        );

        return;
    }


    // Convert date/time into actual Date objects.

    const points =
        entries.map(
            function (entry) {

                return {

                    time:
                        new Date(
                            `${entry.date}T${entry.time}`
                        ),

                    value:
                        entry[metric]
                };
            }
        );


    points.sort(
        function (a, b) {

            return a.time - b.time;
        }
    );


    const left = 50;
    const right = 20;
    const top = 20;
    const bottom = 45;


    const graphWidth =
        width - left - right;

    const graphHeight =
        height - top - bottom;


    // --------------------------------
    // Determine time range
    // --------------------------------

    let minTime =
        points[0].time.getTime();

    let maxTime =
        points[
            points.length - 1
        ].time.getTime();


    // One point needs some width.

    if (minTime === maxTime) {

        minTime -=
            60 * 60 * 1000;

        maxTime +=
            60 * 60 * 1000;
    }


    // --------------------------------
    // Coordinate transformations
    // --------------------------------

    function timeToX(time) {

        return (
            left +

            (
                (
                    time.getTime() -
                    minTime
                )
                /
                (
                    maxTime -
                    minTime
                )
            )

            * graphWidth
        );
    }


    function valueToY(value) {

        return (
            top +

            (
                (10 - value)
                / 10
            )

            * graphHeight
        );
    }


    // --------------------------------
    // Draw Y axis and horizontal grid
    // --------------------------------

    ctx.font =
        "14px Arial";

    ctx.textAlign =
        "right";

    ctx.textBaseline =
        "middle";


    for (
        let value = 0;
        value <= 10;
        value += 2
    ) {

        const y =
            valueToY(value);


        ctx.beginPath();

        ctx.moveTo(
            left,
            y
        );

        ctx.lineTo(
            width - right,
            y
        );

        ctx.strokeStyle =
            "#dddddd";

        ctx.stroke();


        ctx.fillStyle =
            "#333333";

        ctx.fillText(
            value,
            left - 8,
            y
        );
    }


    // --------------------------------
    // Draw symptom line
    // --------------------------------

    ctx.beginPath();

    points.forEach(
        function (point, index) {

            const x =
                timeToX(
                    point.time
                );

            const y =
                valueToY(
                    point.value
                );


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );
            }
            else {

                ctx.lineTo(
                    x,
                    y
                );
            }
        }
    );


    ctx.strokeStyle =
        "#222222";

    ctx.lineWidth =
        3;

    ctx.stroke();


    // --------------------------------
    // Draw individual measurements
    // --------------------------------

    points.forEach(
        function (point) {

            const x =
                timeToX(
                    point.time
                );

            const y =
                valueToY(
                    point.value
                );


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#222222";

            ctx.fill();
        }
    );


    // --------------------------------
    // Beginning and ending times
    // --------------------------------

    ctx.fillStyle =
        "#333333";

    ctx.font =
        "12px Arial";

    ctx.textBaseline =
        "top";


    ctx.textAlign =
        "left";

    ctx.fillText(
        points[0]
            .time
            .toLocaleString(),
        left,
        height - bottom + 12
    );


    ctx.textAlign =
        "right";

    ctx.fillText(
        points[
            points.length - 1
        ]
            .time
            .toLocaleString(),
        width - right,
        height - bottom + 12
    );
}


graphMetric.addEventListener(
    "change",
    drawSymptomGraph
);


drawSymptomGraph();
function getCurrentPosition() {

    return new Promise(
        function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(
                function (position) {

                    resolve({
                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude
                    });
                },

                function (error) {

                    reject(error);
                }
            );
        }
    );
}
async function getWeatherForObservation(
    latitude,
    longitude,
    date,
    time
) {

    const url =
        "https://api.open-meteo.com/v1/forecast" +

        `?latitude=${latitude}` +

        `&longitude=${longitude}` +

        "&hourly=" +
        "temperature_2m," +
        "relative_humidity_2m," +
        "dew_point_2m," +
        "surface_pressure" +

        "&temperature_unit=fahrenheit" +

        "&timezone=auto" +

        `&start_date=${date}` +

        `&end_date=${date}`;


    const response =
        await fetch(url);


    if (!response.ok) {
        throw new Error(
            "Weather request failed"
        );
    }


    const data =
        await response.json();


    const observationTime =
        new Date(
            `${date}T${time}`
        );


    let closestIndex = 0;

    let closestDifference =
        Infinity;


    data.hourly.time.forEach(
        function (weatherTime, index) {

            const t =
                new Date(weatherTime);

            const difference =
                Math.abs(
                    t - observationTime
                );


            if (
                difference <
                closestDifference
            ) {

                closestDifference =
                    difference;

                closestIndex =
                    index;
            }
        }
    );


    return {

        temperatureF:
            data.hourly
                .temperature_2m[
                    closestIndex
                ],

        humidity:
            data.hourly
                .relative_humidity_2m[
                    closestIndex
                ],

        dewPointF:
            data.hourly
                .dew_point_2m[
                    closestIndex
                ],

        pressureHpa:
            data.hourly
                .surface_pressure[
                    closestIndex
                ],

        weatherTime:
            data.hourly
                .time[
                    closestIndex
                ]
    };
}

function main() {

    debugger;

    setCurrentDateTime();       

    displayEntries();
    resetSymptomSliders(); 

    drawSymptomGraph();                         

    buildTimeline();
    restoreDBSSettings();
    restoreDosage();
}     

main();

function downloadCSV() {
    downloadObservationsCSV();
    downloadMedicationCSV()
}

 function downloadObservationsCSV()
 {   
    const entries = getEntries();

    if (entries.length === 0) {
        alert("There are no observations to download.");
        return;
    }

    // Get the column names from the first entry.
const columns = [
    { key: "date",            label: "Date" },
    { key: "time",            label: "Time" },
    { key: "enteredAt",       label: "Entered At" },
    { key: "overallSymptoms", label: "Overall Parkinson's" },
    { key: "tremor",          label: "Tremor" },
    { key: "stiffness",       label: "Stiffness / Rigidity" },
    { key: "dystonia",        label: "Dystonia / Cramping" },
    { key: "balance",         label: "Walking / Balance" },
    { key: "dyskinesia",      label: "Dyskinesia" },
    { key: "depression",      label: "Depression" },
    { key: "anxiety",         label: "Anxiety" },
    { key: "sleep",           label: "Sleep" },
    { key: "energy",          label: "Energy" },
    { key: "dbsProgram",      label: "dbsProgram" },
    { key: "dbsLevel",        label: "dbsLevel" },
    { key: "dbsFrequency",    label: "dbsFrequency" },
    { key: "dbsPulseWidth",   label: "dbsPulseWidth" }
    ];

    const headers =
        Object.keys(entries[0]);

    const rows = [];

    rows.push(
    columns
        .map(column => `"${column.label}"`)
        .join(",")
    );
    entries.forEach(function (entry) {

        const row =
            columns.map(function (column) {

                let value =
                    entry[column.key] ?? "";

                value = String(value)
                    .replace(/"/g, '""');

                return `"${value}"`;
            });

        rows.push(row.join(","));
    });

    const csv =
        rows.join("\n");

    const blob =
        new Blob(
            [csv],
            { type: "text/csv;charset=utf-8;" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "ParkinsonsObservations.csv";

    link.click();

    URL.revokeObjectURL(url);

}

function downloadMedicationCSV() {

    const events =
        getMedicationEvents();

    if (events.length === 0) {
        alert("There are no medication events to download.");
        return;
    }

    const columns = [
        { key: "medication", label: "Medication" },
        { key: "timestamp",  label: "Timestamp" },
        { key: "date",       label: "Date" },
        { key: "time",       label: "Time" }
    ];

    const rows = [];

    // CSV column headings
    rows.push(
        columns
            .map(column => `"${column.label}"`)
            .join(",")
    );

    // Medication records
    events.forEach(function (event) {

        const row =
            columns.map(function (column) {

                let value =
                    event[column.key] ?? "";

                value = String(value)
                    .replace(/"/g, '""');

                return `"${value}"`;
            });

        rows.push(row.join(","));
    });

    // Build the CSV file
    const csv =
        rows.join("\n");

    const blob =
        new Blob(
            [csv],
            { type: "text/csv;charset=utf-8;" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "ParkinsonsMedications.csv";

    link.click();

    URL.revokeObjectURL(url);
}

function downloadBackup() {

    const backup = {
        entries: getEntries(),
        medications: getMedicationEvents()
    };

    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type: "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "ParkLogBackup.json";

    link.click();

    URL.revokeObjectURL(url);
}
if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("./service-worker.js")
        .then(function () {
            console.log(
                "ParkLog service worker registered"
            );
        })
        .catch(function (error) {
            console.error(
                "Service worker registration failed:",
                error
            );
        });
}

function restoreDBSSettings() {

    const entries =
        getEntries();

    for (
        let i = entries.length - 1;
        i >= 0;
        i--
    ) {

        const entry =
            entries[i];

        if (entry.dbsProgram != null) {

            dbsProgram.value =
                entry.dbsProgram;

            dbsLevel.value =
                entry.dbsLevel ?? "";

            dbsFrequency.value =
                entry.dbsFrequency ?? "";

            dbsPulseWidth.value =
                entry.dbsPulseWidth ?? "";

            return;
        }
    }
}

function restoreDosage() {

    const entries =
        getEntries();

    for (
        let i = entries.length - 1;
        i >= 0;
        i--
    ) {

        const entry =
            entries[i];

        if (entry.carbidopaDose != null) {

            carbidopaDose.value =
                entry.carbidopaDose ?? "";

            RopaDose.value =
                entry.RopaDose ?? "";

            return;
        }
    }
}