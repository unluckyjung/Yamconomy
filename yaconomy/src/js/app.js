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

    console.log(id);
    console.log(price);
    console.log(review);
    console.log(score);

    $('#review').val('');
    $('#score').val('');

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
