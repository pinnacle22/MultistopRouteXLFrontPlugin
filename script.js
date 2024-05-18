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

    const directionsService = new google.maps.DirectionsService();

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
        } else {
            console.error('Directions request failed due to ' + status);
            alert('Failed to calculate the route. Please check the console for more details.');
        }
    });
}

function displayResult(result) {
    const route = result.routes[0];
    const totalTime = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 3600; // Convert seconds to hours
    document.getElementById('result').innerHTML = `<h2>Total Travel Time: ${totalTime.toFixed(2)} hours</h2>`;
}

function initMap() {
    // Initialization code if needed
}
