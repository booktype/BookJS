/*!
 * BookJS v.0.23.1-dev
 * Copyright 2012  Aleksandar Erkalovic, Marita Fraser, Steven Levithan, 
 * Philip Schatz and Johannes Wilm. Freely available under the AGPL. For
 * further details see LICENSE.txt
 *
 * Using this library you can turn an HTML element into a series
 * of pages using CSS Regions. If the browser doesn't support CSS Regions,
 * everything will be flown into one large page  container that looks like a
 * very long page.
 *
 *
 * HOWTO
 *
 * In order to use this library, link to the corresponding file as well as this
 * javascript file within your html code. If you need to set custom options, 
 * set them before including this file by defining an object named 
 * paginationConfig and setting the customization options as keys within this 
 * object. Like this:
 *
 * <link href="book.css" rel="stylesheet" type="text/css" />
 * <script type="text/javascript">
 *     paginationConfig = {
 *         'sectionStartMarker': 'h3',
 *	   'columns': 3,
 *         'autoStart': false,
 *     }
 * </script>
 * <script src="book.js" type="text/javascript"></script>
 *
 * The following options are available to customize the pagination behavior. In
 * the descriptions below you can see the default values for these options. You
 * only need to specify the options if you want to deviate from the default 
 * value.
 *
 * sectionStartMarker: h1 -- This is the HTML element we look for to find where
 * a new section starts.
 *
 * sectionTitleMarker: h1 -- Within the newly found section, we look for the
 * first instance of this element to determine the title of the section.
 *
 * chapterStartMarker: h2 -- This is the HTML element we look for to find where
 * a new chapter starts.
 *
 * chapterTitleMarker: h2 -- Within the newly found chapter, we look for the
 * first instance of this element to determine the title of the chapter.
 *
 * flowElement: document.body -- This specifies element the container element
 * of the content we will flow into pages. You can use any javascript selector
 * here, such as "document.getElementById('contents')" .
 * 
 * alwaysEven: false -- This determines whether each section and chapter should
 * have an even number of pages (2, 4, 6, 8, ...).
 *
 * columns: 1 -- This specifies the number of number of columns used for the
 * body text. 
 * 
 * enableFrontmatter: true -- This resolves whether a table of contents, page\
 * headers and other frontmatter contents should be added upon page creation.
 *
 * bulkPagesToAdd: 50 -- This is the initial number of pages of each flowable
 * part (section, chapter). After this number is added, adjustments are made by
 * adding another bulk of pages or deleting pages individually. It takes much 
 * less time to delete pages than to add them individually, so it is a point to
 * overshoot the target value. For larger chapters add many pages at a time so 
 * there is less time spent reflowing text.
 *
 * pagesToAddIncrementRatio: 1.4 -- This is the ratio of how the bulk of pages 
 * incremented. If the initial bulkPagestoAdd is 50 and those initial 50 pages
 * were not enough space to fit the contents of that chapter, then next
 * 1.4 * 50 = 70 are pages, for a total of 50+70 = 120 pages, etc. .  1.4 seems
 * to be the fastest in most situations.
 *
 * frontmatterContents: none -- These are the HTML contents that are added to
 * the frontmatter before the table of contents. This would usually be a title 
 * page and a copyright page, including page breaks.
 *
 * autoStart: true -- This controls whether pagination should be executed 
 * automatically upon page load. If it is set to false, pagination has to be
 * initiated manually by calling Pagination.applyBookLayout() or 
 * Pagination.applySimpleBookLayout() in case CSS Regions are not present. 
 * Check Pagination._cssRegionCheck() to see if CSS Regions are present.
 */
 
var Pagination = new Object;
// Pagination is the object that contains the namespace used by BookJS.

Pagination.config = {
    // Pagination.config starts out with default config options.
    'sectionStartMarker': 'h1',
    'sectionTitleMarker': 'h1',
    'chapterStartMarker': 'h2',
    'chapterTitleMarker': 'h2',
    'flowElement': 'document.body',
    'alwaysEven': false,
    'columns': 1,
    'enableFrontmatter': true,
    'bulkPagesToAdd': 50,
    'pagesToAddIncreementRatio': 1.4,
    'frontmatterContents': '',
    'autoStart': true
};

// help functions

Pagination.romanize = function () {
    // Create roman numeral representations of numbers.
    var digits = String(+this.value).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "",
        "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", 
        "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    }
    return Array(+digits.join("") + 1).join("M") + roman;
};

Pagination.createRandomId = function(base) {
    // Create a random CSS Id that is not in use already.
    var stillSearchingForUniqueId = true;
    var randomId;
    while(stillSearchingForUniqueId) {
        randomId = base + Math.floor(Math.random() * 100000);
        if(!document.getElementById(randomId)) {
            stillSearchingForUniqueId = false;
        }
    }  
    return randomId;
};

