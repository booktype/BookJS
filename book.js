/*
 * (c) 2012  Marita Fraser, Steven Levithan, Philip Schatz and Johannes Wilm. Freely available under the AGPL. For further details see LICENSE.txt
 */
var pagination = new Object;

/* CONFIG OPTIONS */

pagination.sectionStartMarker = 'h1';
pagination.sectionTitleMarker = 'h1';

pagination.chapterStartMarker = 'h2';
pagination.chapterTitleMarker = 'h2';

pagination.flowElement = "document.body";

pagination.alwaysEven = false;

pagination.enableReflow = true;

pagination.enableFrontmatter = true;

pagination.bulkPagesToAdd = 50; // For larger chapters add many pages at a time so there is less time spent reflowing text
pagination.pagesToAddIncrementRatio = 1.4; // Ratio of incrementing pages. 1.4 seems to be the fastest in most situations.

pagination.frontmatterContents = '';

pagination.autoStart = true;

/* END CONFIG OPTIONS */

pagination.romanize = function () {
    var digits = String(+this.value).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--) {
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    }
    return Array(+digits.join("") + 1).join("M") + roman;
}


pagination.pageCounterCreator = function (selector, show) {
    this.selector = selector;
    if (show !== undefined) {
        this.show = show;
    }
}

pagination.pageCounterCreator.prototype.value = 0;

pagination.pageCounterCreator.prototype.needsUpdate = false;

pagination.pageCounterCreator.prototype.show = function(){
    return this.value;
}
    
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
}

pagination.pageCounters = {};

pagination.pageCounters.arab = new pagination.pageCounterCreator('arabic');
pagination.pageCounters.roman = new pagination.pageCounterCreator('roman', pagination.romanize);



pagination.createPages = function (num, flowName, pageCounterSelector) {
    var page, contents;
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
            contents = document.createElement('div');
            contents.classList.add('contents');
            contents.style.webkitFlowFrom = flowName;

            page.appendChild(contents);
        } else { // if no flowname is given, an empty page is created
            page.classList.add('empty');
        }

        tempRoot.appendChild(page);
    }
    return tempRoot;
}

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

            var tocItemPnText = document.createTextNode(bodyObjects[i].startpageNumber);

            tocItemPnSpan.appendChild(tocItemPnText);
            tocItemDiv.appendChild(tocItemPnSpan);

            tocDiv.appendChild(tocItemDiv);

        }

    }

    return tocDiv;
}

pagination.createBodyObjects = function () {
    //Create body objects    
    var bodyObjects = [];
    var chapterCounter = 0;

    bodyObjects.push(new pagination.flowObject('bodypre', pagination.pageCounters.arab));

    var bodyContainer = eval(pagination.flowElement);
    var bodyContents = bodyContainer.childNodes;


    for (var i = bodyContents.length; i > 0; i--) {

        if (bodyContents[0].nodeType == 1) {
            if (bodyContents[0].webkitMatchesSelector(pagination.chapterStartMarker)) {
                bodyObjects.push(new pagination.flowObject('body' + chapterCounter++, pagination.pageCounters.arab));
                bodyObjects[chapterCounter].setType('chapter');

            } else if (bodyContents[0].webkitMatchesSelector(pagination.sectionStartMarker)) {
                bodyObjects.push(new pagination.flowObject('body' + chapterCounter++, pagination.pageCounters.arab));
                bodyObjects[chapterCounter].setType('section');
            }
        }

        bodyObjects[chapterCounter].rawdiv.appendChild(bodyContents[0]);
    }

    return bodyObjects;

}


pagination.flowObject = function (name, pageCounter) {
    this.name = name;
    this.pageCounter = pageCounter;

    this.rawdiv = document.createElement('div');
    this.rawdiv.id = name + 'raw';
    this.rawdiv.style.webkitFlowInto = name;

    this.div = document.createElement('div');
    this.div.id = name;   

}

pagination.flowObject.prototype.redoPages = false;

pagination.flowObject.prototype.bulkPagesToAdd = pagination.bulkPagesToAdd;

pagination.flowObject.prototype.setType = function (type) {
    this.type = type;
    this.div.classList.add(type);
};

pagination.flowObject.prototype.findTitle = function () {
    var titleField;
    if (this.type == 'chapter') {
        titleField = this.rawdiv.querySelector(pagination.chapterTitleMarker);
        this.title = titleField.innerHTML;
    } else if (this.type == 'section') {
        titleField = this.rawdiv.querySelector(pagination.sectionTitleMarker);
        this.title = titleField.innerHTML;
    }
};

