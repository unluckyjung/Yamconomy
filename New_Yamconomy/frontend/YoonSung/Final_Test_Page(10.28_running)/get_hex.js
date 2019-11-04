function get_hex_from_contract(s) {
    var Web3 = require("web3");

    //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"))
    //ropsten이라고 명시해줘야함.

    //var contract = web3.eth.contract(ABI_CODE).at(ADDRESS);
    //ABI_CODE에 만들어진 contract ABI 따와서 넣고
    //ADDRESS는 문자열 형식으로 넣어야함

    var contract = web3.eth.contract(ABI).at("0x63D299614dce54Fe198f09DaDF6EfE04ADA435D7");

    var hexnum = s
    var hexvalue = contract.Review_Verification(hexnum);
    
    return hexvalue;
}