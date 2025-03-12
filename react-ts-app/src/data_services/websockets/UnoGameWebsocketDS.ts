import { BehaviorSubject } from "rxjs";
import { diff } from "deep-diff";

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
        console.log("TEST 2 : Connecting to UnoGame WebSocket...");
        if (this.socket) {
            this.disconnect();
        }

        this.connectionStatus$.next("connecting");

        // Connect to WebSocket with authentication token
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${wsProtocol}//localhost:8000/ws/rooms/${this.roomId}/uno/?token=${this.token}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log("TEST 3 : Connected to UnoGame WebSocket");
            this.connectionStatus$.next("connected");
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            // console.log("TEST 4 : Received message from UnoGame WebSocket:", event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.type === "game_state") {
                    this.updateGameState(data.game);
                }
                else if (data.type === "player_count") {
                    this.playerCount$.next(data.count);
                }
                else if (data.type === "error") {
                    console.error("TEST 6 : WebSocket error:", data.error);
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
            console.log("TEST 7 : Disconnected from UnoGame WebSocket:", event.code);
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
        console.log("TEST 8 : Sending message to UnoGame WebSocket:", message);
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

    private updateGameState(newGameState: UnoGame) {
        const oldGameState = this.gameState$.value;
        if (!oldGameState) {
            this.gameState$.next(newGameState);
            return;
        }

        const changes = diff(oldGameState, newGameState);
        if (!changes) return; // No changes detected

        // Apply only changes
        const updatedGameState = { ...oldGameState };
        changes.forEach(change => {
            if (change.kind === "E") {
                // Edit: Property changed
                this.setByPath(updatedGameState, change.path!, change.rhs);
            } else if (change.kind === "A") {
                // Array modification
                const array = this.getByPath(updatedGameState, change.path!);
                if (Array.isArray(array)) {
                    if (change.item?.kind === "N") {
                        array.splice(change.index!, 0, change.item.rhs); // Add item
                    } else if (change.item?.kind === "D") {
                        array.splice(change.index!, 1); // Remove item
                    }
                }
            }
        });

        this.gameState$.next(updatedGameState);
    }

    private getByPath(obj: unknown, path: Array<string | number>): unknown {
        return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
    }

    private setByPath(obj: unknown, path: Array<string | number>, value: unknown) {
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (!current[key]) current[key] = typeof path[i + 1] === "number" ? [] : {};
            current = current[key];
        }
        current[path[path.length - 1]] = value;
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
}
