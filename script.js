let map;
let directionsRenderer;
let directionsService;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
        zoom: 8,
    });
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer.setMap(map);
}

async function calculateMileage() {
    const origin = document.getElementById('origin').value.trim();
    const destinations = document.getElementById('destinations').value.trim().split('\n').map(addr => addr.trim());
    
    if (!origin || destinations.length < 1) {
        alert("Please enter the origin and at least one destination address.");
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

    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            displayResult(result);
            directionsRenderer.setDirections(result);
        } else {
            console.error('Directions request failed due to ' + status);
            alert('Failed to calculate the route. Status: ' + status);
        }
    });
}

function displayResult(result) {
    const route = result.routes[0];
    const totalTime = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 3600; // Convert seconds to hours
    const totalDistance = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000; // Convert meters to kilometers

    document.getElementById('total-time').innerText = `Total Travel Time: ${totalTime.toFixed(2)} hours`;
    document.getElementById('total-distance').innerText = `Total Distance: ${totalDistance.toFixed(2)} km`;
    
    document.getElementById('output').style.display = 'block';
    console.log('Result:', result);
}
