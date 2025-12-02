document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // Basis-Elemente
    // ==========================
    const overlay = document.getElementById("modalOverlay");
    const modalProfile = document.getElementById("modalProfile");
    const modalFilmInfo = document.getElementById("modalFilmInfo");
    const closeProfileBtn = document.getElementById("modalCloseProfile");
    const closeInfoBtn = document.getElementById("modalCloseInfo");
    const backInfoBtn = document.getElementById("FilmInfoBack");
    const saveBtn = document.getElementById("Save");
    const openProfileBtn = document.getElementById("btnändern");
    // Account-Felder
    const spanName = document.getElementById("inhaltBenutzername");
    const spanEmail = document.getElementById("inhaltEmail");
    const spanPass = document.getElementById("inhaltPasswort");
    const inputName = document.getElementById("ModelinhaltBenutzername");
    const inputEmail = document.getElementById("ModelinhaltEmail");
    const inputPass = document.getElementById("ModelinhaltPasswort");
    // Film-/Ticket-Info-Felder
    const inhaltTitel = document.getElementById("Titel");
    const inhaltText = document.getElementById("Beschreibung");
    const infoKategorie = document.getElementById("Kategorie");
    const infoFsk = document.getElementById("FSK");
    const infoFormat = document.getElementById("Format");
    const infoPreis = document.getElementById("Preis");
    const inhaltDate = document.getElementById("Date");
    const inhaltTime = document.getElementById("Time");
    // ==========================
    // Helper
    // ==========================
    function formatEuro(val) {
        const num = isNaN(val) ? 0 : Number(val);
        return num.toFixed(2).replace('.', ',') + " €";
    }
    document.querySelectorAll(".liste li").forEach(li => {
        const titel = li.dataset.titel;
        const date = li.dataset.date;
        const time = li.dataset.time;
        const titleSpan = li.querySelector(".ticket-title");
        const dateSpan = li.querySelector(".ticket-date");
        const timeSpan = li.querySelector(".ticket-time");

        if (titel && titleSpan) {
            titleSpan.textContent = titel;
        }
        if (date && dateSpan) {
            dateSpan.textContent = date;
        }
        if (time && timeSpan) {
            timeSpan.textContent = time;
        }
    });

    function showOverlay() {
        if (!overlay) return;
        overlay.classList.add("active"); // => CSS: display:flex
    }

    function hideOverlay() {
        if (!overlay) return;
        overlay.classList.remove("active");
        if (modalProfile) modalProfile.classList.add("hidden");
        if (modalFilmInfo) modalFilmInfo.classList.add("hidden");
    }
    // ==========================
    // Profil-Modal
    // ==========================
    function openProfileModal() {
        if (!overlay || !modalProfile) return;
        if (spanName && inputName) inputName.value = spanName.textContent.trim();
        if (spanEmail && inputEmail) inputEmail.value = spanEmail.textContent.trim();
        if (inputPass) inputPass.value = "";
        showOverlay();
        modalProfile.classList.remove("hidden");
        if (modalFilmInfo) modalFilmInfo.classList.add("hidden");
    }
    if (openProfileBtn) {
        openProfileBtn.addEventListener("click", openProfileModal);
    }
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            if (spanName && inputName) spanName.textContent = inputName.value;
            if (spanEmail && inputEmail) spanEmail.textContent = inputEmail.value;
            if (spanPass && inputPass && inputPass.value.trim() !== "") {
                spanPass.textContent = "••••••••";
            }
            // TODO: später per fetch() ans Backend schicken
            hideOverlay();
        });
    }
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener("click", hideOverlay);
    }
    // ==========================
    // Film-Info-Modal
    // ==========================
    function openFilmInfoModalFromTicket(li) {
        if (!overlay || !modalFilmInfo || !li) return;
        const titel = li.dataset.titel || "";
        const beschr = li.dataset.beschreibung || "";
        const fsk = li.dataset.fsk || "";
        const format = li.dataset.format || "";
        const kat = li.dataset.kategorie || "";
        const preis = parseFloat(li.dataset.preis || "0");
        const date = li.dataset.date || "";
        const time = li.dataset.time || "";
        if (inhaltTitel) inhaltTitel.textContent = titel;
        if (inhaltText) inhaltText.textContent = beschr;
        if (infoFsk) infoFsk.textContent = fsk;
        if (infoFormat) infoFormat.textContent = format;
        if (infoKategorie) infoKategorie.textContent = kat;
        if (infoPreis) infoPreis.textContent = formatEuro(preis);
        if (inhaltDate) inhaltDate.textContent = date;
        if (inhaltTime) inhaltTime.textContent = time;
        showOverlay();
        modalFilmInfo.classList.remove("hidden");
        if (modalProfile) modalProfile.classList.add("hidden");
    }
    // Alle Info-Buttons über Event-Delegation
    document.addEventListener("click", (e) => {
        const infoBtn = e.target.closest(".ticket-info-btn");
        if (!infoBtn) return;
        const li = infoBtn.closest("li");
        openFilmInfoModalFromTicket(li);
    });
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener("click", hideOverlay);
    }
    if (backInfoBtn) {
        backInfoBtn.addEventListener("click", hideOverlay);
    }
    // ==========================
    // Overlay & ESC
    // ==========================
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                hideOverlay();
            }
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideOverlay();
        }
    });
    // ==========================
    // Ticket stornieren
    // ==========================
    document.addEventListener("click", (e) => {
        const cancelBtn = e.target.closest(".ticket-cancel-btn");
        if (!cancelBtn) return;
        const li = cancelBtn.closest("li");
        const ok = confirm("Ticket wirklich stornieren?");
        if (!ok || !li) return;
        // TODO: später Backend-DELETE
        li.remove();
    });
});