document.addEventListener('DOMContentLoaded', () => {
    const filme = document.querySelectorAll('.liste li');
    const inhaltBox = document.getElementById('inhaltBox');
    const buchenBox = document.getElementById('buchenBox');
    const inhaltTitel = document.getElementById('inhaltTitel');
    const inhaltText = document.getElementById('inhaltText');

    const infoBox = document.getElementById('filmInfoDetails');
    const infoFsk = document.getElementById('infoFsk');
    const infoFormat = document.getElementById('infoFormat');
    const infoPreis = document.getElementById('infoPreis');

    const buchenBtn = document.getElementById('buchenBtn');
    const zurueckBtn = document.getElementById('zurueckBtn');
    const bezahlenBtn = document.getElementById('bezahlenBtn');

    // Buchungs-Elemente
    const preisErwachsene = document.getElementById('preisErwachsene');
    const summeAnzeige = document.getElementById('summeAnzeige');

    const selectVoll  = document.getElementById('anzahlVoll');
    const selectStud  = document.getElementById('anzahlStudent');
    const selectSen   = document.getElementById('anzahlSenior');
    const selectKind  = document.getElementById('anzahlKinder');

    const ermCheck   = document.getElementById('ermCheck');
    const ermBereich = document.getElementById('ermBereich');

    let aktuellerFilm = null;
    let grundpreis = 0;

    const RABATT_STUDENT = 0.20;
    const RABATT_SENIOR  = 0.15;
    const RABATT_KIND    = 0.30;

    function formatEuro(wert) {
        return wert.toFixed(2).replace('.', ',') + ' €';
    }

    function aktualisiereSumme() {
        const voll = parseInt(selectVoll.value) || 0;
        const stud = ermCheck.checked ? (parseInt(selectStud.value) || 0) : 0;
        const sen  = ermCheck.checked ? (parseInt(selectSen.value)  || 0) : 0;
        const kind = ermCheck.checked ? (parseInt(selectKind.value) || 0) : 0;

        let summe = 0;
        summe += voll  * grundpreis;
        summe += stud  * grundpreis * (1 - RABATT_STUDENT);
        summe += sen   * grundpreis * (1 - RABATT_SENIOR);
        summe += kind  * grundpreis * (1 - RABATT_KIND);

        summeAnzeige.textContent = formatEuro(summe);
    }

    // Film anklicken
    filme.forEach(li => {
        li.addEventListener('click', () => {
            filme.forEach(e => e.classList.remove('aktiv'));
            li.classList.add('aktiv');

            aktuellerFilm = li;

            inhaltTitel.textContent = li.dataset.titel;
            inhaltText.textContent  = li.dataset.beschreibung;

            infoFsk.textContent     = li.dataset.fsk;
            infoFormat.textContent  = li.dataset.format;
            infoPreis.textContent   = li.dataset.preis;
            infoBox.style.display   = 'block';

            grundpreis = parseFloat(li.dataset.preis) || 0;
            preisErwachsene.textContent = formatEuro(grundpreis);
            aktualisiereSumme();

            // Inhalt anzeigen, Buchung ausblenden
            buchenBox.classList.add('hidden');
            inhaltBox.classList.remove('hidden');
        });
    });

    // Buchen-Button
    buchenBtn.addEventListener('click', () => {
        if (!aktuellerFilm) {
            alert('Bitte zuerst einen Film auswählen.');
            return;
        }
        inhaltBox.classList.add('hidden');
        buchenBox.classList.remove('hidden');
    });

    // Zurück-Button
    zurueckBtn.addEventListener('click', () => {
        buchenBox.classList.add('hidden');
        inhaltBox.classList.remove('hidden');
    });

    // "Bezahlen" Demo
    bezahlenBtn.addEventListener('click', () => {
        alert('Buchung übernommen.\nSumme: ' + summeAnzeige.textContent);
    });

    // Ermäßigungen ein-/ausblenden
    ermCheck.addEventListener('change', () => {
        const aktiv = ermCheck.checked;
        ermBereich.classList.toggle('hidden', !aktiv);

        if (!aktiv) {
            selectStud.value = '0';
            selectSen.value  = '0';
            selectKind.value = '0';
        }
        aktualisiereSumme();
    });

    [selectVoll, selectStud, selectSen, selectKind].forEach(sel => {
        sel.addEventListener('change', aktualisiereSumme);
    });

    // Startzustand: Inhalt sichtbar, Buchung versteckt
    inhaltBox.classList.remove('hidden');
    buchenBox.classList.add('hidden');
});