Pagination.setupManualCssTrigger = function() {
    // Setup a styleshett that lets us trigegr CSS evaluation manually. This is
    // to get around a bug in CSS Regions.
    this.triggerStylesheet = document.createElement('style');
    document.head.appendChild(this.triggerStylesheet);
}

Pagination.manualCssTrigger = function() {
    // Manually trigger CSS evaluation. This to get around above mentioned bug.
    Pagination.triggerStylesheet.innerHTML = '';
    Pagination.triggerStylesheet.innerHTML = '.trigger {trigger: trigger;}';
}

Pagination.initiate = function () {
    // Initiate BookJS by importing user set config options and setting basic
    // CSS style.
    
    this.setupManualCssTrigger();
    
    this.userConfigImport();
    this.setStyle();
}

Pagination.userConfigImport = function () {
    // If paginationConfig has been defined, import the values from it,
    // overwriting default config values set in Pagination.config.
    if (window.paginationConfig) {
        for (var key in paginationConfig) {
            Pagination.config[key] = paginationConfig[key];
        }
    }
}

Pagination.setStyle = function () {
    // Set style for the regions and pages used by BookJS and add it to the
    // head of the DOM.
    var stylesheet = document.createElement('style');
    stylesheet.innerHTML = 
    ".contentsContainer {display: -webkit-box; -webkit-box-orient: vertical;}"
    + " .contents {display: -webkit-box; -webkit-box-flex: 1}" 
    + " .contents-column {-webkit-box-flex: 1}"
    + " body {counter-reset: footnote footnote-reference;}"
    + " .footnote::before {counter-increment: footnote-reference;"
    + " content: counter(footnote-reference);}" 
    + " .footnote > * > *::before {counter-increment: footnote;"
    + " content: counter(footnote);}"
    + ".footnote > * > * {display: block;}";
    document.head.appendChild(stylesheet);
}



Pagination.pageCounterCreator = function (cssClass, show) {
    // Create a pagecounter. cssClass is the CSS class employed by this page
    // counter to mark all page numbers associated with it. If a show function
    // is specified, use this instead of the built-in show function.
    this.cssClass = cssClass;
    if (show !== undefined) {
        this.show = show;
    }
};

Pagination.pageCounterCreator.prototype.value = 0;
// The initial value of any page counter is 0.

Pagination.pageCounterCreator.prototype.needsUpdate = false;
// needsUpdate controls whether a given page counter should be updated. 
// Initially this is not the case.

Pagination.pageCounterCreator.prototype.show = function () {
    // Standard show function for page counter is to show the value itself
    // using arabic numbers.
    return this.value;
};

Pagination.pageCounterCreator.prototype.incrementAndShow = function () {
    // Increment the page count by one and return the reuslt page count using
    // the show function.
    this.value++;
    return this.show();
};


Pagination.pageCounterCreator.prototype.numberPages = function () {
    // If the pages associated with this page counter need to be updated, go
    // through all of them from the start of the book and number them, thereby
    // potentially removing old page numbers.
    this.value = 0;
    this.needsUpdate = false;

    var pagenumbersToNumber = document.querySelectorAll(
        '.page .pagenumber.' 
        + this.cssClass
    );
    for (var i = 0; i < pagenumbersToNumber.length; i++) {
        pagenumbersToNumber[i].innerHTML = this.incrementAndShow();
    }
};

Pagination.pageCounters = {};
// Pagination.pageCounters contains all the page counters we use in a book --
// typically these are two -- roman for the frontmatter and arab for the main
// body contents. 

Pagination.pageCounters.arab = new Pagination.pageCounterCreator(
    'arabic'
);
// arab is the page counter used by the main body contents.

Pagination.pageCounters.roman = new Pagination.pageCounterCreator(
    'roman', 
    Pagination.romanize
);
// roman is the page counter used by the frontmatter.

Pagination.createPages = function (num, flowName, pageCounterClass, columns) {
    // Create the DOM structure of num number of pages.
    var page, contents, footnotes, contentsContainer, column, topFloats;
    var tempRoot = document.createDocumentFragment();
    for (var i = 0; i < num; i++) {
        page = document.createElement('div');
        page.classList.add('page');

        header = document.createElement('div');
        header.classList.add('header');

        chapterheader = document.createElement('span');
        chapterheader.classList.add('chapter');
        header.appendChild(chapterheader);

        sectionheader = document.createElement('span');
        sectionheader.classList.add('section');
        header.appendChild(sectionheader);

        page.appendChild(header);

        pagenumberfield = document.createElement('div');
        pagenumberfield.classList.add('pagenumber');
        pagenumberfield.classList.add(pageCounterClass);

        page.appendChild(pagenumberfield);

        // If flowName is given, create a page with content flow.
        if (flowName) {
            contentsContainer = document.createElement('div');
            contentsContainer.classList.add('contentsContainer');

            topFloats = document.createElement('div');
            topFloats.classList.add('topFloats');

            contents = document.createElement('div');
            contents.classList.add('contents');

            for (var j = 0; j < columns; j++) {
                column = document.createElement('div');
                column.classList.add('contents-column');
                contents.appendChild(column);
            }

            footnotes = document.createElement('div');
            footnotes.classList.add('footnotes');

            contentsContainer.appendChild(topFloats);
            contentsContainer.appendChild(contents);
            contentsContainer.appendChild(footnotes);
            page.appendChild(contentsContainer);
            // If no flowName is given, an empty page is created.
        } else {
            page.classList.add('empty');
        }

        tempRoot.appendChild(page);
    }
    return tempRoot;
};

