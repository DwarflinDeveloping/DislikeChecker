function init_theme() { window.theme = "bright"; }

function get_opposite_theme(theme) { if ( theme == "dark") { return "bright" } else { return "dark" } }

function toggle_theme() { window.theme = get_opposite_theme(window.theme); change_theme(window.theme) }

function change_theme(theme) {
    if ( theme == "dark" ) {
        document.getElementById("icon-views").src = "assets/dark/views.svg";
        document.getElementById("icon-likes").src = "assets/dark/like.svg";
        document.getElementById("icon-dislikes").src = "assets/dark/dislike.svg";
        document.getElementById("theme-toggle").src = "assets/dark/sun.svg";
        document.getElementById("theme-import").href = "style/dark.css";
    } else if ( theme == "bright" ) {
        document.getElementById("icon-views").src = "assets/bright/views.svg";
        document.getElementById("icon-likes").src = "assets/bright/like.svg";
        document.getElementById("icon-dislikes").src = "assets/bright/dislike.svg";
        document.getElementById("theme-toggle").src = "assets/bright/moon.svg";
        document.getElementById("theme-import").href = "style/bright.css";
    }
}
