export const searchIcons = async (searchTerm: string) => {
    try {
        const response = await fetch(`/api/v4/icons/search?query=${searchTerm}&count=20`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_ICON_FINDER_API_KEY}`
            }
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
}