Pagination.events = {};
// Pagination.events represents all the evenets created specifically by BookJs.

Pagination.events.bodyLayoutUpdated = document.createEvent('Event');
Pagination.events.bodyLayoutUpdated.initEvent(
    'bodyLayoutUpdated', 
    true, 
    true
);
// bodyLayoutUpdated is emitted when pages have been added or removed from any
// body flowObject.

Pagination.events.layoutFlowFinished = document.createEvent('Event');
Pagination.events.layoutFlowFinished.initEvent(
    'layoutFlowFinished', 
    true, 
    true
);
// layoutFlowFinished is emitted the first time the flow of the entire book has
// been created.

Pagination.events.pageLayoutUpdate = document.createEvent('Event');
Pagination.events.pageLayoutUpdate.initEvent(
    'pageLayoutUpdated', 
    true, 
    true
);
// pageLayoutUpdated is emitted when new pages have to added or excess pages be
// removed.

Pagination.events.footnotesNeedMove = document.createEvent('Event');
Pagination.events.footnotesNeedMove.initEvent(
    'footnotesNeedMove', 
    true, 
    true
);
// footnotesNeedMove is emitted when at least one footnote no longer is on the
// page of the reference page it corresponds to.

Pagination.events.redoFootnotes = document.createEvent('Event');
Pagination.events.redoFootnotes.initEvent(
    'redoFootnotes', 
    true, 
    true
);
// redoFootnotes is being listened to by BookJS to see when footnotes need to
// be refound and redrawn. This can be used by editors who need to add new footnotes. 


Pagination.headersAndToc = function (bodyObjects) {
    // Go through all pages of all flowObjects and add page headers and
    // calculate the table fo contents (TOC) for the frontmatter. This has to
    // be done after all pages representing the body of the text have been
    // flown and has to redone when there are changes to the body contents that
    // can influence the TOC (such as page creation or deletion).
    var currentChapterTitle = '';
    var currentSectionTitle = '';

    var tocDiv = document.createElement('div');
    tocDiv.id = 'toc';

    tocTitleDiv = document.createElement('div');
    tocTitleDiv.id = 'toc-title';

    tocDiv.appendChild(tocTitleDiv);



    for (var i = 0; i < bodyObjects.length; i++) {
        bodyObjects[i].findTitle();
        bodyObjects[i].findStartpageNumber();

        if (bodyObjects[i].type == 'chapter') {
            currentChapterTitle = bodyObjects[i].title;
        } else if (bodyObjects[i].type == 'section') {
            currentSectionTitle = bodyObjects[i].title;
        }
        var pages = bodyObjects[i].div.childNodes;

        for (var j = 0; j < pages.length; j++) {
            var chapterHeader = pages[j].querySelector('.header .chapter');
            chapterHeader.innerHTML = currentChapterTitle;

            var sectionHeader = pages[j].querySelector('.header .section');
            sectionHeader.innerHTML = currentSectionTitle;
        }

        if (bodyObjects[i].type) {

            var tocItemDiv = document.createElement('div');
            tocItemDiv.classList.add('toc-entry');
            tocItemDiv.classList.add(bodyObjects[i].type);

            var tocItemTextSpan = document.createElement('span');
            tocItemTextSpan.classList.add('toc-text');

            tocItemTextSpan.innerHTML = bodyObjects[i].title;
            tocItemDiv.appendChild(tocItemTextSpan);

            var tocItemPnSpan = document.createElement('span');
            tocItemPnSpan.classList.add('toc-pagenumber');

            if (typeof bodyObjects[i].startpageNumber !== 'undefined') {
                var tocItemPnText = document.createTextNode(
                    bodyObjects[i].startpageNumber
                );
                tocItemPnSpan.appendChild(tocItemPnText);
            }

            tocItemDiv.appendChild(tocItemPnSpan);

            tocDiv.appendChild(tocItemDiv);

        }

    }

    return tocDiv;
};

