import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import PageHeader from '../components/common/PageHeader';
import { ChevronLeft, ChevronRight, Users, Briefcase, Sparkles, Calendar, List, Loader2 } from 'lucide-react';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

const CalendarView = ({ schedule, jobs, users, currentDate }) => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    const startingDayIndex = getDay(firstDayOfMonth);
    const paddingDays = Array.from({ length: startingDayIndex }, (_, i) => null);
    const allDays = [...paddingDays, ...daysInMonth];

    const getJobForEvent = (jobId) => jobs.find(j => j.id === jobId);
    const getUserForEvent = (userId) => users.find(u => u.id === userId);

    const eventsByDate = useMemo(() => {
        const events = {};
        schedule.forEach(event => {
            const eventDays = eachDayOfInterval({ start: new Date(event.startDate), end: new Date(event.endDate) });
            eventDays.forEach(day => {
                const dateString = format(day, 'yyyy-MM-dd');
                if (!events[dateString]) events[dateString] = [];
                events[dateString].push(event);
            });
        });
        return events;
    }, [schedule]);

    return (
        <div className="bg-surface p-4 rounded-lg shadow-md border border-border">
            <div className="grid grid-cols-7 gap-px text-center text-sm font-semibold text-text-secondary">
                {weekDays.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-px">
                {allDays.map((day, index) => (
                    <div key={day ? day.toISOString() : `pad-${index}`} className={`relative min-h-[8rem] p-2 border-t border-l border-border ${day ? '' : 'bg-muted/50'}`}>
                        {day && (
                            <>
                                <span className={`text-xs font-semibold ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                                    {format(day, 'd')}
                                </span>
                                <div className="mt-1 space-y-1 overflow-y-auto max-h-24">
                                    {(eventsByDate[format(day, 'yyyy-MM-dd')] || []).map(event => {
                                        const user = getUserForEvent(event.userId);
                                        const job = getJobForEvent(event.jobId);
                                        return (
                                            <div key={event.id} className="text-xs bg-blue-100 dark:bg-blue-900/50 p-1 rounded truncate" title={`${user?.name} @ ${job?.name}`}>
                                                {user?.name.split(' ')[0]} @ {job?.name.split(' ')[0]}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const RosterView = ({ users, schedule, jobs }) => {
    const technicians = users.filter(u => u.role === 'technician');
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today);
    const endOfCurrentWeek = endOfWeek(today);

    const getAssignment = (userId) => {
        const assignment = schedule.find(s => 
            s.userId === userId && 
            isWithinInterval(today, { start: new Date(s.startDate), end: new Date(s.endDate) })
        );
        if (!assignment) return { text: 'Available', color: 'text-success' };
        const job = jobs.find(j => j.id === assignment.jobId);
        return { text: job?.name || 'Assigned', color: 'text-text-primary' };
    };

    return (
        <div className="bg-surface p-4 rounded-lg shadow-md border border-border">
            <h3 className="font-semibold text-text-primary mb-3">Technician Roster (This Week)</h3>
            <div className="space-y-3">
                {technicians.map(tech => {
                    const assignment = getAssignment(tech.id);
                    return (
                        <div key={tech.id} className="flex justify-between items-center p-3 border-b border-border">
                            <p className="font-medium">{tech.name}</p>
                            <p className={`text-sm font-semibold ${assignment.color}`}>{assignment.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const SchedulePage = () => {
    const { navigate, schedule, batchAddSubmissions, jobs, users, showNotification } = useContext(AppContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('calendar');
    const [scheduleStartDate, setScheduleStartDate] = useState(format(startOfWeek(addDays(new Date(), 7)), 'yyyy-MM-dd'));
    const [isScheduling, setIsScheduling] = useState(false);

    const changeMonth = (amount) => {
        setCurrentDate(prev => new Date(prev.setMonth(prev.getMonth() + amount)));
    };

    const scheduledTechnicianIdsForWeek = useMemo(() => {
        const start = startOfWeek(new Date(scheduleStartDate));
        const end = endOfWeek(new Date(scheduleStartDate));
        const ids = new Set();
        schedule.forEach(s => {
            if (isWithinInterval(start, { start: new Date(s.startDate), end: new Date(s.endDate) }) || isWithinInterval(end, { start: new Date(s.startDate), end: new Date(s.endDate) })) {
                ids.add(s.userId);
            }
        });
        return ids;
    }, [schedule, scheduleStartDate]);

    const availableTechnicians = useMemo(() => {
        return users.filter(u => u.role === 'technician' && !scheduledTechnicianIdsForWeek.has(u.id));
    }, [users, scheduledTechnicianIdsForWeek]);

    const unscheduledJobs = useMemo(() => {
        const scheduledJobIds = new Set(schedule.map(s => s.jobId));
        return jobs.filter(j => !scheduledJobIds.has(j.id) && j.status === 'Active');
    }, [schedule, jobs]);

    const handleAutoSchedule = () => {
        setIsScheduling(true);
        setTimeout(() => { // Simulate network delay
            if (unscheduledJobs.length === 0) {
                showNotification("No active jobs to schedule.", "info");
                setIsScheduling(false);
                return;
            }

            let techs = [...availableTechnicians];
            let jobsToSchedule = [...unscheduledJobs];
            let newScheduleEntries = [];
            let scheduledCount = 0;

            jobsToSchedule.forEach(job => {
                const required = job.requiredPersonnel || 1;
                if (techs.length < required) return;

                const assignedTechs = techs.splice(0, required);
                const startDate = new Date(scheduleStartDate);
                const endDate = addDays(startDate, 6);
                
                assignedTechs.forEach(tech => {
                    newScheduleEntries.push({
                        id: `sched_auto_${Date.now()}_${tech.id}`,
                        userId: tech.id,
                        jobId: job.id,
                        startDate: format(startDate, 'yyyy-MM-dd'),
                        endDate: format(endDate, 'yyyy-MM-dd'),
                        shift: 'Day'
                    });
                });
                scheduledCount++;
            });

            if (newScheduleEntries.length > 0) {
                batchAddSubmissions('schedule', newScheduleEntries);
            }

            if (scheduledCount > 0) {
                showNotification(`Auto-scheduled ${scheduledCount} job(s) for the week of ${scheduleStartDate}.`, "success");
            } else {
                 showNotification(`Not enough available technicians to fulfill requirements for unscheduled jobs.`, "warning");
            }
            setIsScheduling(false);
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Team Schedule" onBack={() => navigate('dashboard')}>
                <div className="flex items-center bg-muted p-1 rounded-lg">
                    <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-md ${viewMode === 'calendar' ? 'bg-surface shadow' : ''}`} title="Calendar View"><Calendar className="w-5 h-5"/></button>
                    <button onClick={() => setViewMode('roster')} className={`p-2 rounded-md ${viewMode === 'roster' ? 'bg-surface shadow' : ''}`} title="Roster View"><List className="w-5 h-5"/></button>
                </div>
                {viewMode === 'calendar' && (
                    <div className="flex items-center space-x-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-muted"><ChevronLeft /></button>
                        <span className="text-lg font-semibold w-32 text-center">{format(currentDate, 'MMMM yyyy')}</span>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-muted"><ChevronRight /></button>
                    </div>
                )}
            </PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    {viewMode === 'calendar' ? 
                        <CalendarView schedule={schedule} jobs={jobs} users={users} currentDate={currentDate} /> :
                        <RosterView users={users} schedule={schedule} jobs={jobs} />
                    }
                </div>
                <div className="space-y-6">
                    <div className="bg-surface p-4 rounded-lg shadow-md border border-border">
                        <h3 className="font-semibold text-text-primary mb-3 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-primary" /> Auto-Scheduler</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-text-secondary">Schedule Start Week</label>
                                <input type="date" value={scheduleStartDate} onChange={e => setScheduleStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-surface border border-border rounded-md shadow-sm" />
                            </div>
                            <button onClick={handleAutoSchedule} disabled={unscheduledJobs.length === 0 || isScheduling} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-text-secondary disabled:cursor-not-allowed">
                                {isScheduling ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling...</> : 'Run Auto-Scheduler'}
                            </button>
                        </div>
                    </div>
                    <div className="bg-surface p-4 rounded-lg shadow-md border border-border">
                        <h3 className="font-semibold text-text-primary mb-2 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-secondary" /> Unscheduled Jobs ({unscheduledJobs.length})</h3>
                        <ul className="text-sm text-text-secondary space-y-1 max-h-40 overflow-y-auto">
                            {unscheduledJobs.length > 0 ? unscheduledJobs.map(job => <li key={job.id}>{job.name} ({job.requiredPersonnel} techs needed)</li>) : <li>No jobs to schedule.</li>}
                        </ul>
                    </div>
                    <div className="bg-surface p-4 rounded-lg shadow-md border border-border">
                        <h3 className="font-semibold text-text-primary mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-secondary" /> Available Technicians ({availableTechnicians.length})</h3>
                        <ul className="text-sm text-text-secondary space-y-1 max-h-40 overflow-y-auto">
                           {availableTechnicians.length > 0 ? availableTechnicians.map(user => <li key={user.id}>{user.name}</li>) : <li>No technicians available.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
