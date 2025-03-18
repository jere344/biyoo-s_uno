import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomDS from "../../data_services/RoomDS";

const RoomInvite = () => {
    const { roomId, inviteCode } = useParams<{ roomId: string; inviteCode: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const joinRoom = async () => {
            if (!roomId || !inviteCode) {
                setError("Invalid invitation link");
                setLoading(false);
                return;
            }

            try {
                await RoomDS.joinWithCode(parseInt(roomId), inviteCode);
                // Successfully joined, redirect to room
                navigate(`/room/${roomId}`);
            } catch (err) {
                console.error("Failed to join room:", err);
                setError("Failed to join room. The invitation may be invalid or expired.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        joinRoom();
    }, [roomId, inviteCode, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-xl">Joining room...</div>
                <div className="mt-4 w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-xl text-red-500">{error}</div>
                <div className="mt-4">Redirecting to home page...</div>
            </div>
        );
    }

    return null;
};

export default RoomInvite;
