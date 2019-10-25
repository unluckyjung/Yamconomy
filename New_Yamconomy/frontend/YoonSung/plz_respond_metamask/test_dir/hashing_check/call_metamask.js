function metamask() {


    ethereum.enable().then(function (accounts) {
        //계정을 불러온다.
        console.log("call account");
    });
    
    var Web3 = require("web3");
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"))

    var contract = web3.eth.contract([
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
    ]).at("0x63D299614dce54Fe198f09DaDF6EfE04ADA435D7");



}