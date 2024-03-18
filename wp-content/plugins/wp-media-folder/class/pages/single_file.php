<div class="content-box content-wpmf-single-file">
    <div class="cboption">
        <p><input data-label="wpmf_option_singlefile" type="checkbox" class="cb_option" <?php if ($option_singlefile == 1) echo 'checked' ?> value="<?php echo @$option_singlefile ?>">
            <?php _e('Enable single file design', 'wpmf') ?>
        </p>
        <p class="description"><?php _e('Apply single file design with below parameters when insert file to post / page','wpmf'); ?></p>
        <input type="hidden" name="wpmf_option_singlefile" value="<?php echo $option_singlefile; ?>">
    </div>
    <hr class="wpmf_setting_line">
    <div class="wpmf_group_color">
        <div class="wpmf_group_singlefile">
            <label class="control-label" for="singlebg"><?php _e('Background color', 'wpms') ?></label>
            <input name="wpmf_color_singlefile[bgdownloadlink]" type="text" value="<?php echo $wpmf_color_singlefile->bgdownloadlink ?>" class="inputbox input-block-level wp-color-field-bg wp-color-picker">
        </div>

        <div class="wpmf_group_singlefile">
            <label class="control-label" for="singlebg"><?php _e('Hover color', 'wpms') ?></label>
            <input name="wpmf_color_singlefile[hvdownloadlink]" type="text" value="<?php echo $wpmf_color_singlefile->hvdownloadlink ?>" class="inputbox input-block-level wp-color-field-hv wp-color-picker">
        </div>

        <div class="wpmf_group_singlefile">
            <label class="control-label" for="singlebg"><?php _e('Font color', 'wpms') ?></label>
            <input name="wpmf_color_singlefile[fontdownloadlink]" type="text" value="<?php echo $wpmf_color_singlefile->fontdownloadlink ?>" class="inputbox input-block-level wp-color-field-font wp-color-picker">
        </div>

        <div class="wpmf_group_singlefile">
            <label class="control-label" for="singlebg"><?php _e('Hover font color', 'wpms') ?></label>
            <input name="wpmf_color_singlefile[hoverfontcolor]" type="text" value="<?php echo $wpmf_color_singlefile->hoverfontcolor ?>" class="inputbox input-block-level wp-color-field-hvfont wp-color-picker">
        </div>
    </div>

</div>

<?php
    wp_enqueue_style('wp-color-picker');
    wp_enqueue_script('wp-color-picker');
?>