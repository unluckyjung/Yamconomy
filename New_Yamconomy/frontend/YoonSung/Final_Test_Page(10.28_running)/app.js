App = {
  web3Provider: null,
  contracts: {},
	

  initWeb3: function() {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }else{
      App.web3Provider = new web3.provider.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
		$.getJSON('Yamconomy.json',function(data){  //여기가 컨트랙(yamconomy)의 json을 여는곳.
      App.contracts.Yamconomy = TruffleContract(data);
      App.contracts.Yamconomy.setProvider(App.web3Provider);
      return App.loadReview();
    });
  },

  writeReview: function() {	
    var id = $('#id').val();
    var price = $('#price').val();
    var review = $('#review').val();
    var score = $('#score').val();
    var menu = $('#menu').val();



    ethereum.enable().then(function (accounts) {
      //계정을 불러온다.

      var account = accounts[0];
        //위에서 받은것들을 매개변수로 넘김
      App.contracts.Yamconomy.deployed().then(function(instance){ //yam.json으로 변경하여서 컨트랙 진행
        //배포가 되었다면 인스턴스를 받아라.
        var reviewUtf8Encoded = utf8.encode(review);
        var menuUtf8Encoded = utf8.encode(menu);
        //한글이 쓰이므로 인코딩이 필요함.(utf8.js 라이브러리 추가)
        return instance.writeReview(id, web3.toHex(reviewUtf8Encoded),score, web3.toHex(menuUtf8Encoded),{from: account, value: price});
        //매개변수로 data를 넘김
        //이때 리뷰는 인코딩 한걸 다시 Hex로 변환이 필요함.
        //0이더를 보냄으로써 기록함.

      }).then(function(){ //잘 작동을 한다면
        $('#review').val('');//이전에 모달에 입력된 내용들을 지운다.
        $('#score').val('');
        $('#menu').val('');
        $('#writeModal').modal('hide');
        return App.loadReview();
      }).catch(function(err){

        console.log(err.message);
      });
    });

  },

  addVote: function() {	
    var id = $('#id').val(); //id는 yam.json의 가게 고유의 id값.
    var price = $('#price').val();  //price는 0이더임.


    ethereum.enable().then(function (accounts) {
      //계정을 불러온다.
      var account = accounts[0]; 
        //위에서 받은것들을 매개변수로 넘김
      App.contracts.Yamconomy.deployed().then(function(instance){ 

        return instance.addVote(id,{from: account, value: price});
        //0이더 전송하는식으로 트랜잭션 발생.
        //이더 전송안하면서 트랜잭션 발생시도 해봤는데 안되던데? 
      }).catch(function(err){
        console.log(err.message);
      });
    });

  },



  loadReview: function() {
    App.contracts.Yamconomy.deployed().then(function(instance){
      return instance.getAllReviewers.call();
    }).then(function(reviewers){
      for( i = 0; i<reviewers.length; i++){
        //reviewers 는 10개의 배열 사이즈를 가지고 있으므로 10번 돌것이다.
        if(reviewers[i] !=='0x0000000000000000000000000000000000000000'){
          //이 배열에 들어가있는 주소가 없다면?
          //이더리움 주소길이인 40개의 0으로 초기화 해야함. 이더에선 NULL 로 대체불가.
          
          //$('.panel-yamconomy').eq(i).find('.btn-review').text('리뷰작성완료').attr('disabled', true); 
          //이거 비활성화하면 중간발표때 한가게에 리뷰 하나밖에 못쓰냐고 뭐라고 할꺼같아서 계속 활성화 해두는걸로 변경.
          //html의 yamconomy review 버튼을 리뷰 작성완료로 변경하고, 비활성화한다.
          $('.panel-yamconomy').eq(i).find('.btn-reviewerInfo').removeAttr('style');
          //이전에 숨김(display none)되어있던 reviwerInfo를 다시 보이게 해준다.

        }
      }
    }).catch(function(err){
      console.log(err.message);
    })
  },
	
  listenToEvents: function() {
	
  }
};
