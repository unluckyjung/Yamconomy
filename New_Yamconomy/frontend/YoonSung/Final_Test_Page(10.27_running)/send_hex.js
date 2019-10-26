function make_transaction_to_contract(sendnum, h_temp) {

    const contractInstance = web3.eth.contract(ABI).at("0x63D299614dce54Fe198f09DaDF6EfE04ADA435D7");
    //console.log(contractInstance)

    ethereum.enable().then(function (accounts) {

        if (accounts.length == 0) {
            console.log("plz metamask login");
            return;
        };
        // console.log("get account");
        // console.log(accounts[0]);
        var User_account = accounts[0];
        console.log(User_account);

        contractInstance.Write_Review(sendnum, h_temp, { from: User_account, value: 100 }, function (error, result) { });
    });

    console.log("transaction occured successfully");
}