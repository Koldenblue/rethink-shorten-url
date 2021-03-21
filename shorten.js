const fs = require("fs");
const path = require("path");
const buckets = 50000;
let hashArr = [];

/** This function is meant to read the hash array which is stored as json. The function may be run at program start in order to initialize the hash array data. */
function retrieveStoredArr() {
  fs.readFileSync(path.join(__dirname, "hashArray.json"), "utf8", (err, storedArr) => {
    try {
      hashArr = JSON.parse(storedArr)
    } catch (err) {
      console.log("error!", err);
    }
  })
  console.log(hashArr)
}
retrieveStoredArr();

// first hash the url
const hash = (url) => {
  url = url.toLowerCase();
  url = url.split('');

  hashValue = 0;
  for (let i = 0, j = url.length; i < j; i++) {
    hashValue += (url[i].charCodeAt()) * 11;
    if (i > 0) {
      hashValue += url[i].charCodeAt() * 7;
    }
    if (i > 1) {
      hashValue += url[i].charCodeAt() * 5;
    }
  }

  hashValue = hashValue % buckets;
  return hashValue;
}

/** This function appends the hash value onto "sh.ly/", then stores the shortened value into the hash array. Then it returns the shortened name to the user. */
function storeHashValue(hashValue, fullUrl) {
  /** each url should be appended onto a name, similar to the bit.ly website. For example, if a url hashes to 100, our shortened url would be "sh.ly/100" */
  let shortenedUrl = "sh.ly/" + hashValue;

  // next store the hash into a JavaScript array, with the index number being equal to the hash value
    // each index in the hash array should be another array which can store more than one url, in case there are collisions between hashed values
    // if there are no previous entries at the hashed array index, append a "-0" onto the end of the shortened url, and store the url in hashArray[hash][0]
    // else there are collisions, we need to append the shortened url onto the end of the array at the hash value.
      // For example, if two urls have a hash value of 100, the first url will be stored at hashArray[100][0], and the second array can be stored at hashArray[100][1]
  let storedValues = hashArr[hashValue];
  if (storedValues === undefined) {
    hashArr[hashValue] = [];
    shortenedUrl = shortenedUrl + "-0";
    hashArr[hashValue].push(fullUrl);
  } else {
    let collisions = hashValue.length;
    shortenedUrl = shortenedUrl + `-${collisions}`;
    hashArr[hashValue].push(fullUrl);
  }

  fs.writeFileSync(path.join(__dirname, "hashArray.json"), JSON.stringify(hashArr, null, 2), err => {console.log(err)} )
  return shortenedUrl;
}


/** Finally, if the longer url needs to be retrieved, the hash array can be searched to retrieve the entire name. 
 * @param {string} url - the hashed url that needs to be looked up, which will be in the format "sh.ly/####-#" */
const retrieveShortenedUrl = (url) => {
  // we can remove the "sh.ly" from the front
  url = url.slice(6)

  // next we can find the collision index number. It should be at the end of the string, after a dash "-".
  // This index number will be used to retrieve the proper url, in case there is more than one url stored at a particular hash value index.
  let dashIndex = url.indexOf("-")
  let collisionIndex = parseInt(url.slice(dashIndex + 1))
  url = parseInt(url.slice(0, dashIndex))

  // Finally with the index numbers in hand, we can look up the full url name in our hash array.
  let fullUrl = hashArr[url][collisionIndex];
  return fullUrl;
}



function shortenUrl(url) {
  let myHash = hash(url);
  return storeHashValue(myHash, url);
}


console.log(shortenUrl('my-very-long-url.com'));
console.log(retrieveShortenedUrl("sh.ly/43052-0"))