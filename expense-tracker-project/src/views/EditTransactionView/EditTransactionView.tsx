import Header from "../../components/Header/Header";
import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Footer from "../../components/Footer/Footer";

const EditTransactionView = () => {
    
    return (
        <>
            <Header from={"Edit Transaction"} />
            <div className="central-container">
                <AddTransaction mode="edit" />
            </div>
            <Footer />
        </>
    );
}

export default EditTransactionView;

