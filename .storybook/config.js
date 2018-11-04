import { configure } from '@storybook/react';

function loadStories() {
  require('../src/storybook/index');
}

configure(loadStories, module);