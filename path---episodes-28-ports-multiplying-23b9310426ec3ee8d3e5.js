webpackJsonp([0x8fb607b317d4],{403:function(n,t){n.exports={data:{site:{siteMetadata:{title:"JSToElm",subtitle:"A show about learning Elm, Functional Programing, and generally leveling up as a JS developer.",copyright:"© All rights reserved.",author:{name:"JavaScript To Elm",twitter:"@jstoelm"},disqusShortname:"",url:"https://jstoelm.com"}},contentfulEpisode:{id:"c7MXvIls59YCugAQ4Qg6S8Y",title:"28: Ports Multiplying",draft:!1,published:"2018-03-08",slug:"28-ports-multiplying",summary:{id:"c7MXvIls59YCugAQ4Qg6S8YsummaryTextNode",internal:{content:"We are back to meow notes, adding our onClick event from Elm back to React to route either to a new note, or an existing note by note.id. This is going to require us to poke another hole in our ports, but remember Murphy's warning, not to treat this like http methods, so lets keep that in mind as we move forward. "}},article:{id:"c7MXvIls59YCugAQ4Qg6S8YarticleTextNode",internal:{type:"contentfulEpisodeArticleTextNode",content:'## Extra Type Alias\n* I had made a `type alias Notes = List Note`\n* Mostly because the compiler was complaining at one point, and I wasn\'t able to see to distill from it that all I needed was some parentheses around `List Note` to disambiguate it. \n\n\n## Tackling the onClick event\n\n```\nList.map (\\n -> Listgroup.li \n        [ onClick (routeTo "/notes/" ++ n.noteId) ] \n        [ text n.content ]) notes\n```\n\n* that was my first thought, but..\n\n```\nThe 1st argument to function `li` is causing a mismatch. - Function `li` is expecting the 1st argument to be:\n\n    List (Listgroup.ItemOption msg)\n\nBut it is:\n\n    List (Html.Attribute a)\n```\n\n grrrrrr\n\n\n```\nList (Html.Attribute msg)\n\nBut the right side is:\n\n    Html.Attribute Msg\n```\n* What I finally got \n\n\n```\nListgroup.button\n    [ Listgroup.attrs <| [ onClick (SetRoute ("/notes/" ++ n.noteId)) ]\n```\n\n\n* Ok got that sorted, sending an Html msg, and in the update function calling the ports function routeTo with the built string. \n* What\'s the title look like? Used to be..\n\n\n```js\nheader={note.content.trim().split("\\n")[0]}\n```\n\n* Now it looks like\n\n```\n--good\nMaybe.withDefault "Note Title" (List.head (String.lines content))\n\n--better\nMaybe.withDefault "Note Title" (n.content <| String.lines <| List.head) --backwords\n\n--best\nMaybe.withDefault "Note Title" (n.content |> String.lines |> List.head) \n```\n\n* saw the nested, and remembered that\'s why the Pizza Operator, er, Pipe Operator\n* I also did it backwards the first time. lol\n\n\n## Too Many Ports, our ship is sinking\n* too many ports sink ships, but what I want is working code first, I\'m not trying to refactor this in my head, **NO WAY**\n\n\n```js\n//init setup for ports\n  setupPorts = ports => {\n    ports.fetchNotes.subscribe(path => {\n      invokeApig({ path: path, queryParams: { limit: 5 } })\n        .then(results => ports.notesLoaded.send(results))\n        .catch(e => console.log(e));\n    });\n    ports.routeTo.subscribe(url => {\n      this.props.history.push(url);\n    });\n  };\n```\n\n\n* So let\'s try to consolidate some stuff. We don\'t need two elm files rendering for the Home component, let\'s pass the isAuthenticated prop into Elm and have that do it for us\n    * So how do we do multiple subscriptions?\n    * Batch of course! \n    * So we send in the props value, \n    * and this works, `ports.isAuthenticated.send(this.props.isAuthenticated);`\n    * but I\'m not super happy with it....\n    * React lifecycle methods to the rescue, \n        * instead of calling isAuthenticated.send we assign it to updateAuth and now we can call it on mount and when component received new props, **NOT** just when we instantiate our Elm Home Component. \n        * Must better. \n\n\n\n## Picks\n* [On Yeah Atom with X-ray!](https://github.com/atom/xray)\n* [Too many coding tools put up big barriers to your creativity by requiring tons of setup, having lots of confusing and complicated features, or by letting jerks run rampant in the community. With Glitch, we\'re rolling out the red carpet to welcome creators just like you.](https://glitch.com/about/)\n\n\n\n## Resources\n* [Murphy\'s The Importance of Ports](https://www.youtube.com/watch?v=P3pL85n9_5s)\n* [Using Elm in React](https://codeburst.io/using-elm-in-react-from-the-ground-up-e3866bb0369d)\n* [Elm Functions – Syntax, Piping and Currying](https://dennisreimann.de/articles/elm-functions.html)\n* [From React To Elm](http://sebastianporto.com/blog/posts/2017/from-react-to-elm/)\n* [Interacting with the DOM Element using Elm](https://vincent.jousse.org/en/tech/interacting-with-dom-element-using-elm-audio-video/)\n* [Elm Elixir-Phoenix Functional Full Stack](https://teamgaslight.com/blog/elm-elixir-and-phoenix-reflecting-on-a-functional-full-stack-project)\n\n## Follow\n\n* JavaScript to Elm\n  * Twitter: [@jstoelm](https://twitter.com/jstoelm)\n  * Email: [hello@jstoelm.com](mailto:hello@jstoelm.com)\n* Jesse Tomchak\n  * Twitter: [@jtomchak](https://twitter.com/jtomchak)'}},childContentfulEpisodeArticleTextNode:{childMarkdownRemark:{html:'<h2>Extra Type Alias</h2>\n<ul>\n<li>I had made a <code>type alias Notes = List Note</code></li>\n<li>Mostly because the compiler was complaining at one point, and I wasn’t able to see to distill from it that all I needed was some parentheses around <code>List Note</code> to disambiguate it. </li>\n</ul>\n<h2>Tackling the onClick event</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">List.map (\\n -> Listgroup.li \n        [ onClick (routeTo "/notes/" ++ n.noteId) ] \n        [ text n.content ]) notes</code></pre>\n      </div>\n<ul>\n<li>that was my first thought, but..</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">The 1st argument to function `li` is causing a mismatch. - Function `li` is expecting the 1st argument to be:\n\n    List (Listgroup.ItemOption msg)\n\nBut it is:\n\n    List (Html.Attribute a)</code></pre>\n      </div>\n<p> grrrrrr</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">List (Html.Attribute msg)\n\nBut the right side is:\n\n    Html.Attribute Msg</code></pre>\n      </div>\n<ul>\n<li>What I finally got </li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">Listgroup.button\n    [ Listgroup.attrs <| [ onClick (SetRoute ("/notes/" ++ n.noteId)) ]</code></pre>\n      </div>\n<ul>\n<li>Ok got that sorted, sending an Html msg, and in the update function calling the ports function routeTo with the built string. </li>\n<li>What’s the title look like? Used to be..</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js">header<span class="token operator">=</span><span class="token punctuation">{</span>note<span class="token punctuation">.</span>content<span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">"\\n"</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<ul>\n<li>Now it looks like</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">--good\nMaybe.withDefault "Note Title" (List.head (String.lines content))\n\n--better\nMaybe.withDefault "Note Title" (n.content <| String.lines <| List.head) --backwords\n\n--best\nMaybe.withDefault "Note Title" (n.content |> String.lines |> List.head) </code></pre>\n      </div>\n<ul>\n<li>saw the nested, and remembered that’s why the Pizza Operator, er, Pipe Operator</li>\n<li>I also did it backwards the first time. lol</li>\n</ul>\n<h2>Too Many Ports, our ship is sinking</h2>\n<ul>\n<li>too many ports sink ships, but what I want is working code first, I’m not trying to refactor this in my head, <strong>NO WAY</strong></li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token comment">//init setup for ports</span>\n  <span class="token function-variable function">setupPorts</span> <span class="token operator">=</span> ports <span class="token operator">=></span> <span class="token punctuation">{</span>\n    ports<span class="token punctuation">.</span>fetchNotes<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>path <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token function">invokeApig</span><span class="token punctuation">(</span><span class="token punctuation">{</span> path<span class="token punctuation">:</span> path<span class="token punctuation">,</span> queryParams<span class="token punctuation">:</span> <span class="token punctuation">{</span> limit<span class="token punctuation">:</span> <span class="token number">5</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>results <span class="token operator">=></span> ports<span class="token punctuation">.</span>notesLoaded<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>results<span class="token punctuation">)</span><span class="token punctuation">)</span>\n        <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>e <span class="token operator">=></span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    ports<span class="token punctuation">.</span>routeTo<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>url <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>history<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<ul>\n<li>\n<p>So let’s try to consolidate some stuff. We don’t need two elm files rendering for the Home component, let’s pass the isAuthenticated prop into Elm and have that do it for us</p>\n<ul>\n<li>So how do we do multiple subscriptions?</li>\n<li>Batch of course! </li>\n<li>So we send in the props value, </li>\n<li>and this works, <code>ports.isAuthenticated.send(this.props.isAuthenticated);</code></li>\n<li>but I’m not super happy with it…</li>\n<li>\n<p>React lifecycle methods to the rescue, </p>\n<ul>\n<li>instead of calling isAuthenticated.send we assign it to updateAuth and now we can call it on mount and when component received new props, <strong>NOT</strong> just when we instantiate our Elm Home Component. </li>\n<li>Must better. </li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n<h2>Picks</h2>\n<ul>\n<li><a href="https://github.com/atom/xray">On Yeah Atom with X-ray!</a></li>\n<li><a href="https://glitch.com/about/">Too many coding tools put up big barriers to your creativity by requiring tons of setup, having lots of confusing and complicated features, or by letting jerks run rampant in the community. With Glitch, we’re rolling out the red carpet to welcome creators just like you.</a></li>\n</ul>\n<h2>Resources</h2>\n<ul>\n<li><a href="https://www.youtube.com/watch?v=P3pL85n9_5s">Murphy’s The Importance of Ports</a></li>\n<li><a href="https://codeburst.io/using-elm-in-react-from-the-ground-up-e3866bb0369d">Using Elm in React</a></li>\n<li><a href="https://dennisreimann.de/articles/elm-functions.html">Elm Functions – Syntax, Piping and Currying</a></li>\n<li><a href="http://sebastianporto.com/blog/posts/2017/from-react-to-elm/">From React To Elm</a></li>\n<li><a href="https://vincent.jousse.org/en/tech/interacting-with-dom-element-using-elm-audio-video/">Interacting with the DOM Element using Elm</a></li>\n<li><a href="https://teamgaslight.com/blog/elm-elixir-and-phoenix-reflecting-on-a-functional-full-stack-project">Elm Elixir-Phoenix Functional Full Stack</a></li>\n</ul>\n<h2>Follow</h2>\n<ul>\n<li>\n<p>JavaScript to Elm</p>\n<ul>\n<li>Twitter: <a href="https://twitter.com/jstoelm">@jstoelm</a></li>\n<li>Email: <a href="mailto:hello@jstoelm.com">hello@jstoelm.com</a></li>\n</ul>\n</li>\n<li>\n<p>Jesse Tomchak</p>\n<ul>\n<li>Twitter: <a href="https://twitter.com/jtomchak">@jtomchak</a></li>\n</ul>\n</li>\n</ul>'}}}},pathContext:{slug:"28-ports-multiplying"}}}});
//# sourceMappingURL=path---episodes-28-ports-multiplying-23b9310426ec3ee8d3e5.js.map