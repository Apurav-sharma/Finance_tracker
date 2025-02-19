import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from "recharts"

export default function Bchart({ barChartData }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}