Pagination.createBodyObjects = function () {
   // Go through the entire body contents and look for chapterStartMarker and
   // sectionStartMarker to divide it up. We will then float these elements
   // individually, as CSS Regions has problems flowing material that requires
   // 100+ regions. 
    var bodyObjects = [];
    var chapterCounter = 0;

    bodyObjects.push(
        new Pagination.flowObject(
            'bodypre',
            Pagination.pageCounters.arab
        )
    );

    var bodyContainer = eval(Pagination.config.flowElement);
    var bodyContents = bodyContainer.childNodes;


    for (var i = bodyContents.length; i > 0; i--) {

        if (bodyContents[0].nodeType == 1) {
            if (
                bodyContents[0].webkitMatchesSelector(
                    Pagination.config.chapterStartMarker
                )
            ) {
                bodyObjects.push(
                    new Pagination.flowObject(
                        'body' + chapterCounter++, 
                        Pagination.pageCounters.arab
                    )
                );
                bodyObjects[chapterCounter].setType('chapter');

            } else if (
                bodyContents[0].webkitMatchesSelector(
                    Pagination.config.sectionStartMarker
                )
            ) {
                bodyObjects.push(
                    new Pagination.flowObject(
                        'body' + chapterCounter++, 
                        Pagination.pageCounters.arab
                    )
                );
                bodyObjects[chapterCounter].setType('section');
            }
        }

        bodyObjects[chapterCounter].rawdiv.appendChild(bodyContents[0]);
    }

    return bodyObjects;

};

Pagination.applyBookLayout = function () {
    // Apply this layout if CSS Regions are present.

    var bodyObjects = Pagination.createBodyObjects();

    // Create div for layout
    var layoutDiv = document.createElement('div');
    layoutDiv.id = 'layout';
    document.body.appendChild(layoutDiv);

    // Create div for contents
    var contentsDiv = document.createElement('div');
    contentsDiv.id = 'contents';
    document.body.appendChild(contentsDiv);

    counter = 0;

    for (var i = 0; i < bodyObjects.length; i++) {
        layoutDiv.appendChild(bodyObjects[i].div);
        contentsDiv.appendChild(bodyObjects[i].rawdiv);
        bodyObjects[i].initiate();
    }

    Pagination.pageCounters.arab.numberPages();

    if (Pagination.config.enableFrontmatter) {
        //Create and flow frontmatter
        fmObject = new Pagination.flowObject(
            'frontmatter', 
            Pagination.pageCounters.roman, 
            1
        );
        fmObject.columns = 1;
        contentsDiv.insertBefore(fmObject.rawdiv, contentsDiv.firstChild);
        fmObject.rawdiv.innerHTML = Pagination.config.frontmatterContents;
        var toc = Pagination.headersAndToc(bodyObjects);
        fmObject.rawdiv.appendChild(toc);
        layoutDiv.insertBefore(fmObject.div, bodyObjects[0].div);
        fmObject.initiate();
        var redoToc = function () {
            var oldToc = toc;
            toc = Pagination.headersAndToc(bodyObjects);
            fmObject.rawdiv.replaceChild(toc, oldToc);
        };
        document.body.addEventListener('bodyLayoutUpdated', redoToc);
    }
    document.dispatchEvent(Pagination.events.layoutFlowFinished);
};



Pagination.applySimpleBookLayout = function () {
    // Apply this alternative layout in case CSS Regions are not present 
    bodyContainer = eval(Pagination.config.flowElement);
    simplePage = document.createElement('div');
    simplePage.classList.add('page');
    simplePage.classList.add('simple');
    simplePage.innerHTML = bodyContainer.innerHTML;
    simplePage.id = bodyContainer.id;
    bodyContainer.innerHTML = '';
    document.body.appendChild(simplePage);
};

Pagination._cssRegionsCheck = function () {
    // Check whether CSS Regions are present in Chrome 23+ version
    if (
        (
            document.webkitGetNamedFlows
        ) 
        && (
            document.webkitGetNamedFlows() !== null
        )
    ) {
        return true;
    }
    return false;
};

Pagination.autoStartInitiator = function () {
    // To be executed upon document loading.
    var cssRegionsPresent = Pagination._cssRegionsCheck();
    if ((document.readyState == 'interactive') && (!(cssRegionsPresent))) {
        Pagination.applySimpleBookLayout();
    } else if ((document.readyState == 'complete') && (cssRegionsPresent)) {
        Pagination.applyBookLayout();
    }
}



Pagination.flowObject = function (name, pageCounter) {
    // A flowObject is either a chapter, a section start, the frontmatter or
    // the contents of the body of the text that come before the first
    // chapter/section title.
    this.name = name;
    this.pageCounter = pageCounter;

    this.rawdiv = document.createElement('div');
    this.rawdiv.id = name + 'raw';

    this.div = document.createElement('div');
    this.div.id = name;

    this.bulkPagesToAdd = Pagination.config.bulkPagesToAdd;

    this.columns = Pagination.config.columns;

    this.footnotes = [];
    
    this.footnoteStylesheet = document.createElement('style');
    document.head.appendChild(this.footnoteStylesheet);
    
};

