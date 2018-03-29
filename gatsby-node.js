const _ = require("lodash");
const Promise = require("bluebird");
const path = require("path");
const lost = require("lost");
const pxtorem = require("postcss-pxtorem");
const slash = require("slash");
const { createPaginationPages } = require("gatsby-pagination");

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  const { createRedirect } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const eposideTemplate = path.resolve("./src/templates/episode-template.jsx");

    graphql(`
      {
        allContentfulEpisode(
          limit: 1000
          filter: { draft: { ne: true } }
          sort: { order: DESC, fields: [published] }
        ) {
          edges {
            node {
              parent {
                id
              }
              id
              title
              slug
              published
              summary {
                id
                internal {
                  content
                }
              }
              article {
                id
              }
              audioUrl
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        console.log(result.errors);
        reject(result.errors);
      }

      console.log(result.data.allContentfulEpisode.edges);
      _.each(result.data.allContentfulEpisode.edges, edge => {
        if (_.get(edge, "node.parent.id") === "Episode") {
          //creating episode pagination
          createPaginationPages({
            createPage: createPage,
            edges: result.data.allContentfulEpisode.edges,
            component: path.resolve("src/templates/index.jsx"),
            limit: 5
          });
          //creating each page for full episode notes
          const episodePath = `episodes/${edge.node.slug}`;
          createPage({
            path: episodePath,
            component: slash(eposideTemplate),
            context: { slug: edge.node.slug }
          });
          //create redirect for root
          // One-off redirect, note trailing slash missing on fromPath and
          // toPath here.
        }
      });

      resolve();
    });
  });
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === "File") {
    const parsedFilePath = path.parse(node.absolutePath);
    const slug = `/${parsedFilePath.dir.split("---")[1]}/`;
    createNodeField({ node, name: "slug", value: slug });
  } else if (node.internal.type === "MarkdownRemark" && typeof node.slug === "undefined") {
    const fileNode = getNode(node.parent);
    let slug = fileNode.fields ? fileNode.fields.slug : fileNode.slug;
    if (typeof node.frontmatter.path !== "undefined") {
      slug = node.frontmatter.path;
    }
    createNodeField({
      node,
      name: "slug",
      value: slug
    });
  }
};

exports.modifyWebpackConfig = ({ config }) => {
  config.merge({
    postcss: [
      lost(),
      pxtorem({
        rootValue: 16,
        unitPrecision: 5,
        propList: [
          "font",
          "font-size",
          "line-height",
          "letter-spacing",
          "margin",
          "margin-top",
          "margin-left",
          "margin-bottom",
          "margin-right",
          "padding",
          "padding-top",
          "padding-left",
          "padding-bottom",
          "padding-right",
          "border-radius",
          "width",
          "max-width"
        ],
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0
      })
    ]
  });
};

/*
Query for contentful Episodes
{
  allContentfulEpisode {
    edges {
      node {
        id
        title
        draft
        published
        slug
        summary {
          id
          internal {
            content
          }
        }
        article {
          id
          internal {
            type
          }
        }
      }
    }
  }
}
*/
