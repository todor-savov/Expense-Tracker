import { useContext, useEffect, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Modal, Snackbar, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useMediaQuery } from '@mui/material';
import { searchIcons } from "../../service/icons-service";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { AddBox } from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import { CANCEL_CATEGORY_ICON, SAVE_CATEGORY_ICON, CATEGORY_NAME_MIN_LENGTH, CATEGORY_NAME_MAX_LENGTH, SPECIAL_CHARS_REGEX } from "../../common/constants";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
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

interface Dialog {
    open: boolean,
    id: string|null
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
    const [error, setError] = useState<string|null>(null);
    const [showIconSearch, setShowIconSearch] = useState<boolean>(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string|null>(null);
    const [editedCategory, setEditedCategory] = useState<Category|null>(null);
    const [categoryToUpdate, setCategoryToUpdate] = useState<Category|null>(null);
    const [dialog, setDialog] = useState<Dialog>({ open: false, id: null });
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setError(null);
                setLoading(true);
                const categories = await getCategories(isLoggedIn.user);
                if (categories.length > 0) setCategories(categories);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        const search = async () => {
            try {
                setError(null);
                setFoundIcons([]);
                const response = await searchIcons(searchTerm);
                if (!response) throw new Error("Error fetching icons");
                setFoundIcons(response.icons);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (searchTerm) search();
    }, [searchTerm]);

    useEffect(() => {
        const addNewCategory = async () => {   
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await createCategory(newCategory as NewCategory);
                if (!response) throw new Error("Failed to create category");
                setSuccessMessage("Category created successfully");
                setCategories([...categories, { id: response, type: newCategory?.type || "", imgSrc: newCategory?.imgSrc 
                    || "", imgAlt: newCategory?.imgAlt || "", user: newCategory?.user || "" }]);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setNewCategory(null);
                setOpenSnackbar(true);
            }        
        }
        if (newCategory) addNewCategory();                                
    }, [newCategory]);

    useEffect(() => {
        const handleCategoryUpdate = async () => {
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await updateCategory(categoryToUpdate as Category, categoryToUpdate?.id);
                if (response) throw new Error("Failed to update category");
                setSuccessMessage("Category updated successfully");
                const updatedCategories = categories.map(category => category.id === categoryToUpdate?.id ? categoryToUpdate : category);
                setCategories(updatedCategories);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setCategoryToUpdate(null);
                setOpenSnackbar(true);
            }
        }
        if (categoryToUpdate) handleCategoryUpdate();
    }, [categoryToUpdate]);

    useEffect(() => {   
        const handleCategoryDelete = async () => {
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await deleteCategory(categoryToDelete as string);
                if (response) throw new Error("Failed to delete category");
                setSuccessMessage("Category deleted successfully");
                const updatedCategories = categories.filter(category => category.id !== categoryToDelete);
                setCategories(updatedCategories);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setCategoryToDelete(null);
                setOpenSnackbar(true);
            }
        }
        if (categoryToDelete) handleCategoryDelete();
    }, [categoryToDelete]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & { "category-name": { value: string }; };
        const categoryName = target["category-name"].value;

        if (categoryName.length < CATEGORY_NAME_MIN_LENGTH || categoryName.length > CATEGORY_NAME_MAX_LENGTH 
            || SPECIAL_CHARS_REGEX.test(categoryName)) {
            setError(`Category name must be between ${CATEGORY_NAME_MIN_LENGTH}-${CATEGORY_NAME_MAX_LENGTH} characters (space/digits allowed)`);
            setOpenSnackbar(true);
            return;
        }

        if (categories.some(category => category.type === categoryName)) {
            setError("Category name already exists");
            setOpenSnackbar(true);
            return;
        }
    
        if (addCategoryMode) {
            if (categoryName && selectedIcon) {                
                setNewCategory({ type: categoryName, imgSrc: selectedIcon, imgAlt: categoryName, user: isLoggedIn.user });
                setAddCategoryMode(false);
                setSelectedIcon("");
                setSearchTerm("");
                setFoundIcons([]);
            }
            else {
                setError("Please select a category icon and provide a name");
                setOpenSnackbar(true);
            }
        }

        if (editedCategory) {
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
            else {
                setError("Please select a category icon and provide a name");
                setOpenSnackbar(true);
            }
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

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
            <Box className="categories-box">
                { dialog.open && <ConfirmDialog dialog={dialog} setDialog={setDialog} deleteHandler={setCategoryToDelete} /> }
                {categories.length > 0 ?
                    <List className="categories-list">
                        <Typography variant="h6"> Existing Categories </Typography>

                        {categories.map((category) => (
                            <ListItem key={category.id} className={isMobile ? "category-item-mobile" : "category-item"}>
                                <ListItemAvatar>
                                    <Avatar> <img src={category.imgSrc} alt={category.imgAlt} /> </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={<span> {category.type} </span>} />

                                <Box sx={{ display: 'none', flexDirection: isMobile ? 'column' : 'row', gap: 1 }} className="category-buttons">
                                    <Tooltip title="Edit" arrow>
                                        <Button onClick={() => handleEdit(category)}>
                                            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <Button onClick={() => setDialog({ open: true, id: category.id })}>
                                            <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </ListItem>
                        ))}                                                 

                        {(addCategoryMode || editedCategory) &&                             
                            <Box component="form" className="category-details" onSubmit={handleSubmit}>
                                <Typography variant="h6"> {addCategoryMode ? "Add Category" : "Edit Category"} </Typography>

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

                                    {addCategoryMode && 
                                        <TextField type="text" id="category-name" label="Category Name" variant="outlined" required />
                                    }

                                    {editedCategory && <img src={selectedIcon ? selectedIcon : editedCategory.imgSrc} alt="category-icon" onClick={() => setShowIconSearch(true)} 
                                        className="selected-icon" />}                                    

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
                    </List>
                    :   <div className="message-box">
                            <h2>No Categories Found</h2>
                        </div>
                }              

                {loading ?
                        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                            <CircularProgress color="success" size='3rem' />
                        </Stack> 
                        : (!addCategoryMode && !editedCategory) && 
                        <Button onClick={handleAddCategoryButtonClick} id='add-category-button'><AddBox style={{fontSize: 40 }} /></Button>
                }
                        
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 8 }}
                >
                    <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} variant="filled">
                        {error ? error : successMessage}
                    </Alert>
                </Snackbar>
            </Box>
        );
}
    
export default Categories;