export const searchIcons = async (searchTerm: string) => {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development';
        const API_URL = isDevelopment ? `/api/v4/icons/search?query=${searchTerm}&count=20`
                                     : `https://api.iconfinder.com/v4/icons/search?query=${searchTerm}&count=20`;

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer TFSDEF1JlpHXluuAhZvOxRijfrEGZRE3mVm61M6ZEusHxRhVxTXDphHKp8N1baVk`
            }
        });
        
        return response.json();
    } catch (error) {
        console.error(error);
    }
}