(function() {

  function addFollowUp() {
    function mark(el) {
      $('.atjs-outline').removeClass('atjs-outline');
      $(el).addClass('atjs-outline');
    }

    function unmark(el) {
      $(el).removeClass('atjs-outline');
    }

    $('body *').mouseenter(function() {
      mark(this);
    }).mouseleave(function() {
      unmark(this);
    });
  }

  function initWidget($toolbar){
    $toolbar.find('.dropdown-toggle').dropdown();
    setTimeout(function() {
      $toolbar.slideDown({
        duration: 300,
        queue: false
      });
      $('body').animate({'padding-top': '97px'}, {
        duration: 200,
        queue: false
      });
    }, 10);
  }

  function appendWidget(html) {
    $('#atjs-toolbar').remove();
    var $markup = $(html).appendTo('body');
    $markup.filter('style,link,script').appendTo('head');
    initWidget($markup.filter('#atjs-toolbar'));
  }

  function fetchWidget() {
    var host = 'https://adobe-marketing-cloud.github.io/target-sdk-libraries/demos/examples/prototype/tve/';
    //host = 'http://localhost:3000/examples/prototype/tve/';
    $.ajax({
      dataType: 'text',
      url: host + 'styles.min.css'
    }).done(function(html) {

      addFollowUp();

      $.ajax({
        dataType: 'html',
        url: host + 'widget.html'
      }).done(function(markup) {
        appendWidget(markup);
      });
    });
  }

  function getScriptElement(url, nextAction) {
    var scriptElement = document.createElement('script');
    scriptElement.src = url;
    scriptElement.onload = nextAction;

    return scriptElement;
  }

  var documentHead = document.getElementsByTagName('head')[0];

  function loadBootstrapJS() {
    var bootstrapScript = getScriptElement('//getbootstrap.com/dist/js/bootstrap.min.js', fetchWidget);
    documentHead.appendChild(bootstrapScript);
  }
  var clientJQueryVersion;

  if (typeof jQuery !== "undefined") {
    clientJQueryVersion = parseFloat(jQuery.prototype.jquery);
  }
  if (typeof jQuery === "undefined" || clientJQueryVersion < 1.91) {
    var jqueryScript = getScriptElement('//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', loadBootstrapJS);
    documentHead.appendChild(jqueryScript);
  } else {
    loadBootstrapJS();
  }
})();
