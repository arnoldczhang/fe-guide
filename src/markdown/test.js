import marked from 'marked';
document.getElementById('container').innerHTML = marked('title | career | age | \n ---: | :---: | :--- |\n aa | bb | cc |\n aa | bb | cc |\n aa | bb | cc |');
