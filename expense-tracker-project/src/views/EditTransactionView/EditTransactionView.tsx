import Header from "../../components/Header/Header";
import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Footer from "../../components/Footer/Footer";

const EditTransactionView = () => {
    
    return (
        <div>
            <Header from={"Edit Transaction"} />
            <AddTransaction mode="edit" />
            <Footer />
        </div>
    );
}

export default EditTransactionView;

