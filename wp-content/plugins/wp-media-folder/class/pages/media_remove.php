<div class="content-box content-wpmf-media-remove content-active">
    <div class="cboption">
        <h3 class="title"><?php _e('Remove a folder with its media', 'wpmf'); ?></h3>
        <p><input data-label="wpmf_option_media_remove" type="checkbox" name="cb_option_media_remove" class="cb_option" id="cb_option_media_remove" <?php if ($option_media_remove == 1) echo 'checked' ?> value="<?php echo @$option_media_remove ?>">
            <?php _e('Remove a folder with its media', 'wpmf') ?>
        </p>
        <p class="description"><?php _e('When you remove a folder all media inside will also be removed if this option is activated. Use with caution.', 'wpmf'); ?></p>
    </div>
    <input type="hidden" name="wpmf_option_media_remove" value="<?php echo $option_media_remove; ?>">
</div>