import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import Comment from "./Comment";
import WriteCommentArea from "./WriteCommentArea";
import { storageAccessTokenKey } from "../../data_services/CustomAxios";
import CommentDS from "../../data_services/CommentDS";
import IComment from "../../data_interfaces/IComment";
import { useState, useEffect } from "react";
import { storageUsernameKey } from "../../data_services/CustomAxios";

const CommentSection: React.FC = () => {
    const [comments, setComments] = useState<IComment[]>([]);

    function fetchComments() {
        CommentDS.get().then((comments) => {
            setComments(comments);
        });
    }

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "auto", mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Comments
            </Typography>
            {
                localStorage.getItem(storageAccessTokenKey) // If user is logged in
                && !comments.some((comment) => comment.user.username === localStorage.getItem(storageUsernameKey)) // If user has not commented yet
                && <WriteCommentArea onSubmit={fetchComments} />}
                <Divider sx={{ my: 2 }} />
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onUpdate={fetchComments}
                        onDelete={fetchComments}
                    />
                ))}
        </Box>
    );
};

export default CommentSection;
