(function ($) {
    $(document).ready(function () {
        if(typeof wp != "undefined"){
            if ( wp.media && $('body.upload-php table.media').length===0 ) {
                myMediaAttachmentCompat = wp.media.view.AttachmentCompat;
                wp.media.view.AttachmentCompat = wp.media.view.AttachmentCompat.extend({
                    render: function () {
                        myMediaAttachmentCompat.prototype.render.apply(this, arguments);
                        var $this = this;
                        var idimg = this.model.id;
                        if ($('.compat-field-wpmf_field_bgfolder').length === 0) {
                            $.ajax({
                                url: ajaxurl,
                                method: 'POST',
                                dataType: 'json',
                                data: {
                                    action: 'wpmf_get_option_bg',
                                },
                                success: function (res) {
                                    if (res && res == idimg) {
                                        $('#attachments-' + idimg + '-wpmf_field_bgfolder').prop('checked', true);
                                    } else {
                                        $('#attachments-' + idimg + '-wpmf_field_bgfolder').prop('checked', false);
                                    }
                                }

                            });
                        }
                    }
                });
            }
        }
    });
}(jQuery));