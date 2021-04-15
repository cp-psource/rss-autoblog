<?php
/*
Addon Name: Verwende externe Permalinks
Description: Mit dieser Erweiterung kannst Du den Beitrags-Permalink für importierten Beiträge in die ursprüngliche URL ändern
Author: WMS N@W
Author URI: https://n3rds.work
Network: False
*/

add_filter( 'post_link', 'autoblog_external_permalink', 10, 2 );
add_filter( 'post_type_link', 'autoblog_external_permalink', 10, 2 );
function autoblog_external_permalink( $permalink, $post ) {
	if ( !is_object( $post ) || !isset( $post->ID ) ) {
		return $permalink;
	}

	$original_link = get_post_meta( $post->ID, 'original_source', true );
	if ( empty( $original_link ) ) {
		return $permalink;
	}

	// Check for the feed id and whether it's on the skip link
	if ( defined( 'AUTOBLOG_EXTERNAL_PERMALINK_SKIP_FEEDS' ) && AUTOBLOG_EXTERNAL_PERMALINK_SKIP_FEEDS != '' ) {
		$skipfeeds = explode( ',', AUTOBLOG_EXTERNAL_PERMALINK_SKIP_FEEDS );
		if ( !empty( $skipfeeds ) ) {
			$original_feed_id = get_post_meta( $post->ID, 'original_feed_id', true );
			if ( !in_array( $original_feed_id, $skipfeeds ) ) {
				return $original_link;
			}
		}
	}

	return $original_link;
}
