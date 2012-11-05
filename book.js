/*
 * (c) 2012  Aleksandar Erkalovic, Marita Fraser, Steven Levithan, Philip Schatz and Johannes Wilm. Freely available under the AGPL. For further details see LICENSE.txt
 */

/* HOW TO CONFIGURE

Using this library you can turn an HTML element into a series of pages using CSS Regions. If the browser doesn't support CSS Regions, everything will be flown into one large page  container that looks like a very long page.

In order to use this library, first link to this javascript file within your html code. Then you can change the following options to customize the pagination behavior. Make sure that the configuration options are mentioned after the link to this file. Below you can see the default values for these options. You only need to specify the options if you want to deviate from the default value.

pagination.config.sectionStartMarker = 'h1'; // This is the HTML element we look for to find where a new section starts.
pagination.config.sectionTitleMarker = 'h1'; // Within the newly found section, we look for the first instance of this element to determine the title of the section.

pagination.config.chapterStartMarker = 'h2'; // This is the HTML element we look for to find where a new chapter starts.
pagination.config.chapterTitleMarker = 'h2'; // Within the newly found chapter, we look for the first instance of this element to determine the title of the chapter.

pagination.config.flowElement = "document.body"; // This specifies element whose contents we will flow into pages. You can use any javascript selector here, such as "document.getElementById('contents')"

pagination.config.alwaysEven = false; // This determines whether each section and chapter should have an even number of pages (2, 4, 6, 8, ...).

pagination.config.columns = 1; // This specifies the number of number of columns used for the body text. 

pagination.config.enableReflow = true; // This decides whether pages should be reflown upon change of contents after the first page flow. This is important if one wants to add an HTML editor to the contents of the pages so that the contents may require more or less pages than initially or one wants to change the length contents in other ways dynamically.

pagination.config.enableFrontmatter = true; // This resolves whether a table of contents, page headers and other frontmatter contents should be added upon page creation.

pagination.config.bulkPagesToAdd = 50; // This is the initial number of pages of each flowable part (section, chapter). After this number is added, adjustments are made by adding another bulk of pages or deletin pages individually. It takes much less time to delete pages than to add them individually, so it is a point to overshoot the target value. For larger chapters add many pages at a time so there is less time spent reflowing text
pagination.config.pagesToAddIncrementRatio = 1.4; // This is the ratio of how the bulk of pages incremented. If the initial bulkPagestoAdd is 50 and those initial 50 pages were not enough space to fit the contents of that chapter, then next 1.4*50 = 70 are pages, for a total of 50+70 = 120 pages, etc. . 1.4 seems to be the fastest in most situations.

pagination.config.frontmatterContents = ''; // These are the HTML contents that are added to the frontmatter before the table of contents. This would usually be a title page and a copyright page, including page breaks.

pagination.config.autoStart = true; // This controls whether pagination should be executed automatically upon page load. */

var pagination = new Object;

pagination.config = {
	'sectionStartMarker': 'h1',
	'sectionTitleMarker': 'h1',

	'chapterStartMarker': 'h2',
	'chapterTitleMarker': 'h2',

	'flowElement': 'document.body',
	'alwaysEven': false,
	'columns': 1,
	'enableReflow': true,
	'enableFrontmatter': true,
	'bulkPagesToAdd': 50,
	'pagesToAddIncreementRatio': 1.4,
	'frontmatterContents': '',
	'autoStart': true
};

pagination.romanize = function () {
    var digits = String(+this.value).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    }
    return Array(+digits.join("") + 1).join("M") + roman;
};


pagination.pageCounterCreator = function (selector, show) {
    this.selector = selector;
    if (show !== undefined) {
        this.show = show;
    }
};

pagination.pageCounterCreator.prototype.value = 0;

pagination.pageCounterCreator.prototype.needsUpdate = false;

pagination.pageCounterCreator.prototype.show = function(){
    return this.value;
};
    
pagination.pageCounterCreator.prototype.incrementAndShow = function () {
    this.value++;
    return this.show();
};   


pagination.pageCounterCreator.prototype.numberPages = function () {
    if (this.needsUpdate) {
        this.value = 0;
        this.needsUpdate = false;
        
        var pagenumbersToNumber = document.querySelectorAll('.page .pagenumber.' + this.selector);
        for (var i = 0; i < pagenumbersToNumber.length; i++) {
            pagenumbersToNumber[i].innerHTML = this.incrementAndShow();
        }
    }
};

pagination.pageCounters = {};

