import React, { useEffect, useRef, useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import L from 'leaflet';
import PageHeader from '../components/common/PageHeader';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import { Map, Edit, Save, PlusCircle, X } from 'lucide-react';

// Leaflet marker icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AddJobPanel = ({ coords, onClose, customers, addJob, addCustomer }) => {
    const [jobName, setJobName] = useState('');
    const [poc, setPoc] = useState('');
    const [personnel, setPersonnel] = useState(1);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [isAddingCustomer, setIsAddingCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerAddress, setNewCustomerAddress] = useState('');

    const handleAddCustomer = () => {
        if (!newCustomerName) {
            alert("New customer name is required.");
            return;
        }
        const newCustomer = addCustomer({ name: newCustomerName, address: newCustomerAddress });
        setSelectedCustomerId(newCustomer.id);
        setIsAddingCustomer(false);
        setNewCustomerName('');
        setNewCustomerAddress('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addJob({
            name: jobName,
            customerId: selectedCustomerId,
            location: `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`,
            poc,
            geoFence: { lat: coords.lat, lon: coords.lng, radius: 500 },
            requiredPersonnel: parseInt(personnel, 10),
        });
        onClose();
    };

    return (
        <div className="absolute top-0 right-0 h-full w-full max-w-md bg-surface shadow-lg z-[1000] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Create New Job</h3>
                <button onClick={onClose}><X/></button>
            </div>
            <form id="add-job-form" onSubmit={handleSubmit} className="flex-grow p-4 overflow-y-auto space-y-4">
                {isAddingCustomer ? (
                    <div className="p-4 border rounded-lg space-y-3 bg-muted/50">
                        <h4 className="font-semibold">Add New Customer</h4>
                        <InputField label="Customer Name" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} required />
                        <InputField label="Customer Address" value={newCustomerAddress} onChange={e => setNewCustomerAddress(e.target.value)} />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAddingCustomer(false)} className="text-sm px-3 py-1 border rounded-md">Cancel</button>
                            <button type="button" onClick={handleAddCustomer} className="text-sm font-semibold text-white bg-primary px-3 py-1 rounded-md">Save Customer</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <InputField label="Coordinates" value={`Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`} disabled />
                        <InputField label="Job Name" value={jobName} onChange={e => setJobName(e.target.value)} placeholder="e.g., Smith Lease - Well 1A" required />
                        <div className="flex items-end gap-2">
                            <div className="flex-grow">
                                <SelectField label="Customer" options={customers.map(c => ({ value: c.id, label: c.name }))} value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} required />
                            </div>
                            <button type="button" onClick={() => setIsAddingCustomer(true)} title="Add New Customer" className="p-2 bg-muted rounded-md hover:bg-border"><PlusCircle className="w-5 h-5"/></button>
                        </div>
                        <InputField label="Point of Contact" value={poc} onChange={e => setPoc(e.target.value)} placeholder="e.g., John Smith" required />
                        <InputField label="Required Personnel" type="number" value={personnel} onChange={e => setPersonnel(e.target.value)} required />
                    </>
                )}
            </form>
            <div className="p-4 border-t flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" form="add-job-form" className="px-4 py-2 bg-primary text-white rounded-md">Create Job</button>
            </div>
        </div>
    );
};


