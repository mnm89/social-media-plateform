import Comment from './models/comment';
import Post from './models/post';
import { getUserAvatarUrl, getUserName } from './utils';

export async function initializeModelsHooks() {
  Post.addHook('afterFind', async (posts: Post | Post[] | null) => {
    if (!posts) return;

    // Ensure we're working with an array
    const postsArray = Array.isArray(posts) ? posts : [posts];

    // Fetch and bind author data for each comment
    await Promise.all(
      postsArray.map(async (post) => {
        // Set author fields on the comment instance
        post.setDataValue('authorName', await getUserName(post.userId));
        post.setDataValue('authorAvatar', await getUserAvatarUrl(post.userId));
        if (post.comments && post.comments.length > 0) {
          // Manually trigger the afterFind hook for each comment
          await Promise.all(
            post.comments.map(async (comment) => {
              // Set author fields on the comment instance
              comment.setDataValue(
                'authorName',
                await getUserName(comment.userId)
              );
              comment.setDataValue(
                'authorAvatar',
                await getUserAvatarUrl(comment.userId)
              );

              if (comment.replies && comment.replies.length > 0) {
                await Promise.all(
                  comment.replies.map(async (reply) => {
                    reply.setDataValue(
                      'authorName',
                      await getUserName(reply.userId)
                    );
                    reply.setDataValue(
                      'authorAvatar',
                      await getUserAvatarUrl(reply.userId)
                    );
                  })
                );
              }
            })
          );
        }
      })
    );
  });

  Comment.addHook('afterFind', async (comments: Comment | Comment[] | null) => {
    if (!comments) return;

    // Ensure we're working with an array
    const commentsArray = Array.isArray(comments) ? comments : [comments];

    // Fetch and bind author data for each comment
    await Promise.all(
      commentsArray.map(async (comment) => {
        // Set author fields on the comment instance
        comment.setDataValue('authorName', await getUserName(comment.userId));
        comment.setDataValue(
          'authorAvatar',
          await getUserAvatarUrl(comment.userId)
        );

        if (comment.replies && comment.replies.length > 0) {
          await Promise.all(
            comment.replies.map(async (reply) => {
              reply.setDataValue('authorName', await getUserName(reply.userId));
              reply.setDataValue(
                'authorAvatar',
                await getUserAvatarUrl(reply.userId)
              );
            })
          );
        }
      })
    );
  });
}
