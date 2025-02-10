export const getExchangeRates = async (baseCurrency: string): Promise<Record<string, number>|string> => {
    try {        
        const rates = await fetch(`https://exchange-rate-proxy.vercel.app/api/exchange-rate?baseCurrency=${baseCurrency}`);
        console.log(rates);
        if (typeof rates === 'string') throw new Error('Error fetching exchange rates');
        return rates.json();
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }            
}