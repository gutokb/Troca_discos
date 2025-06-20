import getDashboardStatistics from "../service/statsService.js";


export const getStats = async (req, res) => {
    try {
        const stats = await getDashboardStatistics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};
