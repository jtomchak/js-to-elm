import React from "react";
import Helmet from "react-helmet";
import Post from "../components/Post";
import Episode from "../components/Episode";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

class IndexRoute extends React.Component {
  render() {
    console.log(this.props);
    const items = [];
    const { title, subtitle } = this.props.data.site.siteMetadata;
    //Possible use for micro posting
    // const posts = this.props.data.allMarkdownRemark.edges;
    // posts.forEach(post => {
    //   items.push(<Post data={post} key={post.node.fields.slug} />);
    // });
    const episodeItems = this.props.data.allContentfulEpisode.edges.map(episode => (
      <Episode data={episode} key={episode.node.slug} />
    ));
    console.log(episodeItems, items);
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={subtitle} />
        </Helmet>
        <Sidebar {...this.props} />
        <div className="content">
          <div className="content__inner">{episodeItems}</div>
          <Footer />
        </div>
      </div>
    );
  }
}

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
