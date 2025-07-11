let logDiv = document.getElementById("log");
let messdaten = [];
let startzeitTUK = null;
let startzeitTUS = null;
let audioMap = {
    pip: "sounds/pip.wav",
    tukdone: "sounds/tuk_done.wav",
    tusdone: "sounds/tus_done.wav",
    saved: "sounds/saved.wav",
};

function playSound(name) {
    const audio = new Audio(audioMap[name]);
    audio.play();
}

function log(text) {
    const p = document.createElement("p");
    p.textContent = text;
    logDiv.appendChild(p);
    console.log(text);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "s") {
        // TUK-Messung
        if (startzeitTUK === null) {
            startzeitTUK = Date.now();
            log("TUK gestartet");
            playSound("pip");
        } else {
            let dauer = (Date.now() - startzeitTUK) / 1000;
            startzeitTUK = Date.now(); // für nächste Runde
            messdaten.push({ typ: "TUK", sekunden: dauer.toFixed(2) });
            log(`TUK: ${dauer.toFixed(2)} s`);
            playSound("pip");

            if (messdaten.filter(e => e.typ === "TUK").length === 6) {
                log("TUK-Messung abgeschlossen");
                playSound("tukdone");
                startzeitTUK = null;
            }
        }
    }

    if (event.key === "a") {
        // TUS-Messung
        if (startzeitTUS === null) {
            startzeitTUS = Date.now();
            log("TUS gestartet");
            playSound("pip");
        } else {
            let dauer = (Date.now() - startzeitTUS) / 1000;
            startzeitTUS = null;
            let wert = dauer < 2.5 ? dauer * 2 : dauer;
            messdaten.push({ typ: "TUS", sekunden: wert.toFixed(2) });
            log(`TUS: ${wert.toFixed(2)} s`);
            playSound("tusdone");
        }
    }

    if (event.key === "z") {
        // Speichern
        if (messdaten.length > 0) {
            log("Messdaten gespeichert");
            playSound("saved");
        } else {
            log("Keine Daten zum Speichern");
        }
    }
});

function exportCSV() {
    if (messdaten.length === 0) {
        alert("Keine Daten zum Exportieren.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Typ;Sekunden\n";
    messdaten.forEach(e => {
        csvContent += `${e.typ};${e.sekunden}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "messdaten.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}