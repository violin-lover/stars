function shorten() {
  debugger;
    let url = document.getElementById("url").value;
    let result = document.getElementById("microURL");
    is_url(url, result);
}

function is_url(url, result) {
  try {
    new URL(url);
    getLongURl();
  } catch (error) {
    result.innerHTML = "~Please make sure your URL is valid~";
  }
}

function getLongURl() {
  let result = document.getElementById("microURL");
  let url = document.getElementById("url").value;
  let encodedUrl = btoa(url);
  encodedUrl = encodeURIComponent(encodedUrl);
  let uRl = "/tokenizer/" + encodedUrl;
    
  fetch(uRl)
    .then((response) => response.json())

    .then((res) => {
      result.innerHTML = res.shortenUrl;
  });
}
