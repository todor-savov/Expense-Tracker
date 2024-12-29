import Header from "../../components/Header/Header";
import BudgetGoals from "../../components/BudgetGoals/BudgetGoals";
import Footer from "../../components/Footer/Footer";

const BudgetGoalsView = () => {
    
    return (
        <>
            <Header from={"Budget & Goals"} /> 
            <div className="central-container">
                <BudgetGoals />
            </div>
            <Footer />
        </>
    );
}

export default BudgetGoalsView;