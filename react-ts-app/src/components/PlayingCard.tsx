import ReactCardFlip from "react-card-flip";
import IPlayingCard from "../data_interfaces/IPlayingCard";
import PlayingCardSide from "./PlayingCardSide";

type PlayingCardProps = {
  card: IPlayingCard;
  onSelect?: (card: IPlayingCard) => void;
  bgColor?: string;
};

export default function PlayingCard({ card, onSelect, bgColor }: PlayingCardProps) {
  const handleBackClick = () => {
    if (onSelect) {
      onSelect(card);
    }
  };

  return (
    <>
      {card.matched ? (
        <PlayingCardSide imageSrc={card.emoji}
        />
      ) : (
        <ReactCardFlip isFlipped={card.flipped}>
          <PlayingCardSide
            bgColor={bgColor || "ghostwhite"}
            emoji="❓"
            onClick={handleBackClick}
          />
          <PlayingCardSide imageSrc={card.emoji} />
        </ReactCardFlip>
      )}
    </>
  );
}
