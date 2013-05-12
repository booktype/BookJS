/*!
 * BookJS
 * Copyright 2012-13  Steven Levithan, and Johannes Wilm. Freely available 
 * under the AGPL. For further details see LICENSE.txt
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
 * output in a specific way, customize the pagination.css file and include it, like 
 * this:
 *
 * <link href="pagination.css" rel="stylesheet" type="text/css" />
 * <script type="text/javascript">
 *     paginationConfig = {
 *         'sectionStartMarker': 'h3',
 *         'columns': 3,
 *         'autoStart': false,
 *     }
 * </script>
 * <script src="pagination.js" type="text/javascript"></script>
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
 * topfloatSelector: '.pagination-topfloat' -- This is the CSS selector used 
 * for finding top floats within the HTML code. Top floats are placed on the 
 * page either of the reference or the one following it. In editing 
 * environments, the top float should be inserted inside two additional 
 * elements, like this:
 * 
 * <span class='pagination-topfloat'><span><span>This is the top float contents
 * </span></span></span>
 * 
 * footnoteSelector: '.pagination-footnote' -- This is the CSS selector used 
 * for finding footnotes within the HTML code. Footnotes are automatically 
 * moved if the page of their reference changes. In editing environments, the
 * footnote should be inserted inside two additional elements, like this:
 * 
 * <span class='pagination-footnote'><span><span>This is a footnote</span>
 * </span></span>. 
 * 
 * Page style options
 * 
 * These settings provide a way to do simple styling of the page. These 
 * settings are different from the baove ones in that they can be overriden 
 * through CSS to provide more advanced designs (see the above note on 
 * pagination.css).
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
 * columnSeparatorWidth: .09 (inch) -- This is the space between columns.
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
        'enableTableOfFigures': false,
        'bulkPagesToAdd': 50,
        'pagesToAddIncrementRatio': 1.4,
        'frontmatterContents': '',
        'autoStart': true,
        'numberPages': true,
        'divideContents': true,
        'footnoteSelector': '.pagination-footnote',
        'topfloatSelector': '.pagination-topfloat',
        'marginnoteSelector': '.pagination-marginnote',
        'maxPageNumber': 10000,
        'columnSeparatorWidth': 0.09,
        'outerMargin': 0.5,
        'innerMargin': 0.8,
        'contentsTopMargin': 0.8,
        'headerTopMargin': 0.3,
        'contentsBottomMargin': 0.8,
        'pagenumberBottomMargin': 0.3,
        'pageHeight': 8.3,
        'pageWidth': 5.8,
        'lengthUnit': 'in'
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
        return new Array(+digits.join("") + 1).join("M") + roman;
    };

    pagination.createRandomId = function (base) {
        // Create a random CSS Id that is not in use already.
        var randomId, stillSearchingForUniqueId = true;
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
    };

    pagination.config = function (configKey) {
        /* Return configuration variables either from paginationConfig if present,
         * or using default values.
         */
        var returnValue;
        if (paginationConfig && paginationConfig.hasOwnProperty(configKey)) {
            returnValue = paginationConfig[configKey];
        } else if (defaults.hasOwnProperty(configKey)) {
            returnValue = defaults[configKey];
        } else {
            returnValue = false;
        }
        return returnValue;
    };

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
    };

    pagination.setPageStyle = function () {
        // Set style for a particular page size.
        var unit = pagination.config('lengthUnit'),
            contentsWidthNumber = pagination.config('pageWidth') - pagination.config(
                'innerMargin') - pagination.config('outerMargin'),
            contentsWidth = contentsWidthNumber + unit,
            contentsColumnSeparatorWidthNumber = pagination.config('columnSeparatorWidth'),
            contentsColumnSeparatorWidth = contentsColumnSeparatorWidthNumber + unit,
            columnWidth = contentsWidthNumber / pagination.config('columns') -
                (contentsColumnSeparatorWidthNumber * (pagination.config('columns') - 1))
                + unit,
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
            "\n#pagination-tof-title:before {content:'Figures';}" +
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
            "\n.pagination-toc-entry .pagination-toc-pagenumber, .pagination-tof-entry .pagination-tof-pagenumber {float:right}"
        /* This seems to be a bug in Webkit. But unless we set the width of the 
         * original element that is being flown, some elements extend beyond the
         * contentsContainer's width.
         */ 
        
        + "\n.pagination-contents-item {width:" + columnWidth + ";}" +
            "\n.pagination-frontmatter-contents {width:" + contentsWidth + ";}"
        + "\n.pagination-contents-column-separator {width:" + contentsColumnSeparatorWidth + ";}" +
        // Footnotes in non-CSS Regions browsers will render as right margin notes.
        "\n.pagination-simple .pagination-footnote > span {" +
            "position: absolute; right: 0in; width: 1in;}";
    };



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
        /* Increment the page count by one and return the reuslt page count 
         * using the show function.
         */
        this.value++;
        return this.show();
    };


    pagination.pageCounterCreator.prototype.numberPages = function () {
        /* If the pages associated with this page counter need to be updated, 
         * go through all of them from the start of the book and number them, 
         * thereby potentially removing old page numbers.
         */
        var pagenumbersToNumber, i;
        this.value = 0;
        this.needsUpdate = false;

        pagenumbersToNumber = document.querySelectorAll(
            '.pagination-page .pagination-pagenumber.pagination-' + this.cssClass);
        for (i = 0; i < pagenumbersToNumber.length; i++) {
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
        var page, contents, footnotes, contentsContainer, column, columnSeparator, topfloats, header, chapterheader, sectionheader, pagenumberfield, i, j,
        tempRoot = document.createDocumentFragment();
        for (i = 0; i < num; i++) {
            page = document.createElement('div');
            page.classList.add('pagination-page');
            page.id = pagination.createRandomId('pagination-page-');

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

                topfloats = document.createElement('div');
                topfloats.classList.add('pagination-topfloats');

                contents = document.createElement('div');
                contents.classList.add('pagination-contents');

                for (j = 0; j < columns; j++) {
                    column = document.createElement('div');
                    column.classList.add('pagination-contents-column');
                    contents.appendChild(column);
                    
                    if ((columns - j) > 1) {
                        columnSeparator = document.createElement('div');
                        columnSeparator.classList.add('pagination-contents-column-separator');
                        contents.appendChild(columnSeparator);
                    }
                }

                footnotes = document.createElement('div');
                footnotes.classList.add('pagination-footnotes');

                contentsContainer.appendChild(topfloats);
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
        'pageLayoutUpdate',
        true,
        true);
    /* pageLayoutUpdate is emitted when new pages have to added or excess pages be
     * removed.
     */

    pagination.events.escapesNeedMove = document.createEvent('Event');
    pagination.events.escapesNeedMove.initEvent(
        'escapesNeedMove',
        true,
        true);
    /* escapesNeedMove is emitted when at least one reference to a an escape 
     * node (footnote, top float) no longer is on the page where it used to be.
     */

    pagination.events.redoEscapes = document.createEvent('Event');
    pagination.events.redoEscapes.initEvent(
        'redoEscapes',
        true,
        true);
    /* redoEscapes is being listened to by BookJS to see when escape nodes 
     * (footnotes, top floats) need to be refound and redrawn. This can be used
     * by editors that need to add new footnotes or top floats. 
     */

    pagination.tof = function (bodyObjects) {
        /* Go through all pages of all flowobjects, looking for all figures to 
         * create a "table of figures".
         */
        var tofDiv, tofTitleH1, figures, figure, image, title, i, j;
        
        
        tofDiv = document.createElement('div');
        tofDiv.id = 'pagination-tof';
        
        tofTitleH1 = document.createElement('h1');
        tofTitleH1.id = 'pagination-tof-title';

        tofDiv.appendChild(tofTitleH1);
        
        //var calculateTof = function() {
        
        for (i = 0; i < bodyObjects.length; i++) {
            figures = bodyObjects[i].rawdiv.querySelectorAll('div.figure');
            for (j = 0; j < figures.length; j++) {
                figure = figures[j];
                image = figure.querySelector('img');
                caption = figure.querySelector('div.caption');
                if (image && image.alt !== '') {
                    title = image.alt;
                } else if (caption) {
                    title = caption.innerText;
                } else {
                    title = 'Figure '+ i + '.' + j;
                }
                pagenumber = pagination.findPage(figure).querySelector('.pagination-pagenumber').innerText;
                tofItemDiv = document.createElement('div');
                tofItemDiv.classList.add('pagination-tof-entry');
                tofItemTextSpan = document.createElement('span');
                tofItemTextSpan.classList.add('pagination-tof-text');                
                tofItemTextSpan.innerHTML = title;
                tofItemDiv.appendChild(tofItemTextSpan);

                tofItemPnSpan = document.createElement('span');
                tofItemPnSpan.classList.add('pagination-tof-pagenumber');

                tofItemPnText = document.createTextNode(pagenumber);
                tofItemPnSpan.appendChild(tofItemPnText);

                tofItemDiv.appendChild(tofItemPnSpan);

                tofDiv.appendChild(tofItemDiv);                
                
            }
        }
        
        return tofDiv;
        //}
        
        
        
    }
    
    pagination.findPage = function (object) {
        /* Find the page a certain element is placed on
         */
        // TODO: cache some of these values, as they will be reused every time.
        var allPages = document.querySelectorAll('.pagination-page');
        var firstPage = allPages[0];
        var firstPageOffsetTop = firstPage.getBoundingClientRect()['top'] + window.pageYOffset;
        var lastPage = allPages[allPages.length-1];
        var lastPageOffsetTop = lastPage.getBoundingClientRect()['top'] + window.pageYOffset;
        var averageActualPageSize = (lastPageOffsetTop - firstPageOffsetTop)/(allPages.length-1);
        
        var objectOffsetTop = object.getBoundingClientRect()['top'] + window.pageYOffset;
        var page = (objectOffsetTop - firstPageOffsetTop)/averageActualPageSize;
        return allPages[parseInt(page, 10)];
        
    };

    pagination.headersAndToc = function (bodyObjects) {
        /* Go through all pages of all flowObjects and add page headers and
         * calculate the table fo contents (TOC) for the frontmatter. This has to
         * be done after all pages representing the body of the text have been
         * flown and has to redone when there are changes to the body contents that
         * can influence the TOC (such as page creation or deletion).
         */
        var currentChapterTitle = '', currentSectionTitle = '', pages, chapterHeader, sectionHeader, tocDiv, tocItemDiv, tocItemPnText, tocTitleH1, tocItemPnSpan, tocItemTextSpan, 
     i, j;

        if (pagination.config('numberPages')) {
            tocDiv = document.createElement('div');
            tocDiv.id = 'pagination-toc';

            tocTitleH1 = document.createElement('h1');
            tocTitleH1.id = 'pagination-toc-title';

            tocDiv.appendChild(tocTitleH1);
        }


        for (i = 0; i < bodyObjects.length; i++) {
            bodyObjects[i].findTitle();
            bodyObjects[i].findStartpageNumber();

            if (bodyObjects[i].type === 'chapter') {
                currentChapterTitle = bodyObjects[i].title;
            } else if (bodyObjects[i].type === 'section') {
                currentSectionTitle = bodyObjects[i].title;
            }
            pages = bodyObjects[i].div.childNodes;

            for (j = 0; j < pages.length; j++) {
                chapterHeader = pages[j].querySelector(
                    '.pagination-header .pagination-header-chapter');
                if (chapterHeader) {
                    chapterHeader.innerHTML = currentChapterTitle;
                }
                
                sectionHeader = pages[j].querySelector(
                    '.pagination-header .pagination-header-section');
                if (sectionHeader) {
                    sectionHeader.innerHTML = currentSectionTitle;
                }
            }

            if (bodyObjects[i].type && pagination.config('numberPages')) {

                tocItemDiv = document.createElement('div');
                tocItemDiv.classList.add('pagination-toc-entry');
                tocItemDiv.classList.add(bodyObjects[i].type);

                tocItemTextSpan = document.createElement('span');
                tocItemTextSpan.classList.add('pagination-toc-text');

                tocItemTextSpan.innerHTML = bodyObjects[i].title;
                tocItemDiv.appendChild(tocItemTextSpan);

                tocItemPnSpan = document.createElement('span');
                tocItemPnSpan.classList.add('pagination-toc-pagenumber');

                tocItemPnText = document.createTextNode(
                    bodyObjects[i].startpageNumber);
                tocItemPnSpan.appendChild(tocItemPnText);

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
        var bodyObjects = [], chapterCounter = 0, bodyContainer, bodyContents, i;

        bodyObjects.push(
            new pagination.flowObject(
            'pagination-body-pre',
            pagination.pageCounters.arab));

        bodyContainer = eval(pagination.config('flowElement'));
        bodyContents = bodyContainer.childNodes;


        for (i = bodyContents.length; i > 0; i--) {

            if (bodyContents[0].nodeType === 1) {
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
        var rawdiv, bodyObject, layoutDiv;

        if (eval(pagination.config('flowElement')) === document.body) {
            /* We are reflowing the body itself, yet the layout will be added to 
             * the body. This will make the broser crash. So we need to move the 
             * original contents inside a Div of its own first.
             */
            rawdiv = document.createElement('div');
            rawdiv.id = 'pagination-contents';
            rawdiv.innerHTML = document.body.innerHTML;
            document.body.innerHTML = '';
            document.body.appendChild(rawdiv);

        } else {
            rawdiv = eval(pagination.config('flowElement'));
        }

        bodyObject = new pagination.flowObject(
            'body',
            pagination.pageCounters.arab,
            rawdiv);

        // Create div for layout
        layoutDiv = document.createElement('div');
        layoutDiv.id = 'pagination-layout';
        layoutDiv.appendChild(bodyObject.div);

        document.body.appendChild(layoutDiv);

        bodyObject.initiate();
        document.dispatchEvent(pagination.events.layoutFlowFinished);
    };

    pagination.applyBookLayout = function () {
        /* Apply this layout if CSS Regions are present.
         * Will first divide the original DOM up into individual chapters and 
         * sections.
         */
        var bodyObjects, layoutDiv, contentsDiv, toc, tof, redoToc, fmObject, i;
        
        bodyObjects = pagination.createBodyObjects();

        // Create div for layout
        layoutDiv = document.createElement('div');
        layoutDiv.id = 'pagination-layout';
        document.body.appendChild(layoutDiv);

        // Create div for contents
        contentsDiv = document.createElement('div');
        contentsDiv.id = 'pagination-contents';
        document.body.appendChild(contentsDiv);


        for (i = 0; i < bodyObjects.length; i++) {
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
            toc = pagination.headersAndToc(bodyObjects);
            
            if (pagination.config('numberPages')) {
                fmObject.rawdiv.appendChild(toc);
            }
            if (pagination.config('enableTableOfFigures')) {
                tof = pagination.tof(bodyObjects);
                fmObject.rawdiv.appendChild(tof);
            }
            layoutDiv.insertBefore(fmObject.div, bodyObjects[0].div);
            fmObject.initiate();
            redoToc = function () {
                var oldToc = toc;
                toc = pagination.headersAndToc(bodyObjects);
                fmObject.rawdiv.replaceChild(toc, oldToc);
                if (pagination.config('enableTableOfFigures')) {
                    var oldTof = tof;
                    tof = pagination.tof(bodyObjects);
                    fmObject.rawdiv.replaceChild(tof, oldTof);
                }
            };
            document.body.addEventListener('bodyLayoutUpdated', function() {
                // We have to set a time out of zero to make sure fonts have been applied, etc. before toc and tof are being calculated.
                // TODO:mIdeally, this shouldn't be needed.
                setTimeout(redoToc, 0);
                
            });
            document.fontloader.addEventListener('loadingdone', function() {
                // When fonts have been loaded, update the body layout.
                // TODO: This does not seem to work at all times. 
                document.body.dispatchEvent(pagination.events.bodyLayoutUpdated);
            });
        }
        document.dispatchEvent(pagination.events.layoutFlowFinished);
    };


    pagination.applySimpleBookLayout = function () {
        // Apply this alternative layout in case CSS Regions are not present 
        var contentsDiv, simplePage;
        
        if (eval(pagination.config('flowElement')) === document.body) {
            /* We are reflowing the body itself, yet the layout will be added to 
             * the body. This will make the broser crash. So we need to move the 
             * original contents inside a Div of its own first.
             */
            contentsDiv = document.createElement('div');
            contentsDiv.id = 'pagination-contents';
            contentsDiv.innerHTML = document.body.innerHTML;
            document.body.innerHTML = '';
            document.body.appendChild(contentsDiv);

            if (!window.hasOwnProperty('paginationConfig')) {
                window.paginationConfig = {};
            }
            paginationConfig.flowElement =
                "document.getElementById('pagination-contents')";
        }

        simplePage = eval(pagination.config('flowElement'));
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
        var returnValue;
        if (
        (
            document.webkitGetNamedFlows) && (
            document.webkitGetNamedFlows() !== null)) {
            returnValue = true;
        } else {
            returnValue = false;
        }
        
        return returnValue;
    };

    pagination.autoStartInitiator = function () {
        // To be executed upon document loading.
        var cssRegionsPresent = pagination._cssRegionsCheck();
        if (document.readyState === 'interactive' && !cssRegionsPresent) {
            pagination.applySimpleBookLayout();
        } else if (document.readyState === 'complete' && cssRegionsPresent) {
            if (pagination.config('divideContents')) {
                pagination.applyBookLayout();
            } else {
                pagination.applyBookLayoutNonDestructive();
            }
        }
    };



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

        this.escapes = {};
        this.escapes.footnote = [];
        this.escapes.topfloat = [];
        this.escapes.marginnote = [];

        this.escapeStylesheets = {};
        this.escapeStylesheets.footnote = document.createElement('style');
        this.escapeStylesheets.topfloat = document.createElement('style');
        this.escapeStylesheets.marginnote = document.createElement('style');
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
        this.findAllTopfloats();
        this.findAllFootnotes();
        this.findAllMarginnotes();
        // Layout magrin notes once before everything else, so that they don't fill up text
        //this.layoutMarginnotes();
        this.placeAllEscapes();
        this.setupEscapeReflow();
        if (pagination.config('numberPages')) {
            this.pageCounter.numberPages();
        }
    };

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
    };

    flowObject.prototype.setType = function (type) {
        // Set the type of this flowObject (chapter or section start).
        this.type = type;
        this.div.classList.add('pagination-' + type);
    };

    flowObject.prototype.findTitle = function () {
        // Find the title of section or chapter that this flowObject is covering.
        var titleField;
        if (this.type === 'chapter') {
            titleField = this.rawdiv.querySelector(
                pagination.config('chapterTitleMarker'));
            if (titleField) {
                this.title = titleField.innerHTML;
            } else {
                this.title = '';
            }
        } else if (this.type === 'section') {
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
        var startpageNumberField;
        
        if (this.rawdiv.innerText.length > 0 && pagination.config('numberPages')) {
            startpageNumberField =
                this.div.querySelector('.pagination-pagenumber');
            if (startpageNumberField) {    
                this.startpageNumber = startpageNumberField.innerText;
            }
        }
    };

    // Footnote and top float handling

    flowObject.prototype.findEscapeReferencePage = function (
        escapeReference) {
        /* Find the page where the the escape would be placed in the body text.
         */
        var escapeReferenceNode;
	if (!escapeReference) {
	    return false;
	}
	escapeReferenceNode = this.namedFlow.getRegionsByContent(
            escapeReference)[0];
        if (escapeReferenceNode) {
            return escapeReferenceNode.parentNode.parentNode.parentNode;
        } else {
            /* A bug in Webkit means that we don't find the footnote at times. In these
             * situations we look for the parent element instead.
             */
            return this.findEscapeReferencePage(escapeReference.parentNode);
        }
    };

    flowObject.prototype.findEscapePage = function (escapeNode) {
        if (escapeNode.parentNode) {
            // Find the page where the escape itself is currently placed.
            return escapeNode.parentNode.parentNode.parentNode;
        } else {
            return false;
        }
    };

    flowObject.prototype.placeAllEscapes = function () {
        /* Find and place all escapes. Then freeze the pages of the references 
         * to these.
         */
        this.layoutTopfloats();
        this.layoutFootnotes();
        this.layoutMarginnotes();
        this.freezeEscapeReferencePages();
    };

    flowObject.prototype.freezeEscapeReferencePages = function () {
        /* For all the references of top/bottom escapes (topfloats, footnotes),
         * note the page they are on. This way we can compare to this
         * list when changes have been made and determine whether footnotes need to be reflown.
         */
        var escapeTypes = ['footnote', 'topfloat', 'marginnote'], j, i;

        for (j = 0; j < escapeTypes.length; j++) {
            for (i = 0; i < this.escapes[escapeTypes[j]].length; i++) {
                this.escapes[escapeTypes[j]][i]['referencePage'] = 
                  this.findEscapeReferencePage(
                    this.escapes[escapeTypes[j]][i]['reference']);
            }
        }
    };
    
    flowObject.prototype.freezeMarginnoteOffsetTop = function () {
        /* For all the references of margin notes,
         * note their top offset. This way we can compare to this
         * list when changes have been made and determine whether margin notes need to be moved.
         */
        var i;
            for (i = 0; i < this.escapes.marginnote.length; i++) {
                this.escapes.marginnote[i]['referenceOffsetTop'] = 
                    this.escapes.marginnote[i]['reference'].offsetTop;
            }
    };    

    flowObject.prototype.checkAllEscapeReferencePagesPlacements = function () {
        /* For all the references of top/bottom escapes (topfloats, footnotes),
         * check if they are still on the same page they were on when we froze 
         * them. If one has changed, dispatch a redoEscapes event.
         */
        var escapeTypes = ['footnote', 'topfloat', 'marginnote'], j, i;

        for (j = 0; j < escapeTypes.length; j++) {
            for (i = 0; i < this.escapes[escapeTypes[j]].length; i++) {

                if (document.getElementById(this.escapes[escapeTypes[j]][i][
                        'id'
                ]) === null) {
                    /* It seems this escape reference had been deleted, so we dispatch an 
                     * event that will redo all escapes.
                     */
                    
                    if (escapeTypes[j] === 'marginnote') {
                        this.rawdiv.dispatchEvent(pagination.events.redoMarginnotes);
                        this.namedFlow.dispatchEvent(pagination.events.marginnotesNeedMove);
                        return;
                    } else {
                        this.rawdiv.dispatchEvent(pagination.events.redoEscapes);
                        this.namedFlow.dispatchEvent(pagination.events.escapesNeedMove);
                        return;
                    }                    

                }

                if (this.escapes[escapeTypes[j]][i]['referencePage'] !== this.findEscapeReferencePage(
                    this.escapes[escapeTypes[j]][i]['reference'])) {
                    if (escapeTypes[j] === 'marginnote') {
                        this.namedFlow.dispatchEvent(pagination.events.marginnotesNeedMove);
                        return;
                    } else {
                        this.namedFlow.dispatchEvent(pagination.events.escapesNeedMove);
                        return;
                    }
                }

            }
        }

        return;
    };


    flowObject.prototype.compareReferenceAndEscapePage = function (
        escapeObject) {
        /* Check whether a footnote/top float and it's corresponding reference in the text
         * are on the same page.
         */
        var escapeReference = document.getElementById(escapeObject['id']), referencePage, escapePage;

        referencePage = this.findEscapeReferencePage(
            escapeReference);
        escapePage = this.findEscapePage(
            escapeObject['item']);

        if (escapePage === referencePage) {
            return true;
        } else {
            return false;
        }
    };


    flowObject.prototype.setupEscapeReflow = function () {
        // Connect footnote reflow events with triggers.
        var flowObject = this, reFlow, redoEscapes;


        reFlow = function () {
            flowObject.placeAllEscapes();
        };

        this.namedFlow.addEventListener('escapesNeedMove', reFlow);

        redoEscapes = function () {
            flowObject.redoEscapes();
        };

        this.rawdiv.addEventListener('redoEscapes', redoEscapes);
    };

    flowObject.prototype.redoEscapes = function () {
        /* Reset all top floats and footnotes.
         */
        var escapeTypes = ['footnote', 'topfloat'], i, j;

        for (j = 0; j < escapeTypes.length; j++) {

            for (i = 0; i < this.escapes[escapeTypes[j]].length; i++) {
                /* Go through all footnotes, removing all spacer blocks and footnote
                 * references from the DOM.
                 */

                if (j === 'footnote' && 'hidden' in this.escapes[escapeTypes[j]][i]) {
                    this.escapes[escapeTypes[j]][i]['hidden'].parentNode.removeChild(
                        this.escapes[escapeTypes[j]][i]['hidden']);
                }

                if (this.escapes[escapeTypes[j]][i]['item'].parentNode !== null) {
                    this.escapes[escapeTypes[j]][i]['item'].parentNode.removeChild(
                        this.escapes[escapeTypes[j]][i]['item']);
                }
            }

            // Start out with no footnotes or top floats.
            this.escapes[escapeTypes[j]] = [];
        }

        // Find footnotes from scratch.
        this.findAllTopfloats();
        this.findAllFootnotes();
    };

    flowObject.prototype.findAllTopfloats = function () {
        // Find all the topfloats in the text and prepare them for flow.
        this.findAllEscapes('topfloat');
    };

    flowObject.prototype.findAllMarginnotes = function () {
        // Find all the footnotes in the text and prepare them for flow.
        this.findAllEscapes('marginnote');
    };    

    flowObject.prototype.findAllFootnotes = function () {
        // Find all the footnotes in the text and prepare them for flow.
        this.findAllEscapes('footnote');
    };

    flowObject.prototype.findAllEscapes = function (escapeType) {

        /* Find all the escapes (footnotes, topfloats) in the text and prepare
         * them for flow.
         */
        var allEscapes, escapeId, escapeObject, escapeFlowTo, i;

        if (this.escapeStylesheets[escapeType].parentNode === document.head) {
            // Remove all previous stylesheet rules of the same escape type.
            document.head.removeChild(this.escapeStylesheets[escapeType]);
            this.escapeStylesheets[escapeType].innerHTML = '';
        }


        /* Look for all the items that have "pagination-"+escapeType in their 
         * class list. These will be treated as escapes from the normal text 
         * flow.
         */
        allEscapes = this.rawdiv.querySelectorAll(
            pagination.config(escapeType + 'Selector'));

        for (i = 0; i < allEscapes.length; i++) {

            if (allEscapes[i].id === '') {
                /* If the escape has no id, create one, so that we can target it
                 * using CSS rules.
                 */
                allEscapes[i].id = pagination.createRandomId(
                    'pagination-' + escapeType + '-');
            }

            escapeId = allEscapes[i].id;

            this.escapeStylesheets[escapeType].innerHTML +=
                '\n#' + escapeId + ' > * {-webkit-flow-into: ' + escapeId +
                ';}' + '\n#' + escapeId + '-flow-into {-webkit-flow-from: ' +
                escapeId + ';}';


            escapeObject = {};
            /* We create this object so that we can find the escape item and
             * reference again later on.
             */

            escapeObject['reference'] = allEscapes[i];

            escapeFlowTo = document.createElement('div');

            escapeFlowTo.id = escapeId + '-flow-into';

            escapeFlowTo.classList.add('pagination-' + escapeType + '-item');

            escapeObject['item'] = escapeFlowTo;

            escapeObject['id'] = escapeId;

            this.escapes[escapeType].push(escapeObject);


        }
        if (this.escapeStylesheets[escapeType].innerHTML !== '') {
            document.head.appendChild(this.escapeStylesheets[escapeType]);
        }

    };

    flowObject.prototype.layoutTopfloats = function () {
        // Layout all top floats
        this.layoutEscapes('topfloat');
    };

    flowObject.prototype.layoutFootnotes = function () {
        // Layout all footnotes
        this.layoutEscapes('footnote');
    };
    
    flowObject.prototype.layoutMarginnotes = function () {
        // Layout all footnotes
        this.layoutEscapes('marginnote');
    }

    flowObject.prototype.layoutEscapes = function (escapeType) {
        // Layout all footnotes and top floats
        var i;
        
        if (escapeType === 'footnote') {

            for (i = 0; i < this.escapes[escapeType].length; i++) {
                /* Go through all footnotes, and remove the hidden nodes that were 
                 * previously placed to make sure footnote reference and footnote 
                 * were on the same page. 
                 */

                if ('hidden' in this.escapes[
                    escapeType][i]) {
                    this.escapes[escapeType][i]['hidden'].parentNode.removeChild(
                        this.escapes[escapeType][i]['hidden']);
                    delete this.escapes[escapeType][i]['hidden'];
                }
            }
        }


        for (i = 0; i < this.escapes[escapeType].length; i++) {
            /* Go through the escapes, this with the purpose of placing them 
             * correctly.
             */
            var escapeReferencePage, firstEscapeContainer, marginnoteOffsetTop, checkSpacerSize, observer, newEscapeReferencePage, newEscapeContainer;
            escapeReferencePage = this.findEscapeReferencePage(
                document.getElementById(this.escapes[escapeType][i]['id']));

            // We find the page where the escape is referenced from.
            firstEscapeContainer = escapeReferencePage.querySelector(
                '.pagination-' + escapeType + 's');
            
            if (escapeType === 'marginnote') {
                marginnoteOffsetTop = document.getElementById(this.escapes[escapeType][i]['id']).offsetTop;
            }
            
            // Only if the escapenode is not already on the page of its reference do we need to get active.
            if (this.escapes[escapeType][i]['item'].parentNode !==
                firstEscapeContainer || (escapeType === 'marginnote' && marginnoteOffsetTop !== this.escapes[escapeType][i]['offsetTop'])) {

                if (this.escapes[escapeType][i]['item'].parentNode !== null) {

                    /* If the escape node has been placed previously, we remove it and
                     * recalculate the escapeReferencePage and firstEscapeContainer
                     */

                    if (escapeType === 'topfloat' && this.escapes[escapeType][i][
                            'item'
                    ].parentNode.children.length === 1) {
                        /* If this is the only top float on the page where the top 
                         * float had previously been placed, we remove the 
                         * pagination-page-topfloat class of the page
                         */
                        this.escapes[escapeType][i]['item'].parentNode.parentNode
                            .parentNode
                            .classList.remove('pagination-page-topfloat');
                    }

                    if (this.escapes[escapeType][i]['item'].parentNode !== firstEscapeContainer) {
                        this.escapes[escapeType][i]['item'].parentNode.removeChild(
                            this.escapes[escapeType][i]['item']);
                   
                    
                        escapeReferencePage = this.findEscapeReferencePage(
                            document.getElementById(this.escapes[escapeType][i][
                                'id'
                        ]));
                        firstEscapeContainer = escapeReferencePage.querySelector(
                            '.pagination-' + escapeType + 's');
                     }
                }


                if (i === 0 || this.escapes[escapeType][i - 1]['item'].parentNode !==
                    firstEscapeContainer) {
                    /* If this is the first footnote or top float or the previous 
                     * one is not on the same page, we insert it at the very 
                     * beginning of the footnote/top float container.
                     */
                    firstEscapeContainer.insertBefore(this.escapes[escapeType][
                            i
                    ]['item'], firstEscapeContainer.firstChild);
                } else {
                    /* If the previous footnote/top float is on the same page, we 
                     * insert after that one
                     */
                    firstEscapeContainer.insertBefore(this.escapes[escapeType][
                            i
                    ]['item'], this.escapes[escapeType][i - 1]['item'].nextSibling);
                }

                if (escapeType === 'topfloat') {
                    // We add the class 'pagination-page-topfloat' to the page where the top float was inserted.
                    firstEscapeContainer.parentNode.parentNode.classList.add(
                        'pagination-page-topfloat');

                } else if (escapeType === 'marginnote') {
                    this.escapes[escapeType][i]['item'].style.top = marginnoteOffsetTop + 'px';
                }

            }

            if (escapeType !== 'marginnote' && !(this.compareReferenceAndEscapePage(
                this.escapes[escapeType][i]))) {
                /* If the footnote reference has been moved from one page to
                 * another through the insertion procedure, we move the footnote to
                 * where it is referenced from now and create an empty div 
                 * ('hidden') and set it in it's place.
                 */

                if (escapeType === 'footnote') {
                    /* We insert a hidden element into the container where the
                     * footnote was previously so that the body text doesn't flow back.
                     */
                    this.escapes[escapeType][i]['hidden'] = document.createElement(
                        'div');

                    this.escapes[escapeType][i]['hidden'].style.height = (
                        this.escapes[escapeType][i]['item'].clientHeight) +
                        'px';

                    this.escapes[escapeType][i]['hidden'].id = this.escapes[
                        escapeType][i][
                            'id'
                    ] +
                        'hidden';


                    firstEscapeContainer.replaceChild(
                        this.escapes[escapeType][i]['hidden'],
                        this.escapes[escapeType][i]['item']);

                    checkSpacerSize = function () {
                        if (this.escapes[escapeType][i]['item'].clientHeight <
                            this.escapes[escapeType][i]['hidden'].clientHeight) {
                            /* The footnote is smaller than its space holder on another
                             * page. It means the footnote has been shortened and we
                             * need to reflow escapes!
                             */
                            this.namedFlow.dispatchEvent(
                                pagination.events.escapesNeedMove);
                        }
                    };

                    observer = new MutationObserver(function (mutations) {
                        checkSpacerSize();
                    });

                    observer.observe(this.escapes[escapeType][i]['item'], {
                        attributes: true,
                        subtree: true,
                        characterData: true,
                        childList: true
                    });

                }

                newEscapeReferencePage = this.findEscapeReferencePage(
                    this.escapes[escapeType][i]['reference']);
                /* We find the page where the escape node is referenced from now and
                 * move it there.
                 */
                newEscapeContainer = newEscapeReferencePage.querySelector(
                    '.pagination-' + escapeType + 's');

                if (i === 0 || this.escapes[escapeType][i - 1]['item'].parentNode !==
                    newEscapeContainer) {
                    /* If this is the first footnote or top float or the previous 
                     * one is not on the same page, we insert it at the very 
                     * beginning of the footnote/top float container.
                     */
                    newEscapeContainer.insertBefore(this.escapes[escapeType][i][
                            'item'
                    ], newEscapeContainer.firstChild);
                } else {
                    /* If the previous footnote/top float is on the same page, we 
                     * insert after that one
                     */
                    newEscapeContainer.insertBefore(this.escapes[escapeType][i][
                            'item'
                    ], this.escapes[escapeType][i - 1]['item'].nextSibling);
                }

                if (escapeType === 'footnote') {
                    if (firstEscapeContainer.children.length === 0) {
                        firstEscapeContainer.parentNode.parentNode
                            .classList.remove('pagination-page-topfloat');
                    }
                    newEscapeContainer.parentNode.parentNode.classList.add(
                        'pagination-page-topfloat');
                }

            }
        }
    };


    flowObject.prototype.makeEvenPages = function () {
        // If the number of pages is odd, add an empty page.
        var emptyPage = this.div.querySelector(
            '.pagination-page.pagination-empty'), allPages;
        if (emptyPage) {
            this.div.removeChild(emptyPage);
        }
        allPages = this.div.querySelectorAll('.pagination-page');
        if (allPages.length % 2 === 1) {
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
        if (this.bulkPagesToAdd > pagination.config('maxPageNumber')) {return;}
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
        (this.namedFlow.firstEmptyRegionIndex !== -1) && (
        (
            this.namedFlow.getRegions().length - this.namedFlow.firstEmptyRegionIndex) >=
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
            if (this.name !== 'pagination-frontmatter') {
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

        var allPages = this.div.querySelectorAll('.pagination-page'), i;

        for (
            i = (
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
        var flowObject = this, checkOverset, checkAllEscapeReferencePagesPlacements, observer, reFlow;

        checkOverset = function () {
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
        };


        checkAllEscapeReferencePagesPlacements = function () {
            flowObject.checkAllEscapeReferencePagesPlacements();
        };

        if (this.rawdiv) {
            /* Create an observer instance to watch if anything is being changed in
             * the contents of the original text.
             * We do this instead of listening to the webkitregionlayoutupdate 
             * event of the flow, because it is ridden with bugs and fires too often.
             * This could be changed once 
             * https://bugs.webkit.org/show_bug.cgi?id=105366 has been resolved.
             * 
             * TODO: Check whether throttling this event makes sense.
             */
            observer = new MutationObserver(function (mutations) {
                checkOverset();
                checkAllEscapeReferencePagesPlacements();
            });

            observer.observe(this.rawdiv, {
                attributes: true,
                subtree: true,
                characterData: true,
                childList: true
            });
        }

        reFlow = function () {
            // The page layout has changed. Reflow by adding pages one by one.
            flowObject.addOrRemovePages(1);
            if (pagination.config('numberPages')) {
                flowObject.pageCounter.numberPages();
            }
        };
        this.namedFlow.addEventListener('pageLayoutUpdate', reFlow);
        
    };

    exports.flowObject = flowObject;

}).call(this.pagination);


pagination.initiate();
