export const searchIcons = async (searchTerm: string) => {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development';
        const API_URL = isDevelopment ? `/api/v4/icons/search?query=${searchTerm}&count=20`
                                     : `https://expense-tracker-murex-beta.vercel.app/api/icons?query=${searchTerm}&count=20`;
        const response = await fetch(API_URL);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}