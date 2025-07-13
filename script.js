let daten = [];
let tukBündel = {};

function erfasseDaten() {
  const tuk = parseFloat(document.getElementById("tuk").value);
  const tus = parseFloat(document.getElementById("tus").value);
  const seite = document.getElementById("seite").value;
  const zahl = parseInt(document.getElementById("zahl").value);

  if (isNaN(tuk) || isNaN(tus) || isNaN(zahl)) {
    alert("Bitte alle Felder korrekt ausfüllen.");
    return;
  }

  const normierteTUS = 3.5;
  const restzeit = +(tuk + (normierteTUS - tus)).toFixed(2);

  daten.push({ tuk, tus, seite, zahl, restzeit });

  const tukKey = tuk.toFixed(2);
  if (!tukBündel[tukKey]) tukBündel[tukKey] = { L: [], R: [] };
  tukBündel[tukKey][seite].push(restzeit);

  speichereDaten();
}

function speichereDaten() {
  const csv = daten.map(d => `${d.tuk};${d.tus};${d.seite};${d.zahl};${d.restzeit}`).join("\n");
  const blob = new Blob(["TUK;TUS;Seite;Zahl;Restzeit\n" + csv], { type: "text/csv" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "kalibrierdaten.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Neue Analyse nach jedem Datensatz
  zeigeRestzeitVerteilung();
}

// Funktion: Häufigkeitsverteilung der Restzeiten anzeigen
function zeigeRestzeitVerteilung() {
  for (const tukKey in tukBündel) {
    console.log(`TUK: ${tukKey}`);
    ['L', 'R'].forEach(seite => {
      const werte = tukBündel[tukKey][seite];
      if (werte.length === 0) return;

      const verteilung = {};
      werte.forEach(wert => {
        const key = wert.toFixed(1); // auf 0.1 Sekunden runden
        verteilung[key] = (verteilung[key] || 0) + 1;
      });

      console.log(`  Seite ${seite}:`);
      for (const key in verteilung) {
        console.log(`    Restzeit ${key}s → ${verteilung[key]}x`);
      }
    });
  }
}
