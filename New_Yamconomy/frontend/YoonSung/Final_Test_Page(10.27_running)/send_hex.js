function make_transaction_to_contract(sendnum, h_temp) {

    // if (typeof window.ethereum !== 'undefined'|| (typeof window.web3 !== 'undefined')) {
    //     alert("plz Install Metamask");  return;
    // }

    const contractInstance = web3.eth.contract(ABI).at("0x63D299614dce54Fe198f09DaDF6EfE04ADA435D7");
    //console.log(contractInstance)

    ethereum.enable().then(function (accounts) {

        if (accounts.length == 0) {
            alert("plz MetaMask longin");
            console.log("plz Metamask login");
            return;
        };
        // console.log("get account");
        // console.log(accounts[0]);
        var User_account = accounts[0];
        console.log(User_account);

        contractInstance.Write_Review(sendnum, h_temp, { from: User_account, value: 100 }, function (error, result) { });
        alert("transaction occured successfully");
        console.log("transaction occured successfully");

    }).catch(function (error) {
        alert("plz hashing first");
        console.error(error)
    });


}