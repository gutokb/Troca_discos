import {User, Sale, Record}from "../model/models.js"


async function countUsers() {
    return (await User.find({}).countDocuments())
}

async function countRecords() {
    return (await Record.find({}).countDocuments())
}

async function totalEarnings() {
    const result = await Sale.aggregate([
        {$group : {
            _id : null,
            total : {$sum : "$price"}
            }}
    ])
    return result[0].total ? result[0].total : 0
}


const getDashboardStatistics = async () => {
    try {
        // Helper function to get month names
        const getMonthName = (date) => {
            const months = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            return months[date.getMonth()];
        };

        // Helper function to get date ranges for the last 6 months
        const getLast6MonthsRange = () => {
            const months = [];
            const now = new Date();

            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
                months.push({
                    name: getMonthName(date),
                    start: date,
                    end: nextMonth
                });
            }
            return months;
        };

        // 1. Sales per month (Line Chart)
        const getSalesPerMonth = async () => {
            const months = getLast6MonthsRange();
            const salesData = [];

            for (const month of months) {
                const result = await Sale.aggregate([
                    {
                        $match: {
                            timestamp: {
                                $gte: month.start,
                                $lt: month.end
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$price" }
                        }
                    }
                ]);

                salesData.push({
                    month: month.name,
                    sales: result[0]?.total || 0
                });
            }

            return salesData;
        };

        // 2. Sales by genre (Pie Chart)
        const getSalesByGenre = async () => {
            const result = await Sale.aggregate([
                {
                    $lookup: {
                        from: 'records',
                        localField: 'recordId',
                        foreignField: '_id',
                        as: 'record'
                    }
                },
                {
                    $unwind: '$record'
                },
                {
                    $unwind: '$record.genre'
                },
                {
                    $group: {
                        _id: '$record.genre',
                        totalSales: { $sum: '$price' }
                    }
                },
                {
                    $sort: { totalSales: -1 }
                }
            ]);

            // Get top 9 genres and group the rest as "Others"
            const top9 = result.slice(0, 9);
            const others = result.slice(9);

            const genreData = top9.map(item => ({
                name: item._id,
                value: item.totalSales
            }));

            if (others.length > 0) {
                const othersTotal = others.reduce((sum, item) => sum + item.totalSales, 0);
                genreData.push({
                    name: 'Others',
                    value: othersTotal
                });
            }

            return genreData;
        };

        // 3. Most sold artists (Bar Chart)
        const getMostSoldArtists = async () => {
            const result = await Sale.aggregate([
                {
                    $lookup: {
                        from: 'records',
                        localField: 'recordId',
                        foreignField: '_id',
                        as: 'record'
                    }
                },
                {
                    $unwind: '$record'
                },
                {
                    $group: {
                        _id: '$record.artist',
                        totalSales: { $sum: '$price' }
                    }
                },
                {
                    $sort: { totalSales: -1 }
                },
                {
                    $limit: 6
                }
            ]);

            return result.map(item => ({
                artist: item._id,
                sales: item.totalSales
            }));
        };

        // 4. Monthly growth (Percentage)
        const getMonthlyGrowth = async () => {
            const now = new Date();

            // Current month
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            // Previous month
            const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

            // Get current month sales
            const currentMonthResult = await Sale.aggregate([
                {
                    $match: {
                        timestamp: {
                            $gte: currentMonthStart,
                            $lt: currentMonthEnd
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                }
            ]);

            // Get previous month sales
            const previousMonthResult = await Sale.aggregate([
                {
                    $match: {
                        timestamp: {
                            $gte: previousMonthStart,
                            $lt: previousMonthEnd
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                }
            ]);

            const currentTotal = currentMonthResult[0]?.total || 0;
            const previousTotal = previousMonthResult[0]?.total || 0;

            let growthPercentage = 0;
            if (previousTotal > 0) {
                growthPercentage = ((currentTotal - previousTotal) / previousTotal) * 100;
            } else if (currentTotal > 0) {
                growthPercentage = 100; // If no previous sales but current sales exist
            }

            return {
                currentMonth: currentTotal,
                previousMonth: previousTotal,
                growthPercentage: Math.round(growthPercentage * 100) / 100 // Round to 2 decimal places
            };
        };

        // Execute all queries
        const [salesPerMonth, salesByGenre, mostSoldArtists, monthlyGrowth] = await Promise.all([
            getSalesPerMonth(),
            getSalesByGenre(),
            getMostSoldArtists(),
            getMonthlyGrowth()
        ]);

        return {
            totalUsers : await countUsers(),
            totalRecords : await countRecords(),
            totalEarnings : await totalEarnings(),
            salesPerMonth,
            salesByGenre,
            mostSoldArtists,
            monthlyGrowth
        };

    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        throw error;
    }
};

// Example usage in your route handler


export default getDashboardStatistics;
// Export the function

