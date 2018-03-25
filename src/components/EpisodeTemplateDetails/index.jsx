import React from "react";
import Link from "gatsby-link";
import moment from "moment";
import Disqus from "../Disqus/Disqus";
import "./style.scss";
import Episode from "../Episode/index";

class EpisodeTemplateDetails extends React.Component {
  render() {
    const { subtitle, author } = this.props.data.site.siteMetadata;
    const episode = this.props.data.contentfulEpisode;

    const homeBlock = (
      <div>
        <Link className="post-single__home-button" to="/">
          All Episodes
        </Link>
      </div>
    );
    const episodeHTML = episode.childContentfulEpisodeArticleTextNode.childMarkdownRemark.html;

    return (
      <div>
        {homeBlock}
        <div className="post-single">
          <div className="post-single__inner">
            <h1 className="post-single__title">{episode.title}</h1>
            <div className="post-single__body" dangerouslySetInnerHTML={{ __html: episodeHTML }} />
            <div className="post-single__date">
              <em>Published {moment(episode.published).format("D MMM YYYY")}</em>
            </div>
          </div>
          <div className="post-single__footer">
            <hr />
            <p className="post-single__footer-text">
              {subtitle}
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <br /> <strong>{author.name}</strong> on Twitter
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default EpisodeTemplateDetails;
