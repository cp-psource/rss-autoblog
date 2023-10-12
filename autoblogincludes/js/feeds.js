jQuery(function($) {
    $(document).ready(function() {
        var file_frame;

        $('select.blog').on('change', function() {
            var blog = $(this).val();
            var postbox = $(this).closest('div.postbox');

            if (blog != '') {
                postbox.find('select.author, select.altauthor, select.cat').html('<option value="">Loading...</option>');

                $.getJSON(ajaxurl, { action: 'autoblog-get-blog-authors', id: blog, nocache: new Date().getTime() }, function(ret) {
                    var authorOptions = "";
                    $.each(ret.data, function(index, author) {
                        authorOptions += `<option value="${author.user_id.toLowerCase()}">${author.user_login}</option>`;
                    });
                    postbox.find('select.altauthor').html(authorOptions);
                    authorOptions = '<option value="0">Use feed author</option>' + authorOptions;
                    postbox.find('select.author').html(authorOptions);
                });

                $.getJSON(ajaxurl, { action: 'autoblog-get-blog-categories', id: blog, nocache: new Date().getTime() }, function(ret) {
                    var catOptions = "";
                    $.each(ret.data, function(index, cat) {
                        catOptions += `<option value="${cat.term_id.toLowerCase()}">${cat.name}</option>`;
                    });
                    postbox.find('select.cat').html(catOptions);
                });
            }
        });

        $('#abtble_posttype').on('change', function() {
            var post_type = $(this).val();

            $('#abtble_feedcatsare option').each(function() {
                var $this = $(this);
                var objects = $this.data('objects');

                if (objects) {
                    if (objects.split(',').indexOf(post_type) < 0) {
                        $this.prop('disabled', true);
                    } else {
                        $this.prop('disabled', false);
                    }
                }
            });

            $("#abtble_feedcatsare").val($('#abtble_feedcatsare option[value]:not(:disabled):first').val());
        });

        $('#featureddefault_select').on('click', function(e) {
            e.preventDefault();

            if (file_frame) {
                file_frame.open();
                return;
            }

            file_frame = wp.media.frames.file_frame = wp.media({
                title: autoblog.fileframe.title,
                button: { text: autoblog.fileframe.button },
                multiple: false
            });

            file_frame.on('select', function() {
                var attachment = file_frame.state().get('selection').first().toJSON();
                var td = $(this).closest('td');

                td.find('input').val(attachment.id);
                td.find('img').attr('src', attachment.url);
            });

            file_frame.open();
        });

        $('#featureddefault_delete').on('click', function() {
            var td = $(this).closest('td');

            td.find('input').val('');
            td.find('img').attr('src', '');
        });
    });
});