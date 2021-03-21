# Title
Given any URL, shorten it and return a globally unique URL back to the user. Make sure to call out any assumptions and / or limitations in your solution.

## Discussion
At approximately sixty minutes, the functionality of the url shortening algorithm was complete. Ten more minutes were taken to get the node.js filesystem (fs) properly working, so that an array of shortened urls could be stored and retrieved. In this way, the program can be demonstrated as fully functional.

The program is a simple script. A function at the bottom of the script has a parameter in which the string of the full url may be input. The script may then be run in node.js. The file system will automatically store the url name in the hashArray.json. There is still a file system bug present: currently the file system will overwrite the entire hash array and any previously stored urls (which will result in an error if you try to retrieve a different url than the one being stored.)

Comments give this explanation: Each url is first hashed to an integer value. The hash function was not optimized, and a better hash function can surely be looked up. The hash value is next appended to a short url, "sh.ly", similar to bit.ly. The hash value corresponds to an index of a hash array, in which it will be stored. Of course, there may be collisions, with urls sharing the same hash value. To account for this, a second array is stored at each hash array index. This second array will hold all colliding full urls. The shortened url also has the index of its location in the second array appended. 

For example, "my-very-long-url.com" has a hash value of 43052. It will be shortened to "sh.ly/43052-0". It will be stored at `hashArray[ 43052 ][ 0 ]`. If there is another long url with a hash value of 43052, that full url will be "sh.ly/43052-1", stored at `hashArray[ 43052 ][1]`.

In this manner, a shortened url such as "sh.ly/43052-0" contains all the information necessary to connect it to the full url name, which should be stored in the persistent array.

There are some shortcomings to the approach. For example, I initially was using "hello.com" as an example - but this url is actually lengthened to "sh.ly/18878-0"! So this approach only works with longer urls. Second, the filesystem, as mentioned earlier, currently overwrites the entire hashArray each time the program is run - this is a bug that should be fixed, given more time. Third, although it should be quick to look up hashed urls given that we already know their index number, this array of arrays is not memory efficient. One possible solution to this is to use an object with stored hash values as keys, rather than an array, and create keys as needed rather than have a set size for the array. Other data structures may also offer improvements - for example, a linked list could be stored at each hash array index, instead of another array. This could be more memory efficient since arrays use contiguous memory locations (or, at least this is true with C/C++).

