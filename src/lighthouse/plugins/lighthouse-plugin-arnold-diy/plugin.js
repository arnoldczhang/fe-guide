module.exports = {
  // Additional audits to run on information Lighthouse gathered.
  audits: [{ path: 'lighthouse-plugin-arnold-diy/src/audits/has-cat-images.js' }],

  // A new category in the report for the plugin output.
  category: {
    title: 'Cats',
    description:
      'When integrated into your website effectively, cats deliver delight and bemusement.',
    auditRefs: [{ id: 'has-cat-images-id', weight: 1 }],
  },
};
