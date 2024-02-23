<div class="tab-header">
    <div class="wpmf-tabs">
        <div class="wpmf-tab-header active" data-label="wpmf-general" ><?php _e('General', 'wpmf'); ?></div>
        <div class="wpmf-tab-header" data-label="wpmf-gallery" ><?php _e('Gallery', 'wpmf'); ?></div>
        <div class="wpmf-tab-header" data-label="wpmf-media-access" ><?php _e('Media access', 'wpmf'); ?></div>
        <?php if(current_user_can('edit_files')): ?>
        <div class="wpmf-tab-header" data-label="wpmf-ftp-import" ><?php _e('FTP import', 'wpmf'); ?></div>
        <?php endif; ?>
        <div class="wpmf-tab-header" data-label="wpmf-single-file" ><?php _e('Single file', 'wpmf'); ?></div>
        <div class="wpmf-tab-header" data-label="wpmf-media-remove" ><?php _e('Remove folder','wpmf'); ?></div>
        <div class="wpmf-tab-header" data-label="wpmf-media-rename" ><?php _e('Media rename', 'wpmf'); ?></div>
    </div>
</div>