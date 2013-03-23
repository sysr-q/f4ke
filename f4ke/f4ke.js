function new_post(is_op) {
    is_op = is_op || false;
    var $made_post = $('<li />');
    var $container = $('<div class="postContainer" />'),
        $post = $('<div class="post" />');
    if (is_op) {
        $made_post.addClass('disabled op');
        $container.addClass('opContainer');
        $post.addClass('op');
    }
    $made_post.append($container);
    $container.append($post);
    return $made_post;
}

$(function () {
    if(supportsLocalStorage()) {
        if ('is_visible' in localStorage) {
            var visible = (localStorage['is_visible'] == "true");
            $('#header .content').toggle(visible);
        }
    }

    $('.delete-btn').toggle();

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

    $('.sortable').sortable({
        items: ':not(.fileThumb):not(.disabled)',
        forcePlaceholderSize: true
    });

    $('.editable').editable('disable');
    $('.sortable').sortable('disable');

    // Blanket catch all edit buttons so they won't expand the header.
    $('#edit-buttons button').click(function () { return false; });

    $('#edit-toggle').click(function () {
        if ($(this).hasClass('green')) {
            $(this).toggleClass('green').toggleClass('red');
            edit_enable();
        } else {
            $(this).toggleClass('red').toggleClass('green');
            edit_disable();
        }
        return false;
    });

    $('#edit-move').click(function() {
        $('.delete-btn').toggle();
        if ($(this).hasClass('green')) {
            $(this).toggleClass('green').toggleClass('red');
            $('.sortable').sortable('enable');
        } else {
            $(this).toggleClass('red').toggleClass('green');
            $('.sortable').sortable('disable');
        }
    });

    $('#edit-new-post').click(function () {
        $('#f4ke-posts').append(new_post());
    });

    $('#header').click(function () {
        $('#header .content').slideToggle(function () {
            if (supportsLocalStorage()) {
                var visible = $('#header .content').is(':visible');
                localStorage['is_visible'] = visible;
            }
        });
    });

    //$('#trash-can').sortable();
});

/* No point in including Modernizr for this alone. */
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

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