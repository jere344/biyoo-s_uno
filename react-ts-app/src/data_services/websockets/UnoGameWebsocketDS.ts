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
        if (this.socket) {
            this.disconnect();
        }

        this.connectionStatus$.next("connecting");

        // Connect to WebSocket with authentication token
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${wsProtocol}//localhost:8000/ws/rooms/${this.roomId}/uno/?token=${this.token}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            this.connectionStatus$.next("connected");
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "game_state") {
                    this.gameState$.next(data.game);
                }
                else if (data.type === "player_count") {
                    this.playerCount$.next(data.count);
                }
                else if (data.type === "error") {
                    console.error("WebSocket error:", data.message);
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
            console.log("TEST 5 : Disconnected from UnoGame WebSocket:", event.code);
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

    playCard(cardId: number) {
        this.send({
            type: "play_card",
            card_id: cardId,
        });
    }

    drawCard() {
        this.send({ type: "draw_card" });
    }
}
