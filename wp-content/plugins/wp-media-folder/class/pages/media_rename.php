<div class="content-box content-wpmf-media-rename">
    <div class="cboption" style="margin: 10px;">
        <p>
            <input data-label="wpmf_media_rename" type="checkbox" name="wpmf_media_rename" class="cb_option" <?php if ($wpmf_media_rename == 1) echo 'checked' ?> value="<?php echo @$wpmf_media_rename ?>">
            <?php _e('Activate media rename on upload', 'wpmf'); ?>
        </p>

        <p>
            <label><?php _e('Patern' , 'wpmf') ?></label>
            <input type="text" name="wpmf_patern" id="wpmf_patern" class="regular-text" value="<?php echo $wpmf_patern; ?>">
        </p>
        <p class="description"><?php _e('Tag avaiable: {sitename} - {foldername} - {date} - {original name}' , 'wpmf') ?></p>
        <p class="description"><?php _e('Note: # will be replaced by increasing numbers' , 'wpmf') ?></p>
        <input type="hidden" name="wpmf_media_rename" value="<?php echo $wpmf_media_rename; ?>">
    </div>
</div>