App = {
  web3Provider: null,
  contracts: {},
	
  init: function() {
    $.getJSON('../yamconomy.json', function(data){
      var list = $('#list');
      var template = $('#template');

      for (i = 0; i< data.length; i++){
        template.find('img').attr('src',data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.type').text(data[i].type);
        template.find('.location').text(data[i].location);
        template.find('.price').text(data[i].price);

        list.append(template.html());
        
        
      }
    })

    return App.initWeb3();
  },


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
		$.getJSON('Yamconomy.json',function(data){
      App.contracts.Yamconomy = TruffleContract(data);
      App.contracts.Yamconomy.setProvider(App.web3Provider);
    });
  },

  writeReview: function() {	
    var id = $('#id').val();
    var price = $('#price').val();
    var review = $('#review').val();
    var score = $('#score').val();


    web3.eth.getAccounts(function(error,accounts){  //계정을 불러온다.
      if(error){
        console.log(error);
      }

      var account = accounts[0];
        //위에서 받은것들을 매개변수로 넘김
      App.contracts.Yamconomy.deployed().then(function(instance){ 
        //배포가 되었다면 인스턴스를 받아라.
        var reviewUtf8Encoded = utf8.encode(review);
        //한글이 쓰이므로 인코딩이 필요함.(utf8.js 라이브러리 추가)
        return instance.writeReview(id, web3.toHex(reviewUtf8Encoded),score, {from: account, value: price});
        //매개변수로 data를 넘김
        //이때 리뷰는 인코딩 한걸 다시 Hex로 변환이 필요함.
        //0이더를 보냄으로써 기록함.

      }).then(function(){ //잘 작동을 한다면
        $('#review').val('');//이전에 모달에 입력된 내용들을 지운다.
        $('#score').val('');
        $('#writeModal').modal('hide');
      }).catch(function(err){

        console.log(err.message);
      });
    });

  },

  loadReview: function() {
	
  },
	
  listenToEvents: function() {
	
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#reviewModal').on('show.bs.modal',function(e){
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text()||0),"ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });
});
