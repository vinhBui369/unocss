<?php
namespace Joomunited\WPMediaFolder;

/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
/**
 * Class WpmfHelper
 * This class that holds most of the main functionality for Media Folder.
 */
class WpmfHelper
{
    /**
     * User full access ID
     *
     * @var array
     */
    public static $user_full_access_id = array();

    /**
     * Load import Enhanced Media Library categories script
     *
     * @param array $eml_categories Enhanced Media Library categories list
     *
     * @return void
     */
    public static function loadImportEmlScript($eml_categories)
    {
        global $pagenow;
        $attachment_terms_order = array();
        $attachment_terms[]       = array(
            'id'        => 0,
            'label'     => esc_html__('Media Library', 'wpmf'),
            'slug'      => '',
            'parent_id' => 0
        );
        $attachment_terms_order[] = '0';
        foreach ($eml_categories as $eml_category) {
            $attachment_terms[$eml_category->term_id] = array(
                'id'            => $eml_category->term_id,
                'label'         => $eml_category->name,
                'slug'          => $eml_category->slug,
                'parent_id'     => $eml_category->parent,
                'depth'         => $eml_category->depth
            );
            $attachment_terms_order[] = $eml_category->term_id;
        }

        $vars            = array(
            'categories'       => $attachment_terms,
            'categories_order' => $attachment_terms_order,
            'ajaxurl'               => admin_url('admin-ajax.php'),
            'pagenow'          => $pagenow,
            'wpmf_nonce'            => wp_create_nonce('wpmf_nonce')
        );

        wp_enqueue_style(
            'wpmf-mdl',
            WPMF_PLUGIN_URL . 'assets/css/modal-dialog/mdl-jquery-modal-dialog.css',
            array(),
            WPMF_VERSION
        );

        wp_enqueue_style(
            'wpmf-deep_orange',
            WPMF_PLUGIN_URL . 'assets/css/modal-dialog/material.deep_orange-amber.min.css',
            array(),
            WPMF_VERSION
        );

        wp_enqueue_script(
            'wpmf-mdl',
            WPMF_PLUGIN_URL . 'assets/js/modal-dialog/mdl-jquery-modal-dialog.js',
            array('jquery'),
            WPMF_VERSION
        );

        wp_enqueue_style(
            'wpmf-notice-style',
            WPMF_PLUGIN_URL . 'assets/css/notice_style.css',
            array(),
            WPMF_VERSION
        );

        wp_enqueue_script(
            'wpmf-import-eml',
            WPMF_PLUGIN_URL . 'assets/js/imports/import_eml.js',
            array('jquery'),
            WPMF_VERSION
        );

        $params = array('l18n' => array(
            'import_all_label' => esc_html__('Import All', 'wpmf'),
            'import_selected_label' => esc_html__('Import selected', 'wpmf'),
            'cancel_label' => esc_html__('Cancel', 'wpmf'),
            'eml_label_dialog' => esc_html__('Import categories from Enhanced Media Library plugin', 'wpmf')
        ), 'vars' => $vars);
        wp_localize_script('wpmf-import-eml', 'import_eml_objects', $params);
    }

    /**
     * Check user full access
     *
     * @return boolean
     */
    public static function checkUserFullAccess()
    {
        global $current_user;
        $wpmf_active_media = get_option('wpmf_active_media');
        $user_roles        = $current_user->roles;
        $role              = array_shift($user_roles);
        if (isset($wpmf_active_media) && (int) $wpmf_active_media === 1
            && $role !== 'administrator' && !current_user_can('administrator') && (!in_array($current_user->ID, self::$user_full_access_id) || self::$user_full_access_id === 0) && !current_user_can('wpmf_full_access')) {
            $user_full_access = false;
        } else {
            $user_full_access = true;
        }

        return $user_full_access;
    }

