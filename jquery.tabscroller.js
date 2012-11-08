/***
* @title: TabScroller
*
* @version: 1.0
*
* @author: Yura Chaikovsky
*
* @exampleJS:
* $('#tabs')
*      // Init plugin
*      .tabscroller({width:600, height:400})
*
*      // Focus tab, identifier can be 0-based index, #id or DOM element
*      .tabscroller('focus',4)
*
*      // Bind event on changing focus. Changing focus can be caused by
*      // clicking on tab panel, hovering tab, or setting focus into input
*      // inside the tab.
*      .bind('focuschange', function(){console.log(arguments)})
*
*
* @config
* |----------------------------------------------------------------------|
* | Option               |  Description                                  |
* |----------------------|-----------------------------------------------|
* | width                | Width of the tab section. Can be any proper   |
* |                      | css width value. Default: auto.               |
* |----------------------|-----------------------------------------------|
* | height               | Height of the tab section. Can be any proper  |
* |                      | css height value. Default: auto.              |
* |----------------------|-----------------------------------------------|
* | highlighterAnimation | Configuration object for jQuery's animate     |
* |                      | function. See http://api.jquery.com/animate/  |
* |                      | for details. Used for animation navigation    |
* |                      | highlighter.                                  |
* |----------------------|-----------------------------------------------|
* | tabAnimation         | Configuration object for jQuery's animate     |
* |                      | function. See http://api.jquery.com/animate/  |
* |                      | for details. Used for tab scrolling animation.|
* |----------------------------------------------------------------------|
*
*
* @events
* |----------------------------------------------------------------------|
* | Event                |  Description                                  |
* |----------------------|-----------------------------------------------|
* | focuschange          | Changing focus can be caused by clicking on   |
* |                      | tab panel, hovering tab, or setting focus     |
* |                      | into input inside the tab.                    |
* |----------------------|-----------------------------------------------|
*
*
* @methods
* |----------------------------------------------------------------------|
* | Method               |  Description                                  |
* |----------------------|-----------------------------------------------|
* | init                 | Initiate plugin on DOM. Can be done only once |
* |                      | until it be destroyd. DOM structure should be |
* |                      | like for jQueryUI tabs plugin, see            |
* |                      | http://jqueryui.com/demos/tabs/               |
* |----------------------|-----------------------------------------------|
* | destroy              | Destrou all changes done by plugin: return    |
* |                      | DOM to initial state, remove background data, |
* |                      | unbind plugin's events                        |
* |----------------------|-----------------------------------------------|
* | focus                | Set focus to tab's item in menu and scroll to |
* |                      | it's DOM. Identifier can be                   |
* |                      |  * 0-based index                              |
* |                      |  * #id of tab object                          |
* |                      |  * DOM element                                |
* |----------------------|-----------------------------------------------|
*
***/
;
(function( $ ){

    var _plugin = {
        'name'                  :       'tabscroller',
        'version'               :       1.0
    };

    var _events = {
        'focuschange'           :       'focuschange'
    };

    var _defaultConfig = {
        'width'                 :       'auto',
        'height'                :       'auto',
        'highlighterAnimation'  :       {'duration' : 800, 'easing' : 'easeInOutExpo'},
        'tabAnimation'          :       {'duration' : 800, 'easing' : 'swing'}
    };

    var _classes = {
        'pluginObject'          :       'ui-tabscroller',
        'tabWrapper'            :       'ui-tabscroller-tabwrapper',
        'tabMenu'               :       'ui-tabscroller-tabmenu',
        'tab'                   :       'ui-tabscroller-tab',
        'highlighter'           :       'ui-tabscroller-highlighter'
    };

    var _selectors = {
        'inputs'                :       'input, textarea, select, a',
        'tabs'                  :       'div',
        'tabMenu'               :       'ul',
        'tabMenuItems'          :       'li',
        'tabMenuItemsLink'      :       'a',
        'tabMenuFirstItem'      :       'ul > li:first'
    }

    var _methods = {
        init : function(config) {
            config = $.extend(_defaultConfig, config);

            return this.each(function(){
                var $this = $(this),
                    data  = $this.data(_plugin.name);

                if(!data){
                    var highlighter = $('<div />');

                    $this
                        .data(_plugin.name, {'config' : config})
                        .addClass(_classes.pluginObject)
                        .css({'width' : config.width, 'height' : config.height})
                        .bind(_events.focuschange + '.' + _plugin.name, _handlers.tabscrollerFocus)
                        .children(_selectors.tabs)
                            .addClass(_classes.tab)
                            .wrapAll($('<div />').addClass(_classes.tabWrapper))
                            .bind('mouseenter.' + _plugin.name, _handlers.tabFocus)
                            .find(_selectors.inputs)
                                .bind('focus.' + _plugin.name, _handlers.inputFocus)
                                .end()
                            .end()
                        .prepend(highlighter)
                        .children(_selectors.tabMenu)
                            .addClass(_classes.tabMenu)
                            .children(_selectors.tabMenuItems)
                                .css('width', Math.floor(100 / $this.find('.' + _classes.tabWrapper + ' > *').size()) + '%')
                                .children(_selectors.tabMenuItemsLink)
                                    .bind('click.' + _plugin.name, _handlers.menuItemClick)
                    ;
                    highlighter
                        .addClass(_classes.highlighter)
                        .css({'width'  : $this.children(_selectors.tabMenuFirstItem).css('width'),
                              'height' : $this.children(_selectors.tabMenuFirstItem).height()})
                    ;
                }
            });
        },
        destroy : function( ) {
            return this.each(function(){
                $(this)
                    .removeData(_plugin.name)
                    .removeClass(_classes.pluginObject)
                    .children('.' + _classes.highlighter)
                        .remove()
                        .end()
                    .children('.' + _classes.tabWrapper)
                        .children()
                            .removeClass(_classes.tab)
                            .unwrap()
                            .end()
                        .end()
                    .children('.' + _classes.tabMenu)
                        .removeClass(_classes.tabMenu)
                        .children(_selectors.tabMenuItems)
                            .css('width', 'auto')
                ;
                $(window).unbind('.' + _plugin.name);
            });
        },
        focus : function(tab) {
            return this.each(function(){
                var $tab;
                switch(typeof tab){
                    case 'number' :
                        $tab = $(this).children('.' + _classes.tabWrapper).children(':eq(' + tab + ')');
                        break;
                    case 'string' :
                        $tab = $(this).find('.' + _classes.tabWrapper + ' > [id=\'' + tab + '\']');
                        break;
                    case 'object' :
                        $tab = $(tab);
                }
                _scrollToTab.call(this, $tab);
            });
        }
    };

    var _handlers = {
        'tabscrollerFocus'  :   function(event, $tab){
                                    _highlighteMenuItem.call(this, $tab);
                                },
        'tabFocus'          :   function(){
                                    $(this)
                                        .parents('.' + _classes.pluginObject)
                                        .triggerHandler(_events.focuschange, [$(this)]);
                                },
        'inputFocus'        :   function(){
                                    var $this = $(this);
                                    setTimeout(function(){
                                        $this
                                            .parents('.' + _classes.pluginObject)
                                            .triggerHandler(_events.focuschange, [$this.parents('.' + _classes.tab)]);
                                    }, 200);
                                },
        'menuItemClick'     :   function(){
                                    _methods.focus.call($(this).parents('.' + _classes.pluginObject), $(this).attr('href').replace('#',''));
                                    return false;
                                }
    }

    var _highlighteMenuItem = function($tab){
        var $tabscroller = $(this),
            $highlighter = $tabscroller.children('.' + _classes.highlighter),
            $menuItem = $tabscroller.find('.' + _classes.tabMenu + ' [href=\'#' + $tab.attr('id') + '\']'),
            data = $(this).data(_plugin.name),
            position = $menuItem.position();
        $highlighter
            .stop()
            .animate({
                'top'  : position.top,
                'left' : ( position.left / $tabscroller.width() * 100) + '%'
            }, data.config.highlighterAnimation.duration, data.config.highlighterAnimation.easing);
    }

    var _scrollToTab = function($tab){
        var data = $(this).data(_plugin.name);
        var $tabWrapper = $(this).children('.' + _classes.tabWrapper);
        $tabWrapper
            .animate({
                scrollTop: ($tab.position().top + $tabWrapper.scrollTop())
            }, data.config.tabAnimation.duration, data.config.tabAnimation.easing);
        $(this).triggerHandler(_events.focuschange, [$tab]);
    }

    $.fn[_plugin.name] = function(method) {
        if (_methods[method]){
            return _methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method) {
            return _methods.init.apply(this, arguments);
        }else{
            $.error('Method ' + method + ' does not exist on jQuery.' + _plugin.name + '.');
        }
    };

})( jQuery );