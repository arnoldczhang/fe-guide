function hash(word) {
  var p = 31;
  var m = 1e9 + 9;
  var hash_value = 0;
  for(var i = 0; i < word.length; i++) {
      var letter = word[i];
      var charCode = letter.charCodeAt();
      hash_value = hash_value + (charCode * Math.pow(p, i))
  }
  return hash_value % m;
}