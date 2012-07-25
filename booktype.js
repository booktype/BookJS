function setupDocument() {
    $('body').wrapInner('<div id="contents" />');
    $('body').append('<div id="layout" />');
    $('#layout').append('<div class="page"><div class="contents"></div><div class="pagenumber"></div></div>');
}

$(document).ready(function () {
    setupDocument();
    var lastColumnState;
    var fillingPages = true;
    setTimeout(function () {
        while (fillingPages == true) {
            lastColumnState = $(".page:last .contents")[0].webkitRegionOverflow;
            if (lastColumnState == 'overflow') {
                $('#layout').append('<div class="page"><div class="contents"></div><div class="pagenumber"></div></div>');
            } else if (lastColumnState == 'fit' || lastColumnState == 'empty') {
                fillingPages = false;
            }
        }
    }, 1000);

});