async function calculateMileage() {
    const origin = document.getElementById('origin').value.trim();
    const destinations = document.getElementById('destinations').value.trim().split('\n').map(addr => addr.trim());
    
    if (!origin || destinations.length < 1) {
        alert("Please enter the origin and at least one destination address.");
        return;
    }

    const addresses = [origin, ...destinations];
    const data = {
        locations: addresses.map(address => ({ address }))
    };

    try {
        const response = await fetch('https://api.routexl.com/tour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('PinnacleRouting:Pinteam500k!') // Replace with your RouteXL credentials
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        displayResult(result);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        alert('Failed to calculate the route. Please check the console for more details.');
    }
}

function displayResult(result) {
    if (result.route && result.route.summary) {
        const totalDistance = result.route.summary.totalDistance;
        document.getElementById('result').innerHTML = `<h2>Total Distance: ${totalDistance} km</h2>`;
    } else {
        document.getElementById('result').innerHTML = `<h2>Unable to calculate distance. Please check your input.</h2>`;
    }
}
