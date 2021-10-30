export default function MiniPost(props: {
  // post: Post;
}): JSX.Element {

  const post = {
    title: 'Post title',
    description: 'Post description',
    date: '2020-01-01',
    view: '1',
    isLocked: false,
    image: ''
  }

  return (
    <div className="mini-post">
      <div className="mini-post-image">
        <img src={post.image} alt="post" />
      </div>
      <div className="mini-post-content">
        <h3>{post.title}</h3>
        {/* <p>{post.content}</p> */}
      </div>
    </div>
  );
}