    /**
     * Create Pdf Thumbnail
     *
     * @param string $filepath File path
     *
     * @return void
     */
    public static function createPdfThumbnail($filepath)
    {
        $metadata       = array();
        $fallback_sizes = array(
            'thumbnail',
            'medium',
            'large',
        );

        /**
         * Filters the image sizes generated for non-image mime types.
         *
         * @param array $fallback_sizes An array of image size names.
         * @param array $metadata       Current attachment metadata.
         */
        $fallback_sizes = apply_filters('fallback_intermediate_image_sizes', $fallback_sizes, $metadata);

        $sizes                      = array();
        $_wp_additional_image_sizes = wp_get_additional_image_sizes();

        foreach ($fallback_sizes as $s) {
            if (isset($_wp_additional_image_sizes[$s]['width'])) {
                $sizes[$s]['width'] = intval($_wp_additional_image_sizes[$s]['width']);
            } else {
                $sizes[$s]['width'] = get_option($s . '_size_w');
            }

            if (isset($_wp_additional_image_sizes[$s]['height'])) {
                $sizes[$s]['height'] = intval($_wp_additional_image_sizes[$s]['height']);
            } else {
                $sizes[$s]['height'] = get_option($s . '_size_h');
            }

            if (isset($_wp_additional_image_sizes[$s]['crop'])) {
                $sizes[$s]['crop'] = $_wp_additional_image_sizes[$s]['crop'];
            } else {
                // Force thumbnails to be soft crops.
                if ('thumbnail' !== $s) {
                    $sizes[$s]['crop'] = get_option($s . '_crop');
                }
            }
        }

        // Only load PDFs in an image editor if we're processing sizes.
        if (!empty($sizes)) {
            $editor = wp_get_image_editor($filepath);

            if (!is_wp_error($editor)) { // No support for this type of file
                /*
                 * PDFs may have the same file filename as JPEGs.
                 * Ensure the PDF preview image does not overwrite any JPEG images that already exist.
                 */
                $dirname      = dirname($filepath) . '/';
                $ext          = '.' . pathinfo($filepath, PATHINFO_EXTENSION);
                $preview_file = $dirname . wp_unique_filename($dirname, wp_basename($filepath, $ext) . '-pdf.jpg');

                $uploaded = $editor->save($preview_file, 'image/jpeg');
                unset($editor);

                // Resize based on the full size image, rather than the source.
                if (!is_wp_error($uploaded)) {
                    $editor = wp_get_image_editor($uploaded['path']);
                    unset($uploaded['path']);

                    if (!is_wp_error($editor)) {
                        $metadata['sizes']         = $editor->multi_resize($sizes);
                        $metadata['sizes']['full'] = $uploaded;
                    }
                }
            }
        }
    }

