import { Box, Typography, Avatar, Tooltip, IconButton } from '@mui/material';
import { FaReact, FaJsSquare, FaHtml5 } from 'react-icons/fa';
import { SiTypescript, SiFirebase, SiCss3 } from 'react-icons/si';
import ownPhoto from '../../assets/IMG_0004-Photoroom.png';
import MaterialUILogo from '../../assets/MaterialUILogo.png';
import './About.css';
import { Email, GitHub, LinkedIn } from '@mui/icons-material';

const About = () => {
    
    const techStack = [
        { name: 'React', icon: <FaReact color="#61DBFB" className='tech-icon' /> },
        { name: 'JavaScript', icon: <FaJsSquare color="#F0DB4F" className='tech-icon' /> },
        { name: 'TypeScript', icon: <SiTypescript color="#007ACC" className='tech-icon' /> },
        { name: 'Firebase', icon: <SiFirebase color="#FFCA28" className='tech-icon' /> },
        { name: 'MaterialUI', icon: <img src={MaterialUILogo} className='tech-icon' />},
        { name: 'HTML5', icon: <FaHtml5 color="#E34F26" className='tech-icon' /> },
        { name: 'CSS', icon: <SiCss3 color="#1572B6" className='tech-icon' /> }
    ];

    const introText = 
        `   I am a versatile front-end developer with a unique blend of experience in business, finance, and technology. 
            My journey began with a Master's in European Business and Finance from Nottingham Business School, which provided 
            me with a solid understanding of the business landscape. Driven by a passion for technology, I later pursued a 
            second Master’s degree in Distributed Systems and Mobile Technologies at Sofia University St. Kliment Ohridski, 
            where I discovered my enthusiasm for programming and problem-solving.

            My transition into front-end development began with hands-on projects, including creating dynamic, user-focused 
            applications using React, TypeScript, and Firebase. Alongside my technical expertise, my background in technical 
            support at SiteGround honed my skills in troubleshooting, attention to detail, and effective communication. 
            Today, I am passionate about building interactive, responsive applications and continuously expanding my skills in 
            JavaScript and front-end technologies.
        `;

  return (        
        <Box id="main-container">
            <Box id="intro-container">
                <Box id='intro-photo-box'>
                    <Avatar src={ownPhoto} alt="Todor-Savov" variant='square' id='avatar-photo' />

                    <Box id='intro-social-icons'>
                        <Tooltip title="GitHub" placement="top" arrow>
                            <IconButton
                                component="a"
                                href="https://github.com/todor-savov"
                                target="_blank"
                                aria-label="GitHub"
                                rel="noopener noreferrer"
                            >
                                <GitHub id='github-icon' />
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
                                <LinkedIn id='linkedin-icon' />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Email" placement="top" arrow>
                            <IconButton
                                component="a"
                                href="mailto:todor.savov@abv.bg"
                                aria-label="Email"
                            >
                                <Email id='email-contact-icon' />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Typography color="text.secondary" id='about-me-text'> {introText} </Typography>                                          
            </Box>
                   
            <Box id='container-scroll'>
                <Box id='scroll'>
                    {[...techStack, ...techStack].map((tech, index) => (
                        <Box key={index} className='tech-item'>
                            {tech.icon}
                            <Typography id='tech-name'> {tech.name} </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
  );
};

export default About;