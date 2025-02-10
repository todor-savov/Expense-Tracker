export const getExchangeRates = async (baseCurrency: string): Promise<Record<string, number>|string> => {
    try {        
        const response = await fetch(`https://exchange-rate-proxy.vercel.app/api/exchange-rate?baseCurrency=${baseCurrency}`);
        if (!response.ok) throw new Error('Failed to fetch exchange rates');
        return await response.json();
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }            
}