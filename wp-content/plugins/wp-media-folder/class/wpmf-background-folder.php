<?php

class Wpmf_Background_Folder{
    
    function __construct() {
        add_action( 'admin_enqueue_scripts', array($this, 'wpmf_load_custom_wp_admin_script') );
        add_filter("attachment_fields_to_edit", array($this, "wpmf_attachment_fields_to_edit"), 10, 2);
        add_filter("attachment_fields_to_save", array($this, "wpmf_attachment_fields_to_save"), 10, 2);
        add_action('wp_ajax_wpmf_get_option_bg', array($this,'wpmf_get_option_bg'));
    }
    
    public function wpmf_load_custom_wp_admin_script() {
        global $pagenow,$current_screen;
        if($current_screen->base != 'settings_page_option-folder' && $pagenow != 'media-new.php'){
            wp_register_script('wpmf-bg_folder', plugins_url( '/assets/js/wpmf-background-folder.js', dirname(__FILE__) ),array('plupload'),WPMF_VERSION);
            wp_enqueue_script('wpmf-bg_folder');
        }
    }
    
    
    function wpmf_attachment_fields_to_edit($form_fields, $post) {
        global $pagenow;
        if($pagenow != 'post.php'){
            $current_folder = get_the_terms($post, 'wpmf-category');
            if(!empty($current_folder) && substr($post->post_mime_type, 0, 5) == 'image'){
                $option_bgfolder = get_option('wpmf_field_bgfolder');
                $form_fields['wpmf_field_bgfolder'] = array(
                    "label" => __('Folder cover','wpmf'),
                    "input" => "html",
                    'html'  => '<input type="checkbox" class="wpmf_field_bgfolder" id="attachments-'.$post->ID.'-wpmf_field_bgfolder" name="attachments['.$post->ID.'][wpmf_field_bgfolder]">'
                );
            }
        }
        
        return $form_fields;
    }
    
    function wpmf_attachment_fields_to_save($post, $attachment) {
        $option_bgfolder = get_option('wpmf_field_bgfolder');
        if(empty($option_bgfolder)){
            $option_bgfolder = array();
        }
        
        if (isset($attachment['wpmf_field_bgfolder']) && $attachment['wpmf_field_bgfolder'] == 'on') {
            $image_thumb = wp_get_attachment_image_src($post['ID'], 'thumbnail' );
            $option_bgfolder[$_SESSION['wpmf-current-folder']] = array($post['ID'],$image_thumb[0]);
        }else{
            unset($option_bgfolder[$_SESSION['wpmf-current-folder']]);
        }
        
	update_option('wpmf_field_bgfolder', $option_bgfolder);	
        return $post;
    }
    
    function wpmf_get_option_bg(){
        $option_bgfolder = get_option('wpmf_field_bgfolder');
        if(!empty($option_bgfolder) && !empty($option_bgfolder[$_SESSION['wpmf-current-folder']])){
            wp_send_json($option_bgfolder[$_SESSION['wpmf-current-folder']][0]);
        }else{
            wp_send_json(false);
        }
    }
}
?>