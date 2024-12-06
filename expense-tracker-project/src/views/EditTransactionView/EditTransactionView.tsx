import Header from "../../components/Header/Header";
import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Footer from "../../components/Footer/Footer";

const EditTransactionView = () => {
    
    return (
        <div>
            <div className="header-container">
                <Header from={"Edit Transaction"} />
            </div>
            <AddTransaction mode="edit" />
            <Footer />
        </div>
    );
}

export default EditTransactionView;

