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
    var fO = this;
    fO.name = name;
    fO.pageCounter = pageCounter;
    fO.rawdiv = '<div id="' + name + 'raw" />';
    fO.rawselector = '#' + name + 'raw';
    fO.div = '<div id="' + name + '" />';
    fO.selector = '#' + name;

    fO.addPage = function () {
        $('#' + name).append('<div class="page"><div class="contents"></div><div class="pagenumber">' + pageCounter.show() + '</div></div>');
        pageCounter.value++;
    };

    fO.addContent = function (content) {
        $(this.rawselector).append(content);
    }

    // If text overflows from the region add more pages and then remove any empty ones
    fO.addPagesIfNeeded = function () {

        if (($(fO.rawselector)[0].innerText.length > 0) && (fO.pageCounter.value == 1)) {
            fO.addPage();
        }

        namedFlow = document.webkitGetFlowByName(fO.name);
        // TODO: We use firstEmptyRegionIndex as overset gives us incorrect values in current Chromium.
        if (namedFlow.firstEmptyRegionIndex == -1) {
            // Add several pages at a time
            // console.log(new Date());
            for (var i = 0; i < bulkPagesToAdd; i++) {
                fO.addPage();
            }
            // The browser becomes unresponsive if we loop
            // Instead, set a timeout
            setTimeout(fO.addPagesIfNeeded(), 1);
        } else {
            // Remove the empty pages (up to bulkPagesToAdd - 1)
            // (empty page needed to test if firstEmptyRegionIndex == -1 )
            while (namedFlow.firstEmptyRegionIndex != -1) {
                $('#' + fO.name + ' .page:last').detach();
                fO.pageCounter.value--;
            }
        }
    }

    fO.buildToc = function () {

        function findTocItems() {
            var namedFlow = document.webkitGetFlowByName(fO.name);
            var headlinePageList = [];

            $(fO.rawselector + ' h1').each(function () {

                var headlineContentDiv = namedFlow.getRegionsByContent(this)[0];
                var headlinePagenumber = $(headlineContentDiv).parent().find('.pagenumber').text();
                var headlineText = $(this).text();
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

}



$(document).ready(function () {
    //Create and flow body
    bodyObject = new flowObject('body', arabPageCounter);
    $('body').wrapInner(bodyObject.rawdiv);
    $('body').append('<div id="layout" />');
    $('#layout').append(bodyObject.div);
    bodyObject.addPagesIfNeeded();

    //Create and flow frontmatter
    fmObject = new flowObject('frontmatter', romanPageCounter);
    $('body').append(fmObject.rawdiv);
    fmObject.addContent('<h1>Booktitle</h1> <p>by Author</p><br class="pagebreak">' + bodyObject.buildToc());
    $('#layout').prepend(fmObject.div);
    fmObject.addPagesIfNeeded();
});