Pagination.flowObject.prototype.redoPages = false;
// redoPages is set if page numbering needs to be updated.

Pagination.flowObject.prototype.overset = false;
// We record the current state of the overset of the region flow so that we
// only have to find out if pages need to be added or removed when it
// changes, rather than every time the contents of the region flow changes.

Pagination.flowObject.prototype.firstEmptyRegionIndex = -1;
// In addition to overset, we also need to monitor changes to the
// firstEmptyRegionIndex property of the flow, because in the case of multi
// column pages, there may be empty regions (unfilled columns) that we do not
// want to remove.

Pagination.flowObject.prototype.initiate = function () {
    // To be run upon the initiation of any flowObject after rawdiv and div
    // have been set and rawdiv has been filled with initial contents.
    this.setStyle();
    this.namedFlow = document.webkitGetNamedFlows()[this.name];
    this.addOrRemovePages();
    this.setupReflow();
    this.findAllFootnotes();
    this.layoutFootnotes();
    this.setupFootnoteReflow();
    this.pageCounter.numberPages();
}

Pagination.flowObject.prototype.setStyle = function () {
    // Create a style element for this flowObject and add it to the header in
    // the DOM. That way it will not be mixing with the DOM of the
    // contents.
    var stylesheet = document.createElement('style');
    stylesheet.innerHTML = "#" + this.name 
    + " .contents-column {-webkit-flow-from:" + this.name + ";}" 
    + " #" + this.name + "raw {-webkit-flow-into:" + this.name + ";}";
    document.head.appendChild(stylesheet);
}

Pagination.flowObject.prototype.setType = function (type) {
    // Set the type of this flowObject (chapter or section start).
    this.type = type;
    this.div.classList.add(type);
};

Pagination.flowObject.prototype.findTitle = function () {
    // Find the title of section or chapter that this flowObject is covering.
    var titleField;
    if (this.type == 'chapter') {
        titleField = this.rawdiv.querySelector(
            Pagination.config.chapterTitleMarker
        );
        this.title = titleField.innerHTML;
    } else if (this.type == 'section') {
        titleField = this.rawdiv.querySelector(
            Pagination.config.sectionTitleMarker
        );
        this.title = titleField.innerHTML;
    }
};

Pagination.flowObject.prototype.findStartpageNumber = function () {
    // Find the first page number used in this flowObject.
    if (this.rawdiv.innerText.length > 0) {
        var startpageNumberField = this.div.querySelector('.pagenumber');
        this.startpageNumber = startpageNumberField.innerText;
    }
};

// Footnote handling

Pagination.flowObject.prototype.findFootnoteReferencePage =
    function (footnoteReference) {
        // Find the page where the reference to the footnote in the text is
        // placed.
    return this.namedFlow.getRegionsByContent(
        footnoteReference
    )[0].parentNode.parentNode.parentNode;
}

Pagination.flowObject.prototype.findFootnotePage = function (footnote) {
    // Find the page where the footnote itself is currently placed.
    return footnote.parentNode.parentNode.parentNode;
}

Pagination.flowObject.prototype.compareReferenceAndFootnotePage = 
    function (footnoteObject) {
    // Check whether a footnote and it's corresponding reference in the text
    // are on the same page.
    var referencePage = this.findFootnoteReferencePage(
        //footnoteObject['reference']
        document.getElementById(footnoteObject['id'])
    );
    var footnotePage = this.findFootnotePage(
        footnoteObject['item']
    );

    if (footnotePage === referencePage) {
        //console.log('ARE THE SAME');
        return true;
    } else {
        return false;
    }
}