pagination.pageCounters.arab = new pagination.pageCounterCreator('arabic');
pagination.pageCounters.roman = new pagination.pageCounterCreator('roman', pagination.romanize);

pagination.createPages = function (num, flowName, pageCounterSelector, columns) {
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
        pagenumberfield.classList.add(pageCounterSelector);

        page.appendChild(pagenumberfield);

        if (flowName) {
            contentsContainer = document.createElement('div');
            contentsContainer.classList.add('contentsContainer');
            contentsContainer.style.display = '-webkit-box';
	    contentsContainer.style.webkitBoxOrient = 'vertical';

	    topFloats = document.createElement('div');
	    topFloats.classList.add('topFloats');

	    contents = document.createElement('div');
	    contents.classList.add('contents');
	    contents.style.webkitBoxFlex = 1;
	    contents.style.display = '-webkit-box';

	    for (var j = 0; j < columns; j++) {
	    	column = document.createElement('div');
	    	column.classList.add('contents-column');
	    	column.style.webkitFlowFrom = flowName;
	    	column.style.webkitBoxFlex = 1;
	    	contents.appendChild(column);
	    }

	    footnotes = document.createElement('div');
	    footnotes.classList.add('footnotes');

	    contentsContainer.appendChild(topFloats);
            contentsContainer.appendChild(contents);
	    contentsContainer.appendChild(footnotes);
	    page.appendChild(contentsContainer);
        } else { // if no flowname is given, an empty page is created
            page.classList.add('empty');
        }

        tempRoot.appendChild(page);
    }
    return tempRoot;
};

pagination.bodyLayoutUpdatedEvent = document.createEvent('Event');

pagination.bodyLayoutUpdatedEvent.initEvent('bodyLayoutUpdated', true, true);

pagination.layoutFlowFinishedEvent = document.createEvent('Event');

pagination.layoutFlowFinishedEvent.initEvent('layoutFlowFinished', true, true);

pagination.headersAndToc = function (bodyObjects) {
    
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

            if(typeof bodyObjects[i].startpageNumber !== 'undefined') {
                var tocItemPnText = document.createTextNode(bodyObjects[i].startpageNumber);
                tocItemPnSpan.appendChild(tocItemPnText);
            }

            tocItemDiv.appendChild(tocItemPnSpan);

            tocDiv.appendChild(tocItemDiv);

        }

    }

    return tocDiv;
};

pagination.createBodyObjects = function () {
    //Create body objects    
    var bodyObjects = [];
    var chapterCounter = 0;

    bodyObjects.push(new pagination.flowObject('bodypre', pagination.pageCounters.arab));

    var bodyContainer = eval(pagination.config.flowElement);
    var bodyContents = bodyContainer.childNodes;


    for (var i = bodyContents.length; i > 0; i--) {

        if (bodyContents[0].nodeType == 1) {
            if (bodyContents[0].webkitMatchesSelector(pagination.config.chapterStartMarker)) {
                bodyObjects.push(new pagination.flowObject('body' + chapterCounter++, pagination.pageCounters.arab));
                bodyObjects[chapterCounter].setType('chapter');

            } else if (bodyContents[0].webkitMatchesSelector(pagination.config.sectionStartMarker)) {
                bodyObjects.push(new pagination.flowObject('body' + chapterCounter++, pagination.pageCounters.arab));
                bodyObjects[chapterCounter].setType('section');
            }
        }

        bodyObjects[chapterCounter].rawdiv.appendChild(bodyContents[0]);
    }

    return bodyObjects;

};


pagination.flowObject = function (name, pageCounter) {
    this.name = name;
    this.pageCounter = pageCounter;

    this.rawdiv = document.createElement('div');
    this.rawdiv.id = name + 'raw';
    this.rawdiv.style.webkitFlowInto = name;

    this.div = document.createElement('div');
    this.div.id = name;

    this.bulkPagesToAdd = pagination.config.bulkPagesToAdd;

    this.columns = pagination.config.columns;
};

pagination.flowObject.prototype.totalPages = 0;

pagination.flowObject.prototype.redoPages = false;

pagination.flowObject.prototype.setType = function (type) {
    this.type = type;
    this.div.classList.add(type);
};

pagination.flowObject.prototype.findTitle = function () {
    var titleField;
    if (this.type == 'chapter') {
        titleField = this.rawdiv.querySelector(pagination.config.chapterTitleMarker);
        this.title = titleField.innerHTML;
    } else if (this.type == 'section') {
        titleField = this.rawdiv.querySelector(pagination.config.sectionTitleMarker);
        this.title = titleField.innerHTML;
    }
};

