import marked from 'marked';

const container = document.querySelector('#container');
container.innerHTML = marked('`Ctrl + M`');



// '--- \n 项目  |   价格  |  数量|\n - | -----|---:|----:|\naa|aa|aa\n'
