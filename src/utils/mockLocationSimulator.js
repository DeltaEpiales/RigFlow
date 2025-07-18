import { getDistanceInMeters } from './helpers';

const UPDATE_INTERVAL = 5000; // 5 seconds

let intervalId = null;

const moveTowards = (current, target, speed) => {
    if (!current || !target) return current;
    const dist = getDistanceInMeters(current.lat, current.lon, target.lat, target.lon);
    if (dist < speed) return target; // Arrived

    const bearing = Math.atan2(target.lon - current.lon, target.lat - current.lat);
    const stepLat = speed * Math.cos(bearing) / 111111; // Approx meters to degrees
    const stepLon = speed * Math.sin(bearing) / (111111 * Math.cos(current.lat * Math.PI / 180));

    return { lat: current.lat + stepLat, lon: current.lon + stepLon };
};

export const startLocationSimulation = (appContext) => {
    if (intervalId) return; // Already running

    console.log("Starting technician location simulation...");

    intervalId = setInterval(() => {
        const { users, jobs, technicianLocations, _updateTechnicianLocation } = appContext;
        if (!users || !jobs || !technicianLocations || !_updateTechnicianLocation) return;

        const technicians = users.filter(u => (u.role === 'technician' || u.role === 'vendor') && u.location);

        technicians.forEach(tech => {
            let currentLocation = technicianLocations[tech.id]?.current || tech.location;
            let status = 'Idle';
            let targetLocation = null;

            const assignedJob = jobs.find(j => j.assignedTo.includes(tech.id) && ['Dispatched', 'En Route', 'In Progress'].includes(j.status));

            if (assignedJob) {
                targetLocation = assignedJob.location;
                const distanceToJob = getDistanceInMeters(currentLocation.lat, currentLocation.lon, targetLocation.lat, targetLocation.lon);

                if (assignedJob.status === 'Dispatched' || assignedJob.status === 'En Route') {
                     if (distanceToJob > assignedJob.geoFence.radius) {
                        status = 'En Route';
                        currentLocation = moveTowards(currentLocation, targetLocation, 25); // Simulate driving at ~25m/s
                    } else {
                        status = 'On Site';
                    }
                } else if (assignedJob.status === 'In Progress') {
                    status = 'On Site';
                     // Simulate small movements within the job site
                    currentLocation = {
                        lat: currentLocation.lat + (Math.random() - 0.5) * 0.0002,
                        lon: currentLocation.lon + (Math.random() - 0.5) * 0.0002,
                    };
                }
            } else {
                // If no job, drift slowly or stay put
                currentLocation = {
                    lat: currentLocation.lat + (Math.random() - 0.5) * 0.0001,
                    lon: currentLocation.lon + (Math.random() - 0.5) * 0.0001,
                };
            }

            _updateTechnicianLocation(tech.id, currentLocation, status);
        });

    }, UPDATE_INTERVAL);
};

export const stopLocationSimulation = () => {
    if (intervalId) {
        console.log("Stopping technician location simulation.");
        clearInterval(intervalId);
        intervalId = null;
    }
};