import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Tooltip } from "@mui/material";
import { Copyright, Email, GitHub, LinkedIn } from "@mui/icons-material";
import './Footer.css';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer>
            <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <Box className="footer-container-left">
                        <IconButton color="inherit" aria-label="menu" onClick={() => navigate('/about')}>
                            Author
                        </IconButton>
                        <IconButton color="inherit" aria-label="menu" onClick={() => navigate('/faq')}>
                            FAQ
                        </IconButton>
                    </Box>

                    <Box className="footer-container-right">
                        <Copyright /> 2024 Todor Savov
                        
                        <Tooltip title="GitHub" placement="top" arrow>
                            <IconButton
                                component="a"
                                href="https://github.com/todor-savov"
                                target="_blank"
                                aria-label="GitHub"
                                rel="noopener noreferrer"
                            >
                                <GitHub fontSize="medium" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="LinkedIn" placement="top" arrow>
                            <IconButton
                                component="a"
                                href="https://www.linkedin.com/in/todor-savov-4a14253b/"
                                target="_blank"
                                aria-label="LinkedIn"
                                rel="noopener noreferrer"
                            >
                                <LinkedIn fontSize="medium" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Email" placement="top" arrow>
                            <IconButton
                                component="a"
                                href="mailto:todor.savov@abv.bg"
                                aria-label="Email"
                            >
                                <Email fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
        </footer>
    )
}

export default Footer;