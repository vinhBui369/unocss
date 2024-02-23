<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');

/**
 * Class WpmfFolderAccess
 */
class WpmfFolderAccess
{
    /**
     * WpmfFolderAccess constructor.
     */
    public function __construct()
    {
        add_action('init', array($this, 'createUserFolder'));
        add_filter('wp_generate_attachment_metadata', array($this, 'autoAddAttachmentToFolder'), 10, 2);
    }

    /**
     * Create user folder
     *
     * @return void
     */
    public function createUserFolder()
    {
        // insert term when user login and enable option 'Display only media by User/User'
        global $current_user;
        $user_roles = $current_user->roles;
        $role = array_shift($user_roles);
        /**
         * Filter check capability of current user when create user folder
         *
         * @param boolean The current user has the given capability
         * @param string  Action name
         *
         * @return boolean
         *
         * @ignore Hook already documented
         */
        $wpmf_capability = apply_filters('wpmf_user_can', current_user_can('upload_files'), 'create_user_folder');
        if (($role !== 'administrator' && $wpmf_capability) || $role === 'employer') {
            $wpmf_create_folder = get_option('wpmf_create_folder');
            if ($wpmf_create_folder === 'user') {
                $slug       = sanitize_title($current_user->data->user_login) . '-wpmf';
                $check_term = get_term_by('slug', $slug, WPMF_TAXO);
                if (empty($check_term)) {
                    $parent = $this->getUserParentFolder();
                    $inserted = wp_insert_term(
                        $current_user->data->user_login,
                        WPMF_TAXO,
                        array('parent' => $parent, 'slug' => $slug)
                    );
                    if (!is_wp_error($inserted)) {
                        wp_update_term($inserted['term_id'], WPMF_TAXO, array('term_group' => $current_user->data->ID));
                    }
                }
            } elseif ($wpmf_create_folder === 'role') {
                $slug       = sanitize_title($role) . '-wpmf-role';
                $check_term = get_term_by('slug', $slug, WPMF_TAXO);
                if (empty($check_term)) {
                    wp_insert_term($role, WPMF_TAXO, array('parent' => 0, 'slug' => $slug));
                }
            }
        }
    }

    /**
     * Auto add attachment to folder
     *
     * @param array   $data    Meta data
     * @param integer $post_id Attachment ID
     *
     * @return array
     */
    public function autoAddAttachmentToFolder($data, $post_id)
    {
        $active_media = get_option('wpmf_active_media');
        if (isset($active_media) && (int) $active_media === 1) {
            $wpmf_create_folder = get_option('wpmf_create_folder');
            if ($wpmf_create_folder === 'user') {
                global $wpdb, $current_user;
                if (!empty($current_user->ID)) {
                    $user_login = $current_user->data->user_login;
                    $user_roles = $current_user->roles;
                    $role = array_shift($user_roles);
                    if ($role === 'employer') {
                        $parent = $this->getUserParentFolder();
                        $user_folder = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . $wpdb->terms . ' as t INNER JOIN ' . $wpdb->term_taxonomy . ' AS tt ON tt.term_id = t.term_id WHERE t.name = %s AND t.term_group = %d AND tt.parent = %d AND tt.taxonomy = %s', array($user_login, (int) $current_user->ID, (int) $parent, WPMF_TAXO)));
                        if (!empty($user_folder)) {
                            wp_set_object_terms($post_id, $user_folder->term_id, WPMF_TAXO, true);
                        }
                    }
                }
            }
        }

        return $data;
    }

    /**
     * Get user parent folder
     *
     * @return integer|mixed|void
     */
    public function getUserParentFolder()
    {
        $wpmf_checkbox_tree = get_option('wpmf_checkbox_tree');
        $parent = 0;
        if (!empty($wpmf_checkbox_tree)) {
            $current_parrent = get_term($wpmf_checkbox_tree, WPMF_TAXO);
            if (!empty($current_parrent)) {
                $parent = $wpmf_checkbox_tree;
            }
        }

        return $parent;
    }
}
