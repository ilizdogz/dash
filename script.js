// USER DATAFIELDS START
var preload = false;
var shiftindicator = 0.985;
// USER DATAFIELDS END

window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {
    preloadBar();
    preload = true;
}

function preloadBar() {
    var barArray = new Array();

    for (var barnum = 0; barnum < 11; barnum++) {
        barArray[barnum] = new Image(711, 73);
        barArray[barnum].src = "rpm_bar_" + (barnum) + ".png";
    }

    var rpm_images = "";
    for (i = 0; i < barArray.length; i++) {
        rpm_images += "<image id=\"rpm_image_" + (i) + "\" class=\"hidden\" src=\"" + barArray[i].src + "\" />";
    }

    document.getElementById("rpm_bar").innerHTML = rpm_images;
}

// CALLBACK FUNCTIONS START (REQUIRED)
var car;
var maxRpm = 0;
var rpmDisp = 0;

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
        console.log(json);
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

        for (i = 0; i < 11; i++) document.getElementById("rpm_image_" + i).className = "hidden";

        if (rpm_per > 0.0 && rpm_per < 0.15) {
            document.getElementById("rpm_image_1").className = "visible";
        }
        else if (rpm_per >= 0.15 && rpm_per < 0.3) {
            document.getElementById("rpm_image_2").className = "visible";
        }
        else if (rpm_per >= 0.3 && rpm_per < 0.45) {
            document.getElementById("rpm_image_3").className = "visible";
        }
        else if (rpm_per >= 0.45 && rpm_per < 0.6) {
            document.getElementById("rpm_image_4").className = "visible";
        }
        else if (rpm_per >= 0.6 && rpm_per < 0.7) {
            document.getElementById("rpm_image_5").className = "visible";
        }
        else if (rpm_per >= 0.7 && rpm_per < 0.75) {
            document.getElementById("rpm_image_6").className = "visible";
        }
        else if (rpm_per >= 0.75 && rpm_per < 0.85) {
            document.getElementById("rpm_image_7").className = "visible";
        }
        else if (rpm_per >= 0.85 && rpm_per < 0.9) {
            document.getElementById("rpm_image_8").className = "visible";
        }
        else if (rpm_per >= 0.9 && rpm_per < 0.95) {
            document.getElementById("rpm_image_9").className = "visible";
        }
        else if (rpm_per >= 0.95) {
            document.getElementById("rpm_image_10").className = "visible";
        }
        else {
            document.getElementById("rpm_image_0").className = "visible";
        }

        if (shiftindicator <= rpm_per) {
            document.querySelector("#gear").className = "grid-item gear_shift_active";
            document.querySelector("#rpm").className = "grid-item gear_shift_active";
            document.querySelector("#digital_bar").className = "gear_shift_active";
        } else {
            document.querySelector("#gear").className = "grid-item";
            document.querySelector("#digital_bar").className = "bg-normal";
            document.querySelector("#rpm").className = "grid-item";
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