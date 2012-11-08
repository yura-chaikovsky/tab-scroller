
TabScroller
============

@version: 1.0

@author: Yura Chaikovsky


### Usage example

<pre>
$('#tabs')
    // Init plugin
    .tabscroller({width:600, height:400})
 
    // Focus tab, identifier can be 0-based index, #id or DOM element
    .tabscroller('focus',4)
 
    // Bind event on changing focus. Changing focus can be caused by
    // clicking on tab panel, hovering tab, or setting focus into input
    // inside the tab.
    .bind('focuschange', function(){console.log(arguments)})
 </pre>
 
### Configurations

<table>
    <tr>
        <th width="130">Option</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>width</td>
        <td>
            Width of the tab section. Can be any proper css width value. Default: auto.
        </td>
    </tr>
    <tr>
        <td>height</td>
        <td>
            Height of the tab section. Can be any proper css height value. Default: auto.
        </td>
    </tr>
    <tr>
        <td>highlighterAnimation</td>
        <td>
            Configuration object for jQuery's animate function. See http://api.jquery.com/animate/ for details.
            Used for animation navigation highlighter.
        </td>
    </tr>
    <tr>
        <td>tabAnimation</td>
        <td>
            Configuration object for jQuery's animate function. See http://api.jquery.com/animate/ for details.
            Used for tab scroling animation.
        </td>
    </tr>
</table>

### Events
<table>
    <tr>
        <th width="130">Event</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>focuschange</td>
        <td>
            Changing focus event will fire on clicking on tab panel, 
            hovering tab, or setting focus into any input inside the tab.
        </td>
    </tr>
</table>
 
### Methods
<table>
    <tr>
        <th width="130">Method</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>init</td>
        <td>
            Initiate plugin on DOM. Can be done only once until it be destroyed. DOM structure should be
            like for jQueryUI tabs plugin, see http://jqueryui.com/demos/tabs/ for details.
        </td>
    </tr>
    <tr>
        <td>destroy</td>
        <td>
            Destroy all changes done by plugin: return DOM to initial state, remove background data,
            unbind plugin's events.
        </td>
    </tr>
    <tr>
        <td>focus</td>
        <td>
            Set focus to tab's item in menu and scroll to it's DOM. Identifier can be 0-based index
            #id of tab object DOM element.
        </td>
    </tr>
</table>