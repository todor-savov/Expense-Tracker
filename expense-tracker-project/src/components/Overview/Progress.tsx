import { useContext, useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { getTransactions } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import { axisClasses, LineChart } from "@mui/x-charts";

interface FetchedTransaction {
    id: string;
    date: string;
    name: string;
    amount: number;
    category: string;
    payment: string;
    receipt: string;
    user: string;
}

interface Data {
    [category: string]: number[];
}

const Progress = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [transactionFilter, setTransactionFilter] = useState<string>('');
    const [data, setData] = useState<Data|null>(null);
    const [timeSpan, setTimeSpan] = useState<string>('');
    const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactions = await getTransactions(isLoggedIn.user);

                const filteredTransactions = transactionFilter === 'monthly-all' ? transactions : 
                    transactions.filter((transaction: FetchedTransaction) => transaction.date.substring(6) === transactionFilter);
                                
                const uniqueMonths = Array.from(new Set(filteredTransactions.map(transaction => {
                    const [month, , year] = transaction.date.split('/');
                    const monthYear = new Date(`${year}-${month}`).toLocaleString('en-US', { month: 'long', year: 'numeric' });
                    return monthYear;
                })));

                const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                uniqueMonths.sort((a, b) => {
                    const [monthA, yearA] = a.split(' ');
                    const [monthB, yearB] = b.split(' ');
                    if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
                    else return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
                });                
                  
                const uniqueCategories = Array.from(new Set(filteredTransactions.map(transaction => transaction.category)));
                  
                const sumsByCategory = uniqueCategories.reduce((acc, category) => {
                    acc[category] = Array(uniqueMonths.length).fill(0);
                    return acc;
                }, {} as Data);

                filteredTransactions.forEach(transaction => {
                    const [month, , year] = transaction.date.split('/');
                    const monthYear = new Date(`${year}-${month}`).toLocaleString('en-US', { month: 'long', year: 'numeric' });
                    const monthIndex = uniqueMonths.indexOf(monthYear);
                    if (monthIndex !== -1) sumsByCategory[transaction.category][monthIndex] += transaction.amount;
                });
                  
                setUniqueMonths(uniqueMonths);
                setData(sumsByCategory);
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
            }
        }
        if (transactionFilter) fetchData();
    }, [transactionFilter]);

    const handleChange = (event: SelectChangeEvent) => {
        event.preventDefault();
        if (event.target.value === 'yearly') setTransactionFilter('yearly');
        if (event.target.value === 'monthly-current') setTransactionFilter(new Date().getFullYear().toString());
        if (event.target.value === 'monthly-all') setTransactionFilter('monthly-all');
        setTimeSpan(event.target.value);
    }
  
    return (
        <>
            {error && <p>{error}</p>}
            <Box className="overview-container">
                <Box className="overview-header">
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-helper-label">Time Span</InputLabel>
                            <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" value={timeSpan} 
                                label="time-span" onChange={handleChange}>
                                <MenuItem value={"yearly"}>Yearly</MenuItem>
                                <MenuItem value={"monthly-current"}>Monthly (Current Year)</MenuItem>
                                <MenuItem value={"monthly-all"}>Monthly (All Years)</MenuItem>
                            </Select>
                    </FormControl>
                </Box>

                <Box sx={{backgroundColor: 'white', boxShadow: 3, borderRadius: 2, width: '100%', padding: 1 }}>
                    <LineChart
                        xAxis={[
                            {
                                id: 'Time',
                                label: 'Time',
                                scaleType: 'band',
                                data: uniqueMonths,
                                valueFormatter: (month) => `${month.split(' ')[0].substring(0, 3)} ${month.split(' ')[1]}`,
                                tickLabelStyle: {
                                    fontSize: 11,
                                    textAnchor: 'middle',
                                },
                                labelStyle: {
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    transform: 'translateY(3px)',
                                },
                            },
                        ]}

                        sx={{
                            [`.${axisClasses.left} .${axisClasses.label}`]: {
                                fontSize: 14,
                                fontWeight: 'bold',
                                transform: 'translateX(-11px)',
                            },
                        }}
                            
                        yAxis={[
                            {
                                id: 'Amount',
                                label: 'Amount',
                                scaleType: 'linear',
                                valueFormatter: (value) => value,
                                tickLabelStyle: {
                                    fontSize: 11,
                                    textAnchor: 'end',
                                },
                            }
                        ]}

                        series={data ? Object.keys(data).map(category => ({
                            id: category,
                            label: category,
                            data: data[category],
                            stack: 'total',
                            area: true,
                            showMark: true,
                        })) : []}

                        grid={{ horizontal: true }}
                        height={400}
                        margin={{ left: 50 }}

                        slotProps={{
                            legend: {
                                direction: 'column',
                                position: { vertical: 'top', horizontal: 'right' },
                                padding: 0,
                                itemMarkWidth: 20,
                                itemMarkHeight: 10,
                                markGap: 5,
                                itemGap: 10,
                                labelStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                }, 
                            },
                        }}
                    />   
                </Box>
            </Box>
        </>
    );
}

export default Progress;