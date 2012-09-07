/*
 * (c) 2012  Mihai Balan, Marita Fraser, Steven Levithan, Philip Schatz and Johannes Wilm. Freely available under the AGPL. For further details see LICENSE.txt
 */
if (document.webkitGetNamedFlows) {


    function romanize(num) {
        if (!+num) return false;
        var digits = String(+num).split(""),
            key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
            roman = "",
            i = 3;
        while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }


    function pageCounter(selector, show) {
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

    var arabPageCounter = new pageCounter('arabic');
    var romanPageCounter = new pageCounter('roman', romanize);

    function numberPages(pageCounter) {
        pageCounter.value = 0;

        var pagenumbersToNumber = document.querySelectorAll('.page .pagenumber.' + pageCounter.selector);
        for (var i = 0; i < pagenumbersToNumber.length; i++) {
            pagenumbersToNumber[i].innerHTML = pageCounter.incrementAndShow();
        }
    }



    function createPages(num, flowName, pageCounterSelector) {
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

    function headersAndToc(bodyObjects) {

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

    function createBodyObjects() {
        //Create body objects    
        var bodyObjects = [];
        var chapterCounter = 0;

        bodyObjects.push(new flowObject('bodypre', arabPageCounter));

        var bodyContainer = eval(flowElement);
        var bodyContents = bodyContainer.childNodes;


        for (var i = bodyContents.length; i > 0; i--) {

            if (bodyContents[0].nodeType == 1) {
                if (bodyContents[0].webkitMatchesSelector(chapterStartMarker)) {
                    bodyObjects.push(new flowObject('body' + chapterCounter++, arabPageCounter));
                    bodyObjects[chapterCounter].setType('chapter');
                    bodyObjects[chapterCounter];

                } else if (bodyContents[0].webkitMatchesSelector(sectionStartMarker)) {
                    bodyObjects.push(new flowObject('body' + chapterCounter++, arabPageCounter));
                    bodyObjects[chapterCounter].setType('section');
                }
            }

            bodyObjects[chapterCounter].rawdiv.appendChild(bodyContents[0]);
        }

        return bodyObjects;

    }


    function flowObject(name, pageCounter) {
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

        fO.bulkPagesToAdd = bulkPagesToAdd;

        fO.setType = function (type) {
            fO.type = type;
            fO.div.classList.add(type);
        };

        fO.findTitle = function () {
            var titleField;
            if (fO.type == 'chapter') {
                titleField = fO.rawdiv.querySelector(chapterTitleMarker);
                fO.title = titleField.innerHTML;
            } else if (fO.type == 'section') {
                titleField = fO.rawdiv.querySelector(sectionTitleMarker);
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
                        fO.div.appendChild(createPages(fO.bulkPagesToAdd, fO.name, fO.pageCounter.selector));
                        fO.bulkPagesToAdd = Math.floor(fO.bulkPagesToAdd * pagesToAddIncrementRatio);

                    } else {
                        fO.div.appendChild(createPages(pages, fO.name, fO.pageCounter.selector));
                    }

                    setTimeout(function () {
                        addPagesLoop(false);
                    }, 1);
                    // If no extra pages are needed, and it's not the first round of addPages we go through, it's safe to remove extra pages and set the page numbers   
                } else if (!(firstTime)) {
                    //     
                    fO.removeExcessPages();
                    // If we always want even pages, add an extra empty page if the total number of pages is odd, else remove this page.
                    if (alwaysEven) {
                        var allPages = fO.div.querySelectorAll('.page');
                        if (allPages.length % 2 == 1) {
                            fO.div.appendChild(createPages(1, false, fO.pageCounter.selector));
                        } else {
                            var emptyPage = fO.div.querySelector('.page.empty');
                            fO.div.removeChild(emptyPage);
                        }

                    }
                    numberPages(fO.pageCounter);
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
    }

    function applyBookLayout() {

        var bodyObjects = createBodyObjects();

        //Create div for layout
        var layoutDiv = document.createElement('div');
        layoutDiv.id = 'layout';

        document.body.appendChild(layoutDiv);

        for (var i = 0; i < bodyObjects.length; i++) {
            var currentBodyObject = bodyObjects[i];
            layoutDiv.appendChild(currentBodyObject.div);
            document.body.appendChild(currentBodyObject.rawdiv);
            currentBodyObject.setNamedFlow();
            currentBodyObject.addPagesIfNeeded();
            if (enableReflow) {
                setInterval(function () {
                    currentBodyObject.addPagesIfNeeded(1);
                    currentBodyObject.removeExcessPages();
                }, 5000);
                //future:
                //currentBodyObject.namedFlow.addEventListener('RegionLayoutUpdated',function(){currentBodyObject.addPagesIfNeeded(1);})
            }
        }

        if (enableFrontmatter) {
            //Create and flow frontmatter
            fmObject = new flowObject('frontmatter', romanPageCounter);
            document.body.appendChild(fmObject.rawdiv);
            fmObject.rawdiv.innerHTML = frontmatterContents;
            var toc = headersAndToc(bodyObjects);
            fmObject.rawdiv.appendChild(toc);

            layoutDiv.insertBefore(fmObject.div, bodyObjects[0].div)
            fmObject.setNamedFlow();
            fmObject.addPagesIfNeeded();
        }
    }

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            applyBookLayout();
            //        setTimeout(function() {applyBookLayout()}, 500); // Wait half a second for fonts to load.
        }
    };

} else {
    document.onreadystatechange = function () {
        if (document.readyState == "interactive") {
            bodyContainer = eval(flowElement);
            simplePage = document.createElement('div');
            simplePage.classList.add('simplepage');
            simplePage.innerHTML = bodyContainer.innerHTML;
            simplePage.id = bodyContainer.id;
            bodyContainer.innerHTML = '';
            document.body.appendChild(simplePage);
        }
    }
}