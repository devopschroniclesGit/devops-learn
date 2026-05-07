import { themes as prismThemes } from 'prism-react-renderer';

const config = {
  title: 'DevOps Learn',
  tagline: 'Structured DevOps learning — from Linux to Kubernetes.',
  favicon: 'img/favicon.ico',

  url: 'https://devopschroniclesgit.github.io',
  baseUrl: '/devops-learn',

  organizationName: 'devopschroniclesGit',
  projectName: 'devops-learn',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig: ({
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'DevOps Learn',
      logo: {
        alt: 'DevOps Chronicles',
        src: 'img/logo-light.png',
        srcDark: 'img/logo-dark.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'learnSidebar',
          position: 'left',
          label: 'Courses',
        },
        {
          href: 'https://devopschronicles.com',
          label: 'Main site →',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tracks',
          items: [
            { label: 'Track 1 — Foundations', to: '/track-1/linux/intro' },
          ],
        },
        {
          title: 'DevOps Chronicles',
          items: [
            { label: 'Main site', href: 'https://devopschronicles.com' },
            { label: 'GitHub', href: 'https://github.com/devopschroniclesGit' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} DevOps Chronicles`,
    },

    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'yaml', 'hcl', 'docker', 'nginx', 'python'],
    },
  }),
};

export default config;
