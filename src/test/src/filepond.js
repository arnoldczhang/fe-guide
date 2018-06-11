import * as FilePond from 'filepond';

const pond = FilePond.create({
  multiple: true,
  name: 'filepond',
});

document.body.appendChild(pond.element);