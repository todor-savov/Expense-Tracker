import Header from "../../components/Header/Header";
import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Footer from "../../components/Footer/Footer";

const AddTransactionView = () => {

    return (
        <>
            <Header from={"Add Transaction"} />
            <div className="central-container">
                <AddTransaction mode="new" />
            </div>
            <Footer />
        </>
    );
}

export default AddTransactionView;