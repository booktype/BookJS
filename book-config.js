    /* CONFIG OPTIONS */

    var sectionStartMarker = 'h1';
    var sectionTitleMarker = 'h1';

    var chapterStartMarker = 'h2';
    var chapterTitleMarker = 'h2';
    
    var flowElement = "document.body";
    
    var alwaysEven = true;
    
    var enableReflow = false;
    
    // Currently only either enableFrontmatter or enableReflow can be used. Using both at the same time doesn't work.
    var enableFrontmatter = true;

    var bulkPagesToAdd = 50; // For larger chapters add many pages at a time so there is less time spent reflowing text
    var pagesToAddIncrementRatio = 1.4; // Ratio of incrementing pages. 1.4 seems to be the fastest in most situations.

    var frontmatterContents ='<div id="booktitle">Book title</div><div id="booksubtitle">Book subtitle</div><div id="bookeditors">ed. Editor 1, Editor II, Editor III</div><div class="pagebreak"></div><div id="copyrightpage">Copyright: You<br>License: CC</div><div class="pagebreak"></div>';
    
    /* END CONFIG OPTIONS */
