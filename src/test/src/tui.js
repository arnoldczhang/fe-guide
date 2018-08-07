import tui from 'tui-grid';

const Grid = tui.Grid;
var instance = new Grid({
    el: document.getElementById('grid'), // Container element
    columns: [
        {
            title: 'Name',
            name: 'name'
        },
        {
            title: 'Artist',
            name: 'artist'
        },
        {
            title: 'Release',
            name: 'release'
        },
        {
            title: 'Genre',
            name: 'genre'
        }
    ],
    data: [
        {
            name: 'Beautiful Lies',
            artist: 'Birdy',
            release: '2016.03.26',
            genre: 'Pop'
        }
    ]
});
// instance.setData(newData); // Call API of instance's public method
Grid.applyTheme('striped'); // Call API of static method
