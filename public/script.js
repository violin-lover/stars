function shorten() {
  debugger;
  let url = document.getElementById("url").value;

    try {
      new URL(url)
      getLongURL(url)
    }

    catch(error) {
	    document.getElementById("microURL").innerText = "Invalid URL detected. Please input a different URL or check that your URL was copied in correctly."
    }
}

function getLongURL(url){
let result = document.getElementById("microURL");
let encodedUrl = btoa(url);
encodedUrl = encodeURIComponent(encodedUrl);
let uRl = "/tokenizer/" + encodedUrl;

fetch(uRl)
.then(response => response.json())

.then(res => {
result.innerHTML = res.shortenUrl;
})
}
