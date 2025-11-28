document.addEventListener('DOMContentLoaded', () => {
    // DOM-Referenzen
    const vorstellungenTbody = document.getElementById('vorstellungenTbody');

    const listenView = document.getElementById('listenView');
    const kalenderView = document.getElementById('kalenderView');

    const btnViewList = document.getElementById('btnViewList');
    const btnViewCalendar = document.getElementById('btnViewCalendar');

    const kalenderBody = document.getElementById('kalenderBody');
    const kalMonatLabel = document.getElementById('kalMonatLabel');
    const kalPrev = document.getElementById('kalPrev');
    const kalNext = document.getElementById('kalNext');

    const movieItems = document.querySelectorAll('.movie-list .movie-item');

    //FFilm hinzufügen
    const listTitel = document.getElementById("listTitel");
    const listBeschreibung = document.getElementById("listBeschreibung");
    const listFsk = document.getElementById("listFsk");
    const listKategorie = document.getElementById("listKategorie");
    const listPreis = document.getElementById("listPreis");

    const modelTitel = document.getElementById("modelTitel");
    const modelBeschreibung = document.getElemntById("mdoelBeschreibung");
    const modelFsk = document.getElemntById("modelFsk");
    const modelKategorie = document.getElemntById("modelKategorie");
    const modelPreis = document.getElemntById("modelPreis");


    // aktuell ausgewählter Film
    let aktuellerFilm = null;

    // Beispiel-Struktur für Vorstellungsdaten
    // Du kannst das später aus deinem Backend füllen
    const vorstellungsDaten = {
        "Kampf der Titanen": [
            { datum: "2025-11-27", titel: "Kampf der Titanen", uhrzeit: "20:00", saal: "Saal 1" },
            { datum: "2025-11-28", titel: "Kampf der Titanen", uhrzeit: "18:30", saal: "Saal 2" }
        ]

    };

    // ----------------------------
    // LISTENANSICHT FÜLLEN
    // ----------------------------
    function fuelleVorstellungenListe(filmTitel) {
        if (!vorstellungenTbody) return;
        vorstellungenTbody.innerHTML = '';

        const eintraege = vorstellungsDaten[filmTitel] || [];
        if (!eintraege.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.textContent = "Keine Vorstellungen hinterlegt.";
            tr.appendChild(td);
            vorstellungenTbody.appendChild(tr);
            return;
        }

        eintraege.forEach(v => {
            const tr = document.createElement('tr');
            const tdDatum = document.createElement('td');
            const tdFilm = document.createElement('td');
            const tdZeit = document.createElement('td');
            const tdSaal = document.createElement('td');

            tdDatum.textContent = v.datum;
            tdFilm.textContent = v.titel;
            tdZeit.textContent = v.uhrzeit;
            tdSaal.textContent = v.saal;

            tr.appendChild(tdDatum);
            tr.appendChild(tdFilm);
            tr.appendChild(tdZeit);
            tr.appendChild(tdSaal);
            vorstellungenTbody.appendChild(tr);
        });
    }

    // ----------------------------
    // KALENDER
    // ----------------------------
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function getMonatsName(monthIndex) {
        const namen = [
            "Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        return namen[monthIndex] || "";
    }

    function baueKalender(filmTitel) {
        if (!kalenderBody || !kalMonatLabel) return;

        kalenderBody.innerHTML = '';
        kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startWochentag = (firstDay.getDay() + 6) % 7; // Montag = 0
        const tageImMonat = lastDay.getDate();

        const eintraege = vorstellungsDaten[filmTitel] || [];
        const mapDatumZuShows = {};
        eintraege.forEach(v => {
            if (!mapDatumZuShows[v.datum]) {
                mapDatumZuShows[v.datum] = [];
            }
            mapDatumZuShows[v.datum].push(v);
        });

        let aktuellerTag = 1;
        for (let zeile = 0; zeile < 6; zeile++) {
            const tr = document.createElement('tr');

            for (let wochentag = 0; wochentag < 7; wochentag++) {
                const td = document.createElement('td');

                if ((zeile === 0 && wochentag < startWochentag) || aktuellerTag > tageImMonat) {
                    td.classList.add('kalender-empty');
                } else {
                    const day = aktuellerTag;
                    const daySpan = document.createElement('span');
                    daySpan.classList.add('tag-nr');
                    daySpan.textContent = day;
                    td.appendChild(daySpan);

                    const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const showsForDate = mapDatumZuShows[dateStr] || [];

                    showsForDate.forEach(show => {
                        const ev = document.createElement('span');
                        ev.classList.add('kal-event');
                        ev.textContent = `${show.uhrzeit} • ${show.saal}  • ${show.titel}`;
                        td.appendChild(ev);
                    });

                    aktuellerTag++;
                }

                tr.appendChild(td);
            }
            kalenderBody.appendChild(tr);
        }
    }

    // Kalender-Navigation
    if (kalPrev) {
        kalPrev.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            if (aktuellerFilm) baueKalender(aktuellerFilm);
        });
    }

    if (kalNext) {
        kalNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            if (aktuellerFilm) baueKalender(aktuellerFilm);
        });
    }

    // ----------------------------
    // ANSICHT UMSCHALTEN
    // ----------------------------
    function setView(mode) {
        if (!listenView || !kalenderView) return;

        if (mode === 'list') {
            listenView.classList.remove('hidden');
            kalenderView.classList.add('hidden');
            btnViewList.classList.add('active-view');
            btnViewCalendar.classList.remove('active-view');
        } else {
            listenView.classList.add('hidden');
            kalenderView.classList.remove('hidden');
            btnViewList.classList.remove('active-view');
            btnViewCalendar.classList.add('active-view');

            if (aktuellerFilm) {
                baueKalender(aktuellerFilm);
            }
        }
    }

    if (btnViewList) {
        btnViewList.addEventListener('click', () => setView('list'));
    }
    if (btnViewCalendar) {
        btnViewCalendar.addEventListener('click', () => setView('calendar'));
    }

    // ----------------------------
    // FILM-KLICK HANDLING
    // ----------------------------
    movieItems.forEach(item => {
        item.addEventListener('click', () => {
            // Titel aus data-Attribut lesen
            aktuellerFilm = item.dataset.titel;
            fuelleVorstellungenListe(aktuellerFilm);

            // Wenn gerade Kalender sichtbar ist, auch aktualisieren
            if (!kalenderView.classList.contains('hidden')) {
                baueKalender(aktuellerFilm);
            }
        });
    });

    // Optional: ersten Film direkt auswählen
    const firstMovie = movieItems[0];
    if (firstMovie) {
        firstMovie.click();
    }

    function openProfileModal() {
        if (!overlay || !modalProfile) return;



    }
    if (openProfileBtn) {
        openProfileBtn.addEventListener("click", openProfileModal);
    }
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {

                //Daten ans Backend geben

            }
            // TODO: später per fetch() ans Backend schicken
            hideOverlay();
        });
}
if (closeProfileBtn) {
    closeProfileBtn.addEventListener("click", hideOverlay);
}
});