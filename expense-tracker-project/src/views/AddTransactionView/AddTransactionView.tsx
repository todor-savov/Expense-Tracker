import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Header from "../../components/Header/Header";

const EditTransactionView = () => {
    
    return (
        <div>
            <div className="header-container">
                <Header from={"Edit Transaction"} />
            </div>
            <AddTransaction mode="edit" />
        </div>
    );
}

export default EditTransactionView;

