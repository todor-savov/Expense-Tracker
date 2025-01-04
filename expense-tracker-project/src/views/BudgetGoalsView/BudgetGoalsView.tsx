import { useState } from "react";
import Header from "../../components/Header/Header";
import BudgetGoals from "../../components/BudgetGoals/BudgetGoals";
import Footer from "../../components/Footer/Footer";

const BudgetGoalsView = () => {
    const [isLimitChanged, setIsLimitChanged] = useState<boolean>(false);
    
    return (
        <>
            <Header from={"Budget & Goals"} isLimitChanged={isLimitChanged} /> 
            <div className="central-container">
                <BudgetGoals isLimitChanged={isLimitChanged} setIsLimitChanged={setIsLimitChanged} />
            </div>
            <Footer />
        </>
    );
}

export default BudgetGoalsView;