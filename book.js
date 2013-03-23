/*!
 * BookJS v.0.70-dev
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
 * In order to use this library, link to this javascript file within your html
 * code.
 * If you need to set custom options, set them before including this javascript
 * file by defining an object named paginationConfig and setting the
 * customization options as keys within this object. If you want to style the 
 * output in a specific way, customize the book.css file and include it, like 
 * this:
 *
 * <link href="book.css" rel="stylesheet" type="text/css" />
 * <script type="text/javascript">
 *     paginationConfig = {
 *         'sectionStartMarker': 'h3',
 *         'columns': 3,
 *         'autoStart': false,
 *     }
 * </script>
 * <script src="book.js" type="text/javascript"></script>
 *
 * OPTIONS
 * 
 * The following options are available to customize the pagination behavior. In
 * the descriptions below you can see the default values for these options. You
 * only need to specify the options if you want to deviate from the default 
 * value.
 *
 * sectionStartMarker: 'h1' -- This is the HTML element we look for to find where
 * a new section starts.
 *
 * sectionTitleMarker: 'h1' -- Within the newly found section, we look for the
 * first instance of this element to determine the title of the section.
 *
 * chapterStartMarker: 'h2' -- This is the HTML element we look for to find where
 * a new chapter starts.
 *
 * chapterTitleMarker: 'h2' -- Within the newly found chapter, we look for the
 * first instance of this element to determine the title of the chapter.
 *
 * flowElement: 'document.body' -- This specifies element the container element
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
 * Note: divideContents has to be true if one wants the frontmatter to render.
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
 * initiated manually. See below under "methods."
 * 
 * numberPages: true -- This controls whether page numbers should be used. If 
 * page numbers are not used, the table of contents is automatically left out.
 * 
 * divideContents: true -- This controls whether the contents are divdided up 
 * according to sections and chapters before flowing. CSS Regions take a long
 * time when more than 20-30 pages are involved, which is why it usually makes
 * sense to divide the contents up. However, if the contents to be flown takes
 * up less space than this, there is no need to do this division. The added 
 * benefit of not doing it is that the original DOM of the part that contains 
 * the conents will not be modified. Only the container element that holds the
 * contents will be assigned another CSS class. Note: divideContents has to be
 * true if one wants the frontmatter to render.
 *
 * maxPageNumber: 10000 -- This controls the maximum amount of pages. If more 
 * pages than this are added, BookJS will die. Notice that pages are added 
 * incrementally, so you won't be able to control the exact number of pages. 
 * You should always set this to something much larger than what you will ever
 * expect that you book will need.
 * 
 * Page style options
 * 
 * These settings provide a way to do simple styling of the page. These 
 * settings are different from the baove ones in that they can be overriden 
 * through CSS to provide more advanced designs (see the above note on 
 * book.css).
 * 
 * outerMargin: .5 (inch)-- This controls the margin on the outer part of the 
 * page.
 * 
 * innerMargin: .8 (inch)-- This controls the margin on the inenr part of the 
 * page.
 * 
 * contentsTopMargin: .8 (inch)-- This controls the margin between the top of 
 * the page and the top of the contents.
 * 
 * headerTopMargin: .3 (inch) -- This controls the margin between the top of 
 * the page and the top of the page headers.
 * 
 * contentsBottomMargin: .8 (inch) -- This controls the margin between the 
 * bottom of the page and the bottom of the contents.
 * 
 * pagenumberBottomMargin: .3 (inch) -- This controls the margin between the 
 * bottom of the page and the bottom of the page number.
 * 
 * pageHeight: 8.3 (inch) -- This controls the height of the page.
 * 
 * pageWidth: 5.8 (inch) -- This controls the width of the page.
 * 
 * lengthUnit: 'in' (inch) -- Use this to specify the unit used in all the page 
 * style options. It can be any unit supported by CSS.
 * 
 * METHODS
 * 
 * Changing the page style after initialization
 * 
 * At times the user might want to change the page design or page size after 
 * BookJS has started -- for example to look at the same text in different page
 * sizes. To do this, he has to change all the page style options which are now
 * located inside paginationConfig and run pagination.setPageStyle(). Like 
 * this:
 * 
 * paginationConfig['pageHeight'] = 11;
 * paginationConfig['pageWidth'] = 8;
 * pagination.setPageStyle();
 * 
 * Initializing page flowing after loading
 * 
 * If one chooses not to flow the pages automatically upon page loading, it has
 * to be initiated manually by calling pagination.applyBookLayout() or 
 * pagination.applySimpleBookLayout() in case CSS Regions are not present. 
 * 
 * Check whether CSS regions are present.
 * 
 * pagination._cssRegionCheck() will return true or false, depending on whether
 * CSS Regions are present or not.
 * 
 */ (function () {

    var exports = this,
        defaults,
        pagination = {};

    // pagination is the object that contains the namespace used by BookJS.

    defaults = {
        // pagination.config starts out with default config options.
        'sectionStartMarker': 'h1',
        'sectionTitleMarker': 'h1',
        'chapterStartMarker': 'h2',
        'chapterTitleMarker': 'h2',
        'flowElement': 'document.body',
        'alwaysEven': false,
        'columns': 1,
        'enableFrontmatter': true,
        'bulkPagesToAdd': 50,
        'pagesToAddIncrementRatio': 1.4,
        'frontmatterContents': '',
        'autoStart': true,
        'numberPages': true,
        'divideContents': true,
        'maxPageNumber': 10000,
        'outerMargin': .5,
        'innerMargin': .8,
        'contentsTopMargin': .8,
        'headerTopMargin': .3,
        'contentsBottomMargin': .8,
        'pagenumberBottomMargin': .3,
        'pageHeight': 8.3,
        'pageWidth': 5.8,
        'lengthUnit': 'in',
    };

    // help functions

    pagination.romanize = function () {
        // Create roman numeral representations of numbers.
        var digits = String(+this.value).split(""),
            key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                    "",
                    "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "",
                    "I", "II",
                    "III", "IV", "V", "VI", "VII", "VIII", "IX"
            ],
            roman = "",
            i = 3;
        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        }
        return Array(+digits.join("") + 1).join("M") + roman;
    };

    pagination.createRandomId = function (base) {
        // Create a random CSS Id that is not in use already.
        var stillSearchingForUniqueId = true;
        var randomId;
        while (stillSearchingForUniqueId) {
            randomId = base + Math.floor(Math.random() * 100000);
            if (!document.getElementById(randomId)) {
                stillSearchingForUniqueId = false;
            }
        }
        return randomId;
    };

    pagination.pageStyleSheet = document.createElement('style');

    pagination.initiate = function () {
        /* Initiate BookJS by importing user set config options and setting basic
         * CSS style.
         */

        this.setStyle();
        this.setPageStyle();
        document.head.insertBefore(
            pagination.pageStyleSheet,
            document.head.firstChild);
    }

    pagination.config = function (configKey) {
        /* Return configuration variables either from paginationConfig if present,
         * or using default values.
         */

        if (paginationConfig && configKey in paginationConfig) {
            return paginationConfig[configKey];
        } else if (configKey in defaults) {
            return defaults[configKey];
        } else {
            return false;
        }
    }

    pagination.setStyle = function () {
        /* Set style for the regions and pages used by BookJS and add it to the
         * head of the DOM.
         */
        var stylesheet = document.createElement('style');
        stylesheet.innerHTML =
            ".pagination-contents-container {display: -webkit-flex; " +
            "-webkit-flex-direction: column; position: absolute;}" +
            "\n.pagination-contents {display: -webkit-flex; -webkit-flex: 1;}"
        /* There seems to be a bug in the new flexbox model code which requires the
         * height to be set to an arbitrary value (which is ignored).
         */ + "\n.pagination-contents {height: 0px;}" +
            "\n.pagination-contents-column {-webkit-flex: 1;}" + "\nbody {" +
            "counter-reset: pagination-footnote pagination-footnote-reference;}" +
            "\n.pagination-footnote::before {" +
            "counter-increment: pagination-footnote-reference; " +
            "content: counter(pagination-footnote-reference);}" +
            "\n.pagination-footnote > * > *:first-child::before {" +
            "counter-increment: pagination-footnote;" +
            "content: counter(pagination-footnote);}" +
            "\n.pagination-footnote > * > * {display: block;}" +
            "\n.pagination-page {page-break-after: always; position: relative;}" +
            "\nimg {-webkit-region-break-before: always; " +
            "-webkit-region-break-after: always;}" +
            "\n.pagination-pagenumber, .pagination-header {position: absolute;}" +
            "\n.pagination-pagebreak {-webkit-region-break-after: always;}" +
            "\n.pagination-simple {height: auto; position-relative;}" +
            "\n.pagination-page {margin-left:auto; margin-right:auto;}";
        document.head.appendChild(stylesheet);
    }

    pagination.setPageStyle = function () {
        // Set style for a particular page size.
        var unit = pagination.config('lengthUnit'),
            contentsWidthNumber = pagination.config('pageWidth') - pagination.config(
                'innerMargin') - pagination.config('outerMargin'),
            contentsWidth = contentsWidthNumber + unit,
            columnWidth = contentsWidthNumber / pagination.config('columns') +
                unit,
            contentsHeightNumber = pagination.config('pageHeight') - pagination
                .config('contentsTopMargin') - pagination.config(
                'contentsBottomMargin'),
            contentsHeight = contentsHeightNumber + unit,
            pageWidth = pagination.config('pageWidth') + unit,
            pageHeight = pagination.config('pageHeight') + unit,
            contentsBottomMargin = pagination.config('contentsBottomMargin') +
                unit,
            innerMargin = pagination.config('innerMargin') + unit,
            outerMargin = pagination.config('outerMargin') + unit,
            pagenumberBottomMargin = pagination.config('pagenumberBottomMargin') +
                unit,
            headerTopMargin = pagination.config('headerTopMargin') + unit,
            imageMaxHeight = contentsHeightNumber - .1 + unit,
            imageMaxWidth = contentsWidthNumber - .1 + unit;

        pagination.pageStyleSheet.innerHTML =
            ".pagination-page {height:" + pageHeight + "; width:" + pageWidth +
            ";" + "background-color: #fff;}" + "\n@page {size:" + pageWidth +
            " " + pageHeight + ";}" + "\nbody {background-color: #efefef;}"
        // A .page.simple is employed when CSS Regions are not accessible
        + "\n.pagination-simple {padding: 1in;}"
        // To give the appearance on the screen of pages, add a space of .2in
        + "\n@media screen{.pagination-page {border:solid 1px #000; " +
            "margin-bottom:.2in;}}" +
            "\n.pagination-contents-container {height:" + contentsHeight + ";" +
            "width:" + contentsWidth + ";" + "bottom:" + contentsBottomMargin +
            ";}"
        // Images should at max size be slightly smaller than the contentsWidth.
        + "\nimg {max-height: " + imageMaxHeight + ";max-width: " +
            imageMaxWidth + ";}" + "\n.pagination-pagenumber {bottom:" +
            pagenumberBottomMargin + ";}" + "\n.pagination-header {top:" +
            headerTopMargin + ";}" +
            "\n#pagination-toc-title:before {content:'Contents';}" +
            "\n.pagination-page:nth-child(odd) .pagination-contents-container, " +
            ".pagination-page:nth-child(odd) .pagination-pagenumber," +
            ".pagination-page:nth-child(odd) .pagination-header {" + "right:" +
            outerMargin + ";left:" + innerMargin + ";}" +
            "\n.pagination-page:nth-child(even) .pagination-contents-container, " +
            ".pagination-page:nth-child(even) .pagination-pagenumber," +
            ".pagination-page:nth-child(even) .pagination-header {" + "right:" +
            innerMargin + ";left:" + outerMargin + ";}" +
            "\n.pagination-page:nth-child(odd) .pagination-pagenumber," +
            ".pagination-page:nth-child(odd) .pagination-header {" +
            "text-align:right;}" +
            "\n.pagination-page:nth-child(even) .pagination-pagenumber," +
            ".pagination-page:nth-child(even) .pagination-header {" +
            "text-align:left;}" +
            "\n.pagination-footnote > * > * {font-size: 0.7em; margin:.25em;}" +
            "\n.pagination-footnote > * > *::before, .pagination-footnote::before " +
            "{position: relative; top: -0.5em; font-size: 80%;}" +
            "\n.pagination-toc-entry .pagination-toc-pagenumber {float:right}"
        /* This seems to be a bug in Webkit. But unless we set the width of the 
         * original element that is being flown, some elements extend beyond the
         * contentsContainer's width.
         */ + "\n.pagination-contents-item {width:" + columnWidth + ";}" +
            "\n.pagination-frontmatter-contents {width:" + contentsWidth + ";}"
        // Footnotes in non-CSS Regions browsers will render as right margin notes.
        + "\n.pagination-simple .pagination-footnote > span {" +
            "position: absolute; right: 0in; width: 1in;}";
    }



    pagination.pageCounterCreator = function (cssClass, show) {
        /* Create a pagecounter. cssClass is the CSS class employed by this page
         * counter to mark all page numbers associated with it. If a show function
         * is specified, use this instead of the built-in show function.
         */
        this.cssClass = cssClass;
        if (show !== undefined) {
            this.show = show;
        }
    };

    pagination.pageCounterCreator.prototype.value = 0;
    // The initial value of any page counter is 0.

    pagination.pageCounterCreator.prototype.needsUpdate = false;
    /* needsUpdate controls whether a given page counter should be updated. 
     * Initially this is not the case.
     */

    pagination.pageCounterCreator.prototype.show = function () {
        /* Standard show function for page counter is to show the value itself
         * using arabic numbers.
         */
        return this.value;
    };

    pagination.pageCounterCreator.prototype.incrementAndShow = function () {
        /* Increment the page count by one and return the reuslt page count using
         * the show function.
         */
        this.value++;
        return this.show();
    };


    pagination.pageCounterCreator.prototype.numberPages = function () {
        /* If the pages associated with this page counter need to be updated, go
         * through all of them from the start of the book and number them, thereby
         * potentially removing old page numbers.
         */
        this.value = 0;
        this.needsUpdate = false;

        var pagenumbersToNumber = document.querySelectorAll(
            '.pagination-page .pagination-pagenumber.pagination-' + this.cssClass);
        for (var i = 0; i < pagenumbersToNumber.length; i++) {
            pagenumbersToNumber[i].innerHTML = this.incrementAndShow();
        }
    };

    pagination.pageCounters = {};
    /* pagination.pageCounters contains all the page counters we use in a book --
     * typically these are two -- roman for the frontmatter and arab for the main
     * body contents. 
     */

    pagination.pageCounters.arab = new pagination.pageCounterCreator(
        'arabic');
    // arab is the page counter used by the main body contents.

    pagination.pageCounters.roman = new pagination.pageCounterCreator(
        'roman',
        pagination.romanize);
    // roman is the page counter used by the frontmatter.

    pagination.createPages = function (num, flowName, pageCounterClass, columns) {
        // Create the DOM structure of num number of pages.
        var page, contents, footnotes, contentsContainer, column, topFloats;
        var tempRoot = document.createDocumentFragment();
        for (var i = 0; i < num; i++) {
            page = document.createElement('div');
            page.classList.add('pagination-page');

            header = document.createElement('div');
            header.classList.add('pagination-header');

            chapterheader = document.createElement('span');
            chapterheader.classList.add('pagination-header-chapter');
            header.appendChild(chapterheader);

            sectionheader = document.createElement('span');
            sectionheader.classList.add('pagination-header-section');
            header.appendChild(sectionheader);

            page.appendChild(header);

            if (pagination.config('numberPages')) {
                pagenumberfield = document.createElement('div');
                pagenumberfield.classList.add('pagination-pagenumber');
                pagenumberfield.classList.add('pagination-' + pageCounterClass);

                page.appendChild(pagenumberfield);
            }

            // If flowName is given, create a page with content flow.
            if (flowName) {
                contentsContainer = document.createElement('div');
                contentsContainer.classList.add('pagination-contents-container');

                topFloats = document.createElement('div');
                topFloats.classList.add('pagination-top-floats');

                contents = document.createElement('div');
                contents.classList.add('pagination-contents');

                for (var j = 0; j < columns; j++) {
                    column = document.createElement('div');
                    column.classList.add('pagination-contents-column');
                    contents.appendChild(column);
                }

                footnotes = document.createElement('div');
                footnotes.classList.add('pagination-footnotes');

                contentsContainer.appendChild(topFloats);
                contentsContainer.appendChild(contents);
                contentsContainer.appendChild(footnotes);
                page.appendChild(contentsContainer);
                // If no flowName is given, an empty page is created.
            } else {
                page.classList.add('pagination-empty');
            }

            tempRoot.appendChild(page);
        }
        return tempRoot;
    };

    pagination.events = {};
    // pagination.events represents all the events created specifically by BookJS.

    pagination.events.bodyLayoutUpdated = document.createEvent('Event');
    pagination.events.bodyLayoutUpdated.initEvent(
        'bodyLayoutUpdated',
        true,
        true);
    /* bodyLayoutUpdated is emitted when pages have been added or removed from any
     * body flowObject.
     */

    pagination.events.layoutFlowFinished = document.createEvent('Event');
    pagination.events.layoutFlowFinished.initEvent(
        'layoutFlowFinished',
        true,
        true);
    /* layoutFlowFinished is emitted the first time the flow of the entire book has
     * been created.
     */

    pagination.events.pageLayoutUpdate = document.createEvent('Event');
    pagination.events.pageLayoutUpdate.initEvent(
        'pageLayoutUpdated',
        true,
        true);
    /* pageLayoutUpdated is emitted when new pages have to added or excess pages be
     * removed.
     */

    pagination.events.footnotesNeedMove = document.createEvent('Event');
    pagination.events.footnotesNeedMove.initEvent(
        'footnotesNeedMove',
        true,
        true);
    /* footnotesNeedMove is emitted when at least one footnote no longer is on the
     * page of the reference page it corresponds to.
     */

    pagination.events.redoFootnotes = document.createEvent('Event');
    pagination.events.redoFootnotes.initEvent(
        'redoFootnotes',
        true,
        true);
    /* redoFootnotes is being listened to by BookJS to see when footnotes need to
     * be refound and redrawn. This can be used by editors who need to add new 
     * footnotes. 
     */


    pagination.headersAndToc = function (bodyObjects) {
        /* Go through all pages of all flowObjects and add page headers and
         * calculate the table fo contents (TOC) for the frontmatter. This has to
         * be done after all pages representing the body of the text have been
         * flown and has to redone when there are changes to the body contents that
         * can influence the TOC (such as page creation or deletion).
         */
        var currentChapterTitle = '';
        var currentSectionTitle = '';

        if (pagination.config('numberPages')) {
            var tocDiv = document.createElement('div');
            tocDiv.id = 'pagination-toc';

            tocTitleH1 = document.createElement('h1');
            tocTitleH1.id = 'pagination-toc-title';

            tocDiv.appendChild(tocTitleH1);
        }


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
                var chapterHeader = pages[j].querySelector(
                    '.pagination-header .pagination-header-chapter');
                chapterHeader.innerHTML = currentChapterTitle;

                var sectionHeader = pages[j].querySelector(
                    '.pagination-header .pagination-header-section');
                sectionHeader.innerHTML = currentSectionTitle;
            }

            if (bodyObjects[i].type && pagination.config('numberPages')) {

                var tocItemDiv = document.createElement('div');
                tocItemDiv.classList.add('pagination-toc-entry');
                tocItemDiv.classList.add(bodyObjects[i].type);

                var tocItemTextSpan = document.createElement('span');
                tocItemTextSpan.classList.add('pagination-toc-text');

                tocItemTextSpan.innerHTML = bodyObjects[i].title;
                tocItemDiv.appendChild(tocItemTextSpan);

                var tocItemPnSpan = document.createElement('span');
                tocItemPnSpan.classList.add('pagination-toc-pagenumber');

                if (typeof bodyObjects[i].startpageNumber !== 'undefined') {
                    var tocItemPnText = document.createTextNode(
                        bodyObjects[i].startpageNumber);
                    tocItemPnSpan.appendChild(tocItemPnText);
                }

                tocItemDiv.appendChild(tocItemPnSpan);

                tocDiv.appendChild(tocItemDiv);

            }

        }

        return tocDiv;
    };

    pagination.createBodyObjects = function () {
        /* Go through the entire body contents and look for chapterStartMarker and
         * sectionStartMarker to divide it up. We will then float these elements
         * individually, as CSS Regions has problems flowing material that requires
         * 100+ regions. 
         */
        var bodyObjects = [];
        var chapterCounter = 0;

        bodyObjects.push(
            new pagination.flowObject(
            'pagination-body-pre',
            pagination.pageCounters.arab));

        var bodyContainer = eval(pagination.config('flowElement'));
        var bodyContents = bodyContainer.childNodes;


        for (var i = bodyContents.length; i > 0; i--) {

            if (bodyContents[0].nodeType == 1) {
                if (
                    bodyContents[0].webkitMatchesSelector(
                    pagination.config('chapterStartMarker'))) {
                    bodyObjects.push(
                        new pagination.flowObject(
                        'pagination-body-' + chapterCounter++,
                        pagination.pageCounters.arab));
                    bodyObjects[chapterCounter].setType('chapter');

                } else if (
                    bodyContents[0].webkitMatchesSelector(
                    pagination.config('sectionStartMarker'))) {
                    bodyObjects.push(
                        new pagination.flowObject(
                        'pagination-body-' + chapterCounter++,
                        pagination.pageCounters.arab));
                    bodyObjects[chapterCounter].setType('section');
                }
            }

            bodyObjects[chapterCounter].rawdiv.appendChild(bodyContents[0]);
        }

        return bodyObjects;

    };

    pagination.applyBookLayoutNonDestructive = function () {
        // Apply layout without changing the original DOM.


        if (eval(pagination.config('flowElement')) == document.body) {
            /* We are reflowing the body itself, yet the layout will be added to 
             * the body. This will make the broser crash. So we need to move the 
             * original contents inside a Div of its own first.
             */
            var rawdiv = document.createElement('div');
            rawdiv.id = 'pagination-contents';
            rawdiv.innerHTML = document.body.innerHTML;
            document.body.innerHTML = '';
            document.body.appendChild(rawdiv);

        } else {
            var rawdiv = eval(pagination.config('flowElement'));
        }

        var bodyObject = new pagination.flowObject(
            'body',
            pagination.pageCounters.arab,
            rawdiv)

        // Create div for layout
        var layoutDiv = document.createElement('div');
        layoutDiv.id = 'pagination-layout';
        layoutDiv.appendChild(bodyObject.div);

        document.body.appendChild(layoutDiv);

        bodyObject.initiate();
        document.dispatchEvent(pagination.events.layoutFlowFinished);
    }

    pagination.applyBookLayout = function () {
        /* Apply this layout if CSS Regions are present.
         * Will first divide the original DOM up into individual chapters and 
         * sections.
         */

        var bodyObjects = pagination.createBodyObjects();

        // Create div for layout
        var layoutDiv = document.createElement('div');
        layoutDiv.id = 'pagination-layout';
        document.body.appendChild(layoutDiv);

        // Create div for contents
        var contentsDiv = document.createElement('div');
        contentsDiv.id = 'pagination-contents';
        document.body.appendChild(contentsDiv);

        counter = 0;

        for (var i = 0; i < bodyObjects.length; i++) {
            layoutDiv.appendChild(bodyObjects[i].div);
            contentsDiv.appendChild(bodyObjects[i].rawdiv);
            bodyObjects[i].initiate();
        }

        pagination.pageCounters.arab.numberPages();

        if (pagination.config('enableFrontmatter')) {
            //Create and flow frontmatter
            fmObject = new pagination.flowObject(
                'pagination-frontmatter',
                pagination.pageCounters.roman,
                false);
            fmObject.columns = 1;
            contentsDiv.insertBefore(fmObject.rawdiv, contentsDiv.firstChild);
            fmObject.rawdiv.innerHTML = pagination.config('frontmatterContents');
            var toc = pagination.headersAndToc(bodyObjects);
            if (pagination.config('numberPages')) {
                fmObject.rawdiv.appendChild(toc);
            }
            layoutDiv.insertBefore(fmObject.div, bodyObjects[0].div);
            fmObject.initiate();
            var redoToc = function () {
                var oldToc = toc;
                toc = pagination.headersAndToc(bodyObjects);
                fmObject.rawdiv.replaceChild(toc, oldToc);
            };
            document.body.addEventListener('bodyLayoutUpdated', redoToc);
        }
        document.dispatchEvent(pagination.events.layoutFlowFinished);
    };



    pagination.applySimpleBookLayout = function () {
        // Apply this alternative layout in case CSS Regions are not present 

        if (eval(pagination.config('flowElement')) == document.body) {
            /* We are reflowing the body itself, yet the layout will be added to 
             * the body. This will make the broser crash. So we need to move the 
             * original contents inside a Div of its own first.
             */
            var contentsDiv = document.createElement('div');
            contentsDiv.id = 'pagination-contents';
            contentsDiv.innerHTML = document.body.innerHTML;
            document.body.innerHTML = '';
            document.body.appendChild(contentsDiv);

            pagination.config('flowElement') =
                "document.getElementById('pagination-contents')";
        }

        var simplePage = eval(pagination.config('flowElement'));
        //var simplePage = document.createElement('div');
        simplePage.classList.add('pagination-page');
        simplePage.classList.add('pagination-simple');
        //simplePage.innerHTML = bodyContainer.innerHTML;
        //simplePage.id = bodyContainer.id;
        //bodyContainer.innerHTML = '';
        //document.body.appendChild(simplePage);
        document.dispatchEvent(pagination.events.layoutFlowFinished);
    };

    pagination._cssRegionsCheck = function () {
        // Check whether CSS Regions are present in Chrome 23+ version
        if (
        (
            document.webkitGetNamedFlows) && (
            document.webkitGetNamedFlows() !== null)) {
            return true;
        }
        return false;
    };

    pagination.autoStartInitiator = function () {
        // To be executed upon document loading.
        var cssRegionsPresent = pagination._cssRegionsCheck();
        if ((document.readyState == 'interactive') && (!(cssRegionsPresent))) {
            pagination.applySimpleBookLayout();
        } else if ((document.readyState == 'complete') && (cssRegionsPresent)) {
            if (pagination.config('divideContents')) {
                pagination.applyBookLayout();
            } else {
                pagination.applyBookLayoutNonDestructive();
            }
        }
    }



    if (pagination.config('autoStart') === true) {
        /* Hook pagination.autoStartInitiator to document loading stage if
         * autoStart is set to true.
         */
        document.addEventListener(
            "readystatechange",
            pagination.autoStartInitiator);
    }

    exports.pagination = pagination;

}).call(this);