const MapPage = () => {
    const mapRef = useRef(null);
    const { user, navigate, jobs, customers, updateJob, addJob, addCustomer, showNotification } = useContext(AppContext);
    const [mode, setMode] = useState('view');
    const [editableLayers, setEditableLayers] = useState({});
    const [addJobCoords, setAddJobCoords] = useState(null);
    const tempMarkerRef = useRef(null);

    const canManage = user.role === 'admin' || user.role === 'executive';

    useEffect(() => {
        if (mapRef.current) return;
        mapRef.current = L.map('map-container', { center: [36.1699, -109.5752], zoom: 6, layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' })] });
        window.navigateToJob = (jobId) => navigate('job_detail', { jobId });
        return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } delete window.navigateToJob; };
    }, [navigate]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const onMapClick = (e) => {
            if (mode !== 'add') return;
            setAddJobCoords(e.latlng);
            if (tempMarkerRef.current) {
                map.removeLayer(tempMarkerRef.current);
            }
            tempMarkerRef.current = L.marker(e.latlng).addTo(map).bindPopup("New Job Location").openPopup();
        };

        map.on('click', onMapClick);
        return () => { map.off('click', onMapClick); };
    }, [mode]);

    useEffect(() => {
        const map = mapRef.current;
        Object.values(editableLayers).forEach(layerGroup => map.removeLayer(layerGroup));
        const newLayers = {};

        jobs.forEach(job => {
            if (!job.geoFence) return;
            const layerGroup = L.layerGroup();
            const marker = L.marker([job.geoFence.lat, job.geoFence.lon]);
            const circle = L.circle([job.geoFence.lat, job.geoFence.lon], { color: mode === 'manage' ? 'orange' : 'blue', fillColor: mode === 'manage' ? '#fb923c' : '#3b82f6', fillOpacity: 0.2, radius: job.geoFence.radius });

            if (mode === 'manage') {
                const popupContent = `
                    <b>${job.name}</b><br>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <input type="range" id="radius-slider-${job.id}" min="100" max="5000" value="${job.geoFence.radius}" step="50" style="flex-grow: 1;">
                        <input type="number" id="radius-input-${job.id}" value="${job.geoFence.radius}" step="50" style="width: 70px; border: 1px solid #ccc; border-radius: 4px; padding: 4px;">
                        <span>m</span>
                    </div>
                    <button id="save-btn-${job.id}" class="leaflet-popup-button">Save</button>
                `;
                marker.bindPopup(popupContent);
                marker.on('popupopen', () => {
                    const slider = document.getElementById(`radius-slider-${job.id}`);
                    const input = document.getElementById(`radius-input-${job.id}`);
                    slider.oninput = (e) => { circle.setRadius(parseInt(e.target.value, 10)); input.value = e.target.value; };
                    input.oninput = (e) => { circle.setRadius(parseInt(e.target.value, 10)); slider.value = e.target.value; };
                    document.getElementById(`save-btn-${job.id}`).onclick = () => {
                        updateJob(job.id, { geoFence: { ...job.geoFence, radius: parseInt(slider.value, 10) } });
                        showNotification(`Geofence for ${job.name} updated.`, 'success');
                        marker.closePopup();
                    };
                });
            } else {
                marker.bindPopup(`<b>${job.name}</b><br>${job.location}<br><button onclick="window.navigateToJob('${job.id}')" class="leaflet-popup-button">View Details</button>`);
            }
            
            layerGroup.addLayer(marker).addLayer(circle).addTo(map);
            newLayers[job.id] = layerGroup;
        });
        setEditableLayers(newLayers);
    }, [jobs, mode, updateJob, showNotification]);

    const handleCloseModal = () => {
        setAddJobCoords(null);
        if (tempMarkerRef.current) {
            mapRef.current.removeLayer(tempMarkerRef.current);
            tempMarkerRef.current = null;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <PageHeader title="Job Site Map" onBack={() => navigate('dashboard')}>
                {canManage && (
                    <div className="flex items-center bg-muted p-1 rounded-lg">
                        <button onClick={() => setMode('view')} title="View Mode" className={`p-2 rounded-md ${mode === 'view' ? 'bg-surface shadow' : ''}`}><Map className="w-5 h-5"/></button>
                        <button onClick={() => setMode('manage')} title="Manage Geofences" className={`p-2 rounded-md ${mode === 'manage' ? 'bg-surface shadow' : ''}`}><Edit className="w-5 h-5"/></button>
                        <button onClick={() => setMode('add')} title="Add New Job" className={`p-2 rounded-md ${mode === 'add' ? 'bg-surface shadow' : ''}`}><PlusCircle className="w-5 h-5"/></button>
                    </div>
                )}
            </PageHeader>
            <div className="relative flex-grow">
                <div id="map-container" className="absolute inset-0 w-full h-full rounded-lg shadow-md border border-border"></div>
                {addJobCoords && (
                    <AddJobPanel coords={addJobCoords} onClose={handleCloseModal} customers={customers} addJob={addJob} addCustomer={addCustomer} />
                )}
            </div>
             <div className="p-2 text-xs text-center text-text-secondary">
                {mode === 'add' ? "ADD MODE: Click on the map to place a new job." : mode === 'manage' ? "MANAGE MODE: Click a job marker to edit its geofence." : "VIEW MODE: Click a job marker to see details."}
            </div>
        </div>
    );
};

export default MapPage;
