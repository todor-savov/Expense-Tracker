import { useContext, useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { axisClasses, LineChart } from "@mui/x-charts";
import { getTransactions } from "../../service/database-service";
import { getExchangeRates } from "../../service/exchange-rate-service";
import AuthContext from "../../context/AuthContext";

interface FetchedTransaction {
    id: string;
    date: string;
    name: string;
    amount: number;
    category: string;
    payment: string;
    receipt: string;
    user: string;
    currency: string;
}

interface Data {
    [category: string]: number[];
}

const Progress = () => {
    const { isLoggedIn, settings } = useContext(AuthContext);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);
    const [uniqueYears, setUniqueYears] = useState<string[]>([]);
    const [data, setData] = useState<Data|null>(null);
    const [timeSpan, setTimeSpan] = useState<string>('');
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                const exchangeRates = await getExchangeRates(settings?.currency as string);

                const updatedTransactions = transactions.map((transaction: FetchedTransaction) => {
                    if (transaction.currency !== settings?.currency) {
                        const exchangeRate = 1 / exchangeRates[transaction.currency];
                        transaction.amount = transaction.amount * exchangeRate;  
                        transaction.currency = settings?.currency as string;                       
                    }
                    return transaction;
                });

                setTransactions(updatedTransactions);
                setError(null);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
                setLoading(false);
            }
        }
        if (!transactions.length) fetchTransactions();
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        event.preventDefault();

        const filteredTransactions = (event.target.value === 'yearly' || event.target.value === 'monthly-all') ? transactions : 
            transactions.filter((transaction: FetchedTransaction) => transaction.date.substring(6) === new Date().getFullYear().toString());

        const uniqueCategories = Array.from(new Set(filteredTransactions.map(transaction => transaction.category)));

        if (event.target.value === 'monthly-all' || event.target.value === 'monthly-current') {
            const uniqueMonths = Array.from(new Set(filteredTransactions.map(transaction => {
                const [month, , year] = transaction.date.split('/');
                return new Date(`${year}-${month}`).toLocaleString('en-US', { month: 'long', year: 'numeric' });
            })));

            const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            uniqueMonths.sort((a, b) => {
                const [monthA, yearA] = a.split(' ');
                const [monthB, yearB] = b.split(' ');
                if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
                else return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
            });              

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
              
            const totalValues = uniqueMonths.map((month, index) => {
                console.log(month);
                return uniqueCategories.reduce((acc, category) => acc + sumsByCategory[category][index], 0)
            });

            setUniqueMonths(uniqueMonths);
            setUniqueYears([]);
            setData({...sumsByCategory, Total: totalValues});
        } else {
            const uniqueYears = Array.from(new Set(filteredTransactions.map(transaction => transaction.date.substring(6))));
            uniqueYears.sort((a, b) => Number(a) - Number(b));

            const sumsByCategory = uniqueCategories.reduce((acc, category) => {
                acc[category] = Array(uniqueYears.length).fill(0);
                return acc;
            }, {} as Data);

            filteredTransactions.forEach(transaction => {
                const year = transaction.date.substring(6);
                const yearIndex = uniqueYears.indexOf(year);
                if (yearIndex !== -1) sumsByCategory[transaction.category][yearIndex] += transaction.amount;
            });

            const totalValues = uniqueYears.map((year, index) => {
                console.log(year);
                return uniqueCategories.reduce((acc, category) => acc + sumsByCategory[category][index], 0)
            });

            setUniqueYears(uniqueYears);
            setUniqueMonths([]);
            setData({...sumsByCategory, Total: totalValues});
        }

        setTimeSpan(event.target.value);
    }
  
    if (loading) {
        return (
            <div className='spinnerContainer'>
                <div className='spinner'></div>
            </div>
        )
    }

    return (
        <>
            {error && <p>{error}</p>}
            <Box sx={{backgroundColor: 'white'}}>
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

                {(transactions.length > 0 && timeSpan !== '') ?
                <Box sx={{ padding: 1 }}>
                    <Typography variant="h6" sx={{ marginBottom: '10px', display: 'flex', fontSize: '16px', fontStyle: 'italic' }}> 
                        The values on the "Amount" axis are in {settings?.currency} currency.
                    </Typography>

                    <LineChart
                        xAxis={[
                            {
                                id: 'Time',
                                label: 'Time',
                                scaleType: 'band',
                                data: uniqueYears.length ? uniqueYears : uniqueMonths,
                                valueFormatter: uniqueYears.length ? (year) => year : (month) => `${month.split(' ')[0].substring(0, 3)} ${month.split(' ')[1]}`,
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
                            stack: category !== 'Total' ? 'total' : undefined,
                            area: category !== 'Total' ? true : false,
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
                :   (timeSpan !== '' && 
                    <div className="message-box">
                        <h2>No Transactions Found</h2>                
                    </div>)
                }
            </Box>
        </>
    );
}

export default Progress;