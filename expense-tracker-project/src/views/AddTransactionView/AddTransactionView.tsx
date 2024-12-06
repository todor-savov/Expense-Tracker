import Header from "../../components/Header/Header";
import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Footer from "../../components/Footer/Footer";

const AddTransactionView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Add Transaction"} />
            </div>
            <AddTransaction mode="new" />
            <Footer />
        </div>
    );
}

export default AddTransactionView;