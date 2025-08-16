// ===== main.js =====

document.addEventListener("DOMContentLoaded", () => {
    const svgContainer = document.getElementById("svgContainer");
    const modal = document.getElementById("roomModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDetails = document.getElementById("modalDetails");
    const closeModal = document.getElementById("closeModal");
    const floorSelect = document.getElementById("floorSelect");
    const searchBar = document.getElementById("searchBar");

    // ===== Load SVG into container =====
    function loadSVG(filePath) {
        fetch(filePath)
            .then(res => res.text())
            .then(svgData => {
                svgContainer.innerHTML = svgData;

                // ✅ FIX: querySelectorAll will now find elements even if <g> or <rect>
                const rooms = svgContainer.querySelectorAll("svg .room");

                rooms.forEach(room => {
                    room.addEventListener("click", () => {
                        openModal(room.id);
                    });
                });
            })
            .catch(err => console.error("Error loading SVG:", err));
    }

    // ===== Open Modal with Room Data =====
    function openModal(roomId) {
        const data = roomData[roomId]; // from roomData.js

        if (data) {
            modalTitle.textContent = `Room ${data.number}`;
            modalDetails.innerHTML = `
                <p><strong>Faculty:</strong> ${data.faculty}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Description:</strong> ${data.description}</p>
            `;
        } else {
            modalTitle.textContent = `Room: ${roomId}`;
            modalDetails.innerHTML = `<p>No data available for this room.</p>`;
        }

        modal.style.display = "block";
    }

    // ===== Modal Close =====
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // ===== Floor Selector =====
    floorSelect.addEventListener("change", function () {
        const floorFile = "svg/" + this.value;
        loadSVG(floorFile);
    });

    // ===== Search Bar =====
    searchBar.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const rooms = svgContainer.querySelectorAll("svg .room");

        rooms.forEach(room => {
            if (room.id.toLowerCase().includes(query)) {
                room.style.fill = "yellow";
            } else {
                room.style.fill = "";
            }
        });
    });
    
    function openModal(roomId) {
        if (!modalTitle || !modalDetails) {
            console.error("Modal elements not found in DOM");
            return;
        }

        const data = roomData[roomId];
        if (data) {
            modalTitle.textContent = `Room ${data.number}`;
            modalDetails.innerHTML = `
                <p><strong>Faculty:</strong> ${data.faculty}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Description:</strong> ${data.description}</p>
            `;
        } else {
            modalTitle.textContent = `Room: ${roomId}`;
            modalDetails.innerHTML = `<p>No data available for this room.</p>`;
        }

        modal.style.display = "block";
    }

    // ===== Initial Load =====
    loadSVG("svg/ground-floor.svg");
});
