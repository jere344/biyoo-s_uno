import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Rating, Paper } from '@mui/material';
import CommentDS from '../../data_services/CommentDS';

interface WriteCommentAreaProps {
    onSubmit: (comment: string, grade: number) => void;
}

const WriteCommentArea: React.FC<WriteCommentAreaProps> = ({ onSubmit }) => {
    const [comment, setComment] = useState('');
    const [grade, setGrade] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!comment.trim()) {
            setError('Please enter a comment');
            return;
        }
        if (!grade) {
            setError('Please select a rating');
            return;
        }

        CommentDS.create(comment, grade).then((comment) => {
            onSubmit(comment.body, comment.rating);
            setComment('');
            setGrade(null);
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Noter le jeux :</Typography>
                <Rating
                    name="grade"
                    value={grade}
                    onChange={(event, newValue) => {
                        setGrade(newValue);
                        setError('');
                    }}
                    precision={0.5}
                />
                <TextField
                    label="Comment"
                    multiline
                    rows={4}
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        setError('');
                    }}
                    variant="outlined"
                    fullWidth
                    error={!!error}
                    helperText={error}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default WriteCommentArea;