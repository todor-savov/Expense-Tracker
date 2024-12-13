import { useNavigate } from 'react-router-dom';
import YOUR_APP_LOGO from '../../assets/app_logo.png';
import CASH_REGISTER_ICON from '../../assets/cash_register_icon.png';
import CATEGORY_ICON from '../../assets/category_icon.png';
import TABLE_ICON from '../../assets/table_icon.png';
import GRAPH_ICON from '../../assets/graph_icon.png';
import LATEST_TRANSACTIONS_ICON from '../../assets/latest_transactions_icon.png';
import BUDGET_ICON from '../../assets/budget_icon.png';
import { TODOR_SAVOV_IMAGE } from '../../common/constants';
import { Box, Button, Card, CardContent, Rating, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './HomePublic.css';

const HomePublic = () => {
    const navigate = useNavigate();
    
    return (
        <Box sx={{ width: '100%' }}>
            <Box className="hero-section">
                <Box className="hero-content">
                    <Box className="logo-headline-container">
                        <img src={YOUR_APP_LOGO} alt="App Logo" className="app-logo" />
                        <Typography variant="h4" sx={{'fontSize': '1.5rem', 'fontWeight': 'bold'}}> 
                            Take Control of Your Finances Today! 
                        </Typography>
                    </Box>
                    <Box className="hero-buttons">
                        <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                        <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    </Box>
                </Box>
                <Box className="hero-background" />
            </Box>

            <Typography variant="h5">Why Choose Us?</Typography>
            <Box className='features'>
                {[{
                    img: CASH_REGISTER_ICON,
                    title: "Register Your Transactions",
                    description: "Record your expenses with a simple and user-friendly interface."
                },
                {
                    img: CATEGORY_ICON,
                    title: "Customize Your Categories",
                    description: "Create new categories tailored to your needs with custom icons and titles."
                },
                {
                    img: TABLE_ICON,
                    title: "Review Transactions Easily",
                    description: "Sort and filter through all transactions in a comprehensive table view."
                },
                {
                    img: GRAPH_ICON,
                    title: "Visualize Your Data",
                    description: "Preview your transaction data through intuitive graphs in snapshot or trend view modes."                    
                },
                {
                    img: LATEST_TRANSACTIONS_ICON,
                    title: "View Latest Transactions",
                    description: "Stay up-to-date with your recent financial activities."
                },
                {
                    img: BUDGET_ICON,
                    title: "Manage Your Budgets",
                    description: "Create budgets for each category and receive alerts when your spending exceeds the limit."
                }].map((feature, index) => (
                    <Card key={index}>
                        <CardContent>
                            <Typography variant="h6"><strong>{feature.title}</strong></Typography>
                            <img src={feature.img} alt={feature.title} />
                            <Typography variant="body2">{feature.description}</Typography>
                        </CardContent>
                    </Card>
                ))}                
            </Box>

            <Box>
                <Typography variant="h5"> Why Our Users Love Us </Typography>            
                <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    spaceBetween={50} slidesPerView={1} pagination={{ clickable: true, dynamicBullets: true, bulletClass: 'swiper-pagination-bullet', bulletActiveClass: 'swiper-pagination-bullet-active' }}
                    onSwiper={() => {}} onSlideChange={() => {}} className="swiper"
                >
                    {[{
                        img: TODOR_SAVOV_IMAGE,
                        name: "Sophia M.",
                        text: "This budgeting app has completely changed my financial game!",
                        rating: 5,
                        quote: "The intuitive interface and customizable categories have made it so easy for me to track my spending. I finally feel in control of my finances!"
                    },
                    {
                        img: TODOR_SAVOV_IMAGE,
                        name: "James T.",
                        text: "I've used many finance apps, but none compare to this one!",
                        rating: 5,
                        quote: "The real-time transaction tracking and beautiful graphs help me visualize my spending habits like never before. Highly recommend!"
                    },
                    {
                        img: TODOR_SAVOV_IMAGE,
                        name: "Emily R.",
                        text: "The alerts for budget limits have saved me from overspending multiple times!",
                        rating: 5,
                        quote: "This app is user-friendly and makes managing my finances feel effortless. I love it!"
                    },
                    {
                        img: TODOR_SAVOV_IMAGE,
                        name: "Liam K.",
                        text: "What I love most about this app is its simplicity!",
                        rating: 5,
                        quote: "Setting up my categories and tracking my expenses is a breeze. It’s helped me save money and stay on budget!"
                    },
                    {
                        img: TODOR_SAVOV_IMAGE,
                        name: "Olivia W.",
                        text: "Finally, a budgeting tool that works for me!",
                        rating: 5,
                        quote: "I appreciate the detailed reports and insights that help me understand my spending patterns. This app is a must-have for anyone looking to manage their money better."
                    }].map((testimonial, index) => (
                        <SwiperSlide key={index} className="swiper-slide">
                            <img src={testimonial.img} alt={testimonial.name} className="testimonial-image" />
                            <div className="testimonial-content">
                                <Typography variant="h6"><strong>"{testimonial.text}"</strong></Typography>
                                <Rating value={testimonial.rating} readOnly className='rating' />
                                <blockquote>"{testimonial.quote}"</blockquote>
                                <cite>— {testimonial.name}</cite>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>       
            </Box>    
        </Box>
    )
}

export default HomePublic;