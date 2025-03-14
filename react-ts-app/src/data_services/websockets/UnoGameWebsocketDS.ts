import { BehaviorSubject } from "rxjs";

export class UnoGameWebsocketDS {
    private socket: WebSocket | null = null;
    private roomId: number;
    private token: string;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: number | null = null;

    // Observable for game state updates
    public gameState$ = new BehaviorSubject<UnoGame | null>(null);
    public playerCount$ = new BehaviorSubject<number>(0);
    public connectionStatus$ = new BehaviorSubject<"connected" | "disconnected" | "connecting">("disconnected");
    public error$ = new BehaviorSubject<string | null>(null);

    constructor(roomId: number, token: string) {
        this.roomId = roomId;
        this.token = token;
    }

    connect() {
        // console.log("TEST 2 : Connecting to UnoGame WebSocket...");
        if (this.socket) {
            this.disconnect();
        }

        this.connectionStatus$.next("connecting");

        // Connect to WebSocket with authentication token
        const wsUrl = `${import.meta.env.VITE_WS_URL}ws/rooms/${this.roomId}/uno/?token=${this.token}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            // console.log("TEST 3 : Connected to UnoGame WebSocket");
            this.connectionStatus$.next("connected");
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            // console.log("TEST 4 : Received message from UnoGame WebSocket:", event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.type === "game_state") {
                    this.gameState$.next(data.game);
                }
                else if (data.type === "player_count") {
                    this.playerCount$.next(data.count);
                }
                else if (data.type === "error") {
                    // console.error("TEST 6 : WebSocket error:", data.error);
                    this.error$.next(data.error);
                }
                else {
                    console.error("Unknown WebSocket message type:", data.type);
                    this.error$.next("Unknown server message type");
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
                this.error$.next("Failed to parse server message");
            }
        };

        this.socket.onclose = (event) => {
            // console.log("TEST 7 : Disconnected from UnoGame WebSocket:", event.code);
            this.connectionStatus$.next("disconnected");

            if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                // Try to reconnect
                this.reconnectTimeout = setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect();
                }, 3000 * Math.pow(2, this.reconnectAttempts)); // Exponential backoff
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.error$.next("WebSocket connection error");
        };
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.connectionStatus$.next("disconnected");
        }
    }

    private send(message: unknown) {
        // console.log("TEST 8 : Sending message to UnoGame WebSocket:", message);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            this.error$.next("Cannot send message: WebSocket is not connected");
            // Try to reconnect
            if (this.connectionStatus$.value !== "connecting") {
                this.connect();
            }
        }
    }

    // Game action methods
    startGame() {
        this.send({ type: "start_game" });
    }

    restartGame() {
        this.send({ type: "restart_game" });
    }

    stopGame() {
        this.send({ type: "stop_game" });
    }

    playCard(cardId: number, color?: string) {
        this.send({
            type: "play_card",
            card_id: cardId,
            color: color,
        });
    }

    drawCard() {
        this.send({ type: "draw_card" });
    }

    sayUno() {
        this.send({ type: "say_uno" });
    }

    denyUno( playerId: number) {
        this.send({ type: "deny_uno", player_id: playerId });
    }
}