pagination.flowObject.prototype.findStartpageNumber = function () {
    if (this.rawdiv.innerText.length > 0) {
        var startpageNumberField = this.div.querySelector('.pagenumber');
        this.startpageNumber = startpageNumberField.innerText;
    }
};

pagination.flowObject.prototype.setNamedFlow = function () {
    this.namedFlow = document.webkitGetFlowByName(this.name);
}

pagination.flowObject.prototype.makeEvenPages = function () {
    var emptyPage = this.div.querySelector('.page.empty');
    if (emptyPage) {
        this.div.removeChild(emptyPage);
    }
    var allPages = this.div.querySelectorAll('.page');
    if (allPages.length % 2 == 1) {
        this.div.appendChild(pagination.createPages(1, false, this.pageCounter.selector));
    }
}

pagination.flowObject.prototype.addPagesLoop = function (pages) {

    if ('undefined' === typeof (pages)) {
        this.div.appendChild(pagination.createPages(this.bulkPagesToAdd, this.name, this.pageCounter.selector));
        this.bulkPagesToAdd = Math.floor(this.bulkPagesToAdd * pagination.pagesToAddIncrementRatio);
    } else {
        this.div.appendChild(pagination.createPages(pages, this.name, this.pageCounter.selector));
    }

    this.addOrRemovePages(pages);
    
    /*var flowObject = this;
    var extraLoop = function () {
        flowObject.addOrRemovePages(pages);  
    }

    setTimeout(extraLoop, 1);*/

};


pagination.flowObject.prototype.addOrRemovePages = function (pages) {
    if(!(this.namedFlow)) {
        this.setNamedFlow();
    }
    
    if ((this.namedFlow.overset) && (this.rawdiv.innerText.length > 0)) {
        this.pageCounter.needsUpdate = true;
        this.redoPages = true;
        this.addPagesLoop(pages);
    } else if (this.namedFlow.firstEmptyRegionIndex!=-1) {
        this.redoPages = true;
        this.removeExcessPages(pages);
    } else if (this.redoPages) {
        this.redoPages = false;
        if (pagination.alwaysEven) {
            this.makeEvenPages();
        }
        if (this.name!='frontmatter') {
            document.body.dispatchEvent(pagination.bodyLayoutUpdatedEvent);
        }
    }
}


pagination.flowObject.prototype.removeExcessPages = function (pages) {

        var allPages = this.div.querySelectorAll('.page');

        for (var i = this.namedFlow.firstEmptyRegionIndex; i < allPages.length; i++) {
            this.div.removeChild(allPages[i]);
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
}


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
        if (pagination.enableReflow) {
            bodyObjects[i].enableAutoReflow();
        }
    }
    
    pagination.pageCounters.arab.numberPages();

    if (pagination.enableFrontmatter) {
        //Create and flow frontmatter
        fmObject = new pagination.flowObject('frontmatter', pagination.pageCounters.roman);
        document.body.appendChild(fmObject.rawdiv);
        fmObject.rawdiv.innerHTML = pagination.frontmatterContents;
        var toc = pagination.headersAndToc(bodyObjects);
        fmObject.rawdiv.appendChild(toc);
        layoutDiv.insertBefore(fmObject.div, bodyObjects[0].div);
        fmObject.addOrRemovePages();
        pagination.pageCounters.roman.numberPages();
        if (pagination.enableReflow) {
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
    } else if (!(pagination.enableReflow)) {
        document.body.dispatchEvent(pagination.layoutFlowFinishedEvent);
    }
}



pagination.applySimpleBookLayout = function () {
    bodyContainer = eval(pagination.flowElement);
    simplePage = document.createElement('div');
    simplePage.classList.add('simplepage');
    simplePage.innerHTML = bodyContainer.innerHTML;
    simplePage.id = bodyContainer.id;
    bodyContainer.innerHTML = '';
    document.body.appendChild(simplePage);
}


document.onreadystatechange = function () {
    if (pagination.autoStart == true) {
        if ((document.readyState == 'interactive') && (!(document.webkitGetNamedFlows))) {
            pagination.applySimpleBookLayout();
        } else if ((document.readyState == 'complete') && (document.webkitGetNamedFlows)){
            pagination.applyBookLayout();
        }
    }
}