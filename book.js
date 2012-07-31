/*
 * (c) 2012 Johannes Wilm. Freely available under the AGPL. For further details see LICENSE.txt
 */

function setupDocument() {
    // TODO: wrapInner takes a long time when loading a large book
    // $('body').wrapInner('<div id="contents" />');
    $('body').append('<div id="layout" />');
    $('#layout').append('<div class="page"><div class="contents"></div><div class="pagenumber">1</div></div>');
}

$(document).ready(function () {
    var pageCounter = 1;
    var namedFlow = document.webkitGetFlowByName("contents");

    function addPageIfNeeded() {
        // TODO: We use firstEmptyRegionIndex as overset gives us incorrect values in current Chromium.
        if (namedFlow.firstEmptyRegionIndex == -1) {
            $('#layout').append('<div class="page"><div class="contents"></div><div class="pagenumber">' + ++pageCounter + '</div></div>');

            // The browser becomes unresponsive if we loop
            // Instead, set a timeout
            setTimeout(addPageIfNeeded, 1);
        } else {
            // Remove the first empty page
            // (empty page needed to test if firstEmptyRegionIndex == -1 )
            $('#layout .page:last').detach();
            pageCounter -= 1;

            //Done flowing pages; calculate the TOC
            addFrontMatter();
        }
    }

    setupDocument();
    setTimeout(addPageIfNeeded, 1);

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
    var namedFlow = document.webkitGetFlowByName("contents");
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