import React, { useState } from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Rating, Button, Box, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import IComment from '../../data_interfaces/IComment';
import { storageUsernameKey } from "../../data_services/CustomAxios";
import CommentDS from '../../data_services/CommentDS';

interface CommentProps {
    comment: IComment;
    onUpdate: (updatedComment: IComment) => void;
    onDelete: (commentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onUpdate, onDelete }) => {
    const isAuthor = localStorage.getItem(storageUsernameKey) === comment.user.username;
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.body);
    const [editedRating, setEditedRating] = useState(comment.rating);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleSave = () => {
        const updatedComment = { ...comment, body: editedComment, rating: editedRating };
        CommentDS.edit(updatedComment).then(onUpdate);
        setIsEditing(false);
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        CommentDS.remove(comment).then(() => {
            onDelete(comment.id);
            setDeleteDialogOpen(false);
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString();
    };

    return (
        <>
            <Card style={{ 
                marginBottom: '16px',
                backgroundColor: isAuthor ? '#f5f5f5' : 'white'
            }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar src={comment.user.profile_picture} />
                        </Grid>
                        <Grid item xs>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>{comment.user.username}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                            Created: {formatDate(comment.created_at)}
                                            {comment.updated_at !== comment.created_at && 
                                                ` • Edited: ${formatDate(comment.updated_at)}`}
                                </Typography>
                            </Box>
                            {isEditing ? (
                                <>
                                    <Rating
                                        value={editedRating}
                                        onChange={(event, newValue) => setEditedRating(newValue || 0)}
                                        precision={0.5}
                                    />
                                    <TextField
                                        value={editedComment}
                                        onChange={(e) => setEditedComment(e.target.value)}
                                        multiline
                                        fullWidth
                                    />
                                </>
                            ) : (
                                <>
                                    
                                    <Rating value={comment.rating} readOnly precision={0.5} />
                                    <Typography variant="body1">{comment.body}</Typography>
                                    
                                </>
                            )}
                            {isAuthor && (
                                <Box sx={{ mt: 2 }}>
                                    {isEditing ? (
                                        <>
                                            <Button color="primary" sx={{ mr: 1 }} onClick={handleSave}>
                                                Save
                                            </Button>
                                            <Button color="secondary" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button color="primary" sx={{ mr: 1 }} onClick={() => setIsEditing(true)}>
                                                Edit
                                            </Button>
                                            <Button color="error" onClick={handleDelete}>
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this comment?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Comment;
