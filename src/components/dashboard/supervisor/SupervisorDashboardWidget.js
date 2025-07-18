import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const SupervisorDashboardWidget = ({ kpi, data, navigate }) => {

    const renderVisualization = () => {
        switch (kpi.visualization) {
            case 'StackedBar':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data} layout="vertical" barSize={20}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => `${value.toFixed(1)} hrs`} contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}/>
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Bar dataKey="Wrench Time" stackId="a" fill="var(--success)" />
                            <Bar dataKey="Travel" stackId="a" fill="var(--warning)" />
                            <Bar dataKey="Idle" stackId="a" fill="var(--secondary)" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'PercentageGauge':
                const percentage = data.value || 0;
                const color = percentage > 90 ? 'var(--success)' : percentage > 75 ? 'var(--warning)' : 'var(--danger)';
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-4xl font-bold" style={{color}}>{percentage.toFixed(1)}%</div>
                        <div className="text-sm text-text-secondary mt-2">{data.description}</div>
                    </div>
                );
            case 'StatusIndicator':
                 return (
                    <div className="space-y-2 h-full overflow-y-auto pr-2">
                        {data.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <span className="text-sm font-medium">{item.name}</span>
                                {item.status === 'At Risk' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">{item.status}</span>}
                                {item.status === 'Breached' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">{item.status}</span>}
                                {item.status === 'On Track' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">{item.status}</span>}
                            </div>
                        ))}
                    </div>
                );
             case 'LiveList':
                 return (
                    <div className="space-y-2 h-full overflow-y-auto pr-2">
                        {data.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <span className="text-sm font-medium">{item.name}</span>
                                <span className="text-xs text-text-secondary">{item.duration}</span>
                            </div>
                        ))}
                         {data.length === 0 && <p className="text-sm text-text-secondary text-center pt-8">All critical assets are active.</p>}
                    </div>
                );
             case 'DonutChart':
                const COLORS = { Complete: 'var(--success)', Overdue: 'var(--danger)' };
                return(
                    <ResponsiveContainer width="100%" height={200}>
                         <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name]} /> )}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}/>
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return <div className="text-center text-text-secondary">No visualization available.</div>
        }
    }

    return (
        <div className="bg-surface p-4 rounded-lg shadow-md border border-border h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-text-primary text-md">{kpi.title}</h4>
                {kpi.drillDownPage && (
                    <button onClick={() => navigate(kpi.drillDownPage)} className="text-xs font-semibold text-primary hover:underline">
                        Details
                    </button>
                )}
            </div>
            <p className="text-xs text-text-secondary mb-3 flex-shrink-0">{kpi.businessQuestion}</p>
            <div className="flex-grow">
                {renderVisualization()}
            </div>
        </div>
    );
};

export default SupervisorDashboardWidget;