pagination.flowObject.prototype.findStartpageNumber = function () {
    if (this.rawdiv.innerText.length > 0) {
        var startpageNumberField = this.div.querySelector('.pagenumber');
        this.startpageNumber = startpageNumberField.innerText;
    }
};

pagination.flowObject.prototype.layoutFootnotes = function () {
    var numFootnote, footnote, footnoteReferencePageBeforeInsertion, footnoteReferencePageAfterInsertion, currentFootnoteContainer, nextpageFootnote;

    var allFootnotes = this.rawdiv.getElementsByClassName('footnote'); // Look for all the items that have "footnote" in their class list. These will be treated as footnote texts.
    for (var i = 0; i < allFootnotes.length; i++) {
	    numFootnote = document.createElement('sup'); // Create a sup-element with the class "footnote-reference" that holds the current footnote number. This will be used both in the body text and in the footnote itself.
	    numFootnote.classList.add('footnote-reference');
	    numFootnoteContents = document.createTextNode(i+1);
	    numFootnote.appendChild(numFootnoteContents);
	    
	    footnote = document.createElement('div'); // Put the footnote number and footnote text together in a div-element with the class footnote-item
	    footnote.classList.add('footnote-item');
	    footnote.classList.add('visible');
	    footnote.appendChild(numFootnote);

	    footnoteText = allFootnotes[i].cloneNode(true);
	    footnote.appendChild(footnoteText);

	    allFootnotes[i].style.display = 'none'; // Hide the original footnote text in the body text. We hide it instead of removing it, so that it can easily be recovered.
           
	    numFootnoteReference = numFootnote.cloneNode(true)
	    allFootnotes[i].parentNode.insertBefore(numFootnoteReference, allFootnotes[i]); // Insert the footnote number in the body text just before the original footnote text appeared in the body (the text that is now hidden).

	    footnoteReferencePageBeforeInsertion = this.namedFlow.getRegionsByContent(numFootnoteReference)[0].parentNode.parentNode.parentNode; // We find the page where the footnote is referenced from before the insertion procedure begins.
            currentFootnoteContainer = footnoteReferencePageBeforeInsertion.querySelector('.footnotes');
            currentFootnoteContainer.appendChild(footnote); // We insert the footnote in the footnote contianer of that page.
	    footnoteReferencePageAfterInsertion = this.namedFlow.getRegionsByContent(numFootnoteReference)[0].parentNode.parentNode.parentNode; // We find the page where the footnote is referenced from after the insertion procedure has taken place.
	    
	    if (footnoteReferencePageBeforeInsertion !== footnoteReferencePageAfterInsertion) { //If the footnote reference has been moved from oen page to another through the insertion procedure, we set the visibility of the footnote to "hidden" so that it continues to take up the same space and then insert it one more time on the page from where it now is referenced.
	        nextpageFootnote = footnote.cloneNode(true);
		footnote.style.visibility = 'hidden';
		footnote.classList.remove('visible');
		footnote.classList.add('invisible');
		
		currentFootnoteContainer = footnoteReferencePageAfterInsertion.querySelector('.footnotes');
		currentFootnoteContainer.appendChild(nextpageFootnote);
	    }
    }
};

pagination.flowObject.prototype.setNamedFlow = function () {
    var namedFlows = document.webkitGetNamedFlows();
    this.namedFlow = namedFlows[this.name];
};

pagination.flowObject.prototype.makeEvenPages = function () {
    var emptyPage = this.div.querySelector('.page.empty');
    if (emptyPage) {
        this.div.removeChild(emptyPage);
    }
    var allPages = this.div.querySelectorAll('.page');
    if (allPages.length % 2 == 1) {
        this.div.appendChild(pagination.createPages(1, false, this.pageCounter.selector, this.columns));
    }
};

pagination.flowObject.prototype.addPagesLoop = function (pages) {

    if ('undefined' === typeof (pages)) {
	this.totalPages += this.bulkPagesToAdd;
        this.div.appendChild(pagination.createPages(this.bulkPagesToAdd, this.name, this.pageCounter.selector, this.columns));
        this.bulkPagesToAdd = Math.floor(this.bulkPagesToAdd * pagination.config.pagesToAddIncrementRatio);
    } else {
	this.totalPages += pages;
        this.div.appendChild(pagination.createPages(pages, this.name, this.pageCounter.selector, this.columns));
    }

    this.addOrRemovePages(pages);

};


