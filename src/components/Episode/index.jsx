import React from "react";
import Link from "gatsby-link";
import moment from "moment";
import "./style.scss";

class Episode extends React.Component {
  render() {
    const { title, published, slug, summary } = this.props.data.node;
    // const { slug, categorySlug } = this.props.data.node.fields;

    return (
      <div className="post">
        <div className="post__meta">
          <time className="post__meta-time" dateTime={moment(published).format("MMMM D, YYYY")}>
            {moment(published).format("MMMM  YYYY")}
          </time>
          <span className="post__meta-divider" />
        </div>
        <h2 className="post__title">
          <Link className="post__title-link" to={slug}>
            {title}
          </Link>
        </h2>
        <p className="post__description">{summary.internal.content}</p>
        <Link className="post__readmore" to={slug}>
          Read
        </Link>
      </div>
    );
  }
}

export default Episode;