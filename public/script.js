function shorten() {
  debugger;
    let url = document.getElementById("url").value;
    let result = document.getElementById("microURL");
    is_url(url, result);
}

function is_url(url, result){
  try {
  new URL(url)
    getLongURl();
} catch (error) {
  result.innerHTML = "Please make sure your url is valid.";
}
}

function getLongURl(){
let result = document.getElementById("microURL");
let url = document.getElementById("url").value;
let encodedUrl = base62.decode(url)
let uRl = "/tokenizer/" + encodedUrl;
fetch(uRl)
.then(response => response.json())

.then(res => {
result.innerHTML = res.shortenUrl;
})
}

const base62 = {
  charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split(''),
  encode: integer => {
    if (integer === 0) {
      return 0;
    }
    let s = [];
    while (integer > 0) {
      s = [base62.charset[integer % 62], ...s];
      integer = Math.floor(integer / 62);
    }
    return s.join('');
  },
  decode: chars => chars.split('').reverse().reduce((prev, curr, i) =>
    prev + (base62.charset.indexOf(curr) * (62 ** i)), 0)
};
