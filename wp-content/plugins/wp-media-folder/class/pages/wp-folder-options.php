<h2><?php _e('Media Folder Settings','wpmf') ?></h2>
<form name="form1" id="form_list_size" action="" method="post">
    <?php
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/menus.php';
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/general.php';
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/media_access.php';
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/gallery.php';
        if(current_user_can('edit_files')){
            require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/ftp_import.php';
        }
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/single_file.php';
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/media_remove.php';
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/media_rename.php';
        require_once WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/submit_button.php';
    ?>
</form>

<script>
    
    (function( $ ) {
        $(function() {
            jQuery('.wp-color-field-bg').wpColorPicker({width: 180 , defaultColor: '#444444'});
            jQuery('.wp-color-field-hv').wpColorPicker({width: 180 , defaultColor: '#888888'});
            jQuery('.wp-color-field-font').wpColorPicker({width: 180 , defaultColor: '#ffffff'});
            jQuery('.wp-color-field-hvfont').wpColorPicker({width: 180 , defaultColor: '#ffffff'});
        });
    })( jQuery );

</script>