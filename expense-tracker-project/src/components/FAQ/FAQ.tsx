import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './FAQ.css';

const FAQ = () => {

    const content = [
        {
            title: 'What is the purpose of this app?',
            description: 'This app helps you track expenses and manage your budget effectively.'
        },
        {
            title: 'How do I change the default currency for my transactions?',
            description: 'To change the default currency, go to Profile icon - Settings - Currency, select your preferred currency from the drop-down menu, and click Save.'
        },
        {
            title: 'How do I change my password?',
            description: 'Go to Profile icon - Profile menu, where you’ll need to enter your current password along with the new password to make the change.'
        },
        {
            title: 'Can I update the email or username on my profile?',
            description: 'No, you cannot change the email or username linked to your account. You can update your first and last name, photo, phone number, and password.'
        },
        {
            title: 'What are activity notifications, and how do I enable or disable them?',
            description: 'Activity notifications alert you when no transactions have been recorded in the past 3 days. If enabled from Settings, these notifications appear in the message box next to the Profile icon. To silence them, turn them off in Settings.'
        },
        {
            title: 'How can I add a new transaction?',
            description: 'To add a transaction, go to Navigation menu - Transactions, click the "+" symbol below the table, fill in all required fields (sales receipt is optional), and click Save.'
        },
        {
            title: 'How do I edit an existing transaction?',
            description: 'To edit a transaction, go to Navigation menu - Transactions, hover over the transaction you want to update, and click the Edit (pencil icon) button. All transaction details can be modified.'
        },
        {
            title: 'Can I delete an existing transaction, and if so, how?',
            description: 'Yes, you can delete a transaction by going to Navigation menu - Transactions, hovering over the transaction row, and clicking the Delete (trash icon) button. This removes it from the database and the Transactions page.'
        },
        {
            title: 'How can I create a new category to classify my transactions?',
            description: 'To create a category, go to Navigation menu - Categories, click the "+" symbol, enter a name, and select an icon by clicking "Select an icon." Click Save to add the new category.'
        },
        {
            title: 'How can I edit an existing category?',
            description: 'To update a category, go to Navigation menu - Categories, locate the desired category, and click the Edit (pencil icon) button. Adjust the name or icon as needed, then save your changes.'
        },
        {
            title: 'How can I delete an existing category?',
            description: 'To delete a category, go to Navigation menu - Categories, locate the category, and click the Delete (trash icon) button. Confirm to permanently remove it from your list.'
        },
        {
            title: 'How can I preview the transactions I have registered?',
            description: 'To view your registered transactions, go to the Navigation menu - Transactions. Here, you’ll find a table displaying all recorded transactions, along with details like date, category, name, amount, payment method and sales receipt if any.'
        },
        {
            title: 'Is it possible to filter through the transactions table by column?',
            description: 'Yes, you can filter transactions directly in the Transactions table. Click on the magnifying glass icon in the header of any column (such as Date, Category, Name, Amount, Payment or Receipt) to apply filters that narrow down the displayed transactions according to your preferences.'
        }, 
        {
            title: 'Is it possible to sort transactions in ascending or descending order using different columns as criteria?',
            description: 'Yes, you can sort the transactions in the table by any column, such as Date, Category, Name, Amount, Payment or Receipt. By default, all transactions are sorted by the Date column in descending order (from most recent to oldest). To change the sorting column, hover over the column header to reveal an upward or downward arrow for ascending or descending order, respectively. Click on the icon to apply the sorting.'
        },  
        {
            title: 'Is there a way to preview transactions data in the form of a chart?',
            description: 'Yes, navigate to Overview & Stats in the Navigations menu and use the slider to switch between snapshot mode (Period Overview) and trend mode (Progress over time). Each mode offers options to view data by year or month. When Period Overview is active, selecting a month or year will display a snapshot of that period’s data as a pie chart. In Progress over time mode, selecting Monthly (All years) or Monthly (Current year) will show monthly data for the chosen period as a line chart, while choosing Yearly will display yearly data over the selected timeframe, also in a line chart.'
        },                
    ];
    
    return (
        <div className='faq-container'>
            {content.map((item, index) => (
                <Accordion key={index} elevation={3} id='faq-accordion'>
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />} id="header-question">
                        <Typography id='faq-title'>
                            {item.title}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography id='faq-description' color="textSecondary">
                            {item.description}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}                    
        </div>
    );
}

export default FAQ;