    /**
     * Create thumbnail after replace
     *
     * @param string  $filepath Physical path of file
     * @param string  $extimage Extension of file
     * @param array   $metadata Meta data of file
     * @param integer $post_id  ID of file
     *
     * @return void
     */
    public static function createThumbs($filepath, $extimage, $metadata, $post_id)
    {
        if (isset($metadata['sizes']) && is_array($metadata['sizes'])) {
            $uploadpath = wp_upload_dir();
            foreach ($metadata['sizes'] as $size => $sizeinfo) {
                $intermediate_file = str_replace(basename($filepath), $sizeinfo['file'], $filepath);

                // load image and get image size
                list($width, $height) = getimagesize($filepath);
                $new_width = $sizeinfo['width'];
                $new_height = floor($height * ($sizeinfo['width'] / $width));
                $tmp_img = imagecreatetruecolor($new_width, $new_height);

                imagealphablending($tmp_img, false);
                imagesavealpha($tmp_img, true);

                switch ($extimage) {
                    case 'jpeg':
                    case 'jpg':
                        $source = imagecreatefromjpeg($filepath);
                        break;

                    case 'png':
                        $source = imagecreatefrompng($filepath);
                        break;

                    case 'gif':
                        $source = imagecreatefromgif($filepath);
                        break;

                    case 'bmp':
                        $source = imagecreatefromwbmp($filepath);
                        break;
                    default:
                        $source = imagecreatefromjpeg($filepath);
                }

                imagealphablending($source, true);
                imagecopyresampled($tmp_img, $source, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
                switch ($extimage) {
                    case 'jpeg':
                    case 'jpg':
                        imagejpeg($tmp_img, path_join($uploadpath['basedir'], $intermediate_file), 100);
                        break;

                    case 'png':
                        imagepng($tmp_img, path_join($uploadpath['basedir'], $intermediate_file), 9);
                        break;

                    case 'gif':
                        imagegif($tmp_img, path_join($uploadpath['basedir'], $intermediate_file));
                        break;

                    case 'bmp':
                        imagewbmp($tmp_img, path_join($uploadpath['basedir'], $intermediate_file));
                        break;
                }

                $metadata[$size]['width'] = $new_width;
                $metadata[$size]['width'] = $new_height;
                wp_update_attachment_metadata($post_id, $metadata);
            }
        } else {
            wp_update_attachment_metadata($post_id, $metadata);
        }
    }

    /**
     * Save pptc metadata
     *
     * @param integer $enable       Enable or disable option
     * @param integer $image_id     ID of image
     * @param string  $path         Path of image
     * @param array   $allow_fields Include fields
     * @param string  $title        Title of image
     * @param string  $mime_type    Mime type
     *
     * @return void
     */
    public static function saveIptcMetadata($enable, $image_id, $path, $allow_fields, $title, $mime_type)
    {
        $iptcMeta = array();
        // update alt
        if ((int) $enable === 1 && strpos($mime_type, 'image') !== false && $title !== '' && !empty($allow_fields['alt'])) {
            update_post_meta($image_id, '_wp_attachment_image_alt', $title);
        }

        if ((int)$enable === 1 && strpos($mime_type, 'image') !== false) {
            $size = getimagesize($path, $info);
            if (!empty($allow_fields['2#105']) && $title !== '') {
                $iptcMeta['2#105'] = array($title);
            }

            if (isset($info['APP13'])) {
                $iptc = iptcparse($info['APP13']);
                if (!empty($iptc)) {
                    foreach ($iptc as $code => $iptcValue) {
                        if (!empty($allow_fields[$code])) {
                            $iptcMeta[$code] = $iptcValue;
                        }
                    }

                    update_post_meta($image_id, 'wpmf_iptc', $iptcMeta);
                }
            }
        }
    }

    /**
     * Sort parents before children
     * http://stackoverflow.com/questions/6377147/sort-an-array-placing-children-beneath-parents
     *
     * @param array   $objects      List folder
     * @param integer $enable_count Enable count
     * @param array   $result       Result
     * @param integer $parent       Parent of folder
     * @param integer $depth        Depth of folder
     *
     * @return array           output
     */
    public static function parentSort(array $objects, $enable_count = false, array &$result = array(), $parent = 0, $depth = 0)
    {
        foreach ($objects as $key => $object) {
            if ((int) $object->parent === (int) $parent) {
                if ($enable_count) {
                    $object->files_count = self::getCountFiles($object->term_id);
                    $object->count_all = 0;
                }
                $object->depth = $depth;
                array_push($result, $object);
                unset($objects[$key]);
                self::parentSort($objects, $enable_count, $result, $object->term_id, $depth + 1);
            }
        }
        return $result;
    }

    /**
     * Get count files in folder
     *
     * @param integer $term_id Id of folder
     *
     * @return integer
     */
    public static function getCountFiles($term_id)
    {
        global $wpdb;
        if (defined('ICL_SITEPRESS_VERSION') && ICL_SITEPRESS_VERSION) {
            global $sitepress;
            $settings = $sitepress->get_settings();
            if (isset($settings['custom_posts_sync_option']['attachment']) && (int) $settings['custom_posts_sync_option']['attachment'] === 1) {
                $language = $sitepress->get_current_language();
                $count = (int)$wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM ' . $wpdb->prefix . 'icl_translations AS wpml 
            INNER JOIN ' . $wpdb->term_relationships . ' AS term_rela ON term_rela.object_id = wpml.element_id 
            WHERE wpml.element_type = "post_attachment" AND term_rela.term_taxonomy_id = %d 
            AND wpml.language_code = %s', array($term_id, $language)));
            } else {
                $folder = get_term($term_id, WPMF_TAXO);
                return $folder->count;
            }
        } elseif (is_plugin_active('polylang/polylang.php')) {
            global $polylang;
            $all_objects = get_objects_in_term($term_id, WPMF_TAXO);
            if ($polylang->curlang && $polylang->model->is_translated_post_type('attachment')) {
                $my_current_lang = $polylang->curlang->slug;
                $lang_term = get_term_by('slug', $my_current_lang, 'language');
                $lang_object = get_objects_in_term($lang_term->term_id, 'language', array('post_type' => 'attachment'));
                $count = array_intersect($all_objects, $lang_object);
                return count($count);
            } else {
                return count($all_objects);
            }
        } else {
            $count = $wpdb->get_var($wpdb->prepare('
                SELECT COUNT(ID) FROM ' . $wpdb->posts . ' as p, ' . $wpdb->term_relationships . ' as tr WHERE p.ID = tr.object_id AND post_type = "attachment" AND (post_status = "publish" OR post_status = "inherit") AND term_taxonomy_id = %d', (int)$term_id));
        }

        return (int) $count;
    }

    /**
     * Get root folder count
     *
     * @param integer $folderRootId Root folder ID
     *
     * @return integer
     */
    public static function getRootFolderCount($folderRootId)
    {
        global $wpdb;

        // Retrieve the overall count of attachements
        $query = 'SELECT COUNT(DISTINCT(p.ID)) AS count FROM ' . $wpdb->posts . ' AS p
                        WHERE p.post_type = "attachment" 
                            AND (p.post_status = "publish" OR p.post_status = "inherit")';
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- SQL not contain variable
        $total_count = (int)$wpdb->get_var($query);

        // Retrieve the number of attachments which are at least in one folder (except the root folder)
        $attachments_in_folders_count = (int)$wpdb->get_var($wpdb->prepare('SELECT COUNT(DISTINCT(p.ID)) AS count FROM ' . $wpdb->posts . ' AS p 
                        LEFT JOIN ' . $wpdb->term_relationships . ' AS tr 
                            ON p.ID = tr.object_id
                        LEFT JOIN ' . $wpdb->term_taxonomy . ' AS tt 
                            ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy = "wpmf-category"
                        WHERE p.post_type = "attachment" 
                            AND (p.post_status = "publish" OR p.post_status = "inherit")
                            AND tt.term_id IS NOT NULL
                            AND tt.term_id <> %d', (int) $folderRootId));

        // Retrieve the number of attachments which are simultaneously in the root folder and in another folder
        $attachments_in_root_folder_count = (int)$wpdb->get_var($wpdb->prepare('SELECT COUNT(DISTINCT(p.ID)) AS count FROM ' . $wpdb->posts . ' AS p 
                        LEFT JOIN ' . $wpdb->term_relationships . ' AS tr 
                            ON p.ID = tr.object_id
                        LEFT JOIN ' . $wpdb->term_taxonomy . ' AS tt 
                            ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy = "wpmf-category"
                        WHERE p.post_type = "attachment" 
                            AND (p.post_status = "publish" OR p.post_status = "inherit")
                            AND tt.term_id = %d', (int) $folderRootId));

        return  $total_count - $attachments_in_folders_count + $attachments_in_root_folder_count;
    }
}
