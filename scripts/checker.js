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

function get_video_url(video_id, base_url="https://www.youtube.com/watch?v=") { return base_url + video_id }

function get_thumbnail_url(video_id) { return "https://i.ytimg.com/vi/" + video_id + "/maxresdefault.jpg" }

function change_url(url) { window.history.replaceState( {}, document.title, url ); }

function add_number_separator(number) { return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); }

function change_url_param(key, value) {
    var url = new URL(document.documentURI);
    var url_params = url.searchParams;

    url_params.set(key, value);
    url.search = url_params.toString();

    change_url(url.toString());
}

function autocorrect_url(input_url) {
    url = input_url
    if ( url.startsWith("youtube.com") ) {
        url = "https://www." + url
    } else if ( url.startsWith("www") ) {
        url = "https://" + url
    }
    return url
}

function reset_output() {
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

    outputs_container.style = "display: none !important;";
    information_container.style = "";
    views_output.innerHTML = "Loading...";
    likes_output.innerHTML = "Loading...";
    dislikes_output.innerHTML = "Loading...";
    title_output.innerHTML = "Loading...";
    author_output.innerHTML = "Loading...";
    title_url_output.href = "";
    author_url_output.href = "";
    thumbnail_output.src = "";
}

function set_outputs(votes, metadata) {
    outputs_container = document.getElementById("outputs");
    information_container = document.getElementById("information-container");
    views_output = document.getElementById("output-views");
    likes_output = document.getElementById("output-likes");
    dislikes_output = document.getElementById("output-dislikes");
    rating_output = document.getElementById("output-rating");
    rating_percent_output = document.getElementById("output-rating-percent");
    title_output = document.getElementById("output-title");
    title_url_output = document.getElementById("title-url");
    author_output = document.getElementById("output-author");
    author_url_output = document.getElementById("author-url");
    thumbnail_output = document.getElementById("output-thumbnail");

    outputs_container.style = "";
    information_container.style = "display: none !important;";

    rating_percent = get_rating_percent(votes["likes"], votes["dislikes"]);

    views_output.innerHTML = add_number_separator(votes["viewCount"]);
    likes_output.innerHTML = add_number_separator(votes["likes"]);
    dislikes_output.innerHTML = add_number_separator(votes["dislikes"]);
    rating_percent_output.innerHTML = rating_percent;
    rating_output.innerHTML = get_rating(rating_percent);
    title_output.innerHTML = metadata["title"];
    title_url_output.href = metadata["url"];
    author_output.innerHTML = metadata["author_name"];
    author_url_output.href = metadata["author_url"];
    thumbnail_output.src = get_thumbnail_url(video_id);
}

function handle_commands(input) {
    if ( input == "hey" ) {
        alert("hey!")
        return 1
    } else if ( input_url == "help") {
        alert("Please enter a URL in the input field.");
        return 1
    } else if ( input_url == "about") {
        window.open("about.html", "_self");
        return 1
    } else if ( input_url == "warranty") {
        return
    } else if ( input_url == "github") {
        return
    } else if ( input_url == "license") {
        return
    } else if ( input_url == "authors") {
        return
    }
    return 0
}

function check_dislikes_input() {
    input_url = document.getElementById("url-input").value;
    if ( input_url == "" ) {
        alert("Please enter a URL in the input field.");
        return
    } else if ( handle_commands(input_url) == 1 ) { return }

    url = autocorrect_url(input_url);
    if ( url.includes("youtube.com") == false ) {
        alert("It looks like your URL is not leading to 'youtube.com'.\nPlease note that this website is made for YouTube videos.");
        return
    }

    check_dislikes(url);

    video_id = get_video_id(url);
    change_url_param('video_id', video_id);
}

function get_rating(rating_percent) {
    ratings = {
      "5": "Extremely miserable",
      "10": "Very miserable",
      "15": "Miserable",
      "20": "Very bad",
      "30": "Bad",
      "40": "Slightly bad",
      "50": "Mediocre",
      "60": "Slightly good",
      "70": "Good",
      "80": "Very good",
      "90": "Excellent",
      "100": "Very excellent"
    }

    if ( rating_percent == 100 ) {
        return "Completely positive"
    } else if ( rating_percent == 0 ) {
        return "Completely negative"
    }

    for ( rating in ratings ) {
        console.log(rating)
        console.log(rating_percent)
        console.log()
        if ( rating_percent < rating ) {
            console.log("done!")
            return ratings[rating]
        } else {
            continue
        }
    }
}

function get_rating_percent(like_count, dislike_count) { return Math.floor( ( ( like_count / ( like_count + dislike_count ) ) * 100 ) / 0.01 ) * 0.01 }

function check_dislikes(url) {
    reset_output();

    video_id = get_video_id(url);

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
        return
    }

    if ( metadata["error"] == "no matching providers found" ) {
        alert("It looks like your URL is not leading to a valid video.\nPlease make sure, your URL starts with 'http://youtube.com/' or 'https://www.youtube.com/'")
        return
    }

    set_outputs(votes, metadata);
}
