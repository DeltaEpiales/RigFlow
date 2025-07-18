import { useEffect, useContext, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { getDistanceInMeters } from '../utils/helpers';
import { sendPunchToPaylocity } from './PaylocityService';

// This is a "headless" component that runs in the background to monitor geofence events.
const GeofenceAutomation = () => {
    const context = useContext(AppContext);
    const { user, technicianLocations, jobs, hazardZones, assets, showNotification, updateSubmission } = context;
    const internalState = useRef({}).current;

    useEffect(() => {
        if (!user || (user.role !== 'technician' && user.role !== 'vendor')) {
            return;
        }

        const checkGeofences = () => {
            const techLocation = technicianLocations[user.id]?.current;
            if (!techLocation) return;

            // 1. Automated Time & Attendance
            const assignedJob = jobs.find(j => j.assignedTo.includes(user.id) && ['En Route', 'In Progress', 'Dispatched'].includes(j.status));
            if (assignedJob) {
                const distanceToJob = getDistanceInMeters(techLocation.lat, techLocation.lon, assignedJob.location.lat, assignedJob.location.lon);
                const isInside = distanceToJob <= assignedJob.geoFence.radius;
                const wasInside = internalState.wasInsideJobGeofence;

                if (isInside && !wasInside) {
                    showNotification(`Clocked In: Welcome to ${assignedJob.name}.`, 'success');
                    sendPunchToPaylocity(user.id, { action: 'clockIn', jobId: assignedJob.id, timestamp: new Date() });
                    if(assignedJob.status !== 'In Progress') {
                       updateSubmission('jobs', assignedJob.id, { status: 'In Progress' });
                    }
                } else if (!isInside && wasInside) {
                    showNotification(`Clocked Out: You have left ${assignedJob.name}.`, 'info');
                     sendPunchToPaylocity(user.id, { action: 'clockOut', jobId: assignedJob.id, timestamp: new Date() });
                     if(assignedJob.status === 'In Progress') {
                        updateSubmission('jobs', assignedJob.id, { status: 'En Route' });
                     }
                }
                internalState.wasInsideJobGeofence = isInside;
            } else {
                 internalState.wasInsideJobGeofence = false;
            }

            // 2. Restricted Area Alerts
            hazardZones.forEach(zone => {
                const distanceToZone = getDistanceInMeters(techLocation.lat, techLocation.lon, zone.geofence.lat, zone.geofence.lon);
                 const isInsideZone = distanceToZone <= zone.geofence.radius;
                 const wasInsideZone = internalState.wasInsideHazardZone?.[zone.id];

                 if(isInsideZone && !wasInsideZone) {
                    showNotification(`DANGER: You have entered a restricted area: ${zone.name}.`, 'danger', 10000);
                 }
                 if(!internalState.wasInsideHazardZone) internalState.wasInsideHazardZone = {};
                 internalState.wasInsideHazardZone[zone.id] = isInsideZone;
            });

            // 3. Asset Security
            const yard = assets.find(a => a.type === 'Yard');
            if (yard && yard.geofence) {
                const distanceToYard = getDistanceInMeters(techLocation.lat, techLocation.lon, yard.geofence.lat, yard.geofence.lon);
                const isOutsideYard = distanceToYard > yard.geofence.radius;
                const isAfterHours = new Date().getHours() >= 19 || new Date().getHours() < 6;
                const wasOutsideYardAfterHours = internalState.wasOutsideYardAfterHours;

                if (isAfterHours && isOutsideYard && !assignedJob && !wasOutsideYardAfterHours) {
                    const myVehicle = assets.find(a => a.type === 'Vehicle'); // Find first vehicle for demo
                    showNotification(`SECURITY ALERT: ${myVehicle?.name || 'A vehicle'} has moved outside the storage yard after hours without an assigned job.`, 'danger', 15000);
                }
                internalState.wasOutsideYardAfterHours = isAfterHours && isOutsideYard && !assignedJob;
            }
        };

        const intervalId = setInterval(checkGeofences, 7000);

        return () => clearInterval(intervalId);

    }, [user, technicianLocations, jobs, hazardZones, assets, showNotification, updateSubmission, internalState]);

    return null;
};

export default GeofenceAutomation;