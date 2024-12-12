import Header from "../../components/Header/Header";
import AllTransactions from "../../components/AllTransactions/AllTransactions";
import Footer from "../../components/Footer/Footer";

const TransactionsView = () => {

    return (
        <>
            <Header from={"Transactions"} />
            <div className="central-container">
                <AllTransactions />
            </div>
            <Footer />
        </>        
    );
};

export default TransactionsView;
