const _ = require("lodash");
const Promise = require("bluebird");
const path = require("path");
const lost = require("lost");
const pxtorem = require("postcss-pxtorem");
const slash = require("slash");
const paginationPages = require("./src/libs/pagination");

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  const { createRedirect } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve("./src/templates/post-template.jsx");
    const eposideTemplate = path.resolve("./src/templates/episode-template.jsx");
    const pageTemplate = path.resolve("./src/templates/page-template.jsx");
    const tagTemplate = path.resolve("./src/templates/tag-template.jsx");
    const categoryTemplate = path.resolve("./src/templates/category-template.jsx");

    graphql(`
      {
        allMarkdownRemark(limit: 1000, filter: { frontmatter: { draft: { ne: true } } }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
                layout
                category
              }
            }
          }
        }
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

      _.each(result.data.allMarkdownRemark.edges, edge => {
        if (_.get(edge, "node.frontmatter.layout") === "page") {
          createPage({
            path: edge.node.fields.slug,
            component: slash(pageTemplate),
            context: { slug: edge.node.fields.slug }
          });
        } else if (_.get(edge, "node.frontmatter.layout") === "post") {
          createPage({
            path: edge.node.fields.slug,
            component: slash(postTemplate),
            context: { slug: edge.node.fields.slug }
          });

          let tags = [];
          if (_.get(edge, "node.frontmatter.tags")) {
            tags = tags.concat(edge.node.frontmatter.tags);
          }

          tags = _.uniq(tags);
          _.each(tags, tag => {
            const tagPath = `/tags/${_.kebabCase(tag)}/`;
            createPage({
              path: tagPath,
              component: tagTemplate,
              context: { tag }
            });
          });

          let categories = [];
          if (_.get(edge, "node.frontmatter.category")) {
            categories = categories.concat(edge.node.frontmatter.category);
          }

          categories = _.uniq(categories);
          _.each(categories, category => {
            const categoryPath = `/categories/${_.kebabCase(category)}/`;
            createPage({
              path: categoryPath,
              component: categoryTemplate,
              context: { category }
            });
          });
        }
      });

      _.each(result.data.allContentfulEpisode.edges, edge => {
        if (_.get(edge, "node.parent.id") === "Episode") {
          //creating episode pagination
          paginationPages({
            edges: result.data.allContentfulEpisode.edges,
            createPage: createPage,
            pageTemplate: "./src/pages/episodes.jsx",
            pageLength: 1,
            pathPrefix: "episodes",
            buildPath: (index, pathPrefix) =>
              index > 1 ? `${pathPrefix}/${index}` : `/${pathPrefix}` // This is optional and this is the default
          });
          //creating each page for full episode notes
          const episodePath = `/episodes/${edge.node.slug}`;
          createPage({
            path: episodePath,
            component: slash(eposideTemplate),
            context: { slug: edge.node.slug }
          });
          //create redirect for root
          // One-off redirect, note trailing slash missing on fromPath and
          // toPath here.
          createRedirect({
            fromPath: `/`,
            isPermanent: true,
            redirectInBrowser: true,
            toPath: `/episodes`
          });
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

    if (node.frontmatter.tags) {
      const tagSlugs = node.frontmatter.tags.map(tag => `/tags/${_.kebabCase(tag)}/`);
      createNodeField({ node, name: "tagSlugs", value: tagSlugs });
    }

    if (typeof node.frontmatter.category !== "undefined") {
      const categorySlug = `/categories/${_.kebabCase(node.frontmatter.category)}/`;
      createNodeField({ node, name: "categorySlug", value: categorySlug });
    }
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
