export const NAME_MIN_CHARS = 1;
export const NAME_MAX_CHARS = 30;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_CHARS = 8;
export const PASSWORD_MAX_CHARS = 30;
export const PHONE_DIGITS = 10;
export const PHONE_REGEX = /^\d{10}$/;
export const STREET_MIN_CHARS = 1;
export const STREET_MAX_CHARS = 40;
export const STREET_REGEX = /^[a-zA-Z0-9 .]{1,40}$/;
export const COUNTRY_MIN_CHARS = 1;
export const COUNTRY_MAX_CHARS = 30;
export const COUNTRY_REGEX = /^[a-zA-Z ]{1,30}$/;
export const CITY_MIN_CHARS = 1;
export const CITY_MAX_CHARS = 30;
export const CITY_REGEX = /^[a-zA-Z ]{1,30}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const DIGIT_REGEX = /\d/;
export const LETTER_REGEX = /[a-zA-Z]/;
export const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
export const DEFAULT_IMAGE = 'https://tse1.mm.bing.net/th?q=blank%20profile%20picture%20image';
export const MAX_YEAR_SPAN = 3;
export const DEFAULT_EVENT_IMAGE = 'https://leekduck.com/assets/img/events/events-default.jpg';
export const SAVE_CATEGORY_ICON = 'https://img.icons8.com/ios/100/40C057/ok--v1.png';
export const CANCEL_CATEGORY_ICON = 'https://img.icons8.com/color/96/cancel--v1.png';
/* User images */
export const TODOR_SAVOV_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/expense-tracking-app-33495.appspot.com/o/users%2FIMG_0597.jpeg?alt=media&token=c0f116a5-bfa0-4a56-baeb-142247a94045';
export const EXPENSE_NAME_MIN_CHARS = 1;
export const EXPENSE_NAME_MAX_CHARS = 25;
export const AMOUNT_MIN_CHARS = 1;
export const AMOUNT_MAX_CHARS = 10;
export const ALPHA_NUMERIC_SPACE_REGEX = /^[a-zA-Z0-9\s]+$/;
export const ALPHA_SPACE_REGEX = /^[a-zA-Z\s]+$/;
export const LETTERS_ONLY_REGEX = /^[a-zA-Z]+$/;
export const CATEGORY_NAME_MIN_LENGTH = 3;
export const CATEGORY_NAME_MAX_LENGTH = 15;
export const FEEDBACK_MAX_CHARS = 300;

import CASH_REGISTER_ICON from '../assets/cash_register_icon.png';
import CATEGORY_ICON from '../assets/category_icon.png';
import TABLE_ICON from '../assets/table_icon.png';
import GRAPH_ICON from '../assets/graph_icon.png';
import LATEST_TRANSACTIONS_ICON from '../assets/latest_transactions_icon.png';
import BUDGET_ICON from '../assets/budget_icon.png';

export const APP_FEATURES = [
    {
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
    }
];

export const CLIENT_FEEDBACK = [
    {
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
    }
];

export const DEMO_VIEWS = [
    {
        description: "View and manage your transactions with ease.",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/expense-tracking-app-33495.appspot.com/o/demo_views%2FTransactionsView.png?alt=media&token=10446e8f-f2a5-4b95-a270-30aad165480d",
        link: "/transactions"
    },
    {
        description: "Organize your transactions into categories.",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/expense-tracking-app-33495.appspot.com/o/demo_views%2FCategoriesView.png?alt=media&token=0eea11f9-77f8-428f-b2d4-891751e9f82b",
        link: "/categories"
    },
    {
        description: "Generate reports to analyze your spending habits.",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/expense-tracking-app-33495.appspot.com/o/demo_views%2FPieChartView.png?alt=media&token=25400521-9135-4256-bd91-4aacf9af3da7",
        link: "/overview"
    },
    {
        description: "Set your budget and stay on track with your financial goals.",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/expense-tracking-app-33495.appspot.com/o/demo_views%2FBudgetView.png?alt=media&token=803bb586-e88d-48a9-9c1d-31a7d69bfaac",
        link: "/budget-goals"
    },
    {
        description: "Customize app settings to enhance your experience.",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/expense-tracking-app-33495.appspot.com/o/demo_views%2FSettingsView.png?alt=media&token=a5ba395f-d53b-4835-bbd5-d7ab60eed8df",
        link: "/settings"
    }
];

import PARTNER_LOGO_1 from '../assets/revolut_logo.png';
import PARTNER_LOGO_2 from '../assets/pocketguard_logo.webp';
import PARTNER_LOGO_3 from '../assets/stripe_logo.png';
import PARTNER_LOGO_4 from '../assets/coinbase_logo.png';
import PARTNER_LOGO_5 from '../assets/quickbooks_logo.png';
import PARTNER_LOGO_6 from '../assets/investopedia_logo.webp';
import PARTNER_LOGO_7 from '../assets/robinhood_logo.png';

export const PARTNER_LOGOS = [
    {
        name: "Revolut",
        image: PARTNER_LOGO_1
    },
    {
        name: "PocketGuard",
        image: PARTNER_LOGO_2
    },
    {
        name: "Stripe",
        image: PARTNER_LOGO_3
    },
    {
        name: "Coinbase",
        image: PARTNER_LOGO_4
    },
    {
        name: "Intuit QuickBooks",
        image: PARTNER_LOGO_5
    },
    {
        name: "Investopedia",
        image: PARTNER_LOGO_6
    },
    {
        name: "Robinhood",
        image: PARTNER_LOGO_7
    }
]