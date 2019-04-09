// USER DATAFIELDS START
var preload = false;
var shiftindicator = 0.985;
// USER DATAFIELDS END

window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {
    // preloadBar();
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

// function is called for JSON-Response with JSONType 1, 2 and 3
function updateType1(json) {
    // USER CODE START
    var gear = json.Gear;
    if (gear == 0) gear = 'N';
    else if (gear == -1) gear = 'R';

    if (preload) {

        var rpm_per = json.RPM / MAXRPM;
        document.querySelector("div#speed p").innerHTML = json.Speed;
        document.getElementById("div#gear p").innerHTML = gear;

        document.getElementById("digital_bar").style.width = (rpm_per * 100) + "%";

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
            document.querySelector("#gear").className = "gear_shift_active";
        } 
        else document.getElementById("#gear").className = "";
    }

    // USER CODE END

    window.setTimeout(sendRequest, updateRate);
}

// function is called for JSON-Response with JSONType 2 and 3
function updateType2(json) {
    // USER CODE START
    document.querySelector("div#lap p").innerHTML = Laps;
    document.querySelector("div#prev p").innerHTML = SecondsToTimeString(Last);
    document.querySelector("div#best p").innerHTML = SecondsToTimeString(Best);
    // USER CODE END	
}

// function is called for JSON-Response with JSONType 3
function updateType3(json) {
    // USER CODE START
    //if(!preload) preloadBar();
    //document.getElementById("speed_label").innerHTML = Speedunit == 0 ? 'KPH' : 'MPH';
    shiftindicator = ShiftIndicator / 100;
    // USER CODE END
}

// CALLBACK FUNCTIONS END

// USER FUNCTIONS START

// USER FUNCTIONS END