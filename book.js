/*
 * (c) 2012 Johannes Wilm. Freely available under the AGPL. For further details see LICENSE.txt
 */

function setupDocument() {
    $('body').wrapInner('<div id="contents" />');
    $('body').append('<div id="layout" />');
    $('#layout').append('<div class="page"><div class="contents"></div><div class="pagenumber">1</div></div>');
}

$(document).ready(function () {
    setupDocument();
    var hasEmptyPage = false;
    var fillingPages = true;
    var pageCounter = 1;
    var namedFlow = document.webkitGetFlowByName("article");
    while (fillingPages == true) {
        if (namedFlow.firstEmptyRegionIndex == -1) { /* TODO: We use firstEmptyRegionIndex as overset gives us incorrect values in current Chromium. */
            $('#layout').append('<div class="page"><div class="contents"></div><div class="pagenumber">' + ++pageCounter + '</div></div>');
        } else {
            fillingPages = false;
            $('#layout .page:last').detach();
            pageCounter -= 1;
        }
    }
    addFrontMatter();
});

function addFrontMatter() {
    var romanPageCounter = 0;
    var frontMatter = '';

    function addFrontMatterPage(content) {
        frontMatter += '<div class="page"><div class="frontmatter">' + content + '</div><div class="pagenumber">' + romanize(++romanPageCounter) + '</div></div>';
    }

    addFrontMatterPage('<h1>Booktitle</h1> <p>by Author</p>');

    addFrontMatterPage(tocPage());

    $('#layout').prepend(frontMatter);
}

function tocPage() {
    var tocList = buildToc();
    var tocContents = '<h2>Table of Contents</h2>';

    $.each(tocList, function (index, headline) {
        tocContents += '<div class="toc-entry">' + headline.text + ' ' + headline.pagenumber + '</div>';
    });

    return tocContents;
}

function buildToc() {
    var namedFlow = document.webkitGetFlowByName("article");
    var headlinePageList = [];
    $('#contents h1').each(function () {
        headlineContentDiv = namedFlow.getRegionsByContent(this)[0];
        headlinePagenumber = $(headlineContentDiv).parent().find('.pagenumber').text();
        headlineText = $(this).text();
        headlinePageList.push({
            'text': headlineText,
            'pagenumber': headlinePagenumber
        });
    });
    return headlinePageList;

}