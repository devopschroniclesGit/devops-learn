const sidebars = {
  learnSidebar: [
    {
      type: 'category',
      label: 'Track 1 — Foundations',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Linux',
          collapsed: false,
          items: [
            'track-1/linux/intro',
            'track-1/linux/file-system',
            'track-1/linux/quiz-file-system',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
