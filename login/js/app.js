document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------
    // GRUND-ELEMENTE
    // ----------------------------
    const filme = document.querySelectorAll('.liste li');
    const inhaltBox = document.getElementById('inhaltBox');
    const buchenBox = document.getElementById('buchenBox');
    const inhaltTitel = document.getElementById('inhaltTitel');
    const inhaltText = document.getElementById('inhaltText');
    const buchenContainer = document.getElementById('buchen');
    const detailsWrapper = document.getElementById('detailsWrapper');

    const infoFsk = document.getElementById('infoFsk');
    const infoFormat = document.getElementById('infoFormat');
    const infoKategorie = document.getElementById('infoKategorie');
    const infoPreis = document.getElementById('infoPreis');

    const vorstellungenTbody = document.getElementById('vorstellungenTbody');

    // Toggle / Ansichten
    const btnViewList = document.getElementById('btnViewList');
    const btnViewCalendar = document.getElementById('btnViewCalendar');
    const listenView = document.getElementById('listenView');
    const kalenderView = document.getElementById('kalenderView');

    // Kalender
    const kalMonatLabel = document.getElementById('kalMonatLabel');
    const kalPrev = document.getElementById('kalPrev');
    const kalNext = document.getElementById('kalNext');
    const kalenderBody = document.getElementById('kalenderBody');

    // Buchung
    const buchenBtn = document.getElementById('buchenBtn');
    const zurueckBtn = document.getElementById('zurueckBtn');
    const bezahlenBtn = document.getElementById('bezahlenBtn');

    const preisErwachsene = document.getElementById('preisErwachsene');
    const summeAnzeige = document.getElementById('summeAnzeige');

    // Sitzplatzauswahl
    const sitzContainer = document.getElementById('sitzContainer');
    const ausgewaehlteSitzeTxt = document.getElementById('ausgewaehlteSitze');
    const ticketsTbody = document.getElementById('ticketsTbody');

    // Filter & Suche
    const filterFormat = document.getElementById('filterFormat');
    const filterFsk = document.getElementById('filterFsk');
    const filterBereich = document.getElementById('filterBereich');
    const filterStil = document.getElementById('filterStil');
    const filterDatum = document.getElementById('FilterDatum');
    const btnFilterApply = document.getElementById('btnFilterApply');
    const suchInput = document.getElementById('filmSuche');
    const suchBtn = document.getElementById('suchBtn');

    // Info im Buchungsfenster zur gewählten Vorstellung
    const buchungVorstellungInfo = document.getElementById('buchungVorstellungInfo');

    // Für Demo: Nutzer ist eingeloggt
    let loginStatus = true;

    // Aktueller Film / Preis
    let aktuellerFilm = null;
    let grundpreis = 0;

    // Ausgewählte Vorstellung (muss gewählt werden, bevor gebucht wird)
    let ausgewaehlteVorstellung = null;

    // ----------------------------
    // VORSTELLUNGSDATEN (DEMO)
    // ----------------------------
    const vorstellungsDaten = {
        "Film 1": [
            { datum: "2025-11-25", uhrzeit: "18:00", saal: "Saal 1" },
            { datum: "2025-11-25", uhrzeit: "20:30", saal: "Saal 1" },
            { datum: "2025-11-26", uhrzeit: "17:45", saal: "Saal 2" }
        ],
        "Film 2": [
            { datum: "2025-11-25", uhrzeit: "19:15", saal: "Saal 3" },
            { datum: "2025-11-26", uhrzeit: "21:00", saal: "Saal 3" }
        ],
        "Film 3": [
            { datum: "2025-11-26", uhrzeit: "16:00", saal: "Saal 2" },
            { datum: "2025-11-27", uhrzeit: "20:00", saal: "Saal 1" }
        ]
    };

    // ----------------------------
    // HILFSFUNKTIONEN
    // ----------------------------
    function formatEuro(wert) {
        if (isNaN(wert)) wert = 0;
        return wert.toFixed(2).replace('.', ',') + ' €';
    }

    // ----------------------------
    // VORSTELLUNG AUSWÄHLEN
    // ----------------------------
    function selectVorstellung(filmTitel, v, trElement) {
        // alle anderen Markierungen entfernen
        const alleZeilen = vorstellungenTbody.querySelectorAll('tr');
        alleZeilen.forEach(row => row.classList.remove('selected-show'));

        // diese Zeile markieren
        trElement.classList.add('selected-show');

        // Daten merken
        ausgewaehlteVorstellung = {
            film: filmTitel,
            datum: v.datum,
            uhrzeit: v.uhrzeit,
            saal: v.saal
        };

        // Buchungsinfo-Text vorab updaten (für später)
        if (buchungVorstellungInfo) {
            buchungVorstellungInfo.textContent =
                `Ausgewählte Vorstellung: ${ausgewaehlteVorstellung.film} – ` +
                `${ausgewaehlteVorstellung.datum}, ` +
                `${ausgewaehlteVorstellung.uhrzeit} Uhr, ` +
                `${ausgewaehlteVorstellung.saal}`;
        }

        // Buchen-Button aktivieren (wenn Film & Login passen)
        if (buchenContainer && buchenBtn && loginStatus) {
            buchenContainer.classList.remove('hidden');
            buchenBtn.disabled = false;
        }
    }

    // ----------------------------
    // VORSTELLUNGSLISTE
    // ----------------------------
    function fuelleVorstellungenListe(filmTitel) {
        if (!vorstellungenTbody) return;
        vorstellungenTbody.innerHTML = '';
        ausgewaehlteVorstellung = null; // neue Filmauswahl -> alte Vorstellung reset

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
            const tdZeit = document.createElement('td');
            const tdSaal = document.createElement('td');

            tdDatum.textContent = v.datum;
            tdZeit.textContent = v.uhrzeit;
            tdSaal.textContent = v.saal;

            tr.appendChild(tdDatum);
            tr.appendChild(tdZeit);
            tr.appendChild(tdSaal);

            // Vorstellung auswählbar machen
            tr.addEventListener('click', () => selectVorstellung(filmTitel, v, tr));

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
        const startWochentag = (firstDay.getDay() + 6) % 7;
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

                if (zeile === 0 && wochentag < startWochentag || aktuellerTag > tageImMonat) {
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
                        ev.textContent = `${show.uhrzeit} • ${show.saal}`;
                        td.appendChild(ev);
                    });

                    aktuellerTag++;
                }

                tr.appendChild(td);
            }
            kalenderBody.appendChild(tr);
        }
    }

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
    // ANSICHT: LISTE / KALENDER
    // ----------------------------
    function setView(mode) {
        if (!listenView || !kalenderView || !btnViewList || !btnViewCalendar) return;

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
        }
    }

    if (btnViewList) {
        btnViewList.addEventListener('click', () => setView('list'));
    }
    if (btnViewCalendar) {
        btnViewCalendar.addEventListener('click', () => {
            setView('calendar');
            if (aktuellerFilm) baueKalender(aktuellerFilm);
        });
    }

    // ----------------------------
    // SITZPLÄTZE & TICKETS
    // ----------------------------
    const SITZPLAN_KONFIG = [
        { reihe: 'A', anzahl: 10, seatType: 'standard', bereich: 'Parkett' },
        { reihe: 'B', anzahl: 10, seatType: 'standard', bereich: 'Parkett' },
        { reihe: 'C', anzahl: 10, seatType: 'standard', bereich: 'Parkett' },
        { reihe: 'D', anzahl: 8, seatType: 'premium', bereich: 'Loge' },
        { reihe: 'E', anzahl: 8, seatType: 'premium', bereich: 'Loge' }
    ];

    let ausgewaehlteSitze = []; // { id, seatType, bereich, personType }

    function aktualisiereSitzAnzeige() {
        if (!ausgewaehlteSitzeTxt) return;
        if (!ausgewaehlteSitze.length) {
            ausgewaehlteSitzeTxt.textContent = 'keine';
        } else {
            ausgewaehlteSitzeTxt.textContent = ausgewaehlteSitze
                .map(s => `${s.id} (${s.bereich})`)
                .join(', ');
        }
    }

    function berechnePreisFuerTicket(sitz) {
        if (!grundpreis) return 0;
        let faktor = 1;

        switch (sitz.personType) {
            case 'student':
                faktor = 0.8;
                break;
            case 'senior':
                faktor = 0.85;
                break;
            case 'kind':
                faktor = 0.7;
                break;
            default:
                faktor = 1;
        }

        if (sitz.seatType === 'premium') {
            return grundpreis * faktor + 2;
        }

        return grundpreis * faktor;
    }

    function baueTicketsTabelle() {
        if (!ticketsTbody) return;
        ticketsTbody.innerHTML = '';

        if (!ausgewaehlteSitze.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4;
            td.textContent = 'Keine Plätze ausgewählt.';
            tr.appendChild(td);
            ticketsTbody.appendChild(tr);
            return;
        }

        ausgewaehlteSitze.forEach((sitz) => {
            const tr = document.createElement('tr');

            const tdPlatz = document.createElement('td');
            const tdBereich = document.createElement('td');
            const tdType = document.createElement('td');
            const tdPreis = document.createElement('td');

            tdPlatz.textContent = sitz.id;
            tdBereich.textContent = sitz.bereich;

            const select = document.createElement('select');
            select.innerHTML = `
                <option value="erwachsene">Erwachsener</option>
                <option value="student">Student (-20%)</option>
                <option value="senior">Senior (-15%)</option>
                <option value="kind">Kind (-30%)</option>
            `;
            select.value = sitz.personType || 'erwachsene';
            select.addEventListener('change', () => {
                sitz.personType = select.value;
                berechneSumme();
                baueTicketsTabelle();
            });

            tdType.appendChild(select);
            tdPreis.textContent = formatEuro(berechnePreisFuerTicket(sitz));

            tr.appendChild(tdPlatz);
            tr.appendChild(tdBereich);
            tr.appendChild(tdType);
            tr.appendChild(tdPreis);

            ticketsTbody.appendChild(tr);
        });
    }

    function toggleSitz(seatEl) {
        const id = seatEl.dataset.id;
        const seatTyp = seatEl.dataset.seatType;
        const bereich = seatEl.dataset.bereich;

        const index = ausgewaehlteSitze.findIndex(s => s.id === id);
        if (index >= 0) {
            ausgewaehlteSitze.splice(index, 1);
            seatEl.classList.remove('gewaehlt');
        } else {
            ausgewaehlteSitze.push({
                id,
                seatType: seatTyp,
                bereich,
                personType: 'erwachsene'
            });
            seatEl.classList.add('gewaehlt');
        }

        aktualisiereSitzAnzeige();
        baueTicketsTabelle();
        berechneSumme();
    }

    function baueSitzplan() {
        if (!sitzContainer) return;
        sitzContainer.innerHTML = '';
        ausgewaehlteSitze = [];

        SITZPLAN_KONFIG.forEach(reiheInfo => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('sitzreihe');

            const label = document.createElement('span');
            label.classList.add('sitzreihe-label');
            label.textContent = reiheInfo.reihe;
            rowDiv.appendChild(label);

            for (let i = 1; i <= reiheInfo.anzahl; i++) {
                const seat = document.createElement('button');
                seat.type = 'button';
                seat.classList.add('sitz', reiheInfo.seatType);
                const id = `${reiheInfo.reihe}${i}`;
                seat.dataset.id = id;
                seat.dataset.seatType = reiheInfo.seatType;
                seat.dataset.bereich = reiheInfo.bereich;
                seat.textContent = i;

                if (Math.random() < 0.07) {
                    seat.classList.add('belegt');
                    seat.disabled = true;
                } else {
                    seat.addEventListener('click', () => toggleSitz(seat));
                }

                rowDiv.appendChild(seat);
            }

            sitzContainer.appendChild(rowDiv);
        });

        aktualisiereSitzAnzeige();
        baueTicketsTabelle();
        berechneSumme();
    }

    // ----------------------------
    // BUCHUNGS-SUMME
    // ----------------------------
    function berechneSumme() {
        let summe = 0;

        ausgewaehlteSitze.forEach(sitz => {
            summe += berechnePreisFuerTicket(sitz);
        });

        if (summeAnzeige) {
            summeAnzeige.textContent = formatEuro(summe);
        }
        if (preisErwachsene) {
            preisErwachsene.textContent = formatEuro(grundpreis);
        }
    }

    // ----------------------------
    // FILM-KLICK
    // ----------------------------
    filme.forEach(li => {
        li.addEventListener('click', () => {
            filme.forEach(f => f.classList.remove('aktiv'));
            li.classList.add('aktiv');

            const titel = li.dataset.titel || li.textContent.trim();
            const beschr = li.dataset.beschreibung || '';
            const fsk = li.dataset.fsk || '';
            const format = li.dataset.format || '';
            const kat = li.dataset.kategorie || '';
            const preis = parseFloat(li.dataset.preis || '0');

            aktuellerFilm = titel;
            grundpreis = preis || 0;

            if (inhaltTitel) inhaltTitel.textContent = titel;
            if (inhaltText) inhaltText.textContent = beschr;
            if (infoFsk) infoFsk.textContent = fsk;
            if (infoFormat) infoFormat.textContent = format;
            if (infoKategorie) infoKategorie.textContent = kat;
            if (infoPreis) infoPreis.textContent = formatEuro(grundpreis);

            if (detailsWrapper) {
                detailsWrapper.classList.remove('hidden');
            }

            fuelleVorstellungenListe(titel);

            if (!kalenderView.classList.contains('hidden')) {
                baueKalender(titel);
            }

            baueSitzplan();
            berechneSumme();

            // Buchungsbutton erst wieder deaktivieren,
            // bis eine Vorstellung ausgewählt wurde
            if (buchenContainer && buchenBtn) {
                buchenContainer.classList.remove('hidden'); // sichtbar lassen
                buchenBtn.disabled = true;
            }
        });
    });

    // ----------------------------
    // SUCHE & FILTER AUF FILMLISTE
    // ----------------------------
    function filmHasVorstellungForDate(titel, datumStr) {
        const eintraege = vorstellungsDaten[titel] || [];
        return eintraege.some(v => v.datum === datumStr);
    }

    function filterAndSearchFilms() {
        const wantFormat = (filterFormat?.value || '').toUpperCase();
        const wantFsk = filterFsk?.value || '';
        const wantBereich = filterBereich?.value || '';
        const wantStil = filterStil?.value || '';
        const wantDate = filterDatum?.value || '';
        const searchText = (suchInput?.value || '').trim().toLowerCase();

        filme.forEach(li => {
            const titelRaw = li.dataset.titel || li.textContent.trim() || '';
            const titel = titelRaw.toLowerCase();
            const format = (li.dataset.format || '').toUpperCase();
            const fsk = li.dataset.fsk || '';
            const bereich = li.dataset.bereich || '';
            const stil = li.dataset.kategorie || '';

            let visible = true;

            if (wantFormat && format !== wantFormat) visible = false;
            if (wantFsk && fsk !== wantFsk) visible = false;
            if (wantBereich && bereich !== wantBereich) visible = false;
            if (wantStil && stil !== wantStil) visible = false;

            if (wantDate && !filmHasVorstellungForDate(titelRaw, wantDate)) {
                visible = false;
            }

            if (searchText && !titel.includes(searchText)) visible = false;

            li.style.display = visible ? '' : 'none';
        });
    }

    if (btnFilterApply) {
        btnFilterApply.addEventListener('click', filterAndSearchFilms);
    }
    if (suchBtn) {
        suchBtn.addEventListener('click', filterAndSearchFilms);
    }
    if (suchInput) {
        suchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterAndSearchFilms();
            }
        });
    }

    // ----------------------------
    // BUCHEN / ZURÜCK / BEZAHLEN
    // ----------------------------
    if (buchenBtn && buchenBox && inhaltBox) {
        buchenBtn.addEventListener('click', () => {
            // Sicherheitscheck: Vorstellung muss ausgewählt sein
            if (!ausgewaehlteVorstellung) {
                alert('Bitte zuerst eine Vorstellung auswählen.');
                return;
            }

            // Info im Buchungsfenster sicher aktualisieren
            if (buchungVorstellungInfo && ausgewaehlteVorstellung) {
                buchungVorstellungInfo.textContent =
                    `Ausgewählte Vorstellung: ${ausgewaehlteVorstellung.film} – ` +
                    `${ausgewaehlteVorstellung.datum}, ` +
                    `${ausgewaehlteVorstellung.uhrzeit} Uhr, ` +
                    `${ausgewaehlteVorstellung.saal}`;
            }

            inhaltBox.classList.add('hidden');
            buchenBox.classList.remove('hidden');
        });
    }

    if (zurueckBtn && buchenBox && inhaltBox) {
        zurueckBtn.addEventListener('click', () => {
            buchenBox.classList.add('hidden');
            inhaltBox.classList.remove('hidden');
        });
    }

    if (bezahlenBtn) {
        bezahlenBtn.addEventListener('click', () => {
            const summe = summeAnzeige ? summeAnzeige.textContent : "0,00 €";
            const sitzText = ausgewaehlteSitze.length ?
                ausgewaehlteSitze.map(s => `${s.id} (${s.personType || 'Erwachsene/r'})`).join(', ') :
                'keine Sitzplätze ausgewählt';

            const vorstellungText = ausgewaehlteVorstellung
                ? `${ausgewaehlteVorstellung.film} – ${ausgewaehlteVorstellung.datum}, ${ausgewaehlteVorstellung.uhrzeit} Uhr, ${ausgewaehlteVorstellung.saal}`
                : 'keine Vorstellung gewählt';

            alert(
                'Buchung übernommen.\n' +
                'Vorstellung: ' + vorstellungText + '\n' +
                'Summe: ' + summe + '\n' +
                'Plätze: ' + sitzText
            );
        });
    }

    // ----------------------------
    // INITIAL
    // ----------------------------
    if (detailsWrapper) {
        detailsWrapper.classList.add('hidden');
    }
    if (buchenContainer && buchenBtn) {
        buchenContainer.classList.add('hidden');
        buchenBtn.disabled = true;
    }

    setView('list');
    baueSitzplan();
    berechneSumme();
});
q