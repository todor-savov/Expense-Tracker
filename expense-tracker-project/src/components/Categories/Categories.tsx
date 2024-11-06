import { useContext, useEffect, useState } from "react";
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Modal, TextField, Tooltip, Typography } from "@mui/material";
import { searchIcons } from "../../service/icons-service";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { CANCEL_CATEGORY_ICON, SAVE_CATEGORY_ICON } from "../../common/constants";
import { GridAddIcon } from "@mui/x-data-grid";
import { AddBox } from "@mui/icons-material";
import { useMediaQuery } from '@mui/material';
import "./Categories.css";

interface Category {
    id: string;
    type: string;
    imgSrc: string;
    imgAlt: string;
    user: string;
}

interface NewCategory {
    type: string;
    imgSrc: string;
    imgAlt: string;
    user: string;
}

const Categories = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [addCategoryMode, setAddCategoryMode] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [foundIcons, setFoundIcons] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState<NewCategory|null>(null);
    const [selectedIcon, setSelectedIcon] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showIconSearch, setShowIconSearch] = useState<boolean>(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string>("");
    const [editedCategory, setEditedCategory] = useState<Category|null>(null);
    const [categoryToUpdate, setCategoryToUpdate] = useState<Category|null>(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categories = await getCategories(isLoggedIn.user);
                if (categories.length > 0) setCategories(categories);
                setLoading(false);
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        }
        if (categories.length === 0) fetchCategories();
    }, [categories]);

    useEffect(() => {
        const search = async () => {
            try {
                const response = await searchIcons(searchTerm);
                if (!response) throw new Error("No response");
                setFoundIcons(response.icons);
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        }
        if (searchTerm) search();
    }, [searchTerm]);

    useEffect(() => {
        const addNewCategory = async () => {   
            try {
                setLoading(true);
                const response = await createCategory(newCategory as NewCategory);
                if (response) throw new Error("Failed to create category");
                setCategories([]);
                setLoading(false);
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        }
        if (newCategory) addNewCategory() 
    }, [newCategory]);

    useEffect(() => {
        const handleCategoryUpdate = async () => {
            try {
                setLoading(true);
                const response = await updateCategory(categoryToUpdate as Category, categoryToUpdate?.id);
                if (response) throw new Error("Failed to update category");
                setCategoryToUpdate(null);
                setCategories([]);
                setLoading(false);
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        }
        if (categoryToUpdate) handleCategoryUpdate();
    }, [categoryToUpdate]);

    useEffect(() => {   
        const handleCategoryDelete = async () => {
            try {
                setLoading(true);
                const response = await deleteCategory(categoryToDelete);
                if (response) throw new Error("Failed to delete category");
                setCategories([]);
                setCategoryToDelete("");
                setLoading(false);
            } catch (error: any) {
                console.error(error);
                setError(error.message);
            }
        }
        if (categoryToDelete) handleCategoryDelete();
    }, [categoryToDelete]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            "category-name": { value: string };
        };

        if (addCategoryMode) {
            const categoryName = target["category-name"].value;
            if (categoryName && selectedIcon) {
                setNewCategory({ type: categoryName, imgSrc: selectedIcon, imgAlt: categoryName, user: isLoggedIn.user });
                setAddCategoryMode(false);
                setSelectedIcon("");
                setSearchTerm("");
                setFoundIcons([]);
            }
            else setError("Please select a category icon and provide a name");
        }

        if (editedCategory) {
            const categoryName = target["category-name"].value;
            if (categoryName) {
                setCategoryToUpdate({id: editedCategory.id, type: categoryName, 
                    imgSrc: selectedIcon ? selectedIcon : editedCategory.imgSrc, 
                    imgAlt: categoryName, user: isLoggedIn.user
                });
                setEditedCategory(null);
                setSelectedIcon("");
                setSearchTerm("");
                setFoundIcons([]);
            }
            else setError("Please select a category icon and provide a name");
        }
    }

    const handleAddCategoryButtonClick = () => {
        setEditedCategory(null);
        setAddCategoryMode(true);
    }

    const handleIconSelect = (imageURL: string) => {
        setShowIconSearch(false);
        setSelectedIcon(imageURL);
    }

    const handleCancelButtonClick = () => {
        setSelectedIcon("");
        setEditedCategory(null);
        setAddCategoryMode(false);
    }

    const handleEdit = (category: Category) => {
        setAddCategoryMode(false);
        setSelectedIcon(category.imgSrc);
        setEditedCategory(category);
    }

    if (loading) {
        return (
            <div className='spinnerContainer'>
                <div className='spinner'></div>
            </div>
        )
    }

    return (
            <Box className="categories-box">
                {categories.length > 0 ?
                    <List className="categories-list">
                        <Typography variant="h6" 
                            sx={{ fontWeight: 'bold', color: '#3f51b5', letterSpacing: '1px', fontSize: '1.0rem' }}
                        >
                            Existing Categories
                        </Typography>

                        {categories.map((category) => (
                            <ListItem key={category.id} className={isMobile ? "category-item-mobile" : "category-item"}>
                                <ListItemAvatar>
                                    <Avatar> <img src={category.imgSrc} alt={category.imgAlt} /> </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={<span> {category.type} </span>} />

                                <Box sx={{ display: 'none', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}
                                    className="category-buttons"
                                >
                                    <Tooltip title="Edit" arrow>
                                        <Button onClick={() => handleEdit(category)}>
                                            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <Button onClick={() => setCategoryToDelete(category.id)}>
                                            <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    :   <div className="message-box">
                            <h2>No Categories Found</h2>
                        </div>
                }

                {error && <p>{error}</p>}

                {(!addCategoryMode && !editedCategory) && 
                    <Box>
                        <Button onClick={handleAddCategoryButtonClick}><AddBox style={{fontSize: 40 }} /></Button>
                    </Box>
                }

            {(addCategoryMode || editedCategory) && 
                <Box component="form" className="category-details" onSubmit={handleSubmit}>

                    <Typography variant="h6" 
                        sx={{ fontWeight: 'bold', color: '#3f51b5', letterSpacing: '1px', fontSize: '1.0rem' }}
                    >
                        {addCategoryMode ? "Add Category" : "Edit Category"}
                    </Typography>

                    {/* First Row: Icon and Category Name */}
                    <div className="top-row">
                        {addCategoryMode && (
                            selectedIcon ? 
                            <img src={selectedIcon} alt="category-icon" onClick={() => setShowIconSearch(true)} className="selected-icon" /> :
                            <div className="icon-placeholder" onClick={() => setShowIconSearch(true)}>
                                <GridAddIcon style={{ fontSize: 50, color: "#9e9e9e" }} />
                                <Typography variant="caption">Select an icon</Typography>
                            </div>
                        )}

                        {editedCategory && <img src={selectedIcon ? selectedIcon : editedCategory.imgSrc} alt="category-icon" onClick={() => setShowIconSearch(true)} 
                            className="selected-icon" />}

                        {addCategoryMode && 
                            <TextField type="text" id="category-name" label="Category Name" 
                                variant="outlined" required 
                            />
                        }

                        {editedCategory &&
                            <TextField type="text" id="category-name" label="Category Name" 
                                variant="outlined" required value={editedCategory.type} 
                                onChange={(e) => setEditedCategory({ ...editedCategory, type: e.target.value })} 
                            />
                        }
                    </div>

                    {/* Second Row: Buttons */}
                    <div className="bottom-row">
                        <Button type="submit">
                            <img width="100" height="100" src={SAVE_CATEGORY_ICON} alt="save-button"/>
                        </Button>
                        <Button onClick={handleCancelButtonClick}>
                            <img width="48" height="48" src={CANCEL_CATEGORY_ICON} alt="cancel-button"/>
                        </Button>
                    </div>

                    <Modal aria-describedby="transition-modal-description" open={showIconSearch} onClose={() => setShowIconSearch(false)} 
                        closeAfterTransition>
                        <Box className='icon-search'>
                            <TextField type="text" fullWidth id="search-input" helperText={"Search for category icons (provided by IconFinder)"} 
                                onChange={(e) => setSearchTerm(e.target.value)} label="Search" variant="outlined" />

                            <Box id="transition-modal-description">
                                {foundIcons.length > 0 ?
                                    <Box className="icon-grid">
                                        {foundIcons.map((icon, index) => {
                                            const imageURL = icon.raster_sizes[icon.raster_sizes.length - 1].formats[0].preview_url;
                                            return <img key={index} onClick={() => handleIconSelect(imageURL)} src={imageURL} alt={icon.tags[0]} />
                                        })}
                                    </Box>
                                    : 'No icons found'
                                }
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            }
            </Box>
        );
}
    
export default Categories;