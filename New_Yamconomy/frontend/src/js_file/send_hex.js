//import './web3.min.js';
const ABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "A_num",
                    "type": "uint256"
                },
                {
                    "name": "H_value",
                    "type": "bytes32"
                }
            ],
            "name": "Write_Review",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "Article_num",
            "outputs": [
                {
                    "name": "Hashing_value",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "A_num",
                    "type": "uint256"
                }
            ],
            "name": "Review_Verification",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]

export default function make_transaction_to_contract(sendnum, h_temp) {

    // if (typeof window.ethereum !== 'undefined'|| (typeof window.web3 !== 'undefined')) {
    //     alert("plz Install Metamask");  return;
    // }

    const contractInstance = window.web3.eth.contract(ABI).at("0x63D299614dce54Fe198f09DaDF6EfE04ADA435D7");
    //console.log(contractInstance)

    window.ethereum.enable().then(function (accounts) {
    //Web3.eth.getAccounts(function(error,accounts){ 

        if (accounts.length == 0) {
            alert("plz MetaMask longin");
            console.log("plz Metamask login");
            return;
        };
        // console.log("get account");
        // console.log(accounts[0]);
        var User_account = accounts[0];
        console.log(User_account);
	
	console.log(sendnum + " 을 인덱스로 체인에 해싱값을 등록");

        contractInstance.Write_Review(sendnum, h_temp, { from: User_account, value: 100 }, function (error, result) { });
        alert("transaction occured successfully");
        console.log("transaction occured successfully");

    }).catch(function (error) {
        alert("plz hashing first");
        console.error(error)
    });


}
