// USER DATAFIELDS START
var preload = false;
var shiftindicator = 0.985;
// USER DATAFIELDS END

window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {
    preload = true;
}

// CALLBACK FUNCTIONS START (REQUIRED)
var car;
var maxRpm = 0;
var rpmDisp = 0;
var pace = new Array;

// function is called for JSON-Response with JSONType 1, 2 and 3
function updateType1(json) {
    // USER CODE START
    var gear = json.Gear;
    if (gear == 0) gear = 'N';
    else if (gear == -1) gear = 'R';

    if (preload) {

        if (json.RPM > maxRpm) {
            maxRpm = json.RPM;
        }
        // console.log(json);
        var rpm_per = json.RPM / maxRpm;
        if (json.RPM / 1000 > rpmDisp) {
            rpmDisp = (json.RPM / 1000);
            updateRpmBar();
        }
        document.querySelector("div#speed p").textContent = json.Speed;
        document.querySelector("div#gear p").textContent = gear;
        document.querySelector("div#current p").textContent = SecondsToTimeString(json.Current);
        document.querySelector("div#diff p").textContent = SecondsToGapTimeString(json.DeltaBest);
        if (json.DeltaBest > 0) {
            document.querySelector("div#diff p").style.color = "red";
        } else if (json.DeltaBest < 0) {
            document.querySelector("div#diff p").style.color = "green";
        } else {
            document.querySelector("div#diff p").style.color = "white";
        }
        document.querySelector("div#turbo p").textContent = json.Turbo.toFixed(3);
        document.querySelector("div#rpm p").textContent = json.RPM;
        document.querySelector("div#tcs p").textContent = (json.TC * 100).toFixed(0) + "%";
        document.querySelector("div#abs p").textContent = (json.ABS * 100).toFixed(0) + "%";
        document.querySelector("div#kers p").textContent = (json.KERSAmount * 100).toFixed(0) + "%";

        document.getElementById("digital_bar").style.width = ((json.RPM / (Math.ceil(rpmDisp) * 1000)) * 100) + "%";

        if (shiftindicator <= rpm_per) {
            document.querySelector("#gear").className = "grid-item gear_shift_active";
            document.querySelector("#rpm").className = "grid-item gear_shift_active";
            document.querySelector("#digital_bar").className = "gear_shift_active";
        } else {
            document.querySelector("#gear").className = "grid-item";
            document.querySelector("#digital_bar").className = "bg-normal";
            if (rpm_per >= 80) {
                document.querySelectory("#rpm").className = "grid-item yellow";
            } else {
                document.querySelector("#rpm").className = "grid-item";
            }
        }
    }

    // USER CODE END

    window.setTimeout(sendRequest, updateRate);
}

// function is called for JSON-Response with JSONType 2 and 3
function updateType2(json) {
    // USER CODE START
    document.querySelector("div#lap p").textContent = Laps;
    document.querySelector("div#prev p").textContent = SecondsToTimeString(Last);
    document.querySelector("div#best p").textContent = SecondsToTimeString(Best);
    document.querySelector("div#fuel p").textContent = json.Fuel.toFixed(2);
    document.querySelector("div#tire-prs p").textContent = json.TyrePress[0].FL + " " + json.TyrePress[0].FR + "\r\n" + json.TyrePress[0].RL + " " + json.TyrePress[0].RR;
    document.querySelector("div#tire-temp p").textContent = json.TyreTemp[0].middle + " " + json.TyreTemp[1].middle + "\r\n" + json.TyreTemp[2].middle + " " + json.TyreTemp[3].middle;
    document.querySelector("div#tire-wear p").textContent = json.TyreWear[0].FL.toFixed(0) + "% " + json.TyreWear[0].FR.toFixed(0) + "%\r\n" + json.TyreWear[0].RL.toFixed(0) + "% " + json.TyreWear[0].RR.toFixed(0) + "%";
    if (!pace.includes(json.Last) && json.Last != 0) {
        if (pace.length < 4) {
            pace.push(json.Last);
        } else {
            pace.shift();
            pace.push(json.Last)
        }
        var avg = 0;
        for (var i = 0; i < pace.length; i++) {
            avg += pace[i];
        }
        avg /= pace.length;
        document.querySelector("div#pace p").textContent = SecondsToTimeString(avg);
    }
    // USER CODE END	
}

// function is called for JSON-Response with JSONType 3
function updateType3(json) {
    // USER CODE START
    //if(!preload) preloadBar();
    //document.getElementById("speed_label").innerHTML = Speedunit == 0 ? 'KPH' : 'MPH';
    shiftindicator = ShiftIndicator / 100;
    if (json.Car != car) {
        car = json.Car;
        maxRpm = 0;
        rpmDisp = 0;
        pace = new Array;
    }
    
    // USER CODE END
}

updateRpmBar = () => {
    var node = document.querySelector("div#digital_rpm_bar");
    var dupNode = document.querySelector("div#digital_rpm_bar").cloneNode(false);
    if (node) {
        node.parentNode.replaceChild(dupNode,node);
    }
    for (var i = 0; i < rpmDisp; i++) {
        var bar = document.createElement("div");
        bar.className = "rpm-disp"
        var p = document.createElement("p");
        p.className = "rpm-num";
        p.textContent = i;
        bar.appendChild(p);
        dupNode.appendChild(bar);
    }
}

// CALLBACK FUNCTIONS END

// USER FUNCTIONS START

// USER FUNCTIONS END