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
	    'track-1/linux/permissions',
	    'track-1/linux/quiz-permissions',
	    'track-1/linux/networking',
	    'track-1/linux/quiz-networking',
	    'track-1/linux/processes',
            'track-1/linux/quiz-processes',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
