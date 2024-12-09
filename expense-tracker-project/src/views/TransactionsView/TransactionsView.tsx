import Header from "../../components/Header/Header";
import AllTransactions from "../../components/AllTransactions/AllTransactions";
import Footer from "../../components/Footer/Footer";

const TransactionsView = () => {

    return (
        <div>
            <Header from={"Transactions"} />
            <AllTransactions />
            <Footer />
        </div>        
    );
};

export default TransactionsView;
