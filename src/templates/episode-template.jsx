import React from "react";
import Helmet from "react-helmet";
import EpisodeTemplateDetails from "../components/EpisodeTemplateDetails";

class EpisodeTemplate extends React.Component {
  render() {
    const { title, subtitle } = this.props.data.site.siteMetadata;
    const episode = this.props.data.contentfulEpisode;
    const { title: episodeTitle, summary: episodeSummary } = episode;
    // const description = postDescription !== null ? postDescription : subtitle;

    return (
      <div>
        <title>{`${episodeTitle} - ${title}`}</title>
        <meta name="description" content={episodeSummary} />
        <EpisodeTemplateDetails {...this.props} />
      </div>
    );
  }
}

export default EpisodeTemplate;

export const pageQuery = graphql`
  query EpisodeBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        subtitle
        copyright
        author {
          name
          twitter
        }
        disqusShortname
        url
      }
    }
    contentfulEpisode(slug: { eq: $slug }) {
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
          content
        }
      }
      childContentfulEpisodeArticleTextNode {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;
