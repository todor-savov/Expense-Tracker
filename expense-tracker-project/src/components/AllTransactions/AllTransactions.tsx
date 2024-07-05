import { useNavigate } from "react-router-dom";

const AllTransactions = () => {
    const navigate = useNavigate();

    return (
        <>
        
            <button onClick={() => navigate('/add-transaction')}>Add new transaction</button>
        </>
    );
}

export default AllTransactions;

