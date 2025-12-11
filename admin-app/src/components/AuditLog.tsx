import { useEffect, useState } from 'react';
import { api } from '../api';

export default function AuditLog() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        api.getAuditLogs().then(res => setLogs(res.data.data));
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">System Audit Logs</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.performed_by}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(log.details), null, 2)}</pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
