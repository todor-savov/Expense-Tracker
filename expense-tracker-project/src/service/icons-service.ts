export const searchIcons = async (searchTerm: string): Promise<any|string> => {
    try {
        const response = await fetch(`https://expense-tracker-murex-beta.vercel.app/api/icons?query=${searchTerm}&count=20`);
        if (!response.ok) throw new Error('Failed to fetch icons');
        return await response.json();
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}