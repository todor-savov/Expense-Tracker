export const searchIcons = async (searchTerm: string): Promise<any|string> => {
    try {
        const API_URL = `https://expense-tracker-murex-beta.vercel.app/api/icons?query=${searchTerm}&count=20`;
        const response = await fetch(API_URL);
        return response.json();
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}