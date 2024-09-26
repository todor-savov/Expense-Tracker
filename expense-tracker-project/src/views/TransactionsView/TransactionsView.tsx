import AllTransactions from "../../components/AllTransactions/AllTransactions";
import Header from "../../components/Header/Header";

const TransactionsView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Transactions"} />
            </div>
            <AllTransactions />
        </div>
    );
};

export default TransactionsView;
