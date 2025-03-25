import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import PersonIcon from "@mui/icons-material/Person";
import LeaderboardDS from "../data_services/LeaderboardDS";
import { IPublicUser } from "../data_interfaces/IUser";
import { useUser } from "../hooks/useUser";
import CustomAvatar from "@components/customAvatar/CustomAvatar";

// Medal colors
const MEDALS = {
    1: { color: "#FFD700", icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#FFD700" }} /> }, // Gold
    2: { color: "#C0C0C0", icon: <EmojiEventsIcon sx={{ fontSize: 36, color: "#C0C0C0" }} /> }, // Silver
    3: { color: "#CD7F32", icon: <EmojiEventsIcon sx={{ fontSize: 32, color: "#CD7F32" }} /> }, // Bronze
};

const Leaderboard: React.FC = () => {
    const { user } = useUser();
    const [leaderboardData, setLeaderboardData] = useState<IPublicUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<"games_won" | "games_played">("games_won");

    useEffect(() => {
        fetchLeaderboard();
    }, [sortBy]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await LeaderboardDS.getLeaderboard({ sort_by: sortBy, limit: 100 });
            setLeaderboardData(response.data);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (_event: React.MouseEvent<HTMLElement>, newSort: "games_won" | "games_played") => {
        if (newSort !== null) {
            setSortBy(newSort);
        }
    };

    // Calculate win rate percentage
    const calculateWinRate = (player: IPublicUser): string => {
        if (player.games_played === 0) return "0%";
        const winRate = (player.games_won / player.games_played) * 100;
        return `${Math.round(winRate)}%`;
    };

    // Find current user's rank
    const currentUserRank = leaderboardData.findIndex((player) => player.id === user?.id) + 1;

    // Podium players (top 3)
    const podiumPlayers = leaderboardData.slice(0, 3);
    // Other players after podium
    const otherPlayers = leaderboardData.slice(3);

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #9c27b0 100%)",
                backgroundSize: "cover",
                minHeight: "100vh",
                paddingY: 4,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('/assets/pattern_overlay.png')",
                    opacity: 0.07,
                    zIndex: 0,
                },
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            marginBottom: 4,
                            padding: 3,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: "15px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
                                letterSpacing: "3px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <StarIcon sx={{ fontSize: 40, marginRight: 2 }} /> CLASSEMENT
                        </Typography>

                        {currentUserRank > 0 && user && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Chip
                                    icon={<PersonIcon />}
                                    label={`Votre position: #${currentUserRank}`}
                                    sx={{
                                        padding: "16px 12px",
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                                        border: "2px solid #fff",
                                        color: "#fff",
                                        borderRadius: "25px",
                                        boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
                                        backdropFilter: "blur(5px)",
                                    }}
                                />
                            </motion.div>
                        )}
                    </Box>
                </motion.div>

                {/* Sort Controls */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 4,
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: "10px",
                            background: "rgba(0,0,0,0.5)",
                            borderRadius: "15px",
                        }}
                    >
                        <ToggleButtonGroup
                            value={sortBy}
                            exclusive
                            onChange={handleSortChange}
                            aria-label="sort by"
                            sx={{
                                "& .MuiToggleButton-root": {
                                    color: "white",
                                    borderColor: "rgba(255,255,255,0.3)",
                                    "&.Mui-selected": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: "#fff",
                                        fontWeight: "bold",
                                    },
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="games_won">
                                <MilitaryTechIcon sx={{ mr: 1 }} /> Parties Gagnées
                            </ToggleButton>
                            <ToggleButton value="games_played">
                                <SportsEsportsIcon sx={{ mr: 1 }} /> Parties Jouées
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Paper>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
                        <CircularProgress size={80} sx={{ color: "white" }} />
                    </Box>
                ) : leaderboardData.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            padding: 5,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: "15px",
                            color: "white",
                        }}
                    >
                        <Typography variant="h5">Aucun classement disponible pour le moment.</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        <Box sx={{ mb: 6 }}>
                            <Box
                                sx={{
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                    padding: "15px 25px",
                                    borderRadius: "20px 20px 0 0",
                                    marginBottom: 2,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <EmojiEventsIcon sx={{ fontSize: 32, marginRight: 2, color: "#ffd700" }} />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#fff",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    Podium
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    position: "relative",
                                    minHeight: "300px",
                                    flexWrap: { xs: "wrap", md: "nowrap" },
                                }}
                            >
                                {podiumPlayers.map((player, index) => {
                                    const rank = index + 1;
                                    const medalInfo = MEDALS[rank as keyof typeof MEDALS];
                                    const isCurrentUser = player.id === user?.id;

                                    // Determine podium arrangement (2nd, 1st, 3rd)
                                    const order = rank === 2 ? 0 : rank === 1 ? 1 : 2;
                                    const podiumHeight = rank === 1 ? 150 : rank === 2 ? 100 : 70;
                                    const zIndex = rank === 1 ? 3 : rank === 2 ? 2 : 1;

                                    return (
                                        <motion.div
                                            key={player.id}
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.7, delay: 0.1 * order }}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                flex: 1,
                                                order: order,
                                                zIndex,
                                                marginTop: `${(150 - podiumHeight)}px`,
                                            }}
                                        >
                                            {/* Player Card */}
                                            <Paper
                                                elevation={6}
                                                sx={{
                                                    width: "80%",
                                                    maxWidth: "250px",
                                                    height: "80%",
                                                    backgroundColor: isCurrentUser
                                                        ? "rgba(255, 215, 0, 0.15)"
                                                        : "rgba(255, 255, 255, 0.1)",
                                                    borderRadius: "15px",
                                                    padding: "20px 15px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    backdropFilter: "blur(10px)",
                                                    border: isCurrentUser ? `3px solid ${medalInfo.color}` : "none",
                                                    mb: 1,
                                                }}
                                            >
                                                {/* Medal Icon */}
                                                <motion.div
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    style={{ marginBottom: "10px" }}
                                                >
                                                    {medalInfo.icon}
                                                </motion.div>

                                                {/* Avatar */}
                                                <CustomAvatar user={player} size={rank === 1 ? 100 : 80}
                                                    sx={{
                                                        border: `4px solid ${medalInfo.color}`,
                                                        boxShadow: `0 0 20px ${medalInfo.color}80`,
                                                        mb: 2,
                                                    }}
                                                />

                                                {/* Username */}
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                                                    }}
                                                >
                                                    {player.username}
                                                </Typography>

                                                {/* Stats */}
                                                <Box sx={{ mt: 1 }}>
                                                    <Chip
                                                        icon={<MilitaryTechIcon />}
                                                        label={`${player.games_won} Victoires`}
                                                        sx={{
                                                            mb: 1,
                                                            backgroundColor: "rgba(255,255,255,0.15)",
                                                            color: "white",
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={`${player.games_played} Parties`}
                                                            sx={{
                                                                backgroundColor: "rgba(255,255,255,0.15)",
                                                                color: "white",
                                                            }}
                                                        />
                                                        <Chip
                                                            size="small"
                                                            label={`${calculateWinRate(player)} Ratio`}
                                                            sx={{
                                                                backgroundColor: "rgba(255,255,255,0.15)",
                                                                color: "white",
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Paper>

                                            {/* Podium */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${podiumHeight}px` }}
                                                transition={{ delay: 0.3, duration: 0.5 }}
                                                style={{
                                                    width: "60%",
                                                    backgroundColor: medalInfo.color,
                                                    borderTopLeftRadius: "10px",
                                                    borderTopRightRadius: "10px",
                                                    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "flex-start",
                                                    paddingTop: "5px",
                                                }}
                                            >
                                                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                                                    #{rank}
                                                </Typography>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </Box>
                        </Box>

                        {/* Leaderboard Table */}
                        <Box sx={{ mb: 4 }}>
                            <Box
                                sx={{
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                    padding: "15px 25px",
                                    borderRadius: "20px 20px 0 0",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <PeopleIcon sx={{ fontSize: 32, marginRight: 2, color: "#42a5f5" }} />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#fff",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    Classement Complet
                                </Typography>
                            </Box>

                            <TableContainer
                                component={Paper}
                                sx={{
                                    borderRadius: "0 0 20px 20px",
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    backdropFilter: "blur(10px)",
                                    maxHeight: "500px",
                                    "&::-webkit-scrollbar": {
                                        width: "10px",
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        background: "rgba(255,255,255,0.1)",
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        background: "rgba(255,255,255,0.3)",
                                        borderRadius: "5px",
                                    },
                                }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    fontWeight: "bold",
                                                    backgroundColor: "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                }}
                                            >
                                                Rang
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: "bold",
                                                    backgroundColor: "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                }}
                                            >
                                                Joueur
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    fontWeight: "bold",
                                                    backgroundColor: "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                }}
                                            >
                                                Victoires
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    fontWeight: "bold",
                                                    backgroundColor: "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                }}
                                            >
                                                Parties
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    fontWeight: "bold",
                                                    backgroundColor: "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                }}
                                            >
                                                Ratio
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <AnimatePresence>
                                            {otherPlayers.map((player, index) => {
                                                const rank = index + 4; // +4 because we start after the podium (top 3)
                                                const isCurrentUser = player.id === user?.id;

                                                return (
                                                    <motion.tr
                                                        key={player.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        style={{
                                                            backgroundColor: isCurrentUser
                                                                ? "rgba(255, 215, 0, 0.15)"
                                                                : index % 2 === 0
                                                                ? "rgba(255, 255, 255, 0.05)"
                                                                : "rgba(0, 0, 0, 0.2)",
                                                        }}
                                                    >
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                color: "white",
                                                                fontWeight: isCurrentUser ? "bold" : "normal",
                                                            }}
                                                        >
                                                            {rank}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <CustomAvatar
                                                                    user={player}
                                                                    size={40}
                                                                    sx={{
                                                                        border: isCurrentUser
                                                                            ? "2px solid gold"
                                                                            : "none",
                                                                    }}
                                                                />
                                                                <Typography
                                                                    sx={{
                                                                        color: "white",
                                                                        ml: 2,
                                                                        fontWeight: isCurrentUser ? "bold" : "normal",
                                                                    }}
                                                                >
                                                                    {player.username}
                                                                    {isCurrentUser && (
                                                                        <Typography
                                                                            component="span"
                                                                            sx={{
                                                                                ml: 1,
                                                                                color: "gold",
                                                                                fontWeight: "bold",
                                                                            }}
                                                                        >
                                                                            (Vous)
                                                                        </Typography>
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                color: "white",
                                                                fontWeight: isCurrentUser ? "bold" : "normal",
                                                            }}
                                                        >
                                                            <Tooltip title="Victoires">
                                                                <Box
                                                                    sx={{
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                    }}
                                                                >
                                                                    <MilitaryTechIcon
                                                                        sx={{
                                                                            mr: 0.5,
                                                                            color: "#ffd700",
                                                                            fontSize: 18,
                                                                        }}
                                                                    />
                                                                    {player.games_won}
                                                                </Box>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                color: "white",
                                                                fontWeight: isCurrentUser ? "bold" : "normal",
                                                            }}
                                                        >
                                                            <Tooltip title="Parties jouées">
                                                                <Box
                                                                    sx={{
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                    }}
                                                                >
                                                                    <SportsEsportsIcon
                                                                        sx={{
                                                                            mr: 0.5,
                                                                            color: "#90caf9",
                                                                            fontSize: 18,
                                                                        }}
                                                                    />
                                                                    {player.games_played}
                                                                </Box>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            sx={{
                                                                color: "white",
                                                                fontWeight: isCurrentUser ? "bold" : "normal",
                                                            }}
                                                        >
                                                            {calculateWinRate(player)}
                                                        </TableCell>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Leaderboard;