Pagination.flowObject.prototype.setupFootnoteReflow = function () {
    // Connect footnote reflow events with triggers.
    var flowObject = this;

    var checkAllFootnotePlacements = function () {
        flowObject.checkAllFootnotePlacements();
    }

    // For Chrome 24 and lower
    this.namedFlow.addEventListener(
        'webkitRegionLayoutUpdate', 
        checkAllFootnotePlacements
    );
    
    // For Chrome 25 and higher
    this.namedFlow.addEventListener(
        'regionlayoutupdate', 
        checkAllFootnotePlacements
    );
    
    
    var reFlow = function () {
        // For Chrome 24 and lower
        flowObject.namedFlow.removeEventListener(
            'webkitRegionLayoutUpdate', 
            checkAllFootnotePlacements
        );
        // For Chrome 25 and higher
        flowObject.namedFlow.removeEventListener(
            'regionlayoutupdate', 
            checkAllFootnotePlacements
        );
        console.log('layout footnotes');
        flowObject.layoutFootnotes();

        // For Chrome 24 and lower
        flowObject.namedFlow.addEventListener(
            'webkitRegionLayoutUpdate', 
            checkAllFootnotePlacements
        );
        
        // For Chrome 25 and higher
        flowObject.namedFlow.addEventListener(
            'regionlayoutupdate', 
            checkAllFootnotePlacements
        );
    }

    this.namedFlow.addEventListener('footnotesNeedMove', reFlow);
    
    var redoFootnotes = function() {
        flowObject.namedFlow.removeEventListener(
            'webkitRegionLayoutUpdate', 
            checkAllFootnotePlacements
        );
        // For Chrome 25 and higher
        flowObject.namedFlow.removeEventListener(
            'regionlayoutupdate', 
            checkAllFootnotePlacements
        );
        console.log('layout footnotes');
        flowObject.redoFootnotes();

        // For Chrome 24 and lower
        flowObject.namedFlow.addEventListener(
            'webkitRegionLayoutUpdate', 
            checkAllFootnotePlacements
        );
        
        // For Chrome 25 and higher
        flowObject.namedFlow.addEventListener(
            'regionlayoutupdate', 
            checkAllFootnotePlacements
        );
    }
    
    this.rawdiv.addEventListener('redoFootnotes', redoFootnotes);
    
     // CSS Regions has a bug that means that the size of footnotes is not
     // recalculated automatically as they grow larger. This is why we
     // trigger CSS reevalution manually upon footnote content change.    
    
    // PROBLEM: This doesn't work together with the CheckSpacerSize function
    // below as it trigegrs regionlayoutupdate events all over the place!

     // For Chrome 24 and lower 
      /*  this.namedFlow.addEventListener(
            'webkitRegionLayoutUpdate',
            Pagination.manualCssTrigger);
     // For Chrome 25 and higher
        this.namedFlow.addEventListener(
            'regionlayoutupdate',
            Pagination.manualCssTrigger);*/
        
        
        var checkSpacerSize = function() {
        // Check whether footnotes are still as large as the spacer that was
        // put in their place. If not, the spacer most likely has to be
        // replaced by the footnote in its original location.    
            
        // For Chrome 24 and lower 
        flowObject.namedFlow.removeEventListener(
            'webkitRegionLayoutUpdate',
            checkSpacerSize);
        // For Chrome 25 and higher
        flowObject.namedFlow.removeEventListener(
            'regionlayoutupdate',
            checkSpacerSize);        
            
        for (var i=0; i<flowObject.footnotes.length; i++ ) {
            console.log('checking spacer size: '+flowObject.footnotes[i]['id']);
            if ('hidden' in flowObject.footnotes[i]) {
                if (flowObject.footnotes[i]['item'].clientHeight < flowObject.footnotes[i]['hidden'].clientHeight) {
                    // The footnote is smaller than its space holder on another
                    // page. It means the footnote has been shortened and we
                    // need to reflow footnotes!
                    flowObject.namedFlow.dispatchEvent(Pagination.events.footnotesNeedMove);
                }
            }
        }
        // For Chrome 24 and lower 
        flowObject.namedFlow.addEventListener(
            'webkitRegionLayoutUpdate',
            checkSpacerSize);
        // For Chrome 25 and higher
        flowObject.namedFlow.addEventListener(
            'regionlayoutupdate',
            checkSpacerSize);    
        };
        

        
        // For Chrome 24 and lower 
        flowObject.namedFlow.addEventListener(
            'webkitRegionLayoutUpdate',
            checkSpacerSize);
        // For Chrome 25 and higher
        flowObject.namedFlow.addEventListener(
            'regionlayoutupdate',
            checkSpacerSize);    
        

}

Pagination.flowObject.prototype.redoFootnotes = function () {
    // Go through all footnotes and check whether they are still where the
    // reference to them is placed.
    for (var i = 0; i < this.footnotes.length; i++) {
        // Go through all footnotes, removing all spacer blocks and footnote
        // references from the DOM.

        if ('hidden' in this.footnotes[i]) {
            this.footnotes[i]['hidden'].parentNode.removeChild(
                this.footnotes[i]['hidden']
            );
        }

        if (this.footnotes[i]['item'].parentNode !== null) {
            this.footnotes[i]['item'].parentNode.removeChild(
                this.footnotes[i]['item']
            ); 
        }
    }
    // Start out with no footnotes.
    this.footnotes=[];
    
    // Find footnotes from scratch.
    this.findAllFootnotes();
}


Pagination.flowObject.prototype.checkAllFootnotePlacements = function () {
    // Go through all footnotes and check whether they are still where the
    // reference to them is placed.
    for (var i = 0; i < this.footnotes.length; i++) {
        if (!(this.compareReferenceAndFootnotePage(this.footnotes[i]))) {
            this.namedFlow.dispatchEvent(Pagination.events.footnotesNeedMove);
        }
    }
}