(function () {

    var exports = this,
        flowObject;

    flowObject = function (name, pageCounter, rawdiv) {
        /* A flowObject is either a chapter, a section start, the frontmatter or
         * the contents of the body of the text that come before the first
         * chapter/section title.
         */
        this.name = name;
        this.pageCounter = pageCounter;

        if (rawdiv) {
            this.rawdiv = rawdiv;
        } else {
            this.rawdiv = document.createElement('div');
        }
        this.rawdiv.classList.add(name + '-contents');
        this.rawdiv.classList.add('pagination-contents-item');

        this.div = document.createElement('div');
        this.div.classList.add(name + '-layout');

        this.bulkPagesToAdd = pagination.config('bulkPagesToAdd');

        this.columns = pagination.config('columns');

        this.footnotes = [];

        this.footnoteStylesheet = document.createElement('style');

    };

    flowObject.prototype.redoPages = false;
    // redoPages is set if page numbering needs to be updated.

    flowObject.prototype.overset = false;
    /* We record the current state of the overset of the region flow so that we
     * only have to find out if pages need to be added or removed when it
     * changes, rather than every time the contents of the region flow changes.
     */

    flowObject.prototype.firstEmptyRegionIndex = -1;
    /* In addition to overset, we also need to monitor changes to the
     * firstEmptyRegionIndex property of the flow, because in the case of multi
     * column pages, there may be empty regions (unfilled columns) that we do not
     * want to remove.
     */

    flowObject.prototype.initiate = function () {
        /* To be run upon the initiation of any flowObject after rawdiv and div
         * have been set and rawdiv has been filled with initial contents.
         */
        this.setStyle();
        this.namedFlow = document.webkitGetNamedFlows()[this.name];
        this.addOrRemovePages();
        this.setupReflow();
        this.findAllFootnotes();
        this.layoutFootnotes();
        this.setupFootnoteReflow();
        if (pagination.config('numberPages')) {
            this.pageCounter.numberPages();
        }
    }

    flowObject.prototype.setStyle = function () {
        /* Create a style element for this flowObject and add it to the header in
         * the DOM. That way it will not be mixing with the DOM of the
         * contents.
         */
        var stylesheet = document.createElement('style');
        stylesheet.innerHTML = "." + this.name + "-layout" +
            " .pagination-contents-column {-webkit-flow-from: " + this.name +
            ";}" + "\n." + this.name + "-contents " + "{-webkit-flow-into: " +
            this.name + ";}";
        document.head.appendChild(stylesheet);
    }

    flowObject.prototype.setType = function (type) {
        // Set the type of this flowObject (chapter or section start).
        this.type = type;
        this.div.classList.add('pagination-' + type);
    };

    flowObject.prototype.findTitle = function () {
        // Find the title of section or chapter that this flowObject is covering.
        var titleField;
        if (this.type == 'chapter') {
            titleField = this.rawdiv.querySelector(
                pagination.config('chapterTitleMarker'));
            if (titleField) {
                this.title = titleField.innerHTML;
            } else {
                this.title = '';
            }
        } else if (this.type == 'section') {
            titleField = this.rawdiv.querySelector(
                pagination.config('sectionTitleMarker'));
            if (titleField) {
                this.title = titleField.innerHTML;
            } else {
                this.title = '';
            }
        }
    };

    flowObject.prototype.findStartpageNumber = function () {
        // Find the first page number used in this flowObject.
        if (this.rawdiv.innerText.length > 0 && pagination.config('numberPages')) {
            var startpageNumberField =
                this.div.querySelector('.pagination-pagenumber');
            this.startpageNumber = startpageNumberField.innerText;
        }
    };

    // Footnote handling

    flowObject.prototype.findFootnoteReferencePage = function (
        footnoteReference) {
        /* Find the page where the reference to the footnote in the text is
         * placed.
         */
        var footnoteReferenceNode = this.namedFlow.getRegionsByContent(
            footnoteReference)[0];
        if (footnoteReferenceNode) {
            return footnoteReferenceNode.parentNode.parentNode.parentNode;
        } else {
            /* A bug in Webkit means that we don't find the footnote at times. In these
             * situations we will look for the parent element instead.
             */
            return this.findFootnoteReferencePage(footnoteReference.parentNode);
        }
    }

    flowObject.prototype.findFootnotePage = function (footnote) {
        if (footnote.parentNode) {
            // Find the page where the footnote itself is currently placed.
            return footnote.parentNode.parentNode.parentNode;
        } else {
            return false;
        }
    }

    flowObject.prototype.compareReferenceAndFootnotePage = function (
        footnoteObject) {
        /* Check whether a footnote and it's corresponding reference in the text
         * are on the same page.
         */
        var footnoteReference = document.getElementById(footnoteObject['id']);
        if (footnoteReference === null) {
            /* It seems this footnote had been deleted, so we will dispatch an 
             * event that will redo all footnotes.
             */
            this.rawdiv.dispatchEvent(pagination.events.redoFootnotes);
            return false;
        }

        var referencePage = this.findFootnoteReferencePage(
            footnoteReference);
        var footnotePage = this.findFootnotePage(
            footnoteObject['item']);

        if (footnotePage === referencePage) {
            return true;
        } else {
            return false;
        }
    }


    flowObject.prototype.setupFootnoteReflow = function () {
        // Connect footnote reflow events with triggers.
        var flowObject = this;


        var reFlow = function () {
            flowObject.layoutFootnotes();
        }

        this.namedFlow.addEventListener('footnotesNeedMove', reFlow);

        var redoFootnotes = function () {
            flowObject.redoFootnotes();
        }

        this.rawdiv.addEventListener('redoFootnotes', redoFootnotes);


        var checkSpacerSize = function () {
            /* Check whether footnotes are still as large as the spacer that was
             * put in their place. If not, the spacer most likely has to be
             * replaced by the footnote in its original location.
             */

            for (var i = 0; i < flowObject.footnotes.length; i++) {
                if ('hidden' in flowObject.footnotes[i]) {
                    if (flowObject.footnotes[i]['item'].clientHeight <
                        flowObject.footnotes[i]['hidden'].clientHeight) {
                        /* The footnote is smaller than its space holder on another
                         * page. It means the footnote has been shortened and we
                         * need to reflow footnotes!
                         */
                        flowObject.namedFlow.dispatchEvent(
                            pagination.events.footnotesNeedMove);
                    }
                }
            }

        };


    }

    flowObject.prototype.redoFootnotes = function () {
        /* Go through all footnotes and check whether they are still where the
         * reference to them is placed.
         */
        for (var i = 0; i < this.footnotes.length; i++) {
            /* Go through all footnotes, removing all spacer blocks and footnote
             * references from the DOM.
             */

            if ('hidden' in this.footnotes[i]) {
                this.footnotes[i]['hidden'].parentNode.removeChild(
                    this.footnotes[i]['hidden']);
            }

            if (this.footnotes[i]['item'].parentNode !== null) {
                this.footnotes[i]['item'].parentNode.removeChild(
                    this.footnotes[i]['item']);
            }
        }
        // Start out with no footnotes.
        this.footnotes = [];

        // Find footnotes from scratch.
        this.findAllFootnotes();
    }


    flowObject.prototype.checkAllFootnotePlacements = function () {
        /* Go through all footnotes and check whether they are still where the
         * reference to them is placed.
         */
        for (var i = 0; i < this.footnotes.length; i++) {
            if (!(this.compareReferenceAndFootnotePage(this.footnotes[i]))) {
                this.namedFlow.dispatchEvent(pagination.events.footnotesNeedMove);
            }
        }
    }



    flowObject.prototype.findAllFootnotes = function () {

        // Find all the footnotes in the text and prepare them for flow.

        if (this.footnoteStylesheet.parentNode === document.head) {
            // Remove all previous footnote stylesheet rules.
            document.head.removeChild(this.footnoteStylesheet);
            this.footnoteStylesheet.innerHTML = '';
        }

        /* Look for all the items that have "footnote" in their class list. These
         * will be treated as footnote texts.
         */
        var allFootnotes = this.rawdiv.getElementsByClassName(
            'pagination-footnote');

        for (var i = 0; i < allFootnotes.length; i++) {

            if (allFootnotes[i].id === '') {
                /* If footnote has no id, create one, so that we can target it
                 * using CSS rules.
                 */
                allFootnotes[i].id = pagination.createRandomId(
                    'pagination-footnote-');
            }

            var footnoteId = allFootnotes[i].id;

            this.footnoteStylesheet.innerHTML +=
                '\n#' + footnoteId + ' > * {-webkit-flow-into: ' + footnoteId +
                ';}' + '\n#' + footnoteId + '-flow-into {-webkit-flow-from: ' +
                footnoteId + ';}';


            var footnoteObject = {};
            /* We create this object so that we can find the footnote item and
             * reference again later on.
             */

            footnoteObject['reference'] = allFootnotes[i];

            var footnoteFlowTo = document.createElement('div');

            footnoteFlowTo.id = footnoteId + '-flow-into';

            footnoteFlowTo.classList.add('pagination-footnote-item');

            footnoteObject['item'] = footnoteFlowTo;

            footnoteObject['id'] = footnoteId;

            this.footnotes.push(footnoteObject);


        }
        if (this.footnoteStylesheet.innerHTML !== '') {
            document.head.appendChild(this.footnoteStylesheet);
        }

    }

    flowObject.prototype.layoutFootnotes = function () {
        // Layout all footnotes

        for (var i = 0; i < this.footnotes.length; i++) {
            /* Go through all footnotes, delete the spacer blocks if they have any
             * and remove the footnote itself from the DOM.
             */

            if ('hidden' in this.footnotes[i]) {
                this.footnotes[i]['hidden'].parentNode.removeChild(
                    this.footnotes[i]['hidden']);
                delete this.footnotes[i]['hidden'];
            }

            if (this.footnotes[i]['item'].parentNode !== null) {
                this.footnotes[i]['item'].parentNode.removeChild(
                    this.footnotes[i]['item']);
            }
        }

        for (var i = 0; i < this.footnotes.length; i++) {
            /* Go through the footnotes again, this time with the purpose of
             * placing them correctly.
             */

            var footnoteReferencePage = this.findFootnoteReferencePage(
                document.getElementById(this.footnotes[i]['id']));
            // We find the page where the footnote is referenced from.
            var firstFootnoteContainer = footnoteReferencePage.querySelector(
                '.pagination-footnotes');
            firstFootnoteContainer.appendChild(this.footnotes[i]['item']);
            // We insert the footnote in the footnote container of that page.

            if (!(this.compareReferenceAndFootnotePage(this.footnotes[i]))) {
                /* If the footnote reference has been moved from one page to
                 * another through the insertion procedure, we move the footnote to
                 * where it is referenced from now and create an empty div 
                 * ('hidden') and set it in it's place.
                 */

                this.footnotes[i]['hidden'] = document.createElement('div');

                this.footnotes[i]['hidden'].style.height = (
                    this.footnotes[i]['item'].clientHeight) + 'px';

                this.footnotes[i]['hidden'].id = this.footnotes[i]['id'] +
                    'hidden';

                var newFootnoteReferencePage = this.findFootnoteReferencePage(
                    this.footnotes[i]['reference']);
                /* We find the page where the footnote is referenced from now and
                 * move the footnote there.
                 */
                var newFootnoteContainer = newFootnoteReferencePage.querySelector(
                    '.pagination-footnotes');

                /* We then insert the hidden element into the container where the
                 * footnote was previously so that the body text doesn't flow back.
                 */
                firstFootnoteContainer.replaceChild(
                    this.footnotes[i]['hidden'],
                    this.footnotes[i]['item']);
                newFootnoteContainer.appendChild(this.footnotes[i]['item']);

                var checkSpacerSize = function () {
                    console.log('check spacer size');
                    if (this.footnotes[i]['item'].clientHeight <
                        this.footnotes[i]['hidden'].clientHeight) {
                        /* The footnote is smaller than its space holder on another
                         * page. It means the footnote has been shortened and we
                         * need to reflow footnotes!
                         */
                        this.namedFlow.dispatchEvent(
                            pagination.events.footnotesNeedMove);
                    }
                };



                var observer = new MutationObserver(function (mutations) {
                    checkSpacerSize();
                });

                observer.observe(this.footnotes[i]['item'], {
                    attributes: true,
                    subtree: true,
                    characterData: true

                });




            }
        }
    };


    flowObject.prototype.makeEvenPages = function () {
        // If the number of pages is odd, add an empty page.
        var emptyPage = this.div.querySelector(
            '.pagination-page.pagination-empty');
        if (emptyPage) {
            this.div.removeChild(emptyPage);
        }
        var allPages = this.div.querySelectorAll('.pagination-page');
        if (allPages.length % 2 == 1) {
            this.div.appendChild(
                pagination.createPages(
                1,
                false,
                this.pageCounter.cssClass,
                this.columns));
        }
    };

    flowObject.prototype.addPagesLoop = function (numberOfPages) {
        /* Add pages. If the variable numberOfPages is defined, add this amount of
         * pages. Else use the config option bulkPagesToAdd times
         * pagesToAddIncrementRatio to determine how many pages should be added.
         * It is a point to overshoot the target, as it is more costly to add than
         * to remove pages. 
         */
        if (this.bulkPagesToAdd > pagination.config('maxPageNumber')) return;
        if ('undefined' === typeof (numberOfPages)) {
            this.div.appendChild(
                pagination.createPages(
                this.bulkPagesToAdd,
                this.name,
                this.pageCounter.cssClass,
                this.columns));
            this.bulkPagesToAdd = Math.floor(
                this.bulkPagesToAdd * pagination.config(
                'pagesToAddIncrementRatio'));
        } else {
            this.div.appendChild(
                pagination.createPages(
                numberOfPages,
                this.name,
                this.pageCounter.cssClass,
                this.columns));
        }
        this.addOrRemovePages(numberOfPages);
    };


    flowObject.prototype.addOrRemovePages = function (pages) {
        // This loop is called when we believe pages have to added or removed. 

        if ((this.namedFlow.overset) && (this.rawdiv.innerText.length > 0)) {
            /* If there are too few regions (overset==True) and the contents of
             * rawdiv are at least 1 character long, pages need to be added.
             */
            this.pageCounter.needsUpdate = true;
            this.redoPages = true;
            this.addPagesLoop(pages);
        } else if (
        (this.namedFlow.firstEmptyRegionIndex != -1) && (
        (
            this.namedFlow.getRegions().length - this.namedFlow.firstEmptyRegionIndex) >
            this.columns)) {
            /* If there are excess regions, and the number of empty regions is
             * equal to or higher than the number of columns, we need to remove
             * pages.
             */
            this.redoPages = true;
            this.removeExcessPages(pages);
        } else if (this.redoPages) {
            /* If pages have either been added or removed, make sure than the total
             * number of pages is even if alwaysEven has been set, and emit a
             * bodyLayoutUpdated event if this is not the frontmatter. 
             */
            this.redoPages = false;
            if (pagination.config('alwaysEven')) {
                this.makeEvenPages();
            }
            if (this.name != 'pagination-frontmatter') {
                document.body.dispatchEvent(pagination.events.bodyLayoutUpdated);
            }
        }
    };


    flowObject.prototype.removeExcessPages = function (pages) {
        /* Remove pages that are in excess. As it takes much less time to remove
         * excess pages than to add new ones, it is preferable to add too many
         * pages initially and then remove them givent hat we do not know exactly
         * how many pages are needed before we add them.
         */

        var allPages = this.div.querySelectorAll('.pagination-page');

        for (
            var i = (
            Math.ceil(this.namedFlow.firstEmptyRegionIndex / this.columns)); i <
            allPages.length; i++) {
            this.div.removeChild(allPages[i]);
        }
        this.addOrRemovePages(pages);
    };


    flowObject.prototype.setupReflow = function () {
        /* Setup automatic addition and removing of pages when content is added or
         * removed.
         */
        var flowObject = this;

        var checkOverset = function () {
            /* Something has changed in the contents of this flow. Check if the
             * values of overset or firstEmptyRegionIndex have changed. If this is
             * the case, emit a pageLayoutUpdate event. 
             */
            if (
            (
                flowObject.namedFlow.overset !== flowObject.overset) || (
                flowObject.namedFlow.firstEmptyRegionIndex !== flowObject.firstEmptyRegionIndex)) {
                flowObject.overset = flowObject.namedFlow.overset;
                flowObject.firstEmptyRegionIndex =
                    flowObject.namedFlow.firstEmptyRegionIndex;
                flowObject.namedFlow.dispatchEvent(
                    pagination.events.pageLayoutUpdate);
            }
        }

        var checkAllFootnotePlacements = function () {
            flowObject.checkAllFootnotePlacements();
        }

        if (this.rawdiv) {
            /* Create an observer instance to watch if anything is being changed in
             * the contents of the original text.
             * We do this instead of listening to the webkitregionlayoutupdate 
             * event of the flow, because it is ridden with bugs and fires too often.
             * This could be changed once 
             * https://bugs.webkit.org/show_bug.cgi?id=105366 has been resolved.
             */
            var observer = new MutationObserver(function (mutations) {
                checkOverset();
                console.log('check footnote placement');
                checkAllFootnotePlacements();
            });

            observer.observe(this.rawdiv, {
                attributes: true,
                subtree: true,
                characterData: true

            });
        }

        var reFlow = function () {
            // The page layout has changed. Reflow by adding pages one by one.
            flowObject.addOrRemovePages(1);
            if (pagination.config('numberPages')) {
                flowObject.pageCounter.numberPages();
            }
        };
        this.namedFlow.addEventListener('pageLayoutUpdated', reFlow);

    };

    exports.flowObject = flowObject;

}).call(this.pagination);


pagination.initiate();