import Header from "../../components/Header/Header";
import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Footer from "../../components/Footer/Footer";

const AddTransactionView = () => {

    return (
        <div>
            <Header from={"Add Transaction"} />
            <AddTransaction mode="new" />
            <Footer />
        </div>
    );
}

export default AddTransactionView;