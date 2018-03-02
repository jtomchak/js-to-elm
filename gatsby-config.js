module.exports = {
  siteMetadata: {
    url: "https://jstoelm.com",
    title: "JSToElm",
    subtitle: "Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.",
    copyright: "© All rights reserved.",
    disqusShortname: "",
    menu: [
      {
        label: "Episodes",
        path: "/"
      },
      {
        label: "About",
        path: "/about/"
      },
      {
        label: "Contact me",
        path: "/contact/"
      }
    ],
    author: {
      name: "Jesse Tomchak",
      email: "#",
      telegram: "#",
      twitter: "#",
      github: "#",
      rss: "#",
      vk: "#"
    }
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages"
      }
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                site_url: url
                title
                description: subtitle
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge =>
                Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.description,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.site_url + edge.node.fields.slug,
                  guid: site.siteMetadata.site_url + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }]
                })
              ),
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        layout
                        draft
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml"
          }
        ]
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: { maxWidth: 960 }
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: { wrapperStyle: "margin-bottom: 1.0725rem" }
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants"
        ]
      }
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: { trackingId: "UA-73379983-2" }
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: { fonts: [`roboto\:400,400i,500,700`] }
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
            {
              site {
                siteMetadata {
                  url
                }
              }
              allSitePage(
                filter: {
                  path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
                }
              ) {
                edges {
                  node {
                    path
                  }
                }
              }
          }`,
        output: "/sitemap.xml",
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map(edge => ({
            url: site.siteMetadata.url + edge.node.path,
            changefreq: "daily",
            priority: 0.7
          }))
      }
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `bsndkuiop7u0`,
        accessToken: `6098b7d21f081c5308b572f8a2a111d18ab94bd66fe04f97ca8addfa443df3ee`
      }
    },
    "gatsby-plugin-offline",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-postcss-sass"
  ]
};