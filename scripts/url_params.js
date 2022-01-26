function params_init_check() {
    const url_params = new URLSearchParams(window.location.search)

    if ( url_params.get("video_id") != null ) {
        check_dislikes(get_video_url(url_params.get("video_id")));
    }
}
