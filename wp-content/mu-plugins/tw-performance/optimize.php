<?php

// Remove emoji
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

function disable_classic_theme_styles()
{
    wp_deregister_style('classic-theme-styles');
    wp_dequeue_style('classic-theme-styles');
}
add_filter('wp_enqueue_scripts', 'disable_classic_theme_styles', 100);


// Remove wp-emoji
function disable_emojis()
{
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    // add_filter('tiny_mce_plugins', 'disable_emojis_tinymce');
}
add_action('init', 'disable_emojis');


// Remove wp-embed
function my_deregister_scripts()
{
    wp_deregister_script('wp-embed');
}
add_action('wp_footer', 'my_deregister_scripts');
// Remove wp-json
remove_action('wp_head', 'rest_output_link_wp_head', 10);
remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
remove_action('template_redirect', 'rest_output_link_header', 11, 0);
// Remove wlwmanifest
remove_action('wp_head', 'wlwmanifest_link');
// Remove shortlink
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
// Remove RSD
remove_action('wp_head', 'rsd_link');
// Remove feed
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
// Remove generator
remove_action('wp_head', 'wp_generator');
// Remove dns-prefetch
remove_action('wp_head', 'wp_resource_hints', 2);
// Remove rest api link
remove_action('wp_head', 'wp_oembed_add_host_js');
// Remove rel=“prev” and rel=“next” from the head
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
// Remove the WordPress version from RSS feeds
add_filter('the_generator', '__return_false');
// Remove the WordPress version from the generator meta tag
add_filter('the_generator', 'remove_wp_ver_meta');


add_filter('use_block_editor_for_post', '__return_false');

// Disable Gutenberg for widgets.
add_filter('use_widgets_block_editor', '__return_false');


add_action('wp_enqueue_scripts', function () {
    // Remove CSS on the front end.
    wp_dequeue_style('wp-block-library');

    // Remove Gutenberg theme.
    wp_dequeue_style('wp-block-library-theme');

    // Remove inline global CSS on the front end.
    wp_dequeue_style('global-styles');
}, 20);