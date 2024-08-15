import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { searchIcons } from "../../service/icons-service";

const Categories = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [icons, setIcons] = useState<any[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const search = async () => {
            try {
                console.log(searchTerm);
                const response = await searchIcons(searchTerm);
                if (!response) throw new Error("No response");
                setIcons(response.icons);
                console.log(response);
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        }
        if (searchTerm) search();
    }, [searchTerm]);

    return (
        <div>
             <TextField type="text" id="expense-name" helperText={"Search for category icons"} required 
                onChange={(e) => setSearchTerm(e.target.value)} label="Search" variant="outlined"/>

            <div>
                {icons.map((icon, index) => (
                    <img key={index} src={icon.raster_sizes[0].formats[0].preview_url} alt={icon.tags[0]} />
                ))}

                {error && <p>{error}</p>}
            </div>

        </div>
    );
}
    
export default Categories;