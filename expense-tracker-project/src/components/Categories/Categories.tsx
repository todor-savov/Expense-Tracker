import React, { useContext, useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Modal, Popover, Snackbar, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { AddBox } from "@mui/icons-material";
import { GridAddIcon } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/AuthContext";
import { searchIcons } from "../../service/icons-service";
import { createCategory, deleteCategory, updateCategory, getCategories } from "../../service/database-service";
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
    const [onSaveError, setOnSaveError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [showIconSearch, setShowIconSearch] = useState<boolean>(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string|null>(null);
    const [editedCategory, setEditedCategory] = useState<Category|null>(null);
    const [categoryToUpdate, setCategoryToUpdate] = useState<Category|null>(null);
    const [dialog, setDialog] = useState<Dialog>({ open: false, id: null });
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [selectedCategoryItem, setSelectedCategoryItem] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categories = await getCategories(isLoggedIn.user);
                if (typeof categories === 'string') throw new Error('Error fetching categories');
                if (categories.length > 0) setCategories(categories);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();

        return () => {
            setError(null);
            setCategories([]);
        }
    }, []);

    useEffect(() => {
        const search = async () => {
            try {
                setOnSaveError(null);
                setFoundIcons([]);
                const response = await searchIcons(searchTerm);
                if (typeof response === 'string') throw new Error("Error fetching icons");
                setFoundIcons(response.icons);
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);
            }
        }
        if (searchTerm) search();
    }, [searchTerm]);

    useEffect(() => {
        const addNewCategory = async () => {   
            try {
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await createCategory(newCategory as NewCategory);
                if (!response) throw new Error("Failed to create category");
                setSuccessMessage("Category created successfully");
                setCategories([...categories, { id: response, type: newCategory?.type || "", imgSrc: newCategory?.imgSrc 
                    || "", imgAlt: newCategory?.imgAlt || "", user: newCategory?.user || "" }]);
            } catch (error: any) {
                setOnSaveError(error.message);
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
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await updateCategory(categoryToUpdate as Category, categoryToUpdate?.id);
                if (response) throw new Error("Failed to update category");
                setSuccessMessage("Category updated successfully");
                const updatedCategories = categories.map(category => category.id === categoryToUpdate?.id ? categoryToUpdate : category);
                setCategories(updatedCategories);
            } catch (error: any) {
                setOnSaveError(error.message);
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
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await deleteCategory(categoryToDelete as string);
                if (response) throw new Error("Failed to delete category");
                setSuccessMessage("Category deleted successfully");
                const updatedCategories = categories.filter(category => category.id !== categoryToDelete);
                setCategories(updatedCategories);
            } catch (error: any) {
                setOnSaveError(error.message);
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
            setOnSaveError(`Category name must be between ${CATEGORY_NAME_MIN_LENGTH}-${CATEGORY_NAME_MAX_LENGTH} characters (space/digits allowed)`);
            setOpenSnackbar(true);
            return;
        }

        if (categories.some(category => category.type === categoryName)) {
            setOnSaveError("Category name already exists");
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
                setOnSaveError("Please select a category icon and provide a name");
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
                setOnSaveError("Please select a category icon and provide a name");
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
        handlePopoverClose();
    }  

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    const handleCategoryItemClick = (event: React.MouseEvent<HTMLElement>, category: string) => {
        setSelectedCategoryItem(category);
        setAnchorEl(event.currentTarget);
    }

    const handlePopoverClose = () => {
        setSelectedCategoryItem("");
        setAnchorEl(null);
    }

    return (
            <Box id="categories-box">
                {error ?  
                    <Box className="message-box">
                        <Typography>There was a problem loading your data. Please try again later.</Typography>
                    </Box>
                    :
                    (categories.length === 0 ? 
                        <Box className="message-box">
                            <Typography>No categories found.</Typography>
                        </Box>
                        :       
                        <>
                            <Typography id='page-title'> Existing Categories </Typography>    

                            <List className="categories-list">                            
                                {categories.map((category) => (
                                    <React.Fragment key={category.id}>
                                        <Tooltip title={"Click to edit/delete this category"} arrow>
                                            <ListItem onClick={(event) => handleCategoryItemClick(event, category.type)} className="category-item">
                                                <ListItemAvatar>
                                                    <img src={category.imgSrc} alt={category.imgAlt} />
                                                </ListItemAvatar>

                                                <ListItemText primary={<span className="category-title"> {category.type} </span>} />                                   
                                            </ListItem>
                                        </Tooltip>

                                        <Popover
                                            open={selectedCategoryItem === category.type}
                                            anchorEl={anchorEl}
                                            onClose={handlePopoverClose} 
                                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}                                        
                                        >
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
                                        </Popover>                                        
                                    </React.Fragment>
                                ))}
                            </List>
                        </>
                    )
                }                

                {(addCategoryMode || editedCategory) &&                          
                    <Box component="form" onSubmit={handleSubmit} id="category-form">
                        <Typography id='form-title'> {addCategoryMode ? "Add Category" : "Edit Category"} </Typography>
                        {/* First Row: Icon and Category Name */}
                        <div id="top-row">
                            {addCategoryMode && (
                                selectedIcon ? 
                                    <img src={selectedIcon} alt="category-icon" onClick={() => setShowIconSearch(true)} className="selected-icon" />
                                    :
                                    <div className="icon-placeholder" onClick={() => setShowIconSearch(true)}>
                                        <GridAddIcon style={{ fontSize: 50, color: "#9e9e9e" }} />
                                        <Typography variant="caption">Select an icon</Typography>
                                    </div>
                            )}

                            {addCategoryMode && 
                                <TextField type="text" id="category-name" label="Category Name" variant="outlined" required />
                            }

                            {editedCategory && 
                                <img src={selectedIcon ? selectedIcon : editedCategory.imgSrc} alt="category-icon" onClick={() => setShowIconSearch(true)} 
                                    className="selected-icon" />
                            }

                            {editedCategory &&
                                <TextField type="text" id="category-name" label="Category Name" variant="outlined" required                                    
                                    onChange={(e) => setEditedCategory({ ...editedCategory, type: e.target.value })} 
                                    value={editedCategory.type} 
                                />
                            }
                        </div>
                        {/* Second Row: Buttons */}
                        <div id="bottom-row">
                            <Button type="submit">
                                <img src={SAVE_CATEGORY_ICON} alt="save-button" />
                            </Button>
                            <Button onClick={handleCancelButtonClick}>
                                <img src={CANCEL_CATEGORY_ICON} alt="cancel-button" />
                            </Button>
                        </div>

                        <Modal open={showIconSearch} onClose={() => setShowIconSearch(false)} closeAfterTransition>
                            <Box className='icon-search'>
                                <TextField type="text" fullWidth id="search-input" helperText={"Search for category icons (provided by IconFinder)"} 
                                    onChange={(e) => setSearchTerm(e.target.value)} label="Search" variant="outlined" />

                                {foundIcons.length > 0 ?
                                    <Box className="icon-grid">
                                        {foundIcons.map((icon, index) => {
                                            const imageURL = icon.raster_sizes[icon.raster_sizes.length - 1].formats[0].preview_url;
                                            return <img key={index} onClick={() => handleIconSelect(imageURL)} src={imageURL} alt={icon.tags[0]} />
                                        })}
                                    </Box>
                                    : 
                                    'No icons found'
                                }
                            </Box>
                        </Modal>
                    </Box>
                }                                         

                {loading ?
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                        <CircularProgress color="success" size='3rem' />
                    </Stack> 
                : (!addCategoryMode && !editedCategory) && 
                    <Button onClick={handleAddCategoryButtonClick} id='add-category-button'>
                        <AddBox style={{fontSize: 40 }} />
                    </Button>
                }        
                        
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={(error || onSaveError) ? 'error' : 'success'} variant="filled">
                        {error ? error : (onSaveError ? onSaveError : successMessage)}
                    </Alert>
                </Snackbar>

                { dialog.open && <ConfirmDialog dialog={dialog} setDialog={setDialog} deleteHandler={setCategoryToDelete} /> }                
            </Box>
        );
}
    
export default Categories;