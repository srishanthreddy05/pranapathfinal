// Import Firebase and configuration
import { db, ref, set, onValue } from './assets/js/firebase-config.js';

function sendRequest() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userName = localStorage.getItem("userName");
                const userNumber = localStorage.getItem("userNumber");
                const userBloodGroup = localStorage.getItem("userBloodGroup");

                if (!userName || !userNumber || !userBloodGroup) {
                    alert("User details not found. Please log in again.");
                    return;
                }

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                set(ref(db, 'requests/' + userNumber), {
                    name: userName,
                    number: userNumber,
                    bloodGroup: userBloodGroup,
                    latitude: latitude,
                    longitude: longitude,
                    status: "pending"
                }).then(() => {
                    alert("Ambulance request sent successfully!");
                }).catch((error) => {
                    alert("Error sending request: " + error.message);
                });
            },
            (error) => {
                alert("Geolocation error: " + error.message);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


// 🚦 Driver Functionality 🚦
function loadRequests() {
    const requestsRef = ref(db, 'requests/');
    onValue(requestsRef, (snapshot) => {
        const requestsDiv = document.getElementById('requests');
        requestsDiv.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const request = childSnapshot.val();
            const requestElement = document.createElement('div');
            requestElement.innerHTML = `
                <div class="request-card">
                    <p>Name: ${request.name}</p>
                    <p>Number: ${request.number}</p>
                    <p>Blood Group: ${request.bloodGroup}</p>
                    <p>Location: ${request.latitude}, ${request.longitude}</p>
                    <button onclick="acceptRequest('${childSnapshot.key}')">Accept</button>
                    <button onclick="declineRequest('${childSnapshot.key}')">Decline</button>
                </div>
            `;
            requestsDiv.appendChild(requestElement);
        });
    });
}

window.acceptRequest = function(requestId) {
    const requestRef = ref(db, 'requests/' + requestId + '/status');
    set(requestRef, "accepted");
    alert("Request accepted. Notifying the user...");
};

window.declineRequest = function(requestId) {
    const requestRef = ref(db, 'requests/' + requestId + '/status');
    set(requestRef, "declined");
    alert("Request declined.");
};

// 🚓 Traffic Police Functionality 🚓
function loadAlerts() {
    const requestsRef = ref(db, 'requests/');
    onValue(requestsRef, (snapshot) => {
        const alertsDiv = document.getElementById('alerts');
        alertsDiv.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const request = childSnapshot.val();
            if (request.status === "accepted") {
                const alertElement = document.createElement('div');
                alertElement.innerHTML = `
                    <div class="alert-card">
                        <p>Ambulance Enroute to: ${request.latitude}, ${request.longitude}</p>
                        <p>Patient: ${request.name}, Blood Group: ${request.bloodGroup}</p>
                    </div>
                `;
                alertsDiv.appendChild(alertElement);
            }
        });
    });
}

function storeUserData() {
    const userName = document.getElementById("userName").value.trim();
    const userNumber = document.getElementById("userNumber").value.trim();
    const userBloodGroup = document.getElementById("userBloodGroup").value.trim();

    if (!userName || !userNumber || !userBloodGroup) {
        alert("Please fill in all fields before proceeding.");
        return;
    }

    localStorage.setItem("userName", userName);
    localStorage.setItem("userNumber", userNumber);
    localStorage.setItem("userBloodGroup", userBloodGroup);

    window.location.href = "user.html";
}

function storeDriverData() {
    const driverName = document.getElementById("driverName").value.trim();
    const driverNumber = document.getElementById("driverNumber").value.trim();
    const driverID = document.getElementById("driverID").value.trim();

    if (!driverName || !driverNumber || !driverID) {
        alert("Please fill in all fields before proceeding.");
        return;
    }

    localStorage.setItem("driverName", driverName);
    localStorage.setItem("driverNumber", driverNumber);
    localStorage.setItem("driverID", driverID);

    window.location.href = "driver.html";
}


// 🚨 Police Interface Initialization 🚨
window.onload = function() {
    const page = window.location.pathname;

    if (page.includes('user-booking.html')) {
        console.log("User page loaded");
    } else if (page.includes('driver-requests.html')) {
        loadRequests();
    } else if (page.includes('police.html')) {
        loadAlerts();
    }
};

// Expose functions to the global scope
window.sendRequest = sendRequest;
window.storeUserData = storeUserData;
window.storeDriverData = storeDriverData;
