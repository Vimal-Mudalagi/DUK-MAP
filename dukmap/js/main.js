document.addEventListener("DOMContentLoaded", () => {
    const svgContainer = document.getElementById("svgContainer");
    const svgWrapper = document.getElementById("svgWrapper");
    const modal = document.getElementById("roomModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDetails = document.getElementById("modalDetails");
    const closeModal = document.getElementById("closeModal");
    const floorSelect = document.getElementById("floorSelect");
    const searchBar = document.getElementById("searchBar");

    let zoomLevel = 1;
    let panX = 0, panY = 0;
    let isPanning = false;
    let startX, startY;

    // Load SVG 
    function loadSVG(filePath) {
        fetch("svg/" + filePath)
            .then(res => res.text())
            .then(svgData => {
                svgContainer.innerHTML = svgData;

                const svg = svgContainer.querySelector("svg");
                svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;

                // Room click logic
                const rooms = svg.querySelectorAll(".room");
                rooms.forEach(room => {
                    room.addEventListener("click", () => {
                        openModal(room.id);
                    });
                });

                //  Enable Zooming 
                svgWrapper.addEventListener("wheel", (e) => {
                    e.preventDefault();
                    if (e.deltaY < 0) zoomLevel *= 1.1;
                    else zoomLevel /= 1.1;
                    zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 5); // clamp between 0.5x and 5x
                    svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
                });

                //  Enable Panning (dragging) 
                svgWrapper.addEventListener("mousedown", (e) => {
                    isPanning = true;
                    startX = e.clientX - panX;
                    startY = e.clientY - panY;
                });

                svgWrapper.addEventListener("mousemove", (e) => {
                    if (!isPanning) return;
                    panX = e.clientX - startX;
                    panY = e.clientY - startY;
                    svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
                });

                svgWrapper.addEventListener("mouseup", () => isPanning = false);
                svgWrapper.addEventListener("mouseleave", () => isPanning = false);

                //  Mobile pinch zoom support 
                let lastDistance = null;
                svgWrapper.addEventListener("touchmove", (e) => {
                    if (e.touches.length === 2) {
                        const dx = e.touches[0].clientX - e.touches[1].clientX;
                        const dy = e.touches[0].clientY - e.touches[1].clientY;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (lastDistance) {
                            if (distance > lastDistance) zoomLevel *= 1.05;
                            else zoomLevel /= 1.05;
                            zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 5);
                            svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
                        }
                        lastDistance = distance;
                    }
                });

                svgWrapper.addEventListener("touchend", () => lastDistance = null);
            })
            .catch(err => console.error("Error loading SVG:", err));
    }

    //  Modal logic
    function openModal(roomId) {
        const data = roomData[roomId];
        if (data) {
            modalTitle.textContent = `Room ${data.number}`;
            modalDetails.innerHTML = `
            <p><strong>professor:</strong> ${data.professor}</p>
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

    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

    floorSelect.addEventListener("change", function () {
        loadSVG(this.value);
    });

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
    //  Search Bar 
    searchBar.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const rooms = svgContainer.querySelectorAll(".room");

        rooms.forEach(room => {
            if (room.id.toLowerCase().includes(query) && query !== "") {
                room.classList.add("pulse");
                // Removing pulse after animation ends
                setTimeout(() => room.classList.remove("pulse"), 2000);
            } else {
                room.classList.remove("pulse");
            }
        });
    });

    // Initial load
    loadSVG("ground-floor.svg");
});