Pagination.flowObject.prototype.findAllFootnotes = function () {
    
    // Find all the footnotes in the text and prepare them for flow.

    // Remove all previous footnote stylesheet rules.
    this.footnoteStylesheet.innerHTML='';

    // Look for all the items that have "footnote" in their class list. These
    // will be treated as footnote texts.
    var allFootnotes = this.rawdiv.getElementsByClassName('footnote'); 

    for (var i = 0; i < allFootnotes.length; i++) {
        
        if (allFootnotes[i].id==='') {
            // If footnote has no id, create one, so that we can target it
            // using CSS rules.
            allFootnotes[i].id = Pagination.createRandomId('footnote');
        }
        
        var footnoteId = allFootnotes[i].id;
        
        this.footnoteStylesheet.innerHTML += 
            '#' + footnoteId 
            + ' > * {-webkit-flow-into: ' + footnoteId + ';} '
            + '#' + footnoteId 
            + 'FlowTo {-webkit-flow-from: ' + footnoteId + ';} ';
        

        var footnoteObject = {}; 
        // We create this object so that we can find the footnote item and
        // reference again later on.
        
        footnoteObject['reference'] = allFootnotes[i];

        var footnoteFlowTo = document.createElement('div');
        
        footnoteFlowTo.id = footnoteId + 'FlowTo';

        footnoteFlowTo.classList.add('footnoteItem');
        
        footnoteObject['item'] = footnoteFlowTo;

        footnoteObject['id'] = footnoteId;

        this.footnotes.push(footnoteObject);
        

                
        /*var footnoteFlow = document.webkitGetNamedFlows()[footnoteObject['id']]; 
        console.log(
            'footnoteFlow: '+ footnoteObject['id']
        );*/
        var flowObject = this;
        
        
        
        // CSS Regions has a bug that means that the size of footnotes is not
        // recalculated automatically as they grow larger. This is why we
        // trigger CSS reevalution manually upon footnote content change.    
/*
        // For Chrome 24 and lower 
        footnoteFlow.addEventListener(
            'webkitRegionLayoutUpdate',
            Pagination.manualCssTrigger);
        // For Chrome 25 and higher
        footnoteFlow.addEventListener(
            'regionlayoutupdate',
            Pagination.manualCssTrigger);    */
        
    }

}

Pagination.flowObject.prototype.layoutFootnotes = function () {
    // Layout all footnotes
    
    for (var i = 0; i < this.footnotes.length; i++) {
        // Go through all footnotes, delete the spacer blocks if they have any
        // and remove the footnote itself from the DOM.

        if ('hidden' in this.footnotes[i]) {
            this.footnotes[i]['hidden'].parentNode.removeChild(
                this.footnotes[i]['hidden']
            );
            delete this.footnotes[i]['hidden'];
        }

        if (this.footnotes[i]['item'].parentNode !== null) {
            this.footnotes[i]['item'].parentNode.removeChild(
                this.footnotes[i]['item']
            );
        }
    }
        
    for (var i = 0; i < this.footnotes.length; i++) {
        // Go through the footnotes again, this time with the purpose of
        // placing them correctly.
        
        var footnoteReferencePage = this.findFootnoteReferencePage(
            document.getElementById(this.footnotes[i]['id'])
        ); 
        // We find the page where the footnote is referenced from.
        var firstFootnoteContainer = footnoteReferencePage.querySelector(
            '.footnotes'
        );
        firstFootnoteContainer.appendChild(this.footnotes[i]['item']); 
        // We insert the footnote in the footnote container of that page.

        console.log('Comparing for '+this.footnotes[i]['id'])
        if (!(this.compareReferenceAndFootnotePage(this.footnotes[i]))) {
            // If the footnote reference has been moved from one page to
            // another through the insertion procedure, we move the footnote to
            // where it is referenced from now and create an empty div 
            // ('hidden') and set it in it's place.
                        
            this.footnotes[i]['hidden'] = document.createElement('div');
            
            this.footnotes[i]['hidden'].style.height = (
                this.footnotes[i]['item'].clientHeight
            )+'px';
       
            this.footnotes[i]['hidden'].id = this.footnotes[i]['id'] + 'hidden';
            
            var newFootnoteReferencePage = this.findFootnoteReferencePage(
                this.footnotes[i]['reference']
            ); 
            // We find the page where the footnote is referenced from now and
            // move the footnote there.
            var newFootnoteContainer = newFootnoteReferencePage.querySelector(
                '.footnotes'
            );
            
            // We then insert the hidden element into the container where the
            // footnote was previously so that the body text doesn't flow back.
            firstFootnoteContainer.replaceChild(
                this.footnotes[i]['hidden'],
                this.footnotes[i]['item']
            );
            newFootnoteContainer.appendChild(this.footnotes[i]['item']);
            
            
        }
    }
};


Pagination.flowObject.prototype.makeEvenPages = function () {
    // If the number of pages is odd, add an empty page.
    var emptyPage = this.div.querySelector('.page.empty');
    if (emptyPage) {
        this.div.removeChild(emptyPage);
    }
    var allPages = this.div.querySelectorAll('.page');
    if (allPages.length % 2 == 1) {
        this.div.appendChild(
            Pagination.createPages(
                1, 
                false, 
                this.pageCounter.cssClass, 
                this.columns
            )
        );
    }
};

