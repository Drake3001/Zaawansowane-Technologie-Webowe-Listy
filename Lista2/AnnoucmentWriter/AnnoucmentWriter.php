<?php
/**
 * Plugin Name: Random Announcement Writer
 * Plugin URI: https://example.com/plugins/AnnouncementWriter/
 * Description: Displays a random announcement between the title and content of each post. Announcements are managed via an admin panel and support HTML content.
 * Version: 1.0
 * Requires at least: 5.0
 * Requires PHP: 7.2
 * Author: Mikołaj Kamiński, Wojciech Król
 * Author URI: https://darksource.pl/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('aw-styles', plugin_dir_url(__FILE__) . 'css/style.css', [], '1.0');
});

add_action('init', function () {
    register_post_type('announcement', [
        'labels' => [
            'name'          => 'Announcements',
            'singular_name' => 'Announcement',
            'add_new_item'  => 'Add New Announcement',
            'edit_item'     => 'Edit Announcement',
            'not_found'     => 'No announcements found.',
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_rest'    => true,
        'supports'        => ['title', 'editor'],
        'menu_icon'       => 'dashicons-megaphone',
        'capability_type' => 'post',
        'rewrite'         => false,
    ]);
});

add_shortcode('random_announcement', function () {
    $announcements = get_posts(['post_type' => 'announcement', 'posts_per_page' => -1]);
    if (empty($announcements)) {
        return '';
    }
    $random = $announcements[array_rand($announcements)];
    return '<div class="aw-announcement-box">' . do_blocks(wpautop($random->post_content)) . '</div>';
});

add_filter('the_content', function ($content) {
    if (is_single() && is_main_query()) {
        $content = do_shortcode('[random_announcement]') . $content;
    }
    return $content;
});
