import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Rating, Typography } from '@mui/material';
import { APP_FEATURES, CLIENT_FEEDBACK, DEMO_VIEWS, PARTNER_LOGOS } from '../../common/constants';
import YOUR_APP_LOGO from '../../assets/app_logo.png';
import './HomePublic.css';

const HomePublic = () => {
    const navigate = useNavigate();
    const [demoImage, showDemoImage] = useState<string|null>(null);
    
    return (
        <Box id="home-public-container">
            {demoImage ? 
                <Box onClick={() => showDemoImage(null)}>
                    <img src={demoImage} alt="Demo" id="demo-image-full-screen" />
                </Box>
                :
                <React.Fragment>
                    <Box id="hero-section-container">
                        <span id='app-logo-container'>
                            <img src={YOUR_APP_LOGO} alt="AppLogo" id="app-logo" />
                            <Typography id='slogan-text'> Take Control of Your Finances Today! </Typography>
                        </span>

                        <Box id='hero-buttons-container'>
                            <Button variant="contained" onClick={() => navigate('/register')}> Register </Button>
                            <Button variant="outlined" onClick={() => navigate('/login')}> Login </Button>
                        </Box>
                    </Box>
            
                    <Typography id='section-title'>Why Choose Us?</Typography>

                    <Box id="features-container">
                        {APP_FEATURES.map((feature, index) => (
                            <Card key={index} className="feature-card">
                                <Typography id='feature-title'> {feature.title} </Typography>
                                <img className="feature-image" src={feature.img} alt="FeatureImage" />
                                <Typography id='feature-description'> {feature.description} </Typography>
                            </Card>
                        ))}
                    </Box>

                    <Typography id='section-title'> Explore the App </Typography>
                        
                    <Swiper className="swiper"
                        modules={[Autoplay, Pagination]} 
                        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        spaceBetween={20} 
                        pagination={{   
                            clickable: true, 
                            dynamicBullets: true, 
                            bulletClass: 'swiper-pagination-bullet', 
                            bulletActiveClass: 'swiper-pagination-bullet-active',
                        }}
                        breakpoints={{
                            1: { slidesPerView: 1 },
                            481: { slidesPerView: 2 },
                            769: { slidesPerView: 3 },
                            1025: { slidesPerView: 4 },
                        }}
                    >
                        {DEMO_VIEWS.map((view, index) => (
                            <SwiperSlide key={index} className="swiper-slide">
                                <Typography id='demo-view-text'> {view.description} </Typography>
                                <img src={view.imageURL} alt='demo-page' className="demo-view-image" onClick={() => showDemoImage(view.imageURL)} />
                                <Button variant='outlined' id='demo-view-button' onClick={() => navigate(view.link)}> View </Button>             
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <Typography id='section-title'> Why Our Users Love Us </Typography>            

                    <Swiper className="swiper"
                        modules={[Autoplay, Pagination]}                          
                        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        spaceBetween={50} 
                        pagination={{
                            clickable: true, 
                            dynamicBullets: true, 
                            bulletClass: 'swiper-pagination-bullet', 
                            bulletActiveClass: 'swiper-pagination-bullet-active',                                       
                        }}
                        breakpoints={{
                            1: { slidesPerView: 1 },
                            481: { slidesPerView: 2 },
                            769: { slidesPerView: 3 },
                            1025: { slidesPerView: 4 },
                        }}
                    >
                        {CLIENT_FEEDBACK.map((feedback, index) => (
                            <SwiperSlide key={index} className="swiper-slide">
                                <img src={feedback.img} alt={feedback.name} className="feedback-image" />
                                <Rating value={feedback.rating} readOnly />
                                <blockquote>"{feedback.quote}"</blockquote>
                                <cite>— {feedback.name}</cite>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <Typography id='section-title'> Our Trusted Partners </Typography>

                    <Box id="partners-container">
                        <Box id='partners-wrapper'>
                            {PARTNER_LOGOS.concat(PARTNER_LOGOS).map((logo, index) => (     
                                <img key={index} src={logo.image} alt="PartnerLogo" className="partner-logo-image" />
                            ))}
                        </Box>
                    </Box>
                </React.Fragment>
            } 
        </Box>
    )
}

export default HomePublic;