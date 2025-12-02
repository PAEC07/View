document.addEventListener('DOMContentLoaded', () => {
    // DOM-Referenzen
    const movieListEl = document.getElementById('movieList');
    const vorstellungenTbody = document.getElementById('vorstellungenTbody');

    const listenView = document.getElementById('listenView');
    const kalenderView = document.getElementById('kalenderView');
    const btnViewList = document.getElementById('btnViewList');
    const btnViewCalendar = document.getElementById('btnViewCalendar');

    const kalenderBody = document.getElementById('kalenderBody');
    const kalMonatLabel = document.getElementById('kalMonatLabel');
    const kalPrev = document.getElementById('kalPrev');
    const kalNext = document.getElementById('kalNext');

    // Filter / Suche
    const filterFormat = document.getElementById('filterFormat');
    const filterFsk = document.getElementById('filterFsk');
    const filterStil = document.getElementById('filterStil');
    const btnFilterApply = document.getElementById('btnFilterApply');
    const filmSuche = document.getElementById('filmSuche');
    const suchBtn = document.getElementById('suchBtn');

    // Modals
    const modalOverlay = document.getElementById('modalOverlay');
    const modalFilm = document.getElementById('modalFilm');
    const modalVorstellung = document.getElementById('modalVorstellung');

    const btnOpenFilmModal = document.getElementById('btnOpenFilmModal');
    const btnOpenVorstellungModal = document.getElementById('btnOpenVorstellungModal');
    const closeFilmModal = document.getElementById('closeFilmModal');
    const closeVorstellungModal = document.getElementById('closeVorstellungModal');

    // Film-Form
    const filmTitelInput = document.getElementById('filmTitelInput');
    const filmBeschreibungInput = document.getElementById('filmBeschreibungInput');
    const filmFskInput = document.getElementById('filmFskInput');
    const filmFormatInput = document.getElementById('filmFormatInput');
    const filmKategorieInput = document.getElementById('filmKategorieInput');
    const filmPreisInput = document.getElementById('filmPreisInput');
    const filmSaveBtn = document.getElementById('filmSaveBtn');

    // Vorstellung-Form
    const vorstellungFilmSelect = document.getElementById('vorstellungFilmSelect');
    const vorstellungDatumInput = document.getElementById('vorstellungDatumInput');
    const vorstellungZeitInput = document.getElementById('vorstellungZeitInput');
    const vorstellungSaalInput = document.getElementById('vorstellungSaalInput');
    const vorstellungSaveBtn = document.getElementById('vorstellungSaveBtn');

    // Daten (Demo)
    let nextMovieId = 4;
    let nextShowId = 7;

    let movies = [
        {
            id: 1,
            titel: 'Film 1',
            beschreibung: 'Spannender Actionfilm.',
            fsk: '16',
            format: '3D',
            kategorie: 'Action',
            preis: 12.99
        },
        {
            id: 2,
            titel: 'Film 2',
            beschreibung: 'Romantische Komödie.',
            fsk: '12',
            format: '2D',
            kategorie: 'Komödie',
            preis: 9.99
        },
        {
            id: 3,
            titel: 'Film 3',
            beschreibung: 'Science-Fiction Abenteuer.',
            fsk: '6',
            format: '3D',
            kategorie: 'Sci-Fi',
            preis: 14.5
        }
    ];

    let shows = [
        { id: 1, filmId: 1, datum: '2025-11-25', uhrzeit: '18:00', saal: 'Saal 1' },
        { id: 2, filmId: 1, datum: '2025-11-25', uhrzeit: '20:30', saal: 'Saal 1' },
        { id: 3, filmId: 1, datum: '2025-11-26', uhrzeit: '17:45', saal: 'Saal 2' },
        { id: 4, filmId: 2, datum: '2025-11-25', uhrzeit: '19:15', saal: 'Saal 3' },
        { id: 5, filmId: 2, datum: '2025-11-26', uhrzeit: '21:00', saal: 'Saal 3' },
        { id: 6, filmId: 3, datum: '2025-11-26', uhrzeit: '16:00', saal: 'Saal 2' }
    ];

    let currentMovieId = null;

    // ============================
    // Helper
    // ============================
    function openModal(which) {
        modalOverlay.classList.remove('hidden');
        modalFilm.classList.add('hidden');
        modalVorstellung.classList.add('hidden');

        if (which === 'film') {
            modalFilm.classList.remove('hidden');
        } else if (which === 'show') {
            modalVorstellung.classList.remove('hidden');
        }
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        modalFilm.classList.add('hidden');
        modalVorstellung.classList.add('hidden');
    }

    function getMovieById(id) {
        return movies.find(m => m.id === id) || null;
    }

    function formatEuro(wert) {
        const n = isNaN(wert) ? 0 : Number(wert);
        return n.toFixed(2).replace('.', ',') + ' €';
    }

    // ============================
    // Filme rendern / filtern
    // ============================
    function renderMovieList() {
        if (!movieListEl) return;
        movieListEl.innerHTML = '';

        const searchText = (filmSuche?.value || '').toLowerCase().trim();
        const wantFormat = (filterFormat?.value || '').toUpperCase();
        const wantFsk = filterFsk?.value || '';
        const wantStil = (filterStil?.value || '').toLowerCase();

        movies.forEach(movie => {
            let visible = true;

            if (wantFormat && movie.format.toUpperCase() !== wantFormat) visible = false;
            if (wantFsk && movie.fsk !== wantFsk) visible = false;
            if (wantStil && movie.kategorie.toLowerCase() !== wantStil) visible = false;
            if (searchText && !movie.titel.toLowerCase().includes(searchText)) visible = false;

            if (!visible) return;

            const li = document.createElement('li');
            li.classList.add('movie-item');
            li.dataset.movieId = String(movie.id);

            if (movie.id === currentMovieId) {
                li.classList.add('selected');
            }

            const row = document.createElement('div');
            row.classList.add('movie-row');

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('movie-info');

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('movie-title');
            titleDiv.textContent = movie.titel;

            const metaDiv = document.createElement('div');
            metaDiv.classList.add('movie-meta');
            metaDiv.innerHTML =
                `FSK: ${movie.fsk} • Format: ${movie.format} • Kategorie: ${movie.kategorie} • ${formatEuro(movie.preis)}`;

            infoDiv.appendChild(titleDiv);
            infoDiv.appendChild(metaDiv);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Löschen';

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMovie(movie.id);
            });

            row.appendChild(infoDiv);
            row.appendChild(deleteBtn);

            li.appendChild(row);

            li.addEventListener('click', () => {
                selectMovie(movie.id);
            });

            movieListEl.appendChild(li);
        });
    }

    function selectMovie(movieId) {
        currentMovieId = movieId;
        renderMovieList();
        renderShowList();
        renderCalendar();
    }

    function deleteMovie(movieId) {
        const movie = getMovieById(movieId);
        if (!movie) return;

        if (!confirm(`Film "${movie.titel}" und alle zugehörigen Vorstellungen wirklich löschen?`)) {
            return;
        }

        movies = movies.filter(m => m.id !== movieId);
        shows = shows.filter(s => s.filmId !== movieId);

        if (currentMovieId === movieId) {
            currentMovieId = null;
        }

        renderMovieList();
        renderShowList();
        renderCalendar();
        fillVorstellungFilmSelect();
    }

    // ============================
    // Vorstellungen rendern
    // ============================
    function renderShowList() {
        if (!vorstellungenTbody) return;
        vorstellungenTbody.innerHTML = '';

        let filteredShows = shows;
        if (currentMovieId != null) {
            filteredShows = shows.filter(s => s.filmId === currentMovieId);
        }

        if (!filteredShows.length) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 5;
            td.textContent = 'Keine Vorstellungen vorhanden.';
            tr.appendChild(td);
            vorstellungenTbody.appendChild(tr);
            return;
        }

        filteredShows
            .sort((a, b) => a.datum.localeCompare(b.datum) || a.uhrzeit.localeCompare(b.uhrzeit))
            .forEach(show => {
                const movie = getMovieById(show.filmId);
                const tr = document.createElement('tr');

                const tdDatum = document.createElement('td');
                const tdFilm = document.createElement('td');
                const tdZeit = document.createElement('td');
                const tdSaal = document.createElement('td');
                const tdAktion = document.createElement('td');

                tdDatum.textContent = show.datum;
                tdFilm.textContent = movie ? movie.titel : 'Unbekannt';
                tdZeit.textContent = show.uhrzeit;
                tdSaal.textContent = show.saal;

                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.textContent = 'Löschen';
                deleteBtn.addEventListener('click', () => {
                    deleteShow(show.id);
                });

                tdAktion.appendChild(deleteBtn);

                tr.appendChild(tdDatum);
                tr.appendChild(tdFilm);
                tr.appendChild(tdZeit);
                tr.appendChild(tdSaal);
                tr.appendChild(tdAktion);

                vorstellungenTbody.appendChild(tr);
            });
    }

    function deleteShow(showId) {
        const show = shows.find(s => s.id === showId);
        if (!show) return;

        const movie = getMovieById(show.filmId);
        const filmTitel = movie ? movie.titel : 'Unbekannt';

        if (!confirm(`Vorstellung von "${filmTitel}" am ${show.datum} um ${show.uhrzeit} löschen?`)) {
            return;
        }

        shows = shows.filter(s => s.id !== showId);
        renderShowList();
        renderCalendar();
    }

    // ============================
    // Kalender
    // ============================
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function getMonatsName(monthIndex) {
        const namen = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        return namen[monthIndex] || '';
    }

    function renderCalendar() {
        if (!kalenderBody || !kalMonatLabel) return;

        kalenderBody.innerHTML = '';
        kalMonatLabel.textContent = `${getMonatsName(currentMonth)} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startWochentag = (firstDay.getDay() + 6) % 7;
        const tageImMonat = lastDay.getDate();

        let relevantShows = shows;
        if (currentMovieId != null) {
            relevantShows = shows.filter(s => s.filmId === currentMovieId);
        }

        const mapDatumZuShows = {};
        relevantShows.forEach(show => {
            if (!mapDatumZuShows[show.datum]) {
                mapDatumZuShows[show.datum] = [];
            }
            mapDatumZuShows[show.datum].push(show);
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

                    const dateStr =
                        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const showsForDate = mapDatumZuShows[dateStr] || [];

                    showsForDate.forEach(show => {
                        const movie = getMovieById(show.filmId);
                        const ev = document.createElement('span');
                        ev.classList.add('kal-event');
                        ev.textContent =
                            `${show.uhrzeit} • ${show.saal} • ${(movie && movie.titel) || 'Unbekannt'}`;
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
            renderCalendar();
        });
    }

    if (kalNext) {
        kalNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // ============================
    // Ansicht umschalten
    // ============================
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

    btnViewList?.addEventListener('click', () => setView('list'));
    btnViewCalendar?.addEventListener('click', () => setView('calendar'));

    // ============================
    // Modals / Form-Handling
    // ============================
    btnOpenFilmModal?.addEventListener('click', () => {
        // Felder leeren
        filmTitelInput.value = '';
        filmBeschreibungInput.value = '';
        filmFskInput.value = '';
        filmFormatInput.value = '';
        filmKategorieInput.value = '';
        filmPreisInput.value = '';
        openModal('film');
    });

    btnOpenVorstellungModal?.addEventListener('click', () => {
        fillVorstellungFilmSelect();
        vorstellungDatumInput.value = '';
        vorstellungZeitInput.value = '';
        vorstellungSaalInput.value = '';
        openModal('show');
    });

    closeFilmModal?.addEventListener('click', closeModal);
    closeVorstellungModal?.addEventListener('click', closeModal);

    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    filmSaveBtn?.addEventListener('click', () => {
        const titel = filmTitelInput.value.trim();
        const beschr = filmBeschreibungInput.value.trim();
        const fsk = filmFskInput.value;
        const format = filmFormatInput.value;
        const kat = filmKategorieInput.value.trim() || 'Allgemein';
        const preis = parseFloat(filmPreisInput.value.replace(',', '.'));

        if (!titel || !fsk || !format || isNaN(preis)) {
            alert('Bitte mindestens Titel, FSK, Format und Preis korrekt ausfüllen.');
            return;
        }

        const newMovie = {
            id: nextMovieId++,
            titel,
            beschreibung: beschr,
            fsk,
            format,
            kategorie: kat,
            preis
        };

        movies.push(newMovie);
        closeModal();
        renderMovieList();
        fillVorstellungFilmSelect();
    });

    function fillVorstellungFilmSelect() {
        if (!vorstellungFilmSelect) return;
        vorstellungFilmSelect.innerHTML = '';

        if (!movies.length) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'Keine Filme vorhanden';
            vorstellungFilmSelect.appendChild(opt);
            vorstellungFilmSelect.disabled = true;
            return;
        }

        vorstellungFilmSelect.disabled = false;

        movies.forEach(movie => {
            const opt = document.createElement('option');
            opt.value = String(movie.id);
            opt.textContent = movie.titel;
            if (movie.id === currentMovieId) {
                opt.selected = true;
            }
            vorstellungFilmSelect.appendChild(opt);
        });
    }

    vorstellungSaveBtn?.addEventListener('click', () => {
        const filmIdStr = vorstellungFilmSelect.value;
        const datum = vorstellungDatumInput.value;
        const zeit = vorstellungZeitInput.value;
        const saal = vorstellungSaalInput.value.trim();

        const filmId = parseInt(filmIdStr, 10);
        const movie = getMovieById(filmId);

        if (!movie || !datum || !zeit || !saal) {
            alert('Bitte Film, Datum, Uhrzeit und Saal ausfüllen.');
            return;
        }

        const newShow = {
            id: nextShowId++,
            filmId,
            datum,
            uhrzeit: zeit,
            saal
        };

        shows.push(newShow);
        closeModal();
        renderShowList();
        renderCalendar();
    });

    // ============================
    // Filter / Suche
    // ============================
    function applyFilter() {
        renderMovieList();
    }

    btnFilterApply?.addEventListener('click', applyFilter);

    suchBtn?.addEventListener('click', applyFilter);

    filmSuche?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            applyFilter();
        }
    });

    // ============================
    // Initial
    // ============================
    setView('list');
    renderMovieList();
    renderShowList();
    renderCalendar();
    fillVorstellungFilmSelect();
});
