/*
 * (c) 2012  Marita Fraser, Steven Levithan, Philip Schatz and Johannes Wilm. Freely available under the AGPL. For further details see LICENSE.txt
 */
var pagination = new Object;

if (document.webkitGetNamedFlows) {

    /* CONFIG OPTIONS */

    pagination.sectionStartMarker = 'h1';
    pagination.sectionTitleMarker = 'h1';

    pagination.chapterStartMarker = 'h2';
    pagination.chapterTitleMarker = 'h2';

    pagination.flowElement = "document.body";

    pagination.alwaysEven = false;

    pagination.enableReflow = false;

    pagination.enableFrontmatter = true;

    pagination.bulkPagesToAdd = 50; // For larger chapters add many pages at a time so there is less time spent reflowing text
    pagination.pagesToAddIncrementRatio = 1.4; // Ratio of incrementing pages. 1.4 seems to be the fastest in most situations.

    pagination.frontmatterContents = '';

    pagination.autoStart = true;

    /* END CONFIG OPTIONS */

    pagination.romanize = function (num) {
        if (!+num) return false;
        var digits = String(+num).split(""),
            key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
            roman = "",
            i = 3;
        while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }


    pagination.pageCounter = function (selector, show) {
        this.value = 0;
        this.show = function () {
            if (show === undefined) {
                return this.value;
            } else {
                return show(this.value);
            }
        };
        this.incrementAndShow = function () {
            this.value++;
            return this.show();
        };
        this.selector = selector;
    }

    pagination.arabPageCounter = new pagination.pageCounter('arabic');
    pagination.romanPageCounter = new pagination.pageCounter('roman', pagination.romanize);

    pagination.numberPages = function (pageCounter) {
        pageCounter.value = 0;

        var pagenumbersToNumber = document.querySelectorAll('.page .pagenumber.' + pageCounter.selector);
        for (var i = 0; i < pagenumbersToNumber.length; i++) {
            pagenumbersToNumber[i].innerHTML = pageCounter.incrementAndShow();
        }
    }



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

        bodyObjects.push(new pagination.flowObject('bodypre', pagination.arabPageCounter));

        var bodyContainer = eval(pagination.flowElement);
        var bodyContents = bodyContainer.childNodes;


        for (var i = bodyContents.length; i > 0; i--) {

            if (bodyContents[0].nodeType == 1) {
                if (bodyContents[0].webkitMatchesSelector(pagination.chapterStartMarker)) {
                    bodyObjects.push(new pagination.flowObject('body' + chapterCounter++, pagination.arabPageCounter));
                    bodyObjects[chapterCounter].setType('chapter');
                    bodyObjects[chapterCounter];

                } else if (bodyContents[0].webkitMatchesSelector(pagination.sectionStartMarker)) {
                    bodyObjects.push(new pagination.flowObject('body' + chapterCounter++, pagination.arabPageCounter));
                    bodyObjects[chapterCounter].setType('section');
                }
            }

            bodyObjects[chapterCounter].rawdiv.appendChild(bodyContents[0]);
        }

        return bodyObjects;

    }


    pagination.flowObject = function (name, pageCounter) {
        var fO = this;
        fO.name = name;
        fO.pageCounter = pageCounter;
        fO.type = false;
        fO.title = false;
        fO.startpageNumber = false;

        fO.rawdiv = document.createElement('div');
        fO.rawdiv.id = name + 'raw';
        fO.rawdiv.style.webkitFlowInto = name;

        fO.div = document.createElement('div');
        fO.div.id = name;

        fO.bulkPagesToAdd = pagination.bulkPagesToAdd;

        fO.setType = function (type) {
            fO.type = type;
            fO.div.classList.add(type);
        };

        fO.findTitle = function () {
            var titleField;
            if (fO.type == 'chapter') {
                titleField = fO.rawdiv.querySelector(pagination.chapterTitleMarker);
                fO.title = titleField.innerHTML;
            } else if (fO.type == 'section') {
                titleField = fO.rawdiv.querySelector(pagination.sectionTitleMarker);
                fO.title = titleField.innerHTML;
            }
        };

        fO.findStartpageNumber = function () {
            if (fO.rawdiv.innerText.length > 0) {
                var startpageNumberField = fO.div.querySelector('.pagenumber');
                fO.startpageNumber = startpageNumberField.innerText;
            }
        };

        fO.setNamedFlow = function () {
            fO.namedFlow = document.webkitGetFlowByName(fO.name);
        }

        // If text overflows from the region add more pages
        fO.addPagesIfNeeded = function (pages) {

            var addPagesLoop = function (firstTime) {

                if (fO.namedFlow.overset) {
                    if ('undefined' === typeof (pages)) {
                        fO.div.appendChild(pagination.createPages(fO.bulkPagesToAdd, fO.name, fO.pageCounter.selector));
                        fO.bulkPagesToAdd = Math.floor(fO.bulkPagesToAdd * pagination.pagesToAddIncrementRatio);

                    } else {
                        fO.div.appendChild(pagination.createPages(pages, fO.name, fO.pageCounter.selector));
                    }

                    setTimeout(function () {
                        addPagesLoop(false);
                    }, 1);
                    // If no extra pages are needed, and it's not the first round of addPages we go through, it's safe to remove extra pages and set the page numbers   
                } else if (!(firstTime)) {
                    //     
                    fO.removeExcessPages();
                    // If we always want even pages, add an extra empty page if the total number of pages is odd, else remove this page.
                    if (pagination.alwaysEven) {
                        var allPages = fO.div.querySelectorAll('.page');
                        if (allPages.length % 2 == 1) {
                            fO.div.appendChild(pagination.createPages(1, false, fO.pageCounter.selector));
                        } else {
                            var emptyPage = fO.div.querySelector('.page.empty');
                            if (emptyPage) {
                                fO.div.removeChild(emptyPage);
                            }
                        }

                    }
                    pagination.numberPages(fO.pageCounter);
                }
            };

            if (fO.rawdiv.innerText.length > 0) {
                addPagesLoop(true);
            }
        }


        fO.removeExcessPages = function () {

            var firstEmpty = fO.namedFlow.firstEmptyRegionIndex;

            // If there are empty pages, remove up to the last odd page number. If there are no empty pages, make sure the last page is an even page.
            if ((firstEmpty != -1) && (firstEmpty !== undefined)) {

                var allPages = fO.div.querySelectorAll('.page');

                for (var i = firstEmpty; i < allPages.length; i++) {
                    fO.div.removeChild(allPages[i]);
                }

            }

        };

        fO.enableAutoReflow = function () {
            setInterval(function () {
                fO.addPagesIfNeeded(1);
                fO.removeExcessPages();
            }, 5000);
            //future:
            //fO.namedFlow.addEventListener('RegionLayoutUpdated',function(){fO.addPagesIfNeeded(1);})
        }
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
            bodyObjects[i].setNamedFlow();
            bodyObjects[i].addPagesIfNeeded();
            if (pagination.enableReflow) {
                bodyObjects[i].enableAutoReflow();
            }
        }

        if (pagination.enableFrontmatter) {
            //Create and flow frontmatter
            fmObject = new pagination.flowObject('frontmatter', pagination.romanPageCounter);
            document.body.appendChild(fmObject.rawdiv);
            fmObject.rawdiv.innerHTML = pagination.frontmatterContents;
            var toc = pagination.headersAndToc(bodyObjects);
            fmObject.rawdiv.appendChild(toc);
            layoutDiv.insertBefore(fmObject.div, bodyObjects[0].div)
            fmObject.setNamedFlow();
            fmObject.addPagesIfNeeded();
            if (pagination.enableReflow) {
                setInterval(function () {
                    var oldToc = toc;
                    toc = pagination.headersAndToc(bodyObjects);
                    fmObject.rawdiv.replaceChild(toc, oldToc);
                }, 5000);
                fmObject.enableAutoReflow();
            }
        }
    }

    document.onreadystatechange = function () {
        if ((document.readyState == "complete") && (pagination.autoStart == true)) {
            pagination.applyBookLayout();
        }
    };

} else {

    pagination.applyBookLayout = function () {
        bodyContainer = eval(pagination.flowElement);
        simplePage = document.createElement('div');
        simplePage.classList.add('simplepage');
        simplePage.innerHTML = bodyContainer.innerHTML;
        simplePage.id = bodyContainer.id;
        bodyContainer.innerHTML = '';
        document.body.appendChild(simplePage);
    }

    document.onreadystatechange = function () {
        if ((document.readyState == "interactive") && (pagination.autoStart == true)) {
            pagination.applyBookLayout();
        }
    }
}