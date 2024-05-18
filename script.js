let map;
let directionsRenderer;
let directionsService;

function logMessage(message) {
    const logDiv = document.getElementById('logs');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logDiv.appendChild(logEntry);
}

function initMap() {
    logMessage("Initializing map...");
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
        zoom: 8,
    });
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer.setMap(map);
    logMessage("Map initialized.");
}

async function calculateMileage() {
    logMessage("Calculating mileage...");
    const origin = document.getElementById('origin').value.trim();
    const destinations = document.getElementById('destinations').value.trim().split('\n').map(addr => addr.trim());

    if (!origin || destinations.length < 1) {
        alert("Please enter the origin and at least one destination address.");
        logMessage("Origin or destinations not provided.");
        return;
    }

    const waypoints = destinations.map(destination => ({
        location: destination,
        stopover: true
    }));

    const request = {
        origin: origin,
        destination: destinations[destinations.length - 1],
        waypoints: waypoints.slice(0, -1),
        travelMode: 'DRIVING',
        optimizeWaypoints: true
    };

    logMessage('Request: ' + JSON.stringify(request)); // Log the request for debugging

    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            logMessage('Directions request successful.');
            displayResult(result);
            directionsRenderer.setDirections(result);
        } else {
            logMessage('Directions request failed due to ' + status);
            alert('Failed to calculate the route. Status: ' + status);
            logMessage('Error details: ' + JSON.stringify(result)); // Log the error details for debugging
        }
    });
}

function displayResult(result) {
    if (!result || !result.routes || result.routes.length === 0) {
        logMessage('No routes found in result: ' + JSON.stringify(result));
        alert('No routes found. Please check your input.');
        return;
    }

    const route = result.routes[0];
    const totalTime = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 3600; // Convert seconds to hours
    const totalDistance = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000; // Convert meters to kilometers

    document.getElementById('total-time').innerText = `Total Travel Time: ${totalTime.toFixed(2)} hours`;
    document.getElementById('total-distance').innerText = `Total Distance: ${totalDistance.toFixed(2)} km`;
    
    document.getElementById('output').style.display = 'block';
    logMessage('Result: ' + JSON.stringify(result));
}
