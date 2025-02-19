import { ResponsiveContainer, Pie, PieChart, Tooltip, Cell } from "recharts"

export default function Pchart({categoryData}) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}