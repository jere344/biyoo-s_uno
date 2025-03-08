import { useState, useEffect } from "react";
import { Container, Grid2, Typography, Paper, Button } from "@mui/material";
import IPlayingCard from "../data_interfaces/IPlayingCard";
import PlayingCard from "./PlayingCard";
import MemoryGameSettings from "./MemoryGameSettings";
import { storageAccessTokenKey } from "../data_services/CustomAxios";
import MemoryGameRules from "./MemoryGameRules";
import CommentSection from "./comments/CommentSection";
import { Link, useLocation } from "react-router-dom";

import IGamePlayed from "../data_interfaces/IGamePlayed";
import GamePlayedDS from "../data_services/GamePlayedDS";

const images = import.meta.glob("../assets/cards-images/*.jpg");
async function loadImages(count: number = 16) {
    const imageModules = await Promise.all(
        Object.keys(images)
            .sort(() => Math.random() - 0.5)
            .slice(0, count / 2)
            .map((key) => images[key]())
    );
    return imageModules.map((module) => module.default);
}

export default function MemoryGame() {
    const [cards, setCards] = useState<IPlayingCard[]>([]);
    const [selectedCards, setSelectedCards] = useState<IPlayingCard[]>([]);
    const [matches, setMatches] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [gameSize, setGameSize] = useState([4, 4]);

    const [cardBgColor, setCardBgColor] = useState("ghostwhite");
    const [showRules, setShowRules] = useState(false);

    // New state for showing/hiding the timer
    const [showTimer, setShowTimer] = useState(false);

    // Hold the current game for the game history
    const [gamePlayed, setGamePlayed] = useState<IGamePlayed | null>(null);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const location = useLocation();

    async function resetGame(newGameSize: [number, number] = [4, 4]) {
		setGameSize(newGameSize);
        setMatches(0);
        setAttempts(0);
        setCards([]);
        setSelectedCards([]);
        setGamePlayed(null);
        setTimer(0);
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        // remove url params
        window.history.replaceState({}, document.title, "/");

        loadImages(newGameSize[0] * newGameSize[1]).then((cardImages) => {
            const shuffledCards: IPlayingCard[] = [...cardImages, ...cardImages].map(
                (emoji, index) =>
                    ({
                        id: index,
                        emoji,
                        flipped: false,
                        matched: false,
                    } as IPlayingCard)
            );
			shuffledCards.sort(() => Math.random() - 0.5);
            setCards(shuffledCards);
        });
    }

    const tryFlipCard = (cardToFlip: IPlayingCard) => {
        if (!cardToFlip.flipped && selectedCards.length < 2) {
            setCards((prev) => prev.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: true } : card)));
            setSelectedCards((prev) => [...prev, cardToFlip]);
        }
    };

    const updateGamePlayed = () => {
        const game_finished = matches === (gameSize[0] * gameSize[1]) / 2;

        if (gamePlayed == null) {
            GamePlayedDS.create({
                game_level: gameSize.join("x"),
                game_duration: 0,
                game_tries: 1,
                game_score: 0,
                game_finished: false,
                game_state: {
                    cards: cards,
                },
            }).then((game) => {
                setGamePlayed(game);
            });
        } else {
            GamePlayedDS.edit({
                ...gamePlayed,
                game_duration: timer,
                game_tries: attempts,
                game_score: matches,
                game_finished: game_finished,
                game_state: {
                    cards: cards,
                },
            }).then((game) => {
                setGamePlayed(game);
            });
        }

        // create/update the timer :
        if (game_finished) {
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
        } else {
            if (!intervalId) {
                const interval = setInterval(() => {
                    setTimer((prev) => prev + 1);
                }, 1000);
                setIntervalId(interval);
            }
        }
    };

    // on first load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const continueGameId = params.get("continue");
        if (continueGameId != null) {
            GamePlayedDS.getOne(continueGameId).then((game) => {
				setGameSize(game.game_level.split("x").map(Number));
                setMatches(game.game_score);
                setAttempts(game.game_tries);
                setTimer(game.game_duration);
                setGamePlayed(game);
                setCards(game.game_state.cards);
                setSelectedCards([]);
            });
        } else {
            resetGame();
        }
	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // when a game is started
    useEffect(() => {
        if (selectedCards.length === 2) {
            const [firstCard, secondCard] = selectedCards;
            if (firstCard.emoji === secondCard.emoji) {
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((card) =>
                            card.id === firstCard.id || card.id === secondCard.id ? { ...card, matched: true } : card
                        )
                    );
                    setMatches((prev) => prev + 1);
                }, 600);
            } else {
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((card) =>
                            card.id === firstCard.id || card.id === secondCard.id ? { ...card, flipped: false } : card
                        )
                    );
                }, 1000);
            }
            setAttempts((prev) => prev + 1);
            setSelectedCards([]);
        }
    }, [cards, selectedCards]);

    // when a card is flipped
    useEffect(() => {
        if (attempts > 0 && localStorage.getItem(storageAccessTokenKey)) {
            updateGamePlayed();
        }
	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attempts, matches]);

    return (
        <Container maxWidth="sm" sx={{ marginY: "1rem" }}>
            <Paper style={{ padding: "1rem", textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Jeu de Mémoire
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowRules(true)}
                    sx={{ marginBottom: "1rem" }}
                >
                    Voir les règles
                </Button>
                <Typography color="primary" variant="h6" sx={{ marginBottom: "2rem" }}>
                    Tentatives : {attempts}
                    <br />
                    Paires trouvées : {matches}
                    {showTimer && (
                        <>
                            <br />
                            Temps : {timer}s
                        </>
                    )}
                </Typography>
                <Grid2 container spacing={2} justifyContent="center">
                    {cards.map((card) => (
                        <Grid2 key={card.id} size={{ xs: 12 / gameSize[0] }}>
                            <PlayingCard card={card} onSelect={tryFlipCard} bgColor={cardBgColor} />
                        </Grid2>
                    ))}
                </Grid2>
                {matches === (gameSize[0] * gameSize[1]) / 2 && (
                    <Container>
                        <Typography variant="h5" color="secondary" sx={{ marginTop: "2rem" }}>
                            Bravo, vous avez trouvé toutes les paires !
                        </Typography>
                        <Button variant="contained" color="primary" onClick={resetGame} sx={{ marginTop: "1rem" }}>
                            Recommencer
                        </Button>
                    </Container>
                )}
                <Button
                    component={Link}
                    to="/game-history"
                    variant="outlined"
                    color="secondary"
                    sx={{ marginTop: "1rem" }}
                >
                    Voir l'historique des jeux
                </Button>
            </Paper>
            {localStorage.getItem(storageAccessTokenKey) && (
                <MemoryGameSettings
                    setGameSize={setGameSize}
                    gameSize={gameSize}
                    setCardBgColor={setCardBgColor}
                    showTimer={showTimer}
                    setShowTimer={setShowTimer}
                    resetGame={resetGame}
                />
            )}
            <MemoryGameRules open={showRules} onClose={() => setShowRules(false)} />
            <CommentSection />
        </Container>
    );
}
