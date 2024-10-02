const ResetPasswordView = () => {   

    const queryParams = new URLSearchParams(location.search);
    console.log(queryParams);
    const oobCode = queryParams.get('oobCode');
    console.log(oobCode);


    
    return (
        <div>
            <h1>Reset Password</h1>
        </div>
    );
}
export default ResetPasswordView;