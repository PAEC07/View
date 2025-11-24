document.addEventListener('DOMContentLoaded', () => {
   const filme        = document.querySelectorAll('.liste li');
   const inhaltBox    = document.getElementById('inhaltBox');
   const buchenBox    = document.getElementById('buchenBox');
   const inhaltTitel  = document.getElementById('inhaltTitel');
   const inhaltText   = document.getElementById('inhaltText');
   const buchen       = document.getElementById('buchen');           // Container für den Buchen-Button
   const detailsWrapper = document.getElementById('detailsWrapper');
 

   // Wenn du testen willst, dass der Buchen-Bereich erscheint: hier true setzen
   let loginStatus = false;

   const inhaltfilm   = document.getElementById('Deails');           // check Schreibweise im HTML!
   const infoBox      = document.getElementById('filmInfoDetails');
   const infoFsk      = document.getElementById('infoFsk');
   const infoFormat   = document.getElementById('infoFormat');
   const infoPreis    = document.getElementById('infoPreis');

   const buchenBtn    = document.getElementById('buchenBtn');
   const zurueckBtn   = document.getElementById('zurueckBtn');
   const bezahlenBtn  = document.getElementById('bezahlenBtn');

   // Buchungs-Elemente
   const preisErwachsene = document.getElementById('preisErwachsene');
   const summeAnzeige    = document.getElementById('summeAnzeige');

   const selectVoll  = document.getElementById('anzahlVoll');
   const selectStud  = document.getElementById('anzahlStudent');
   const selectSen   = document.getElementById('anzahlSenior');
   const selectKind  = document.getElementById('anzahlKinder');

   const ermCheck    = document.getElementById('ermCheck');
   const ermBereich  = document.getElementById('ermBereich');

   let aktuellerFilm = null;
   let grundpreis    = 0;

   const RABATT_STUDENT = 0.20;
   const RABATT_SENIOR  = 0.15;
   const RABATT_KIND    = 0.30;

   function formatEuro(wert) {
       if (isNaN(wert)) {
           wert = 0;
       }
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
           // Auswahl markieren
           filme.forEach(e => e.classList.remove('aktiv'));
           li.classList.add('aktiv');
           aktuellerFilm = li;

           // Texte setzen
           inhaltTitel.textContent = li.dataset.titel || '';
           inhaltText.textContent  = li.dataset.beschreibung || '';
           infoFsk.textContent     = li.dataset.fsk || '';
           infoFormat.textContent  = li.dataset.format || '';
           infoPreis.textContent   = formatEuro(parseFloat(li.dataset.preis) || 0);

           // Info-Box/Details anzeigen
           if (detailsWrapper) {
               detailsWrapper.classList.remove('hidden');
           }
           if (infoBox) {
               infoBox.classList.remove('hidden');
           }

           // Nur wenn eingeloggt: Buchen-Bereich (mit Button) anzeigen
           if (loginStatus && buchen) {
               buchen.classList.remove('hidden');
           } else if (buchen) {
               buchen.classList.add('hidden');
           }

           // Buchung aus, Inhalt an
           buchenBox.classList.add('hidden');
           inhaltBox.classList.remove('hidden');

           // Summe neu berechnen
           grundpreis = parseFloat(li.dataset.preis) || 0;
           preisErwachsene.textContent = formatEuro(grundpreis);
           aktualisiereSumme();
       });
   });

   // Buchen-Button (wechsel auf Buchungsansicht)
   if (buchenBtn) {
       buchenBtn.addEventListener('click', () => {
           if (!aktuellerFilm) {
               alert('Bitte zuerst einen Film auswählen.');
               return;
           }
           inhaltBox.classList.add('hidden');
           buchenBox.classList.remove('hidden');
           if (inhaltfilm) {
               inhaltfilm.classList.add('hidden');
           }
       });
   }

   // Zurück-Button
   if (zurueckBtn) {
       zurueckBtn.addEventListener('click', () => {
           buchenBox.classList.add('hidden');
           inhaltBox.classList.remove('hidden');
           if (inhaltfilm) {
               inhaltfilm.classList.remove('hidden');
           }
       });
   }

   // "Bezahlen" Demo
   if (bezahlenBtn) {
       bezahlenBtn.addEventListener('click', () => {
           alert('Buchung übernommen.\nSumme: ' + summeAnzeige.textContent);
       });
   }

   // Ermäßigungen ein-/ausblenden
   if (ermCheck) {
       ermCheck.addEventListener('change', () => {
           const aktiv = ermCheck.checked;
           if (ermBereich) {
               ermBereich.classList.toggle('hidden', !aktiv);
           }

           if (!aktiv) {
               selectStud.value = '0';
               selectSen.value  = '0';
               selectKind.value = '0';
           }
           aktualisiereSumme();
       });
   }

   [selectVoll, selectStud, selectSen, selectKind].forEach(sel => {
       if (sel) {
           sel.addEventListener('change', aktualisiereSumme);
       }
   });

   // Startzustand
   inhaltBox.classList.remove('hidden');         // rechte Box sichtbar
   if (inhaltfilm) {
       inhaltfilm.classList.add('hidden');       // dein Extra-Block erstmal aus
   }
   buchenBox.classList.add('hidden');           // Buchungsbereich aus
   if (buchen) {
       buchen.classList.add('hidden');           // Buchen-Bereich (Button) aus
   }
   if (detailsWrapper) {
       detailsWrapper.classList.add('hidden');   // Detail-Elemente erst nach Klick
   }
   
   var btndelete = document.getElementByID("delete");

    function deleteAccount() {
        alert('Wollen sie dieses Konto wirklich löschen?\nEine Wiederherstellung ist nicht möglich.');
    }
   
});


