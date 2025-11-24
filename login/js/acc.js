document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // MODAL ELEMENTE
    // ==========================
    const openBtn = document.getElementById("btnändern");
    const overlay = document.getElementById("modalOverlay");
    const closeBtn = document.getElementById("modalClose");
    const saveBtn = document.getElementById("Save");

    const spanName = document.getElementById("inhaltBenutzername");
    const spanEmail = document.getElementById("inhaltEmail");
    const spanPass = document.getElementById("inhaltPasswort");

    const inputName = document.getElementById("ModelinhaltBenutzername");
    const inputEmail = document.getElementById("ModelinhaltEmail");
    const inputPass = document.getElementById("ModelinhaltPasswort");

    function openModal() {
        if (!overlay) return;

        // aktuelle Werte in Inputs übernehmen
        if (spanName && inputName) inputName.value = spanName.textContent.trim();
        if (spanEmail && inputEmail) inputEmail.value = spanEmail.textContent.trim();
        if (inputPass) inputPass.value = "";

        overlay.classList.add("active");
    }

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove("active");
    }

    // Öffnen über "Ändern"
    if (openBtn) {
        openBtn.addEventListener("click", openModal);
    }

    // Schließen über X
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Schließen über Klick neben dem Modal
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // Schließen über ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    // Speichern: hier später Spring Boot call, jetzt nur UI-Update
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            if (spanName && inputName) spanName.textContent = inputName.value;
            if (spanEmail && inputEmail) spanEmail.textContent = inputEmail.value;

            // Passwort nur als •••• anzeigen, nicht im Klartext
            if (spanPass && inputPass && inputPass.value.trim() !== "") {
                spanPass.textContent = "••••••••";
            }

            // TODO: Hier später per fetch() an dein Spring-Boot-Backend schicken

            closeModal();
        });
    }

    // ==========================
    // TICKET STORNIEREN (optional)
    // ==========================

    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("ticket-cancel-btn")) return;

        const li = e.target.closest("li");
        const ticketId = li?.dataset.ticketId;

        const ok = confirm("Ticket wirklich stornieren?");
        if (!ok || !li) return;

        // TODO: Hier Spring-Boot-DELETE-Aufruf einbauen, z.B.:
        // fetch(`/api/tickets/${ticketId}`, { method: "DELETE" })

        // Für jetzt: nur aus der Liste entfernen
        li.remove();
    });
});
