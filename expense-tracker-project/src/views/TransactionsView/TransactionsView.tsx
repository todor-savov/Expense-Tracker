import Header from "../../components/Header/Header";
import AllTransactions from "../../components/AllTransactions/AllTransactions";
import Footer from "../../components/Footer/Footer";

const TransactionsView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Transactions"} />
            </div>
            <AllTransactions />
            <Footer />
        </div>        
    );
};

export default TransactionsView;
