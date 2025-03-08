import { Property } from "csstype";
import { Card, CardActionArea, CardMedia } from "@mui/material";

type PlayingCardSideProps = {
    bgColor?: Property.BackgroundColor;
    emoji: string;
    onClick?: () => void;
	imageSrc?: string | undefined;
};

export default function PlayingCardSide({
    bgColor,
    emoji,
    imageSrc,
    onClick,
}: PlayingCardSideProps) {
    return (
        <Card onClick={onClick}>
            {imageSrc ? (
                <CardMedia
                    component="img"
                    height="100"
                    image={imageSrc}
                    alt="card image"
                />
            ) : (
                <CardActionArea
                    sx={{
                        alignItems: "center",
                        backgroundColor: bgColor,
                        display: "flex",
                        fontSize: 24,
                        height: 100,
                        justifyContent: "center",
                    }}
                >
                    {emoji}
                </CardActionArea>
            )}
        </Card>
    );
}
