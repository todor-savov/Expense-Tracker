import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton } from "@mui/material";
import { Copyright } from "@mui/icons-material";
import './Footer.css';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer>
            <AppBar position="static" id='page-footer'>
                <Toolbar>
                    <Box className="footer-container-left">
                        <IconButton color="inherit" aria-label="menu" onClick={() => navigate('/about')}>
                            Author
                        </IconButton>
                        <IconButton color="inherit" aria-label="menu" onClick={() => navigate('/faq')}>
                            FAQ
                        </IconButton>
                    </Box>

                    <span id='year-span'> 
                        <Copyright color="inherit" /> 2024 Todor Savov 
                    </span>                                                                   
                </Toolbar>
            </AppBar>
        </footer>
    )
}

export default Footer;
