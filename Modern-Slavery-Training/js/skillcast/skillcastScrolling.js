isModNavLayout_scrolling = true;
isModNavLayout_responsive = false;
isModNavLayout_fixed = false;
mod_nav_layout = "scrolling";

var skillcastScrollingSkin = function (scrollingSkinGlobalSettings) {
    //Globals
    var errors = [], elementTypesLookUp = {}, elementTypesLookUpDone = false,
    stackTraceLog = {}, stackTraceLogHistory = [],
    hideNextOrContinueLog = {}, showNextOrContinueLog = {};

    //Scrolling Skin Global Settings
    var scrollingSkinGlobalSettingsFallback = {
        autoHeightSections: true,
        autoShrinkSections: true,
        autoReturnToLast: true,
        autoScrollMenu: true,
        showProgressType: "bar",
        animateSpeedToNext: 800,
        animateSpeedFromMenu: 200,
        autoMinHeight: "100vh",
        autoHeight: "100%",
        menuButtonGotoPage: "",
        hideMenuByPageID: "",
        continueButtonAlignment: "center",
        continueButtonHeight: "100px",
        menuNotAvailableText: "(Not Available)",
        menuFieldsetName: "Main Menu",
        complete: "complete",
        menuStyle: "",
        notInViewport: "",
        linkedResourcesTitle: "Linked Resources",
        settingsMenuTitle: "Settings",
        settingsMenuAudioTitle: "Audio settings",
        settingsMenuAudioOn: "Turn audio on",
        settingsMenuAudioOff: "Turn audio off",
        settingsMenuLanguages: "Language settings",
        modOpensInNewTab: "Opens in new tab",
        clientId: "",
        lpid: "",
        rootPath: "",
        relativePath: "",
        iconAssessmentComplete: "far fa-check",
        iconPageComplete: "far fa-check",
        iconAssessmentVisted: "",
        iconPageVisted: "",
        iconPageCurrent: "",
        iconAssessmentNotVisted: "",
        iconPageNotVisted: "",
        iconAssessmentDisabled: "",
        iconPageDisabled: "",
        iconSectionCurrent: "far fa-dot-circle",
        iconSectionDisabled: "far fa-circle",
        iconSectionComplete: "far fa-circle",
        iconLinkedResourcesTitleIcon: "far fa-link",
        iconTitleIconExcel: "fad fa-file-excel",
        iconTitleIconPdf: "fad fa-file-pdf",
        iconTitleIconWord: "fad fa-file-word",
        iconSettingsMenuTitleIcon: "far fa-user-cog",
        iconAudioToggleOnOn: "fad fa-volume",
        iconAudioToggleOnOff: "fal fa-volume",
        iconAudioToggleOffOn: "fad fa-volume-mute",
        iconAudioToggleOffOff: "fal fa-volume-mute",
        iconLangToggleOn: "fad fa-eye",
        iconLangToggleOff: "fal fa-eye",
        buttonClass: "custombtn",
        entryAndDelay: true,
        menuStartsOpen: true
    };
    var skinGlobalSettings = {};

    //UI Buttons
    var $continueButton, $nextButton, $menuButton, $menuCloseButton,
    $linkButton, $linkCloseButton, $settingsButton, $settingsCloseButton;

    //UI Areas
    var $scrollNavTools, $scrollingResponsiveMenu;

    //CSS Classes
    var skinClasses;

    //Page and Module Identifiers
    var pageInfo, pageId, pageIdentifier, sectionsVisitedKey,
    lastPage, isAssessment;

    //Page Tracking Data from Suspend Data
    var pageTrackingDataArray, hasPageGotTrackingData;

    //All Section Settings
    var allSectionSettings;

    //All Section UI Elements
    var allSections, allSectionsLen,
        showSections, showSectionsLen, showSectionsByAutoId,
        activeSection, activeSectionIndex, activeSectionAutoId,
        missingSectionCount,
        goToSection = "";

    //Menu Style Options
    var isMenuInFixedStyle = false,
    isMenuStyleFixedLeft = false,
    isMenuStyleFixedRight = false,
    isSmallScreen = false,
    isPageMenuOpen = false,
    isLinkedResourcesMenuOpen = false,
    isSettingsMenuOpen = false;

    //Validation Object for error checking
    var validateSectionsAndSettingsObject, validateSectionsVisitedObject;

    //Current Scroll UI Position
    var currentScrollPosition;

    var  externalScriptsRun = {}, externalScriptsRunHistory = [],
    externalScriptsNotRunHistory = [], externalScriptsRunAlreadyHistory = [];

    //Bind click and touch events
    var bindEventTouchClick = "touchend mouseup",
    bindEventTouchClickStatus = false;

    var bindEventHandler = function(callback){
        if (!bindEventTouchClickStatus) {
            bindEventTouchClickStatus = true;
            callback();
            setTimeout(function(){
                bindEventTouchClickStatus = false;
            }, 100);
        }
        return false;
    };

    var scrollToAutoId = function (args) {
        var animateSpeedFromMenu = skinGlobalSettings.animateSpeedFromMenu;
        var autoId = args.autoId;
        var key = "_" + autoId;
        var goToSectionObject = showSectionsByAutoId[key];
        var coverTogglePageMenu = (!isMenuInFixedStyle);
        var fixedTogglePageMenu = (isSmallScreen && isMenuInFixedStyle);
        var callTogglePageMenu = (isPageMenuOpen && (coverTogglePageMenu || fixedTogglePageMenu));
        goToSection = autoId;
        scrollToSection(goToSectionObject, animateSpeedFromMenu, false, undefined);
        if (callTogglePageMenu && !isMenuInFixedStyle) {
            togglePageMenu();
        }
        refreshMenu();
    };

    var createDonut = function (percent) {
        var pieTotal = 360;
        var pieHalf = 360 / 2;
        var addPieSlice = function (degA, degB, className) {
            var pie = $("<div></div>").addClass("pie").css({
                transform: "rotate(" + (degA) + "deg)"
            });
            pieSliceX = $("<div></div>").addClass(className + " hold").css({
                transform: "rotate(" + (degB) + "deg)"
            }).html(pie);
            return pieSliceX;
        };
        var deg = Math.round(pieTotal * (percent / 100));
        var usePie1 = (deg <= pieHalf);
        var usePie2 = (deg > pieHalf);
        var useComplete = (percent === 100);
        var pie1a = (usePie2) ? pieHalf : deg;
        var pie1b = (usePie1) ? pieHalf : 0;
        var pieContainer = $("<div></div>").addClass("pieContainer");
        var pieBackground = $("<div></div>").addClass("pieBackground");
        var pieSlice1 = addPieSlice(pie1a, 0, "pieSliceDone");
        var innerCircle = $("<div></div>").addClass("innerCircle");
        var pieContainerContent = [pieBackground, pieSlice1];
        var pieX, pieSliceX;
        if (usePie1) {
            pieSliceX = addPieSlice(pie1b, pie1a, "pieSliceNotDone");
            pieContainerContent.push(pieSliceX);
            pieSliceX = addPieSlice(pie1b, pieHalf, "pieSliceNotDone");
            pieContainerContent.push(pieSliceX);
        }

        if (usePie2) {
            pieX = (deg - pieHalf);
            pieSliceX = addPieSlice(pieX, pieHalf, "pieSliceDone");
            pieContainerContent.push(pieSliceX);
            pieSliceX = addPieSlice(pieHalf - pieX, pieX + pieHalf, "pieSliceNotDone");
            pieContainerContent.push(pieSliceX);
        }
        if (useComplete) {
            innerCircle.addClass("complete");
        }
        pieContainerContent.push(innerCircle);
        pieContainer.html(pieContainerContent);
        return pieContainer;
    };

    var getMenuNotAvailableText = function () {
        var menuNotAvailableText = skinGlobalSettings.menuNotAvailableText;
        return menuNotAvailableText;
    };
    
    var hasMenuNotAvailableText = function () {
        var menuNotAvailableText = getMenuNotAvailableText();
        var returnBoolean = (isThisAString(menuNotAvailableText) && menuNotAvailableText.length > 0);
        return returnBoolean;
    };
    
    var notAvailableText = function () {
        var returnHTMLObject = "";
        if (hasMenuNotAvailableText()) {
            returnHTMLObject = $("<span></span>");
            returnHTMLObject
                .addClass('sr-only')
                .html(getMenuNotAvailableText());
        }
        return returnHTMLObject;
    };

    var renderPageMenu = function () {
        var menuFieldsetName = skinGlobalSettings.menuFieldsetName;
        var $scrollMenuContentMainMenuHolder = $("#scrollMenuContentMainMenuHolder");
        var $fieldset = $("<nav></nav>").prop("name", menuFieldsetName);
        var $menuLinks = [];
        var menuPageNo = thisPageNo + 1;
        var showPageItem, showPageArray;
        renderProgress();
        $.each(scr_pages, function (index) {
            showPageItem = (this.hide == false && (this.type != "h2" || (this.sectionstart <= menuPageNo && this.sectionend > menuPageNo)));
            if (showPageItem) {
                showPageArray = getMenuPageItem(this, index);
                $.each(showPageArray, function () {
                     $menuLinks.push(this);
                });
            }
        });
        if ($menuLinks.length > 0) {
            $fieldset.html($menuLinks);
            $scrollMenuContentMainMenuHolder.html($fieldset );
        }
        scrollToMenuSection();
    };

    var scrollToMenuSection = function () {
        var autoScrollMenu = skinGlobalSettings.autoScrollMenu;
        var menuPageItems;
        if(autoScrollMenu && isMenuInFixedStyle){
            menuPageItems = $('.scrollingMenuCoreItem[aria-current="page"]');
            if(menuPageItems.length === 1){
                scrollToOutOfViewport(menuPageItems, true);
            }
        }
    };

    var scrollToMenuSubSection = function () {
        var menuSubItems = $('.scrollingMenuSection[aria-current="page"]');
        if(menuSubItems.length === 1){
            scrollToOutOfViewport(menuSubItems, false);
        }

    };

    var scrollToOutOfViewport = function(menuItem, callback) {
        var $menuItem = $(menuItem[0])
        var isMenuItemInViewport = isInViewport($menuItem);
        var offset = $menuItem.offset();
        if(!isMenuItemInViewport){
            $('#scrollMenuContainerBottom').animate({
                scrollTop: offset.top,
                scrollLeft: offset.left
            }, {
                complete: function () {
                    if(callback){
                        scrollToMenuSubSection();
                    }
                },
                queue: false,
                duration: 200
            });
        } else if(callback) {
            scrollToMenuSubSection();

        }
    };

    var addIconToProgressDonut = function( donut, icon){
        var newIcon = $("<i></i>").addClass(icon);
        $(donut).find('.innerCircle').html(newIcon);
        return donut;
    };

    var getMenuPageItem = function ( pageObject, index ) {
        //Page Settings And Data
        var pageStatus = pageObject.pageStatus,
        pageCurrent = pageStatus.pageCurrent,
        pageComplete = pageStatus.pageComplete,
        pageVisted = pageStatus.pageVisted,
        isPageAssessment = pageStatus.isAssessment,
        sectionProgress = pageStatus.sectionProgress,
        menuLinkTitleOnly = pageObject.title,
        $menuTitleArray = [$("<span></span>").addClass('menuItemText mainPageMenuItemText').html(menuLinkTitleOnly)],
        pageScrollingSections = pageObject.scrollingSections,
        pageScrollingSectionsLen = pageStatus.progressPageSectionTotal,
        hasPageScrollingSections = (pageScrollingSectionsLen > 1);
        //Default class/element values
        var menuLinkPageClass = "scrollingMenuItem scrollingMenuCoreItem",
        menuLinkSubSectionClass = "scrollingMenuSection",
        tabIndex = 0,
        attrDefaultObject = {
            prop: "role",
            value: "link"
        };

        //Page Item class/element values
        var menuLinkClass = [menuLinkPageClass],
        attrArray = [attrDefaultObject],
        propArray = [],
        ariaLabel = "";

        //Page Items HTML elements
        var menuLinks, progressDonut, progressDonutIcon, $menuLinks = [];

        
        progressDonut = createDonut(sectionProgress);

        if (pageObject.type == "h2") {
            menuLinkClass.push(menuLinkSubSectionClass);
        }
        if(isPageAssessment){
            menuLinkClass.push("scrollingMenuAssessment");
        }

        if(hasPageScrollingSections){
            menuLinkClass.push("scrollingMenuItemWithSections");
        }
        else {
            menuLinkClass.push("scrollingMenuItemNoSections");
        }

        if (pageComplete || pageVisted) {
            if(pageComplete){
                menuLinkClass.push("scrollingMenuCompletePage");
                progressDonutIcon = (isPageAssessment) ? skinGlobalSettings.iconAssessmentComplete : skinGlobalSettings.iconPageComplete;
                $menuTitleArray.unshift(progressDonut);
                progressDonut = addIconToProgressDonut(progressDonut, progressDonutIcon);
            } else {
                menuLinkClass.push("scrollingMenuVistedPage");
                $menuTitleArray.unshift(progressDonut);
            }
            if (pageCurrent) {
                menuLinkClass.push("scrollingMenuCurrentPage");
                attrArray.push({
                    prop: "aria-current",
                    value: "page"
                });
                $menuTitleArray.push($('<i class="' + skinGlobalSettings.iconPageCurrent + '"></i>'));
            }
            propArray.push({
                prop: "href",
                value: getPageUrl(index)
            });

        }
        else {
            if(completionMode === 1){
                menuLinkClass.push("scrollingMenuNotVistedPage");
                $menuTitleArray.unshift(progressDonut);
                propArray.push({
                    prop: "href",
                    value: getPageUrl(index)
                });         
            } else {
                tabIndex = -1;
                menuLinkClass.push("scrollingMenuDisabledPage");
                $menuTitleArray.unshift(progressDonut);
                if (hasMenuNotAvailableText()) {
                    $menuTitleArray.push(notAvailableText());
                    ariaLabel = " " + getMenuNotAvailableText();
                }
            }
        }
        attrArray.push({
            prop: "tabindex",
            value: tabIndex
        });
        attrArray.push({
            prop: "aria-label",
            value: menuLinkTitleOnly + ariaLabel + " (" + sectionProgress + "% " + skinGlobalSettings.complete + ")"
        });
        menuLinks = getMenuPageElements({link: $menuTitleArray}, menuLinkClass, attrArray, propArray);
        $.each(menuLinks, function () {
            $menuLinks.push(this);
        });
        if(hasPageScrollingSections && pageCurrent){
            menuLinks = getMenuPageSectionsItem(pageScrollingSections, pageStatus, index);
            $.each(menuLinks, function () {
                $menuLinks.push(this);
            });
        }
        return $menuLinks;
    };

    var getMenuPageSectionsItem = function ( pageScrollingSections, pageStatus, pageIndex ) {
        var pageCurrent = pageStatus.pageCurrent,
        pageComplete = pageStatus.pageComplete,
        pageVisted = pageStatus.pageVisted,
        visitedDataLastKey = pageStatus.visitedDataLastKey;

        //Default class/element values
        var menuLinkPageClass = "scrollingMenuItem",
        menuLinkSubSectionClass = "scrollingMenuSection",
        tabIndex = 0,
        attrDefaultObject = {
            prop: "role",
            value: "link"
        };

        //Page Items HTML elements
        var menuLinks, progressDonut, $menuLinks = [],
         hideInMenu,  menuLinkTitleOnly, $menuTitleArray,
         autoId, sectionVisted, currentSet = false;

        $.each(pageScrollingSections, function (subIndex) {
            var menuLinkClass = [menuLinkPageClass, menuLinkSubSectionClass],
            attrArray = [attrDefaultObject],
            propArray = [],
            clickArray = [],
            ariaLabel = "",
            sectionIcon;
            menuLinkTitleOnly = this.title;
            $menuTitleArray = [$("<span></span>").addClass('menuItemText').html(menuLinkTitleOnly)];
            autoId = this.autoId;
            hideInMenu = this.hideInMenu;
            sectionVisted = this.sectionVisted;
            if (!hideInMenu && menuLinkTitleOnly.length > 0) {
                current = (pageCurrent && !currentSet && ((visitedDataLastKey == autoId) || (goToSection == autoId)));

                if (pageComplete || pageVisted) {
                    if (pageComplete) {
                        menuLinkClass.push("scrollingMenuCompleteSection");
                    }
                    if (sectionVisted) {
                        menuLinkClass.push("scrollingMenuVistedSection");
                    }

                    if (current) {
                        currentSet = current;
                        menuLinkClass.push("scrollingMenuCurrentSection");
                        attrArray.push({
                            prop: "aria-current",
                            value: "page"
                        });
                    }
                    if (current || (pageCurrent && sectionVisted)) {
                        clickArray.push({
                            fn: scrollToAutoId,
                            ag: { autoId: autoId }
                        });
                    }
                    else if (sectionVisted) {
                        propArray.push({
                            prop: "href",
                            value: getPageUrl(pageIndex) + "?goToSection=" + autoId
                        });
                    }
        
                }
                if (!sectionVisted) {
                    tabIndex = -1;
                    menuLinkClass.push("scrollingMenuDisabledSection");
                    if (hasMenuNotAvailableText) {
                        $menuTitleArray.push(notAvailableText());
                        ariaLabel = " " + getMenuNotAvailableText();
                    }
                    sectionIcon = skinGlobalSettings.iconSectionDisabled;
                } else {
                    sectionIcon = (current) ? skinGlobalSettings.iconSectionCurrent : skinGlobalSettings.iconSectionComplete;
                }
                $menuTitleArray.unshift($('<i class="' + sectionIcon + '"></i>'));
                attrArray.push({
                    prop: "tabindex",
                    value: tabIndex
                });
                attrArray.push({
                    prop: "aria-label",
                    value: menuLinkTitleOnly + ariaLabel
                });
                menuLinks = getMenuPageElements({link: $menuTitleArray}, menuLinkClass, attrArray, propArray, clickArray);
                $.each(menuLinks, function () {
                    $menuLinks.push(this);
                });
            }
        });
        return $menuLinks;
    };

    var getMenuPageElements = function ( linkObject, menuLinkClass, attrArray, propArray, clickArray ) {
        var $menuTitleArray = linkObject.link
        var $menuLink = $("<a></a>").html($menuTitleArray).addClass(menuLinkClass.join(" ")),
        $menuLinkItem = $("<div></div>").addClass("scrollingSkinMenuItem"),
        $menuItemArray = [], $returnArray = [], clickArrayObject;
        $.each(attrArray, function () {
            $menuLink.attr(this.prop, this.value);
        });
        $.each(propArray, function () {
            $menuLink.prop(this.prop, this.value);
        });
        if(isThisAnArrayEQ(clickArray, 1)){
            clickArrayObject = clickArray[0];
            $menuLink.on(bindEventTouchClick, function () {
                var callback = clickArrayObject.fn,
                callbackArgs = clickArrayObject.ag;
                return bindEventHandler(function(){
                    callback(callbackArgs);
                });
            });
        }
        $menuItemArray.push($menuLink);
        if(linkObject.hasOwnProperty("donut")){
            $menuItemArray.push(linkObject.donut);
        }
        $menuLinkItem.html($menuItemArray);
        $returnArray.push($menuLinkItem);
        return $returnArray;
    };

    var renderProgress = function (progressSectionTotal, progressSection) {
        var $scrollMenuMainProgressDone = $("#scrollMenuMainProgressDone"),
        $scrollMenuMainProgressTodo = $("#scrollMenuMainProgressTodo"),
        $scrollMenuMainProgressTextNumber = $("#scrollMenuMainProgressTextNumber"),
        $scrollMenuMainProgressText = $("#scrollMenuMainProgressText"),
        complete = skinGlobalSettings.complete,
        progress = setProgressData(),
        progressWidth, not, notWidth, headingAlt;

        progressWidth = progress + "%";
        not = 100 - progress;
        notWidth = not + "%";
        headingAlt = progressWidth + " " + complete;
        $scrollMenuMainProgressDone.css("width", progressWidth);
        $scrollMenuMainProgressTodo.css("width", notWidth);
        $scrollMenuMainProgressTextNumber.html(progressWidth);
        $scrollMenuMainProgressText.attr("alt", headingAlt).attr("aria-label", headingAlt);
    };

    var spImagesPath = function () {
        return skinGlobalSettings.rootPath + "sp_images/"
    };

    var renderLinkedResources = function () {
        var $scrollMenuContentMainMenuHolder = $("#scrollMenuContentMainMenuHolder"),
        opensInNewTab = skinGlobalSettings.modOpensInNewTab,
        $titleIcon = $('<i class="' + skinGlobalSettings.iconLinkedResourcesTitleIcon + '"></i>'),
        $title = $('<h3></h3>').addClass('menuTitle').html([$titleIcon, skinGlobalSettings.linkedResourcesTitle]),
        $bodyArray = [$title],
        spImagesBase = spImagesPath(),
        basePath = spImagesBase + "client/" + skinGlobalSettings.clientId + "/" + skinGlobalSettings.lpid + "/",
        $titleIconPdf = function () {
            return $('<i class="' + skinGlobalSettings.iconTitleIconPdf + '"></i>');
        },
        $body;
        renderProgress();
        $.each(scr_linkedResources, function(index){
            var title = this.resourcetitle,
            $titleIcon = $titleIconPdf(),
            link = basePath + this.resourcefile,
            previewImgPath = spImagesBase + "icon_resources_pdf.png",
            $preview = $('<img>')
                .prop("src", previewImgPath)
                .addClass("linkedResourcesMenuPreview")
                .html([title])
                .attr("aria-label", title),
            $span = $('<span></span>')
                .addClass('sr-only')
                .html(opensInNewTab),
            $menuItemText = $('<span></span>').addClass('menuItemText').html(title),
            $linkButtonItem = $('<a></a>').addClass("linkedResourcesMenuButton").html([$titleIcon, $menuItemText, $span])
            .prop("href", link)
            .prop("target", "linkedResource" + index)
            .attr("aria-label", opensInNewTab + ' ' + title),
            $resources = $('<div></div>')
                .addClass("linkedResourcesMenuItem")
                .html([$preview , $linkButtonItem]);
            $bodyArray.push($resources);
        });
        $body = $('<div></div>').prop("id","linkedResourcesMenuItems").html($bodyArray);
        $scrollMenuContentMainMenuHolder.html($body);
    };

    var isSettingsMenuOn = function () {
        var isAudioOn = isSettingsAudioOn();
        var isLangOn = isSettingsLangOn();
        return (isAudioOn || isLangOn);
    }

    var isSettingsAudioOn = function () {
        return scr_formats.isAudioOn;
    }

    var isSettingsLangOn = function () {
        return (isThisAnArrayGT(src_langs, 1));
    }

    var isLinkedResourcesOn = function () {
        return (isThisAnArrayGT(scr_linkedResources, 0));
    }

    var renderSettingsMenu = function () {
        var $scrollMenuContentMainMenuHolder = $('#scrollMenuContentMainMenuHolder'),
        $titleIcon = $('<i class="' + skinGlobalSettings.iconSettingsMenuTitleIcon + '"></i>'),
        $title = $('<h3></h3>').addClass('menuTitle').html([$titleIcon, skinGlobalSettings.settingsMenuTitle]),
        $settingItems = [$title],
        isAudioOn = isSettingsAudioOn(),
        isLangOn = isSettingsLangOn();
        renderProgress();
        if(isAudioOn){
            $settingItems.push(settingsAudioMenu());
        }
        if(isAudioOn && isLangOn){
            $settingItems.push($('<hr></hr>'));
        }
        if(isLangOn){
            $settingItems.push(settingsLangMenu());
        }
        $scrollMenuContentMainMenuHolder.html($settingItems);
    };

    var toggleAudio = function () {
        if(self.scr_audio == "off") {
            self.scr_audio = "on";
        } else {
            self.scr_audio = "off";
        }
        refreshPage();
    }

    var settingsAudioMenu = function () {
        var $title = $('<h4></h4>').html(skinGlobalSettings.settingsMenuAudioTitle),
        isAudioOn = (scr_audio === "on"),
        toggleFunction = (isMenuInFixedStyle) ? function(){} : toggleSettings,
        audioOnFn = (isAudioOn) ? toggleFunction : toggleAudio,
        audioOffFn = (isAudioOn) ? toggleAudio : toggleFunction,
        audioToggleOnIconClass = (isAudioOn) ? skinGlobalSettings.iconAudioToggleOnOn : skinGlobalSettings.iconAudioToggleOnOff,
        $audioToggleOnIcon = $('<i class="' + audioToggleOnIconClass +'"></i>'),
        $audioToggleOn = $('<input></input>').prop("type","radio").prop("name","audioToggle").prop("id","audioToggleOn").val("on").prop("checked", isAudioOn).change(audioOnFn),
        $labelAudioToggleOn = $('<label></label>').addClass('menuItemText').html(skinGlobalSettings.settingsMenuAudioOn).prop("for","audioToggleOn"),
        $br = $('<br/>'),
        audioToggleOffIconClass = (!isAudioOn) ? skinGlobalSettings.iconAudioToggleOffOn : skinGlobalSettings.iconAudioToggleOffOff,
        $audioToggleOffIcon = $('<i class="' + audioToggleOffIconClass + '"></i>'),
        $audioToggleOff = $('<input></input>').prop("type","radio").prop("name","audioToggle").prop("id","audioToggleOff").val("off").prop("checked", (!isAudioOn)).change(audioOffFn),
        $labelAudioToggleOff = $('<label></label>').addClass('menuItemText').html(skinGlobalSettings.settingsMenuAudioOff).prop("for","audioToggleOff"),
        $feildset = $('<fieldset></fieldset>').addClass().html([$audioToggleOn, $labelAudioToggleOn, $audioToggleOnIcon, $br, $audioToggleOff, $labelAudioToggleOff, $audioToggleOffIcon]),
        $body = $('<div></div>').html([$title, $feildset]);
        return $body;
    };

    var settingsLangMenu = function () {
        var $title = $('<h4></h4>').html(skinGlobalSettings.settingsMenuLanguages),
        $bodyArray = [$title],
        $body;

        $.each(src_langs, function(){
            var code = this.code,
            isThisLang = (code === scr_lang),
            $langToggle = $('<input></input>').prop("type","radio").prop("name","settingsLang").prop("id","settingsLang" + code).val(code).prop("checked", isThisLang).change(function () {
                scr_lang = code;
                refreshPage();
            }),
            langToggleIconClass = (isThisLang) ? skinGlobalSettings.iconLangToggleOn : skinGlobalSettings.iconLangToggleOff,
            $langToggleIcon = $('<i class="' + langToggleIconClass + '"></i>'),
            $labelLangToggle = $('<label></label>').addClass('menuItemText').html(this.local_name).prop("for","settingsLang" + code),
            $br = $('<br/>');

            $bodyArray.push($langToggle);
            $bodyArray.push($labelLangToggle);
            $bodyArray.push($langToggleIcon);
            $bodyArray.push($br);
        });

        $body = $('<fieldset></fieldset>').html($bodyArray);
        return $body;
    };

    var trackSection = function () {
        setPageSectionTrackingData();
        trackThisSection(activeSectionAutoId, true);
    };

    var trackThisSection = function (autoId, live) {
        var visitedArray = pageTrackingDataArray;
        var visitedUpdate;
        var isSectionTracked = ($.inArray(autoId, visitedArray) > -1);
        if (!isSectionTracked) {
            visitedArray.push(autoId);
            visitedUpdate = visitedArray.join(',');
            setDataValue(sectionsVisitedKey, visitedUpdate);
            if (live) {
                forceCommit();
            }
            setPageSectionTrackingData();
        }
    };

    var switchSection = function ($section, addClass, removeClassA, removeClassB) {
        $section
            .addClass(addClass)
            .removeClass(removeClassA, removeClassB);
        scrollingSectionWithMinAjust();
    };

    var scrollingSectionWithMinAjust = function () {
        var scrollingSections = $('.scr_scrolling_section_showWithMin');
        var heightProp = "min-height";
        var thisSection, thisSectionHeight;
        $.each(scrollingSections, function () {
            thisSection = $(this);
            thisSectionHeight = thisSection.css(heightProp);
        });
    };

    var setSectionProgress = function () {
        var showProgressType = skinGlobalSettings.showProgressType;
        if (showProgressType === "bar") {
            setSectionProgressBar();
        }
    };

    var setSectionProgressBar = function () {
        var progress, progressWidth, not, notWidth;
        progress = ((activeSectionIndex + 1) / showSectionsLen) * 100;
        progressWidth = progress + "%";
        not = 100 - progress;
        notWidth = not + "%";
        $('#scrollNavProgress').css('width', progressWidth);
        $('#scrollNavNotProgress').css('width', notWidth);
    };

    var nextSection = function () {
        var animateSpeedToNext = skinGlobalSettings.animateSpeedToNext;
        var lastActiveSectionIndex = activeSectionIndex;
        var latestSectionIndex = lastActiveSectionIndex + 1;
        var latestSectionObject = showSections[latestSectionIndex];
        var latestSectionAutoId = latestSectionObject.settings.autoId;
        currentScrollPosition = $('html, body').scrollTop();
        if(goToSection.length > 0){
            goToSection = latestSectionIndex;
        }
        displaySection(latestSectionObject);
        setSectionScrollIndicator(latestSectionObject, true);
        scrollToSection(latestSectionObject, animateSpeedToNext, true, activeSection);
        setActiveSection(latestSectionObject, latestSectionIndex, latestSectionAutoId);
        autoPlayVideoOrAudio(latestSectionObject);
        trackSection();
        refreshMenu();
    };

    var nextSectionCheck = function () {
        var latestSectionIndex = activeSectionIndex + 1;
        if (latestSectionIndex <= (showSectionsLen - 1)) {
            nextSection();
        } else {
            alert("No more slides to go to");
        }
    };

    var nextSectionOrPage = function () {
        var latestSectionIndex = activeSectionIndex + 1;
        if (latestSectionIndex <= (showSectionsLen - 1)) {
            nextSection();
        } else {
            self.location.href = getPageUrl(nextPageNo);
        }
    };

    var runSectionScripts = function (sectionObject) {
        runEntryAndElementScripts(true, false, false, sectionObject);
    };

    var checkBySectionGetElementsIds = function(sectionObject){
        if(!isSectionValid(sectionObject)){
            return [];
        }
        runSectionCustomScripts(sectionObject);
        return getElementsBySection(sectionObject);
    }

    var getElementsBySection = function(sectionObject){
        var elementsBySection = pageInfo.elementsBySection,
        sectionAutoId = sectionObject.settings.autoId,
        sectionKey = "_" + sectionAutoId;
        return elementsBySection[sectionKey];
    };

    var getComBo = function(isSectionEntry, isPageEntry){
        var entryAndDelay = (skinGlobalSettings.entryAndDelay),
        comBo = 0;
        if (entryAndDelay) {
            comBo += 4;
        }
        if (isSectionEntry) {
            comBo += 2;
        }
        if (isPageEntry) {
            comBo += 1;
        }
        return comBo;
    };

    var getSwitchObjectFromComBo = function(isSectionEntry, isPageEntry){
        var comBo = getComBo(isSectionEntry, isPageEntry),
        switchObject = {
            "addPage_renderEntry": false,
            "addPage_renderElement": false,
            "addSection_renderEntry": false,
            "addSection_renderElement": false,
            "invalid": false
        };
        switch (comBo) {
            case 0 : // isPageEntry is FALSE AND isSectionEntry is FALSE and entryAndDelay is FALSE
                switchObject.invalid = true;
            break;
            case 1 : // isPageEntry is TRUE AND isSectionEntry is FALSE and entryAndDelay is FALSE
                switchObject.addPage_renderEntry = true;
                switchObject.addPage_renderElement = true;
            break;
            case 2 : // isPageEntry is FALSE AND isSectionEntry is TRUE and entryAndDelay is FALSE
                switchObject.addPage_renderEntry = true;
                switchObject.addSection_renderElement = true;
            break;
            case 3 : // isPageEntry is TRUE AND isSectionEntry is TRUE and entryAndDelay is FALSE
                switchObject.addPage_renderEntry = true;
                switchObject.addSection_renderElement = true;
            break;
            case 4 : // isPageEntry is FALSE AND isSectionEntry is FALSE and entryAndDelay is TRUE
                switchObject.invalid = true;
            break;
            case 5 : // isPageEntry is TRUE AND isSectionEntry is FALSE and entryAndDelay is TRUE
                switchObject.addPage_renderEntry = true;
                switchObject.addPage_renderElement = true;
            break;
            case 6 : // isPageEntry is FALSE AND isSectionEntry is TRUE and entryAndDelay is TRUE
                switchObject.addSection_renderEntry = true;
                switchObject.addSection_renderElement = true;
            break;
            case 7 : // isPageEntry is TRUE AND isSectionEntry is TRUE and entryAndDelay is TRUE
                switchObject.addSection_renderEntry = true;
                switchObject.addSection_renderElement = true;
            break;
            default:
                switchObject.invalid = true;
            break;
        }
        //This case should never happen and is due to code error
        if(switchObject.invalid){
            switchObject.addPage_renderEntry = true;
            switchObject.addPage_renderElement = true;
        }
        return switchObject;
    };

    var getRunScripts = function(isSectionEntry, isPageEntry, runCustomScript, sectionObject){
        var switchObject = getSwitchObjectFromComBo(isSectionEntry, isPageEntry),
        pageElementsIds = pageInfo.elements,
        stages = [],
        addRunScript = function(runScript, isPage, isSection){
            var addRunScriptToStage = function(){
                var elements = (isSection) ? checkBySectionGetElementsIds(sectionObject) : pageElementsIds;
                var stage = {
                    "runScript": runScript,
                    "elements": elements,
                    "runCustom": runCustomScript,
                    "sectionObj": sectionObject
                };
                stages.push(stage);
            };
            addRunScriptToStage();
        };
        addRunScript(runEntryScripts, switchObject.addPage_renderEntry, switchObject.addSection_renderEntry);
        addRunScript(runElementScripts, switchObject.addPage_renderElement, switchObject.addSection_renderElement);
        return stages;
    };

    var runEntryAndElementScripts = function (isSectionEntry, isPageEntry, runCustomScript, sectionObject) {
        var stages = getRunScripts(isSectionEntry, isPageEntry, runCustomScript, sectionObject);
        $.each(stages, function(){
            var runScript = this.runScript,
            elements = this.elements,
            runCustom = this.runCustom,
            sectionObj = this.sectionObj;
            runScript(elements, runCustom, sectionObj);
        });
    };

    var runEntryScripts = function (elements) {
        $.each(elements, function(){
            var functionName = "renderCssDelayAndEntry" + this;
            runExternalFunction(functionName, this);
        });      
    };

    var runElementScripts = function (elements, runCustomScript, sectionObject) {
        var elementsStages = ["renderElement"];
        $.each(elements, function(){
            var autoId = this;
            $.each(elementsStages, function(){
                var functionName = this + autoId;
                runExternalFunction(functionName, sectionObject);
            });
        });
        runSectionCustomScripts(sectionObject);
    };

    var runExternalFunction = function (functionName, args){
        var hasRun = (externalScriptsRun.hasOwnProperty(functionName) && externalScriptsRun[functionName]),
        isFunction = (isThisAFunction(window[functionName])),
        addHistoryLog = function(historyArray, functionName){
            var stamp = new Date()
            historyObject = {
                "stamp": stamp,
                "functionName": functionName
            };
                
            historyArray.push(historyObject);
        },
        fn;
        if(isFunction && !hasRun){
            fn = window[functionName];
            externalScriptsRun[functionName] = true;
            fn(args);
            addHistoryLog(externalScriptsRunHistory, functionName);
        }
        else if(isFunction && hasRun) {
            addHistoryLog(externalScriptsRunAlreadyHistory, functionName);
        }
        else {
            addHistoryLog(externalScriptsNotRunHistory, functionName);
        }
    };

    var debugRunExternalFunction = function (functionName){
        return {
            "externalScriptsRun": externalScriptsRun,
            "externalScriptsRunHistory": externalScriptsRunHistory,
            "externalScriptsNotRunHistory": externalScriptsNotRunHistory,
            "externalScriptsRunAlreadyHistory": externalScriptsRunAlreadyHistory
        };
    };

    var runSectionCustomScripts = function (sectionObject) {
        var isValid = isSectionValid(sectionObject);
        var settings = (isValid) ? sectionObject.settings : {};
        var hasIdentifier = (isValid && settings.hasOwnProperty('identifier') && settings.identifier.length > 0);
        var functionName = (hasIdentifier) ? "scriptOn_" + settings.identifier : "scriptOn_EachSection";
        runExternalFunction(functionName, sectionObject);
    };

    var autoPlayVideoOrAudio = function (sectionObject) {
        var $element = sectionObject.$element;
        var audio = $element.find('audio.auto-play');
        var video = $element.find('video.auto-play').not('.plyr');
        var play = false;
        var autoPlay;
        $('video').not('.plyr').each(function () {
            this.pause();
        });
        $('audio').each(function () {
            this.pause();
        });
        if (video.length > 0) {
            play = true;
            autoPlay = video[0];
        }
        else if (audio.length > 0) {
            play = true;
            autoPlay = audio[0];
        }
        if (play) {
            autoPlay.play();
        }
    };

    var toggleNext = function (sectionObject, callback) {
        var settings = sectionObject.settings;
        var $element = sectionObject.$element;
        var hideNextButton = settings.hideNextButton;
        var showNextButtonDelay = settings.showNextButtonDelay;
        var showFunction = function (mySection, cb) {
            var isExternal = (isThisAString(mySection) && mySection === "external"),
            autoId = (isSectionValid(mySection)) ? "S_" + mySection.settings.autoId : "P_" + pageIdentifier,
            key = "_" + autoId,
            rasRun = (showNextOrContinueLog.hasOwnProperty(key) && showNextOrContinueLog[key]),
            delay;
            if(!rasRun || isExternal){
                if (showNextButtonDelay > 0) {
                    delay = showNextButtonDelay * 1000;
                    showNextOrContinueWithDelay(delay);
                }
                else {
                    showNextOrContinue();
                }
            }
            if(isThisAFunction(cb)){
                cb(mySection);
            }
            if(!isExternal){
                showNextOrContinueLog[key] = true;
            }
        };

        if (showSectionsLen > 0) {
            hideNextOrContinue(sectionObject, callback);
        }
        if (!hideNextButton) {
            showFunction(sectionObject, callback);
        }
    };

    var getVistedTrackingObject = function () {
        var visitedArray = pageTrackingDataArray;
        var returnObject = {
            arrayData: visitedArray,
            arrayDataLen: visitedArray.length,
            visitedShow: [],
            visitedShowLen: 0,
            visitedHide: [],
            objectData: {}
        };
        var visitedShow = [];
        var visitedHide = [];
        var objectData = {};
        var key;
        $.each(visitedArray, function (index) {
            key = "_" + this;
            if (!showSectionsByAutoId.hasOwnProperty(key)) {
                visitedHide.push(this);
            }
            else if (!objectData.hasOwnProperty(key)) {
                visitedShow.push(this);
                objectData[key] = {
                    "index": index
                };
            }
        });
        returnObject.visitedShow = visitedShow;
        returnObject.visitedShowLen = visitedShow.length;
        returnObject.visitedHide = visitedHide;
        returnObject.objectData = objectData;
        return returnObject;
    };

    var pageSectionsTrackingValidate = function () {
        var visitedObject = getVistedTrackingObject();
        var visitedShow = visitedObject.visitedShow;
        var visitedShowLen = visitedObject.visitedShowLen;
        var visitedObjectData = visitedObject.objectData;
        var visitedFound = [];
        var visitedFoundLen = 0;
        var visitedNew = [];
        var visitedNewLen = 0;
        var visitedInvlaid = [];
        var visitedInvlaidLen = 0;
        var visitedFoundAll = false;
        var validSectionsObject = {}
        var validSectionsArray = []
        var lastFoundSection = "";
        var firstNewSection = "";
        var lastNewSection = "";
        var showSectionSettings, autoId, key, found;

        $.each(showSections, function (index) {
            if (visitedFoundAll) {
                return true;
            }
            showSectionSettings = this.settings;
            autoId = showSectionSettings.autoId;
            key = "_" + autoId;
            found = visitedObjectData.hasOwnProperty(key);
            if (found) {
                visitedFound.push(autoId);
                visitedFoundLen++;
                lastFoundSection = autoId;
            } else {
                visitedNew.push(autoId);
                visitedNewLen++;
                lastNewSection = autoId;
                if (firstNewSection.length === 0) {
                    firstNewSection = autoId;
                }
            }
            visitedFoundAll = (visitedFoundLen === visitedShowLen);
            validSectionsArray.push(this);
            validSectionsObject[key] = {
                index: index,
                found: found
            };
        });
        if (!visitedFoundAll) {
            $.each(visitedShow, function (index) {
                key = "_" + this;
                if (!validSectionsObject.hasOwnProperty(key)) {
                    visitedInvlaid.push(this);
                    visitedInvlaidLen++;
                }
            });
        }
        $.each(visitedNew, function (index) {
            trackThisSection(this, false);
        });
        validateSectionsVisitedObject = {
            "lastFoundSection": lastFoundSection,
            "firstNewSection": firstNewSection,
            "lastNewSection": lastNewSection,
            "visitedFoundAll": visitedFoundAll,
            "validSectionsArray": validSectionsArray,
            "validSectionsObject": validSectionsObject,
            "visitedFound": visitedFound,
            "visitedFoundLen": visitedFoundLen,
            "visitedNew": visitedNew,
            "visitedNewLen": visitedNewLen,
            "visitedInvlaid": visitedInvlaid,
            "visitedInvlaidLen": visitedInvlaidLen
        };
    };

    var loadPageSectionsWithTrackedData = function () {
        var autoReturnToLast = skinGlobalSettings.autoReturnToLast;
        var animateSpeedToNext = skinGlobalSettings.animateSpeedToNext;
        var validSectionsArray = validateSectionsVisitedObject.validSectionsArray;
        var lastFoundSection = validateSectionsVisitedObject.lastFoundSection;
        var firstNewSection = validateSectionsVisitedObject.firstNewSection;
        var focusSet = false;
        var showSectionSettings, autoId, focusOnNew, focusOnSection, focusOnLast, focusOnAny, focusOnUser, $element;
        $.each(validSectionsArray, function (index) {
            showSectionSettings = this.settings;
            autoId = showSectionSettings.autoId;
            focusOnNew = (firstNewSection == autoId);
            focusOnSection = (goToSection == autoId);
            focusOnLast = (lastFoundSection == autoId);
            focusOnAny = (focusOnNew || focusOnSection || focusOnLast);
            focusOnUser = (focusOnNew || focusOnSection);
            $element = this.$element;
            if (!focusOnLast) {
                switchSection(
                    $element,
                    skinClasses.scrollingSectionVistedClass,
                    skinClasses.scrollingSectionHideClass,
                    skinClasses.scrollingSectionShowClass
                );
            }
            setSectionScrollIndicator(this, focus);
            if (focusOnAny && !focusSet) {
                focusSet = true;
                if (autoReturnToLast || focusOnUser) {
                    scrollToSection(this, animateSpeedToNext, false, undefined);
                    autoPlayVideoOrAudio(this);
                } else {
                    noScrollToSection(this);
                }
            }
            if (focusOnLast) {
                setActiveSection(this, index, autoId);
                displaySection(this);
            }
            if(!focusSet) {
                runSectionScripts(this);
            }
        });
    };

    var objIsEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    };

    var scrollToSection = function (scrollToSectionObject, delay, switchLast, switchObject) {
        var $element = scrollToSectionObject.$element;
        var localScrollTimeout;
        //$('html, body').scrollTop(currentScrollPosition);
        clearTimeout(localScrollTimeout);
        localScrollTimeout = setTimeout(function(){
            $('html, body')
                .animate({
                    scrollTop: $element.offset().top
                }, {
                    complete: function () {
                        var cb = function (mySection) {
                            runSectionScripts(mySection);
                            setSectionProgress();
                        },
                        thisSection = scrollToSectionObject.$element,
                        findTitleSection = thisSection.find('.scrollingSectionTitleText'),
                        findTitle = thisSection.find('.title-bar'),
                        focusElement = thisSection;
                        if (switchLast && !objIsEmpty(switchObject)) {
                            switchSection(
                                switchObject.$element,
                                skinClasses.scrollingSectionVistedClass,
                                skinClasses.scrollingSectionHideClass,
                                skinClasses.scrollingSectionShowClass
                            );
                        }
                        $('html, body').scrollTop($element.offset().top);
                        if(findTitle.length > 0) {
                            focusElement = findTitle[0];
                        } else if(findTitleSection.length > 0){
                            focusElement = findTitleSection[0];
                        } 
                        $(focusElement).attr("tabindex", "-1").focus();
                        toggleNext(scrollToSectionObject, cb);
                        
                    },
                    queue: false,
                    duration: delay
                });
                setSectionProgress();
        }, 500);
    };

    var noScrollToSection = function (sectionObject) {
        var $element = sectionObject.$element;
        var localDelay = 200;
        var localScrollTimeout;
        var cb = function (mySection) {
            runSectionScripts(mySection);
            setSectionProgress();
        };
        clearTimeout(localScrollTimeout);
        localScrollTimeout = setTimeout(function () {
            toggleNext(sectionObject, cb);
            setSectionProgress();
        }, localDelay);
    };

    var showNextOrContinueWithDelay = function (delay) {
        setTimeout(showNextOrContinue, delay);
    };

    var addContinueNextContainer = function ($inlineButtons) {
        var continueButtonAlignment = skinGlobalSettings.continueButtonAlignment.toLowerCase();
        var continueButtonHeight = skinGlobalSettings.continueButtonHeight;
        var alignment = (continueButtonAlignment.length > 0) ? " scrollingInlineContainer_" : "";
        var setHeight = (continueButtonHeight.length > 0);
        var $element = (isThisAObject(activeSection)) ? activeSection.$element : $('#contentinner');
        var id = (isThisAObject(activeSection)) ? activeSectionAutoId : 'noActiveSections';
        var containerClass = "scrollingInlineContainer" + alignment + continueButtonAlignment;
        var containerId = "scrollingInlineContainer" + id;
        var containerIdSelector = "#" + containerId;
        var $inlineContainer = $(containerIdSelector);
        $.each($inlineButtons, function () {
            this.detach();
        });
        if ($inlineContainer.length === 0) {
            $inlineContainer = $('<div></div>')
                .prop('id', containerId)
                .addClass(containerClass);
            if (setHeight) {
                $inlineContainer.css('height', continueButtonHeight);
            }
            $element.append($inlineContainer);
        }
        $inlineContainer.html($inlineButtons);
    };

    var setNextButtonAction = function () {
        var settings = activeSection.settings;
        var gotoPageAfterSection = settings.gotoPageAfterSection;
        var href;
        if (gotoPageAfterSection.length > 0) {
            href = "javascript:SKILLCASTAPI.gotoPageId('" + gotoPageAfterSection + "');"
            $nextButton.prop("href", href);
        }
    };

    var isInViewport = function (element) {
        if (isThisAFunction(jQuery) && element instanceof jQuery) {
            element = element[0];
        }
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    var removeElementNotInViewport = function (){
        $('#elementNotInViewport').remove();
    };

    var scollAndRemoveNotInViewport = function (element){
        removeElementNotInViewport();
        scollToElementNotInViewport(element);
    };

    var scollToElementNotInViewport = function(element) {
        var $element = $(element)
        var isElementInViewport = isInViewport($element);
        var offset = $element.offset();
        if(!isElementInViewport){
            $('html, body').animate({
                scrollTop: offset.top
            }, {
                queue: false,
                duration: 200
            });
        } else if(callback) {
            scrollToMenuSubSection();

        }
    };
 
    var displayNotInViewport = function ($element){
        var notInViewport = skinGlobalSettings.notInViewport;
        var buttonClass = skinGlobalSettings.buttonClass;
        var icon = $('<i></i>').addClass("fal fa-hand-point-down");
        var $message = $('<button></button>')
            .prop("id","elementNotInViewport")
            .addClass(buttonClass)
            .prop("type","button")
            .attr("role", "presentation")
            .attr("title", notInViewport)
            .attr("aria-label", notInViewport)
            .attr("aria-hidden", "true")
            .attr("alt", notInViewport)
            .html(icon)
            .on(bindEventTouchClick, function (e) {
                return bindEventHandler(function(){
                    scollAndRemoveNotInViewport($element);
                    e.stopPropagation();
                    e.preventDefault();
                });
            });
        checkElementNotInViewport($element);
        $element.before($message);
    }

    var checkElementNotInViewport = function (element){
        if(isInViewport(element)){
            return removeElementNotInViewport();
        }
        return setTimeout(function(){
            checkElementNotInViewport(element)
        }, 200);
    }

    var checkDisplayNotInViewport = function (element){
        if(skinGlobalSettings.notInViewport.length > 0){
            return setTimeout(function(){
                if(!isInViewport(element)){
                    displayNotInViewport(element);
                }
            }, 200);
        }
        return;
    }
    var getAssessmentStatus = function () {
        var assessmentStatus = {
            "answered": 0,
            "numerOfQuestions": 0
        };
        if(isThisAObject(skillcastAssessment) && isThisAFunction(skillcastAssessment.assessmentStatus)){
            assessmentStatus = skillcastAssessment.assessmentStatus();
        }
        return assessmentStatus;
    }

    var isAssessmentLastQuestion = function () {
        if(isAssessment){
            var assessmentStatus = getAssessmentStatus(),
            answered = assessmentStatus.answered,
            numerOfQuestions = assessmentStatus.numerOfQuestions;
            if(answered === 0 && numerOfQuestions === 0){
                return false
            }
            return (answered === numerOfQuestions);
        }
        return false;
    };

    var showNextOrContinueForNonScrollingOnly = function () {
        var pageHideNextButton = pageInfo.pageHideNextButton;
        var isAssessment = pageInfo.isAssessment;
        var pageShowNext = (!(pageHideNextButton === "y" || pageHideNextButton === "Y"));
        if(!isAssessment && pageShowNext){
            showNextOrContinue();
        }
    };

    var showNextOrContinue = function () {
        var hasSections = (showSectionsLen > 0);
        var isLastSection = ((activeSectionIndex === showSectionsLen - 1) || !hasSections);
        var isContinueButton = (showSectionsLen > 0 && !isLastSection);
        var showButton = true;
        var sectionInlineButtons = [$continueButton, $nextButton];
        var $showNextButton, $hideNextButton;
        var isAssessmentLast = isAssessmentLastQuestion();
        addContinueNextContainer(sectionInlineButtons);
        if(isContinueButton) {
            $continueButton.prop("disabled", false);
            $showNextButton = $continueButton;
            $hideNextButton = $nextButton;
        }
        else {
            showButton = (!(lastPage && hasSections) || (!hasSections && !isAssessmentLast));
            if(hasSections){
                setNextButtonAction();
            }
            $showNextButton = $nextButton;
            $hideNextButton = $continueButton;
        }
        if (showButton) {
            setVisibilityVisible($showNextButton.show(0));
            checkDisplayNotInViewport($showNextButton);

        }
        setVisibilityHidden($hideNextButton.hide(0));
    };

    var addStackTrace = function (id) {
        var isIdStringValid = (isThisAString(id) && id.length > 0),
        stackTraceError, stack;

        if(!isIdStringValid){
            return;
        }
        stackTraceLogHistory.push(id);
        stackTraceError = new Error();
        stack = stackTraceError.stack;
        if(!(isThisAObject(stackTraceLog[id]))){
            stackTraceLog[id] = [];
        }
        stackTraceLog[id].push(stack);
    };

    var getStackTraceLog = function () {
        var returnObject = {
            "stackTraceLog": stackTraceLog,
            "stackTraceLogHistory": stackTraceLogHistory
        };
        return returnObject;
    };

    var hideNextOrContinue = function (sectionObject, callback) {
        var isExternal = (isThisAString(sectionObject) && sectionObject === "external"),
        autoId = (isSectionValid(sectionObject)) ? "S_" + sectionObject.settings.autoId : "P_" + pageIdentifier,
        key = "_" + autoId,
        rasRun = (hideNextOrContinueLog.hasOwnProperty(key) && hideNextOrContinueLog[key]),
        hideButtons;
        if(!rasRun || isExternal){
            hideButtons = [$continueButton, $nextButton];
            $.each(hideButtons, function (index) {
                $(this).hide(0);
            });
            if(!isExternal){
                hideNextOrContinueLog[key] = true;
            }
        }
        if(isThisAFunction(callback)){
            callback(sectionObject);
        }
    };

    var isSectionValid = function (sectionObject) {
        return (isThisAObject(sectionObject) && sectionObject.hasOwnProperty('settings'));
    };

    var getTypeOf = function(a){
        return typeof a;
    }

    var isThisAObject = function(a){
        return (getTypeOf(a) === "object");
    };

    var isThisAFunction = function(fn){
        return (getTypeOf(fn) === "function");
    };

    var isTypeofMatch = function(a, b){
        return (getTypeOf(a) === getTypeOf(b));
    };

    var isThisABoolen = function(a){
        return (getTypeOf(a) === "boolean");
    };

    var isThisABoolenAndTrue = function(a){
        return (isThisABoolen(a) && a);
    };

    var isThisAString = function(a){
        return (getTypeOf(a) === "string");
    };

    var isThisAnArray = function(a){
        return (getTypeOf(a) === "object" && a.hasOwnProperty("length") && getTypeOf(a.length) === "number");
    };

    var isThisAnArrayEQ = function(a, b){
        return (isThisAnArray(a) && a.length === b);
    };

    var isThisAnArrayGTE = function(a, b){
        return (isThisAnArray(a) && a.length >= b);
    };

    var isThisAnArrayGT = function(a, b){
        return (isThisAnArray(a) && a.length > b);
    };

    var debug = function () {
        var returnSettings = {
            "globalSettings": skinGlobalSettings,
            "allSections": allSections,
            "showSections": showSections,
            "showSectionsByAutoId": showSectionsByAutoId,
            "activeSection": activeSection,
            "activeSectionIndex": activeSectionIndex,
            "activeSectionAutoId": activeSectionAutoId,
            "missingSectionCount": missingSectionCount,
            "validateSectionsAndSettingsObject": validateSectionsAndSettingsObject,
            "validateSectionsVisitedObject": validateSectionsVisitedObject,
            "stackTraceLog": stackTraceLog,
            "stackTraceLogHistory": stackTraceLogHistory
        };
        return returnSettings;
    };

    var setSectionScrollIndicator = function (sectionObject, focus) {
        var $section = sectionObject.$element;
        var isFocus = focus || false;
        if (isFocus) {
            $section.focus();
        }
        $section.find(".scrollIndicator").css("height", "100%");
    };

    var displaySection = function (sectionObject) {
        var $section = sectionObject.$element;
        switchSection(
            $section,
            skinClasses.scrollingSectionShowClass,
            skinClasses.scrollingSectionHideClass,
            skinClasses.scrollingSectionVistedClass
        );
    };

    var setActiveSection = function (sectionObject, index, autoId) {
        activeSection = sectionObject;
        activeSectionIndex = index;
        activeSectionAutoId = autoId;
    };

    var loadPageSectionNoTrackedData = function () {
        var showSectionIndex = 0,
        section = showSections[showSectionIndex],
        autoId = section.settings.autoId,
        cb;
        setActiveSection(section, 0, autoId);
        displaySection(activeSection);
        setSectionScrollIndicator(activeSection, true);
        initializeScrollToTop();
        cb = function (mySection) {
            autoPlayVideoOrAudio(mySection);
            runSectionScripts(mySection);
        };
        toggleNext(activeSection, cb);
    };

    var initializeScrollToTop = function () {
        currentScrollPosition = $(window).scrollTop();
    };

    var focusForNonScrollingOnly = function () {
        var contentStart = $('#scr_outer_td'),
        titleBar = contentStart.find('.title-bar'),
        focusElement = contentStart;
        if(titleBar.length > 0){
            focusElement = titleBar;
        }
        $(focusElement).attr("tabindex", "-1").focus();
    };

    var handleEntryAndDelay = function () {
        var entryAndDelay = skinGlobalSettings.entryAndDelay;
        var continueLoad = false;
        if (showSectionsLen === 0) {
            showNextOrContinueForNonScrollingOnly();
            runEntryAndElementScripts(false, true, false, false);
            focusForNonScrollingOnly();
        } else {
            continueLoad = true;
            if (!entryAndDelay) {
                runEntryAndElementScripts(true, true, true, activeSection);  
            }
        }
        return continueLoad;
    };

    var continueLoadingSkinWithTracking = function () {
        pageSectionsTrackingValidate();
        loadPageSectionsWithTrackedData();
    }

    var continueLoadingSkinWithoutTracking = function () {
        loadPageSectionNoTrackedData();
        trackSection();
    }

    var continueLoadingSkinPath = function () {
        if (hasPageGotTrackingData) {
            continueLoadingSkinWithTracking();
        }
        else {
            continueLoadingSkinWithoutTracking();
        }
    }

    var continueLoadingSkin = function () {
        continueLoadingSkinPath();
        setSectionProgress();
    }

    var startLoadingSkin = function () {
        if(handleEntryAndDelay()){
            continueLoadingSkin();
        }
    }

    var handleErrorsOrLoadSkin = function () {
        startLoadingSkin();
    };

    var validateSectionsAndSettings = function () {
        var validateObject = {};
        var testsObject = {
            test1missingSectionCount: (missingSectionCount === 0)
        };
        var testsParamsObject = {
            test1missingSectionCount: {
                missingSectionCount: missingSectionCount
            }
        };
        var passed = 0;
        var errors = 0;
        var key, test, testsParams, isValid;
        for (key in testsObject) {
            test = testsObject[key];
            testsParams = testsParamsObject[key];
            if (test) {
                passed++;
            } else {
                errors++;
            }
            validateObject[key] = {
                test: test,
                testsParams: testsParams
            };
        }
        isValid = (errors === 0 && passed > 0);
        validateObject["isOk"] = isValid;
        validateSectionsAndSettingsObject = validateObject;
        if (!isValid) {
            errors.push("Function validateSectionsAndSettings Failed!");
        }
    };

    var setupSections = function () {
        var findKey = "#scr_scrolling_section_";
        var autoId,
            autoIdObjectKey,
            findKeyId,
            $foundByKeyId,
            foundByKeyIdLen,
            isElementFoundByKeyId,
            tempSectionsObject,
            tempFoundSectionsObject;

        var missingSectionsObject = {};
        var showSectionsObject = {};

        var allSectionsArray = [];
        var showSectionsArray = [];
        var missing = 0;
        var show = 0;
        var showOddEven = "scr_scrolling_section_odd";

        $.each(allSectionSettings, function (index) {
            autoId = this.autoId;
            autoIdObjectKey = "_" + autoId;
            findKeyId = findKey + autoId;
            $foundByKeyId = $(findKeyId);
            foundByKeyIdLen = $foundByKeyId.length;
            isElementFoundByKeyId = (foundByKeyIdLen === 1);
            tempSectionsObject = {
                $element: $foundByKeyId,
                index: index,
                isOk: isElementFoundByKeyId,
                settings: this
            };
            allSectionsArray.push(tempSectionsObject);
            if (isElementFoundByKeyId) {
                tempFoundSectionsObject = {
                    $element: $foundByKeyId,
                    index: index,
                    settings: this
                };
                show++;
                showOddEven = ((show % 2) === 0) ? "scr_scrolling_section_even" : "scr_scrolling_section_odd";
                tempFoundSectionsObject.$element.addClass(showOddEven);
                showSectionsObject[autoIdObjectKey] = tempFoundSectionsObject;
                showSectionsArray.push(tempFoundSectionsObject);

            }
            else {
                missing++;
                missingSectionsObject[autoIdObjectKey] = index;
                errors.push("Function setupSections - Missing Sections: " + autoId);
            }
        });
        allSections = allSectionsArray;
        allSectionsLen = allSectionsArray.length;
        missingSectionCount = missing;
        showSectionsByAutoId = showSectionsObject;
        showSections = showSectionsArray;
        showSectionsLen = showSectionsArray.length;
    };

    var setupSectionSettings = function () {
        var allSectionSettingsArray = pageInfo.scrollingSections;
        var sectionSettingsObject = {};
        var autoId, autoIdKey;
        $.each(allSectionSettingsArray, function (index) {
            autoId = this.autoId;
            autoIdKey = "_" + autoId;
            this["index"] = index;
            sectionSettingsObject[autoIdKey] = this;
        });
        allSectionSettings = allSectionSettingsArray;
    };

    var setPageSectionTrackingDataIsFromSuspendData = function () {
        hasPageGotTrackingData = (pageTrackingDataArray.length > 0);
    };

    var setPageSectionTrackingData = function () {
        var sectionsVisitedData = getDataValue(sectionsVisitedKey);
        var visitedArray = sectionsVisitedData.split(",");
        var sectionsVisitedArray = [];
        $.each(visitedArray, function () {
            if (this.length) {
                sectionsVisitedArray.push(this);
            }
        });
        pageTrackingDataArray = sectionsVisitedArray;
    };

    var setPageTrackingData = function () {
        setPageSectionTrackingData();
        setPageSectionTrackingDataIsFromSuspendData();
    };

    var setPageInfo = function () {
        pageInfo = SKILLCASTAPI.getPageInfo();
        pageId = pageInfo.autoId;
        pageIdentifier = pageInfo.identifier;
        isAssessment = pageInfo.isAssessment;
        sectionsVisitedKey = "sectionsVisited-" + pageId;
        lastPage = (pageInfo.pageNo === pageInfo.totalPages);
    };

    var hideMenuButtonByPageId = function () {
        var hideMenuByPageID = skinGlobalSettings.hideMenuByPageID;
        var hideMenuPageIDArray = hideMenuByPageID.split(",");
        var hideMenuObject = [];
        var hideMenuObjectItem;
        $.each(hideMenuPageIDArray, function () {
            hideMenuObjectItem = this.trim();
            if (hideMenuObjectItem.length > 0) {
                hideMenuObject[hideMenuObjectItem] = true;
            }
        });
        if (isThisABoolenAndTrue(hideMenuObject[pageIdentifier])) {
            hideMenuButton();
        }
    };

    var setVisibility = function($element, visibility){
        $element.css("visibility", visibility);
    };

    var setDisabled = function($element, disabled){
        $element.prop("disabled", disabled);
    };

    var setDisabledFalse = function($element){
        setDisabled($element, false);
    };

    var setDisabledTrue = function($element){
        setDisabled($element, true);
    };

    var setVisibilityHidden = function($element){
        setVisibility($element, "hidden");
    };

    var setVisibilityVisible = function($element){
        setVisibility($element, "visible");
    };

    var toogleButtonAndMenu = function(isOpen, toggleFn){
        if(isOpen){
            toggleFn();
        }
    };

    var setDisabledTrueAndToogleMenu = function($element, toggleBool, toggleFn){
        setDisabledTrue($element);
        toogleButtonAndMenu(toggleBool, toggleFn);
    };

    var setDisabledFalseAndToogleMenu = function($element, toggleBool, toggleFn){
        setDisabledFalse($element);
        toogleButtonAndMenu(toggleBool, toggleFn);
    };

    var hideMenuButton = function(){
        setDisabledTrueAndToogleMenu($menuButton, isPageMenuOpen, togglePageMenu);
    };

    var hideResourcesButton = function(){
        setDisabledTrueAndToogleMenu($linkButton, isLinkedResourcesMenuOpen, toggleLinkedResources);
    };

    var hideSettingsButton = function(){
        setDisabledTrueAndToogleMenu($settingsButton, isSettingsMenuOpen, toggleSettings);
    };

    var showMenuButton = function(){
        setDisabledFalseAndToogleMenu($menuButton, isPageMenuOpen, togglePageMenu);
    };

    var showResourcesButton = function(){
        var toggleBool = (isLinkedResourcesMenuOpen && isLinkedResourcesOn());
        setDisabledFalseAndToogleMenu($linkButton, toggleBool, toggleLinkedResources);
    };

    var showSettingsButton = function(){
        var toggleBool = (isSettingsMenuOpen && isSettingsMenuOn());
        setDisabledFalseAndToogleMenu($settingsButton, toggleBool, toggleSettings);
    };

    var setSkinClasses = function () {
        var autoHeightSections = skinGlobalSettings.autoHeightSections;
        var autoMinHeight = skinGlobalSettings.autoMinHeight;
        var autoHeight = skinGlobalSettings.autoHeight;
        var customAutoHeight = (autoHeightSections && autoMinHeight.length > 0 && autoHeight.length > 0);
        var showWithMinClass = (customAutoHeight) ? "scr_scrolling_section_showWithCustomMin" : "scr_scrolling_section_showWithMin";
        var autoShrinkSections = skinGlobalSettings.autoShrinkSections;
        var classesObject = {
            scrollingSectionHideClass: "scr_scrolling_section_hide",
            scrollingSectionShowClass: (autoHeightSections) ? showWithMinClass : "scr_scrolling_section_show",
            scrollingSectionVistedClass: (autoShrinkSections) ? "scr_scrolling_section_auto" : "scr_scrolling_section_autoNoAuto"
        };
        skinClasses = classesObject;
    };

    var loadMenu = function(){
        var menuStartsOpen = skinGlobalSettings.menuStartsOpen,
        smcm = getDataValue("smcm"),
        slrm = getDataValue("slrm"),
        sstm = getDataValue("sstm"),
        isOpenOrNotSet = function(data) {
            return (isOpenOnly(data) || data === "");
        },
        isOpenOnly = function(data) {
            return (data == "1");
        },
        is_smcm_on = (menuStartsOpen) ? isOpenOrNotSet(smcm) : isOpenOnly(smcm),
        is_slrm_on = isOpenOnly(slrm),
        is_sstm_on = isOpenOnly(sstm);

        if(!isSmallScreen && !isPageMenuOpen && isMenuInFixedStyle){
            if(is_smcm_on){
                togglePageMenu();
            }
            else if(is_slrm_on){
                toggleLinkedResources();
            }
            else if(is_sstm_on){
                toggleSettings();
            }
        }
    };

    var refreshMenu = function () {
        if (isMenuInFixedStyle) {
            if(isPageMenuOpen){
                renderPageMenu();
            }
            if(isSettingsMenuOpen){
                renderSettingsMenu();
            }
            if(isLinkedResourcesMenuOpen){
                renderLinkedResources();
            }
        }
    };

    var togglePageMenu = function () {
        var currentAriaExpanded = $menuButton.attr("aria-expanded"),
        menuButtonAriaExpanded = (currentAriaExpanded == "true") ? "false" : "true",
        toggleOnClass = (isPageMenuOpen) ? "togglePageMenuOff" : "",
        menuTracking = 0;
        $menuButton.attr("aria-expanded", menuButtonAriaExpanded);
        $menuCloseButton.attr("aria-expanded", menuButtonAriaExpanded);
        if (menuButtonAriaExpanded === "true") {
            isPageMenuOpen = true;
            toggleOnClass = "togglePageMenuOn";
            renderPageMenu();
            $menuCloseButton.focus();
            menuTracking = 1;
        } else {
            isPageMenuOpen = false;
        }
        setDataValue("smcm", menuTracking);
        toggleOff(toggleOnClass);
    };

    var toggleLinkedResources = function () {
        var currentAriaExpanded = $linkButton.attr("aria-expanded"),
        linkButtonAriaExpanded = (currentAriaExpanded == "true") ? "false" : "true",
        toggleOnClass = (isLinkedResourcesMenuOpen) ? "toggleLinkedResourcesOff" : "",
        menuTracking = 0;
        $linkButton.attr("aria-expanded", linkButtonAriaExpanded);
        $linkCloseButton.attr("aria-expanded", linkButtonAriaExpanded);
        if (linkButtonAriaExpanded === "true") {
            isLinkedResourcesMenuOpen = true;
            toggleOnClass = "toggleLinkedResourcesOn";
            renderLinkedResources();
            $linkCloseButton.focus();
            menuTracking = 1;
        } else {
            isLinkedResourcesMenuOpen = false;
        }
        setDataValue("slrm", menuTracking);
        toggleOff(toggleOnClass);
    };

    var toggleSettings = function () {
        var currentAriaExpanded = $settingsButton.attr("aria-expanded"),
        settingsButtonAriaExpanded = (currentAriaExpanded == "true") ? "false" : "true",
        toggleOnClass = (isSettingsMenuOpen) ? "toggleSettingsOff" : "",
        menuTracking = 0;
        $settingsButton.attr("aria-expanded", settingsButtonAriaExpanded);
        $settingsCloseButton.attr("aria-expanded", settingsButtonAriaExpanded);
        if (settingsButtonAriaExpanded === "true") {
            isSettingsMenuOpen = true;
            toggleOnClass = "toggleSettingsOn";
            renderSettingsMenu();
            $settingsCloseButton.focus();
            menuTracking = 1;
        } else {
            isSettingsMenuOpen = false;
        }
        setDataValue("sstm", menuTracking);
        toggleOff(toggleOnClass);
    };

    var toggleOff = function (action) {

        var callTogglePageMenu = false,
        callToggleLinkedResources = false,
        callToggleSettings = false,
        isAction_togglePageMenuOn = (action === "togglePageMenuOn"),
        isAction_togglePageMenuOff = (action === "togglePageMenuOff"),
        isAction_toggleLinkedResourcesOn = (action === "toggleLinkedResourcesOn"),
        isAction_toggleLinkedResourcesOff = (action === "toggleLinkedResourcesOff"),
        isAction_toggleSettingsOn = (action === "toggleSettingsOn"),
        isAction_toggleSettingsOff = (action === "toggleSettingsOff"),
        isAMenuOn = (isPageMenuOpen || isLinkedResourcesMenuOpen || isSettingsMenuOpen),
        bodyClass = "menuExpanded",
        $body = $('body'),
        class_togglePageMenu = "pageMenuExpanded",
        class_toggleLinkedResources = "linkedResourcesMenuExpanded",
        class_toggleSettings = "settingsMenuExpanded",
        class_Add = [],
        class_Remove = [];

        if(isAMenuOn){
            class_Add.push(bodyClass);
        }
        else {
            class_Remove.push(bodyClass);
        }

        if(isAction_togglePageMenuOn){
            class_Add.push(class_togglePageMenu);
            class_Remove.push(class_toggleLinkedResources);
            class_Remove.push(class_toggleSettings);
        }
        
        if(isAction_togglePageMenuOff){
            class_Remove.push(class_togglePageMenu);
        }

        if(isAction_toggleLinkedResourcesOn){
            class_Add.push(class_toggleLinkedResources);
            class_Remove.push(class_togglePageMenu);
            class_Remove.push(class_toggleSettings);
        }

        if(isAction_toggleLinkedResourcesOff){
            class_Remove.push(class_toggleLinkedResources);
        }

        if(isAction_toggleSettingsOn){
            class_Add.push(class_toggleSettings);
            class_Remove.push(class_togglePageMenu);
            class_Remove.push(class_toggleLinkedResources);
        }

        if(isAction_toggleSettingsOff){
            class_Remove.push(class_toggleSettings);
        }

        if(isAction_toggleLinkedResourcesOn || isAction_toggleSettingsOn){
            if(isPageMenuOpen){
                callTogglePageMenu = true;
            }
        }
        if(isAction_togglePageMenuOn || isAction_toggleSettingsOn){
            if(isLinkedResourcesMenuOpen){
                callToggleLinkedResources = true;
            }
        }
        
        if(isAction_togglePageMenuOn || isAction_toggleLinkedResourcesOn){
            if(isSettingsMenuOpen){
                callToggleSettings = true;
            }
        }

        $body.addClass(class_Add.join(" ")).removeClass(class_Remove.join(" "));

        if(callTogglePageMenu){
            togglePageMenu();
        }
        if(callToggleLinkedResources){
            toggleLinkedResources();
        }
        if(callToggleSettings){
            toggleSettings();
        }
    };

    var setupMenuButton = function () {
        var menuButtonGotoPage = skinGlobalSettings.menuButtonGotoPage;
        var menuStyle = skinGlobalSettings.menuStyle;
        var menuButtonAction = togglePageMenu;
        var menuButtonActionArg = "";
        if (menuButtonGotoPage.length > 0) {
            menuButtonAction = SKILLCASTAPI.gotoPageId;
            menuButtonActionArg = menuButtonGotoPage;
        }
        $menuButton.off().on(bindEventTouchClick, function (e) {
            return bindEventHandler(function(){
                e.stopPropagation();
                e.preventDefault();
                menuButtonAction(menuButtonActionArg);
            });
        });
        isMenuStyleFixedLeft = (menuStyle === "fixedLeft");
        isMenuStyleFixedRight = (menuStyle === "fixedRight");
        isMenuInFixedStyle = (isMenuStyleFixedLeft || isMenuStyleFixedRight)
        isSmallScreen = SKILLCASTAPI.isSmallScreen();
    };

    var setupUIButtons = function () {
        $menuButton = $("#menu-btn");
        $menuCloseButton = $("#menuCloseButton");
        $linkButton = $("#link-btn");
        $linkCloseButton = $("#linkCloseButton");
        $settingsButton = $("#set-btn");
        $settingsCloseButton = $("#settingsCloseButton");
        $continueButton = $("#continueButton");
        $nextButton = $("#nextButton");
        $scrollNavTools = $("#scrollNavTools");
        $scrollingResponsiveMenu = $("#scrollingResponsiveMenu");
        $continueButton.on(bindEventTouchClick, function (e) {
            return bindEventHandler(function(){
                e.stopPropagation();
                e.preventDefault();
                $continueButton.prop("disabled", true);
                nextSection();
            });
        });
        $menuCloseButton.on(bindEventTouchClick, function (e) {
            e.stopPropagation();
            e.preventDefault();
            return bindEventHandler(togglePageMenu);
        });

        $linkButton.on(bindEventTouchClick, function (e) {
            e.stopPropagation();
            e.preventDefault();
            return bindEventHandler(toggleLinkedResources);
        });

        $linkCloseButton.on(bindEventTouchClick, function (e) {
            e.stopPropagation();
            e.preventDefault();
            return bindEventHandler(toggleLinkedResources);
        });

        $settingsButton.on(bindEventTouchClick, function (e) {
            e.stopPropagation();
            e.preventDefault();
            return bindEventHandler(toggleSettings);
        });

        $settingsCloseButton.on(bindEventTouchClick, function (e) {
            e.stopPropagation();
            e.preventDefault();
            return bindEventHandler(toggleSettings);
        });

        var paramsRaw = location.search.substring(1);
        var paramsBase = paramsRaw.split("&");
        var paramsObject = {};
        var showModuleOptionalButton = function(buttons){
            var hiddenClass = "moduleUiButtonHidden";
            $.each(buttons, function(){
                var isOn = this.isOn;
                var $buttons = this.buttons;
                $.each($buttons, function(){
                    var hasHiddenClass = this.hasClass(hiddenClass);
                    if(isOn && hasHiddenClass){
                        this.removeClass(hiddenClass);
                    } else {
                        this.hide(0);
                    }
                });
            });

        };
        var optionalButtons = [
            {
                isOn: isLinkedResourcesOn(),
                buttons: [$linkButton, $linkCloseButton]
            },
            {
                isOn: isSettingsMenuOn(),
                buttons: [$settingsButton, $settingsCloseButton]
            }
        ];
        $.each(paramsBase, function () {
            paramsArray = paramsRaw.split("=");
            if (paramsArray.length === 2) {
                paramsObject[paramsArray[0]] = paramsArray[1];
            }
        });
        if (paramsObject.hasOwnProperty("goToSection")) {
            goToSection = paramsObject.goToSection;
        }
        showModuleOptionalButton(optionalButtons);

    }

    var setupUI = function () {
        setupUIButtons();
        setupMenuButton();
        setSkinClasses();
        legacyUIButtons();
    };

    var legacyUIButtons = function () {
        var buttons = $scrollNavTools.find('button');
        if(buttons.length >= 2){
            /* Older content not republished have the close button
            at the start of the nav bar - This is now the last button
            in the nav bar - Added 13/10/2020 RMB */
            moveCloseButton_LegacySupport(buttons[0]);
        }
    };

    var moveCloseButton_LegacySupport = function (button) {
        var btn = $(button),
        id = btn.prop('id');
        if(id === 'close-btn'){
            btn = $(button);
            btn.detach();
            $scrollNavTools.append(btn);
        }
    };

    //Feature pending
    var setElementTypesLookUp = function() {
        var url = skinGlobalSettings.relativePath + "/elementTypes.json";
        $.ajax(url, {
            async: true,
            cache: false,
            method: "GET",
            dataType: "json",
            success: function(data){
                elementTypesLookUp = data;
                elementTypesLookUpDone = true;
            }
        });
    };

    //Feature pending
    var getElementTypesLookUp = function() {
        return{
            ok: elementTypesLookUpDone,
            data: elementTypesLookUp
        };
    };

    var validateGlobalSkinSettings = function () {
        var settingKey, settingValue;
        var skinValidSettings = {};
        var globalSettings = scrollingSkinGlobalSettings || {};

        for (settingKey in scrollingSkinGlobalSettingsFallback) {
            settingValue = scrollingSkinGlobalSettingsFallback[settingKey];
            if (isTypeofMatch(globalSettings[settingKey], settingValue)) {
                settingValue = globalSettings[settingKey];
            } else {
                errors.push("Function validateGlobalSkinSettings - Missing setting: " + settingKey);
            }
            skinValidSettings[settingKey] = settingValue;
        }
        for (settingKey in globalSettings) {
            if (!scrollingSkinGlobalSettingsFallback.hasOwnProperty(settingKey)) {
                errors.push("Function validateGlobalSkinSettings - Not a valid setting: " + settingKey);
            }
        }
        skinGlobalSettings = skinValidSettings;
    };

    var documentReady = function () {

        //Validate Global Skin Settings Arguments
        validateGlobalSkinSettings();

        //get elementTypes Look Up
        //Feature pending
        //setElementTypesLookUp();

        //Set UI Elements
        setupUI();

        //Set Page Tracking Keys
        setPageInfo();

        //Hide Menu By Page Id
        hideMenuButtonByPageId();

        //Set Page Global Section Tracking Data
        setPageTrackingData();

        //Set Page Global Section Setting Data
        setupSectionSettings();

        //Set Page Global Sections
        setupSections();

        //Validate Page Sections
        validateSectionsAndSettings();

        //Handle Errors or Load Skin
        handleErrorsOrLoadSkin();

        //Handle Errors or Load Skin
        loadMenu();
    };

    var publicFunctions = function () {
        var returncFunctions = {
            "debug": debug,
            "refreshMenu": refreshMenu,
            "nextSectionCheck": nextSectionCheck,
            "nextSectionOrPage": nextSectionOrPage,
            "showNextOrContinue": showNextOrContinue,
            "hideNextOrContinue": hideNextOrContinue,
            "debugRunExternalFunction": debugRunExternalFunction,
            "setElementTypesLookUp": setElementTypesLookUp,
            "getElementTypesLookUp": getElementTypesLookUp,
            "getStackTraceLog": getStackTraceLog,
            "addStackTrace": addStackTrace,
            "hideMenuButton": hideMenuButton,
            "hideResourcesButton": hideResourcesButton,
            "hideSettingsButton": hideSettingsButton,
            "showMenuButton": showMenuButton,
            "showResourcesButton": showResourcesButton,
            "showSettingsButton": showSettingsButton
        };
        return returncFunctions;
    };

    var setupAPI = function () {
        var check = window.hasOwnProperty("SKILLCASTSCROLLINGAPI");
        if(!check){
            window["SKILLCASTSCROLLINGAPI"] = publicFunctions();
        }
    };

    var initialize = function () {
        $(document).ready(documentReady);
    };
    setupAPI();
    return initialize();
};