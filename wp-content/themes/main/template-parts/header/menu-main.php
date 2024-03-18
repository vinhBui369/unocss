<div class="header-main ">
    <div class="header-main_top bg-green-5 py-8px">
        <div class="tw-container color-white flex justify-end">
            <a href="#" class="color-white decoration-none">
                <span>Hotline:</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11.8217 9.61345C11.0162 8.92453 10.1988 8.50722 9.40319 9.1951L8.92813 9.61085C8.58055 9.91264 7.93429 11.3227 5.43566 8.44843C2.93755 5.57775 4.42414 5.13079 4.77224 4.8316L5.2499 4.41533C6.04133 3.72589 5.74266 2.85798 5.17185 1.96457L4.82739 1.42342C4.25399 0.532094 3.62959 -0.0532791 2.83608 0.63512L2.40733 1.00976C2.05663 1.26524 1.07632 2.09569 0.838529 3.67334C0.552347 5.56631 1.45512 7.73401 3.52344 10.1124C5.58916 12.4919 7.61169 13.6871 9.52755 13.6663C11.1198 13.6491 12.0813 12.7948 12.3821 12.4841L12.8124 12.109C13.6038 11.4211 13.1121 10.7207 12.3061 10.0302L11.8217 9.61345Z" fill="white" />
                </svg>
                0966501213
            </a>
        </div>
    </div>
    <div class="header-main_menu">
        <div class="tw-container flex flex-items-center">
            <a href="<?= HOME_URL ?>">
                <img src="<?= THEME_ASSETS ?>/images/logo-tam-anh.png" alt="">
            </a>
            <?php
            wp_nav_menu(array(
                'theme_location' => 'main-menu',
                'menu'              => "main-menu",
                'menu_class'        => "menu-main",
                'menu_id'           => "main-menu list-none flex flex-items-center gap-8px",
            ));
            ?>

        </div>
    </div>


    <?php
    add_filter('nav_menu_link_attributes', 'wpse156165_menu_add_class', 10, 1);

    function wpse156165_menu_add_class($atts)
    {
        $class = 'decoration-none'; // or something based on $item
        $atts['class'] = $class;
        return $atts;
    }
    ?>

</div>