Pagination.flowObject.prototype.addPagesLoop = function (numberOfPages) {
    // Add pages. If the variable numberOfPages is defined, add this amount of
    // pages. Else use the config option bulkPagesToAdd times
    // pagesToAddIncrementRatio to determine how many pages should be added.
    // It is a point to overshoot the target, as it is more costly to add than
    // to remove pages. 
    if ('undefined' === typeof (numberOfPages)) {
        this.div.appendChild(
            Pagination.createPages(
                this.bulkPagesToAdd, 
                this.name, 
                this.pageCounter.cssClass, 
                this.columns
            )
        );
        this.bulkPagesToAdd = Math.floor(
            this.bulkPagesToAdd * Pagination.config.pagesToAddIncrementRatio
        );
    } else {
        this.div.appendChild(
            Pagination.createPages(
                numberOfPages, 
                this.name, 
                this.pageCounter.cssClass, 
                this.columns
            )
        );
    }
    this.addOrRemovePages(numberOfPages);
};


Pagination.flowObject.prototype.addOrRemovePages = function (pages) {
    // This loop is called when we believe pages have to added or removed. 

    if ((this.namedFlow.overset) && (this.rawdiv.innerText.length > 0)) {
        // If there are too few regions (overset==True) and the contents of
        // rawdiv are at least 1 character long, pages need to be added.
        this.pageCounter.needsUpdate = true;
        this.redoPages = true;
        this.addPagesLoop(pages);
    } else if (
        (this.namedFlow.firstEmptyRegionIndex != -1) 
        && (
            (
                this.namedFlow.getRegions().length 
                - this.namedFlow.firstEmptyRegionIndex
            ) > this.columns
           )
              ) {
        // If there are excess regions, and the number of empty regions is
        // equal to or higher than the number of columns, we need to remove
        // pages.
        this.redoPages = true;
        this.removeExcessPages(pages);
    } else if (this.redoPages) {
        // If pages have either been added or removed, make sure than the total
        // number of pages is even if alwaysEven has been set, and emit a
        // bodyLayoutUpdated event if this is not the frontmatter. 
        this.redoPages = false;
        if (Pagination.config.alwaysEven) {
            this.makeEvenPages();
        }
        if (this.name != 'frontmatter') {
            document.body.dispatchEvent(Pagination.events.bodyLayoutUpdated);
        }
    }
};


Pagination.flowObject.prototype.removeExcessPages = function (pages) {
    // Remove pages that are in excess. As it takes much less time to remove
    // excess pages than to add new ones, it is preferable to add too many
    // pages initially and then remove them givent hat we do not know exactly
    // how many pages are needed before we add them.

    var allPages = this.div.querySelectorAll('.page');

    for (
        var i = (
            Math.ceil(this.namedFlow.firstEmptyRegionIndex / this.columns)
        );
        i < allPages.length; 
        i++
    ) {
        this.div.removeChild(allPages[i]);
    }
    this.addOrRemovePages(pages);
};


Pagination.flowObject.prototype.setupReflow = function () {
    // Setup automatic addition and removing of pages when content is added or
    // removed.
    var flowObject = this;

    var checkOverset = function () {
        // Something has changed in the contents of this flow. Check if the
        // values of overset or firstEmptyRegionIndex have changed. If this is
        // the case, emit a pageLayoutUpdate event. 
        if (
            (
                flowObject.namedFlow.overset !== flowObject.overset
            ) 
            || (
                flowObject.namedFlow.firstEmptyRegionIndex 
                    !== flowObject.firstEmptyRegionIndex
            )
           ) {
            flowObject.overset = flowObject.namedFlow.overset;
            flowObject.firstEmptyRegionIndex = 
                flowObject.namedFlow.firstEmptyRegionIndex;
            flowObject.namedFlow.dispatchEvent(
                Pagination.events.pageLayoutUpdate
            );
        }
    }
    // For Chrome 24 and lower 
    this.namedFlow.addEventListener('webkitRegionLayoutUpdate', checkOverset);
    // For Chrome 25 and higher
    this.namedFlow.addEventListener('regionlayoutupdate', checkOverset);    

    var reFlow = function () {
        // The page layout has changed. Reflow by adding pages one by one.
        flowObject.addOrRemovePages(1);
        flowObject.pageCounter.numberPages();
    };
    this.namedFlow.addEventListener('pageLayoutUpdated', reFlow);

};



Pagination.initiate();

if (Pagination.config.autoStart === true) {
    // Hook Pagination.autoStartInitiator to document loading stage if
    // autoStart is set to true.
    document.addEventListener(
        "readystatechange", 
        Pagination.autoStartInitiator
    );
}
