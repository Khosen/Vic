$('#readlink').click(function() {
    var para = $('#readlink').prev('#para')
    var lineheight = parseInt(para.css('line-height'))
    if (parseInt(para.css('height')) == lineheight*3) {
       para.css('height','auto');
       $(this).text('Less')
    } else {
       para.css('height',lineheight*3+'px');
       $(this).text('More')
    }
});