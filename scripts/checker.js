function get_url(attachment, base_url="https://returnyoutubedislikeapi.com/votes?videoId=") { return base_url + attachment }

function download_votes(video_id) {
    const url = get_url(video_id);
    console.log("INFO: Starting votes download of video '" + video_id + "' with url '" + url + "'...");
    return download(url);
}

function download_metadata(video_url) {
    const url = get_url(video_url, base_url="https://noembed.com/embed?dataType=json&url=");
    console.log("INFO: Starting metadata download of video '" + video_id + "' with url '" + url + "'...");
    return download(url);
}

function download(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false );
    request.send();

    if ( request.status == 200 ) {
        return request.responseText;
    } else if ( request.status == 429 ) {
        console.log("ERROR: Too many requests sent! Limits: 100 per minute; 10000 per day")
        console.log("Have a look at https://returnyoutubedislike.com/docs/usage-rights")
    } else {
        console.log( "ERROR: Request not successful. Returned status code " + request.status );
        return "";
    }
}

function parse_json(text) { return JSON.parse(text) }

function get_video_id(url, id_separator="watch?v=") { return url.split(id_separator).pop() }

function get_thumbnail_url(video_id) { return "https://i.ytimg.com/vi/" + video_id + "/maxresdefault.jpg" }

function check_dislikes() {
    input_url = document.getElementById("url-input").value;
    if ( input_url == "" ) {
        return
    }

    outputs_container = document.getElementById("outputs");
    information_container = document.getElementById("information-container");
    views_output = document.getElementById("output-views");
    likes_output = document.getElementById("output-likes");
    dislikes_output = document.getElementById("output-dislikes");
    title_output = document.getElementById("output-title");
    title_url_output = document.getElementById("title-url");
    author_output = document.getElementById("output-author");
    author_url_output = document.getElementById("author-url");
    thumbnail_output = document.getElementById("output-thumbnail");

    if ( outputs_container.style != "" ) {
        views_output.innerHTML = "Loading...";
        likes_output.innerHTML = "Loading...";
        dislikes_output.innerHTML = "Loading...";
    }

    if ( information_container.style.display == "" ) { information_container.style = "display: none !important;"; }

    outputs_container.style = "";
    video_id = get_video_id(input_url);

    url = input_url
    if ( url.startsWith("youtube.com") ) {
        url = "https://www." + url
    } else if ( url.startsWith("www") ) {
        url = "https://" + url
    }
    if ( url.includes("youtube.com") == false ) {
        alert("It looks like your URL is not leading to 'youtube.com'.\nPlease note that this website is made for YouTube videos.")
        outputs_container.style = "display: none !important;";
        information_container.style = ""
        return
    }

    try {
        votes = parse_json(download_votes(video_id));
        metadata = parse_json(download_metadata(url))
    } catch (exception) {
        console.log("ERROR: Exception " + exception.name + " occurred while trying to download the votes of video '" + video_id + "'.");

        if ( exception.name == "NetworkError" ) {
            alert("An network error occurred while trying to download data. Please make sure you have a stable internet connection and try again. More information in the console (F12)")
        } else {
            alert("An error occurred while trying to download data.\nName: '" + exception.name + "'\nMessage: '" + exception.message + "'");
        }
        outputs_container.style = "display: none !important;";
        information_container.style = ""
        return
    }
    if ( metadata["error"] == "no matching providers found" ) {
        alert("It looks like your URL is not leading to a valid video.\nPlease make sure, your URL starts with 'http://youtube.com/' or 'https://www.youtube.com/'")
        outputs_container.style = "display: none !important;";
        information_container.style = ""
        return
    }

    for ( element in document.getElementsByClassName("output") ) {
        element.hidden = false;
    }

    views_output.innerHTML = votes["viewCount"];
    likes_output.innerHTML = votes["likes"];
    dislikes_output.innerHTML = votes["dislikes"];
    title_output.innerHTML = metadata["title"];
    title_url_output.href = metadata["url"];
    author_output.innerHTML = metadata["author_name"];
    author_url_output.href = metadata["author_url"];
    thumbnail_output.src = get_thumbnail_url(video_id);
}
