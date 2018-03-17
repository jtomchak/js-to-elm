require("dotenv").config();

module.exports = {
  siteMetadata: {
    url: "https://jstoelm.com",
    title: "JSToElm",
    subtitle:
      "A show about learning Elm, Functional Programing, and generally leveling up as a JS developer.",
    copyright: "© All rights reserved.",
    disqusShortname: "",
    menu: [
      {
        label: "Episodes",
        path: "/"
      },
      {
        label: "iTunes",
        path: "https://itunes.apple.com/us/podcast/javascript-to-elm/id1272026213?mt=2"
      },
      {
        label: "RSS",
        path: "http://jstoelm.libsyn.com/rss"
      },
      {
        label: "GooglePlay",
        path: "http://jstoelm.libsyn.com/gpm"
      },
      {
        label: "Overcast",
        path: "https://overcast.fm/itunes1272026213/javascript-to-elm"
      }
    ],
    author: {
      name: "JavaScript To Elm",
      email: "contact@jstoelm.com",
      telegram: "#",
      twitter: "@jstoelm",
      github: "@jtomchak",
      rss: "rss.xml",
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
        spaceId: process.env.CONTENTFUL_ID || "",
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || ""
      }
    },
    "gatsby-plugin-offline",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-postcss-sass"
  ]
};
