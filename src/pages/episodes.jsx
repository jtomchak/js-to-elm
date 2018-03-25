import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import Post from "../components/Post";
import Episode from "../components/Episode";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

class EpisodeRoute extends React.Component {
  render() {
    const items = [];
    const { title, subtitle } = this.props.data.site.siteMetadata;
    const { index, first, last, pageCount, pathPrefix } = this.props.pathContext;
    const previousUrl = index - 1 == 1 ? "/" : `/${(index - 1).toString()}/`;
    const nextUrl = (index + 1).toString();
    //Possible use for micro posting
    // const posts = this.props.data.allMarkdownRemark.edges;
    // posts.forEach(post => {
    //   items.push(<Post data={post} key={post.node.fields.slug} />);
    // });
    const group = this.props.pathContext.group || [];
    const episodeItems = group.map(episode => <Episode data={episode} key={episode.node.slug} />);
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={subtitle} />
        </Helmet>
        <Sidebar {...this.props} />
        <div className="content">
          <div className="content__inner">{episodeItems}</div>
          <div className="episodes__pagination">
            {!first && (
              <Link className="episodes__pag-button" to={`/${pathPrefix}${previousUrl}`}>
                Previous
              </Link>
            )}

            {!last && (
              <Link className="episodes__pag-button" to={`/${pathPrefix}/${nextUrl}`}>
                Next
              </Link>
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default EpisodeRoute;

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
    allMarkdownRemark(
      limit: 1000
      filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;
