function shorten() {
  debugger;
    let url = document.getElementById("url").value;
    getLongURl(url);
}

function getLongURl(url){
debugger;
let result = document.getElementById("microURL");
let encodedUrl = btoa(url);
let uRl = "/tokenizer/" + encodedUrl;
fetch(uRl)
.then(response => response.json())

.then(res => {
result.innerHTML = res.shortenUrl;
})
}