pagination.flowObject.prototype.addOrRemovePages = function (pages) {
    if(!(this.namedFlow)) {
        this.setNamedFlow();
    }
    
    if ((this.namedFlow.overset) && (this.rawdiv.innerText.length > 0)) {
        this.pageCounter.needsUpdate = true;
        this.redoPages = true;
        this.addPagesLoop(pages);
    } else if ((this.namedFlow.firstEmptyRegionIndex!=-1) && ((this.totalPages * this.columns - this.namedFlow.firstEmptyRegionIndex) > this.columns ))  {
        this.redoPages = true;
        this.removeExcessPages(pages);
    } else if (this.redoPages) {
        this.redoPages = false;
        if (pagination.config.alwaysEven) {
            this.makeEvenPages();
        }
        if (this.name!='frontmatter') {
            document.body.dispatchEvent(pagination.bodyLayoutUpdatedEvent);
        }
    }
};


pagination.flowObject.prototype.removeExcessPages = function (pages) {

        var allPages = this.div.querySelectorAll('.page');

        for (var i = (Math.ceil(this.namedFlow.firstEmptyRegionIndex/this.columns)); i < allPages.length; i++) {
            	this.div.removeChild(allPages[i]);
		this.totalPages--;
        }
    this.addOrRemovePages(pages);
};

pagination.flowObject.prototype.enableAutoReflow = function () {
    var flowObject = this;

    var reFlow = function () {
        flowObject.addOrRemovePages(1);
        flowObject.pageCounter.numberPages();
    };
    this.namedFlow.addEventListener('webkitRegionLayoutUpdate',reFlow)
};


pagination.applyBookLayout = function () {

    var bodyObjects = pagination.createBodyObjects();

    //Create div for layout
    var layoutDiv = document.createElement('div');
    layoutDiv.id = 'layout';
    counter = 0;
    document.body.appendChild(layoutDiv);

    for (var i = 0; i < bodyObjects.length; i++) {
        layoutDiv.appendChild(bodyObjects[i].div);
        document.body.appendChild(bodyObjects[i].rawdiv);
        bodyObjects[i].addOrRemovePages();
        if (pagination.config.enableReflow) {
            bodyObjects[i].enableAutoReflow();
        }
	bodyObjects[i].layoutFootnotes();
    }
    
    pagination.pageCounters.arab.numberPages();

    if (pagination.config.enableFrontmatter) {
        //Create and flow frontmatter
        fmObject = new pagination.flowObject('frontmatter', pagination.pageCounters.roman, 1);
	fmObject.columns = 1;
        document.body.appendChild(fmObject.rawdiv);
        fmObject.rawdiv.innerHTML = pagination.config.frontmatterContents;
        var toc = pagination.headersAndToc(bodyObjects);
        fmObject.rawdiv.appendChild(toc);
        layoutDiv.insertBefore(fmObject.div, bodyObjects[0].div);
        fmObject.addOrRemovePages();
        pagination.pageCounters.roman.numberPages();
        if (pagination.config.enableReflow) {
            var redoToc = function() {
                var oldToc = toc;
                toc = pagination.headersAndToc(bodyObjects);
                fmObject.rawdiv.replaceChild(toc, oldToc);
            };
            document.body.addEventListener('bodyLayoutUpdated',redoToc);
            fmObject.enableAutoReflow();
        } else {
            document.body.dispatchEvent(pagination.layoutFlowFinishedEvent);
        }
    } else if (!(pagination.config.enableReflow)) {
        document.body.dispatchEvent(pagination.layoutFlowFinishedEvent);
    }
};



pagination.applySimpleBookLayout = function () { 
// Apply this alternative layout in case CSS Regions are not present 
    bodyContainer = eval(pagination.config.flowElement);
    simplePage = document.createElement('div');
    simplePage.classList.add('simplepage');
    simplePage.innerHTML = bodyContainer.innerHTML;
    simplePage.id = bodyContainer.id;
    bodyContainer.innerHTML = '';
    document.body.appendChild(simplePage);
};

pagination._cssRegionsCheck = function() { 
// Check whether CSS Regions are present in Chrome 23+ version
    if ((document.webkitGetNamedFlows) && (document.webkitGetNamedFlows() !== null)) {
	return true;
    }
    return false;
};


document.onreadystatechange = function () {
    var cssRegionsPresent = pagination._cssRegionsCheck();
    if (pagination.config.autoStart == true) {
        if ((document.readyState == 'interactive') && (!(cssRegionsPresent))) {
            pagination.applySimpleBookLayout();
        } else if ((document.readyState == 'complete') && (cssRegionsPresent)){
            pagination.applyBookLayout();
        }
    }
};
