import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import Post from "../components/Post";
import Episode from "../components/Episode";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const IndexRoute = props => {
  const { data, pathContext } = props;
  const { title, subtitle } = data.site.siteMetadata;
  const { nodes, page, prev, next, pages, total, limit } = pathContext;
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={subtitle} />
      </Helmet>
      <Sidebar {...props} />
      <div className="content">
        <div className="content__inner">
          {nodes.map(episode => <Episode data={episode} key={episode.node.slug} />)}
        </div>
        <div className="episodes__pagination">
          {prev && (
            <Link className="episodes__pag-button" to={prev}>
              Previous
            </Link>
          )}

          {next && (
            <Link className="episodes__pag-button" to={next}>
              Next
            </Link>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default IndexRoute;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        subtitle
        copyright
        menu {
          label
          path
          localPath
        }
        author {
          name
          email
          twitter
          rss
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
          audioUrl
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
`;
