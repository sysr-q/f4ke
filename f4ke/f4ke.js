$(function () {
    /**
     * Replaces HTML with human readable values,
     * making it easier for the user to edit.
     */
     function editable_before(value, settings) {
        var lines = value.split('<br>'),
        retval = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            line = line.replace(/\<span class="quote"\>(?:&gt;|>)([^<]+)\<\/span\>/, ">$1");
            retval.push(line);
        }
        return $('<div />').html(retval.join("\n")).text();
    }

    /**
     * Replaces human readable vals with
     * required HTML.
     * Mainly for green text quotes
     */
     function editable_ret(value, settings) {
        var lines = value.split('\n'),
        retval = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (settings.name == "editable_text") {
                // Since this is for text boxes, we're going to apply
                // blockquote replacement. Greentext, mostly.
                line = line.replace(/^\>(.+)/, '<span class="quote">&gt;$1</span>');
            }
            retval.push(line);
        }
        return retval.join("<br>");
    }

    $('.editable:not(.editable_text)').editable(editable_ret, {
        tooltip: "Click to edit...",
        cssclass: "edit-text",
        onblur: "submit",
        data: editable_before,
        name: "editable",
    });
    $('.editable_text').editable(editable_ret, {
        tooltip: "Click to edit...",
        type: "textarea",
        cssclass: "edit-text",
        onblur: "submit",
        data: editable_before,
        name: "editable_text",
    });

    $('.editable').editable('disable');

    // For le debugging.
    $('.sortable li:last-child').clone().appendTo($('.sortable'));
    $('.sortable').sortable({
        items: ':not(.disabled)',
        forcePlaceholderSize: true
    });

    $('#edit-enable').click(edit_enable);
    $('#edit-disable').click(edit_disable);
    $('#header').click(function () {
        /** /
        var new_height = (-$(this).height() + ($('#edit-enable').height() + 14));
        var tp = $(this).css('top') == '0px' ? new_height + 'px' : '0px';
        $(this).animate({top:tp}, 1000, function () {
            $(this).toggleClass('collapsed');
        });
        /**/
        $('#header .content').slideToggle();
    });
});

function edit_disable() {
    $('.editable').editable('disable');
    $('.editable').each(function () {
        $(this).toggleClass('highlight', !$(this).data('disabled.editable'));
    });
    return false;
}

function edit_enable() {
    $('.editable').editable('enable');
    $('.editable').each(function () {
        $(this).toggleClass('highlight', !$(this).data('disabled.editable'));
    });
    return false;
}