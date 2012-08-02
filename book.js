/*
 * (c) 2012 Johannes Wilm and Philip Schatz. Freely available under the AGPL. For further details see LICENSE.txt
 */
// Some timing stats: the time it takes to add each group (in seconds)
// bulk adding 50 pages at a time: 7+10+12+19+24+37+22+40+44+48
// bulk adding 100 pages at a time: 8+17+22+35+44
var bulkPagesToAdd = 100; // For larger books add many pages at a time so there is less time spent reflowing text


function pageCounter(show) {
    this.value = 1;
    this.show = function () {
        if (show === undefined) {
            return this.value;
        } else {
            return show(this.value);
        }
    }
}

var arabPageCounter = new pageCounter();
var romanPageCounter = new pageCounter(romanize);

function flowObject(name, pageCounter) {
    this.name = name;
    this.pageCounter = pageCounter;
    this.rawdiv = '<div id="' + name + 'raw" />';
    this.rawselector = '#' + name + 'raw';
    this.div = '<div id="' + name + '" />';
    this.selector = '#' + name;

    var addPage = function () {
        $('#' + name).append('<div class="page"><div class="contents"></div><div class="pagenumber">' + pageCounter.show() + '</div></div>');
        pageCounter.value++;
    };
    this.addPage = addPage;

    this.addContent = function (content) {
        $(this.rawselector).append(content);
    }

    // If text overflows from the region add more pages and then remove any empty ones
    var addPagesIfNeeded = function () {
        namedFlow = document.webkitGetFlowByName(name);

        // TODO: We use firstEmptyRegionIndex as overset gives us incorrect values in current Chromium.
        if (namedFlow.firstEmptyRegionIndex == -1) {
            // Add several pages at a time
            // console.log(new Date());
            for (var i = 0; i < bulkPagesToAdd; i++) {
                addPage();
            }
            // The browser becomes unresponsive if we loop
            // Instead, set a timeout
            setTimeout(addPagesIfNeeded(), 1);
        } else {
            // Remove the empty pages (up to bulkPagesToAdd - 1)
            // (empty page needed to test if firstEmptyRegionIndex == -1 )
            while (namedFlow.firstEmptyRegionIndex != -1) {
                $('#' + name + ' .page:last').detach();
                pageCounter.value--;
            }
        }
    }
    this.addPagesIfNeeded = addPagesIfNeeded;

}

function buildToc(flowObject) {

    function findTocItems(flowObject) {
        var namedFlow = document.webkitGetFlowByName(flowObject.name);
        var headlinePageList = [];
        $(flowObject.rawselector+' h1').each(function () {
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
    
    var tocList = findTocItems();
    var tocContents = '<h2>Table of Contents</h2>';

    $.each(tocList, function (index, headline) {
        tocContents += '<div class="toc-entry">' + headline.text + ' ' + headline.pagenumber + '</div>';
    });

    return tocContents;
}

$(document).ready(function () {
    bodyObject = new flowObject('body', arabPageCounter);
    $('body').wrapInner(bodyObject.rawdiv);
    $('body').append('<div id="layout" />');
    $('#layout').append(bodyObject.div);
    bodyObject.addPage();
    bodyObject.addPagesIfNeeded();
    //Done flowing body pages; calculate the TOC
    fmObject = new flowObject('frontmatter', romanPageCounter);
    $('body').append(fmObject.rawdiv);
    fmObject.addContent('<h1>Booktitle</h1> <p>by Author</p><br class="pagebreak">' + buildToc(bodyObject));
    $('#layout').prepend(fmObject.div);
    fmObject.addPage();
    fmObject.addPagesIfNeeded();
});