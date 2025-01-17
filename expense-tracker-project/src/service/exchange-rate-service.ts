export const getExchangeRates = async (baseCurrency: string): Promise<Record<string, number>|undefined> => {  
    try {        
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`); 
        const data = await response.json();
        return data.conversion_rates;
    } catch (error: any) {
        console.log(error.message);
    }            
}