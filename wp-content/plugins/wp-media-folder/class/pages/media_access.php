<div class="content-box content-wpmf-media-access">
    <div class="cboption">
        <h3 class="title"><?php _e('Access management', 'wpmf'); ?></h3>
        <p><input data-label="wpmf_folder_option1" type="checkbox" name="cb_option_1" class="cb_option" id="cb_option_1" <?php if ($option1 == 1) echo 'checked' ?> value="<?php echo @$option1 ?>">
            <?php _e('Auto create one folder per editor', 'wpmf'); ?></p>

        <p><input data-label="wpmf_active_media" type="checkbox" name="cb_option_active_media" class="cb_option" id="cb_option_active_media" <?php if ($wpmf_active_media == 1) echo 'checked' ?> value="<?php echo @$wpmf_active_media ?>">
            <?php _e('Show only own user media (an option will be added for admin in the media manager)', 'wpmf'); ?>
        </p>

        <input type="hidden" name="wpmf_folder_option1" value="<?php echo $option1; ?>">
        <input type="hidden" name="wpmf_active_media" value="<?php echo $wpmf_active_media; ?>">
    </div>
</div>
